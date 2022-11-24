import { NextApiRequest, NextApiResponse } from "next";

import methods from "micro-method-router";
import { getProductIdAlgolia } from "controllers/products";
import * as yup from "yup";
import { schemaQuery } from "lib/middlewares/schemaMiddleware";
import { middlewareCors } from "lib/middlewares/cors";

const querySchema = yup
  .object()
  .shape({
    productId: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const productId = req.query.productId as string;
  const response = await getProductIdAlgolia(productId).catch((err) => {
    res.status(401).send({
      message: "no encontramos ese productId en la base de datos",
      error: err,
    });
  });

  res.send(response);
}
const handler = methods({
  get: getHandler,
});

const handlerWithValidation = schemaQuery(querySchema, handler);

export default middlewareCors(handlerWithValidation);
