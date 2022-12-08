import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getProductQueryInALgolia } from "controllers/products";
import * as yup from "yup";
import { schemaQuery } from "lib/middlewares/schemaMiddleware";
import { middlewareCors } from "lib/middlewares/cors";

const querySchema = yup
  .object()
  .shape({
    q: yup.string().required(),
    limit: yup.string().required(),
    offset: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const search = req.query.q as string;
  const response = await getProductQueryInALgolia(search, req).catch((err) => {
    res.status(401).send({
      message: "no encontramos ese producto",
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
