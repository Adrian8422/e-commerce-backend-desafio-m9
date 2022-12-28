import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { createPreferenceAndOrderOneProductMp } from "controllers/orders";
import * as yup from "yup";
import { schemaBodyAndQuery } from "lib/middlewares/schemaMiddleware";
import { middlewareCors } from "lib/middlewares/cors";
const querySchema = yup
  .object()
  .shape({
    productId: yup.string().required(),
  })
  .noUnknown(true)
  .strict();
const bodySchema = yup
  .object()
  .shape({
    quantity: yup.number().required(),
  })
  .noUnknown(true)
  .strict();

async function postHanlder(req: NextApiRequest, res: NextApiResponse, token) {
  const { productId } = req.query;
  const { quantity } = req.body;

  const userId = token.userId;
  const respuesta = await createPreferenceAndOrderOneProductMp(
    productId,
    userId,
    quantity
  ).catch((err) => {
    res.status(400).send({ message: "no encontramos el producto", error: err });
  });

  res.send(respuesta);
}
const postHandlerWithValidation = schemaBodyAndQuery(
  bodySchema,
  querySchema,
  postHanlder
);
const handler = methods({
  post: postHandlerWithValidation,
});

const handlerWithValidation = authMiddleware(handler);
export default middlewareCors(handlerWithValidation);
