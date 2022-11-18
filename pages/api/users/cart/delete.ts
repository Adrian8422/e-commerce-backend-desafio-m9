import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { quitProductCart } from "controllers/cart";
import * as yup from "yup";
import { schemaQuery } from "lib/middlewares/schemaMiddleware";
const querySchema = yup
  .object()
  .shape({
    idProd: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  const { idProd } = req.query;
  const response = await quitProductCart(idProd as string).catch((err) =>
    res.status(401).send({ message: err })
  );
  res.send(response);
}

const deleteHandlerWithValidation = schemaQuery(querySchema, deleteHandler);

const handler = methods({
  delete: deleteHandlerWithValidation,
});
export default authMiddleware(handler);
