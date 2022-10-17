import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { createPreferenceAndOrderMp } from "controllers/orders";
import * as yup  from "yup"
import { schemaMiddlware } from "lib/middlewares/schemaMiddleware";
let querySchema = yup.object().shape({
  productId: yup.string().required(),
 
}).noUnknown(true).strict()
let bodySchema = yup.object().shape({
  color: yup.string(),
  version:yup.string()

}).noUnknown(true).strict()

async function postHanlder(req: NextApiRequest, res: NextApiResponse, token) {
  ///// ver como hacer para crear order Preference porque no me la estaria tomando, hacer una order primero en la base d edatos y luego hacer la preferencia en mercado pago :DDD relaxx que ya lo vamos a solucionar :DDDD
  const { productId } = req.query;
  const dataBody = req.body;
  const userId = token.userId;
  const respuesta = await createPreferenceAndOrderMp(
    productId,
    userId,
    dataBody
  ).catch((err) => {
    res.status(400).send({ message: "no encontramos el producto", error: err });
  });

  res.send(respuesta);
}
const postHandlerWithValidation = schemaMiddlware(bodySchema,querySchema,postHanlder)
const handler = methods({
  post: postHandlerWithValidation,
});

export default authMiddleware(handler);
