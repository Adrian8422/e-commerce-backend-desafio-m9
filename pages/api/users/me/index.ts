import { getDataUser, patchUpdateDataUser } from "controllers/user";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup"
import { schemaPatchAddress } from "lib/middlewares/schemaMiddleware";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
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
const patchHandleWithValidation = schemaPatchAddress(bodySchema,patchHandler)
const handler = methods({
  get: getHandler,
  patch: patchHandleWithValidation,
});
export default authMiddleware(handler);
