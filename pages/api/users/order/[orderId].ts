import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { getOrderById } from "controllers/orders";
import * as yup from "yup";
import { schemaQuery } from "lib/middlewares/schemaMiddleware";
import { middlewareCors } from "lib/middlewares/cors";
const querySchema = yup
  .object()
  .shape({
    orderId: yup.string().required(),
  })
  .noUnknown(true)
  .strict();
async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId } = req.query;

  const response = await getOrderById(orderId).catch((err) => {
    res.status(401).send({
      message: "Error en id o no existe ese id",
      error: err,
    });
  });
  res.send(response);
}
const getHandlerWithValidation = schemaQuery(querySchema, getHandler);

const handler = methods({
  get: getHandlerWithValidation,
});
const handlerWithValidation = authMiddleware(handler);
export default middlewareCors(handlerWithValidation);
