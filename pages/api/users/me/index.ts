import { getDataUser, patchUpdateDataUser } from "controllers/user";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup"
import { schemaBody } from "lib/middlewares/schemaMiddleware";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {

 ///  llevar todo el objeto consoleado y preguntar en el controller si el id ese corresponde con el producto y si es asi le agregamos ese quantity al product id esto es un ejemplo que realizo en me para checar mas rapido los resultados 
 
  const user = await getDataUser(token.userId);
  res.send(user);
}
let bodySchema = yup.object().shape({
  name:yup.string().notRequired(),
  birthday:yup.string().notRequired(),
  address:yup.string().notRequired()
}).noUnknown(true).strict()

async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { name, birthday, address } = req.body;

  const user = await patchUpdateDataUser(token.userId, {
    name,
    birthday,
    address,
  }).catch((err)=>{
    res.status(401).send({
      message:"error en modificar direccion del usuario",
      error:err
    })
  })

  res.send(user);
}
const patchHandleWithValidation = schemaBody(bodySchema,patchHandler)
const handler = methods({
  get: getHandler,
  patch: patchHandleWithValidation,
});
export default authMiddleware(handler);
