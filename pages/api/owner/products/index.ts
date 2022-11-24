import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import {
  createProductsInAirtable,
  getAllProductsOwner,
} from "controllers/products";
import * as yup from "yup";
import { schemaBody, schemaQuery } from "lib/middlewares/schemaMiddleware";
import { middlewareCors } from "lib/middlewares/cors";
const querySchema = yup
  .object()
  .shape({
    offset: yup.string().required(),
    limit: yup.string().required(),
  })
  .noUnknown(true)
  .strict();
async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { offset, limit } = req.query;
  if (!offset && !limit) {
    res.status(401).send({ message: "no hay offset and limit" });
  }
  const response = await getAllProductsOwner(offset, limit).catch((err) => {
    res.status(401).send({
      error: err,
    });
  });
  res.send(response);
}

const bodySchema = yup
  .object()
  .shape({
    title: yup.string().required(),
    price: yup.number().required(),
    categories: yup.string().required(),
    shipment: yup.string().required(),
    description: yup.string().required(),
    stock: yup.number().required(),
  })
  .noUnknown(true)
  .strict();
async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const ownerId = token.ownerId;
  const { title, price, categories, shipment, description, stock } = req.body;
  const response = await createProductsInAirtable({
    ownerId,
    title,
    price,
    categories,
    shipment,
    description,
    stock,
  });

  res.send(response);
}
const postHandlerWithValidation = schemaBody(bodySchema, postHandler);

const getHandlerWithValidation = schemaQuery(querySchema, getHandler);
const handler = methods({
  get: getHandlerWithValidation,
  post: postHandlerWithValidation,
});

const handlerWithValidation = authMiddleware(handler);

export default middlewareCors(handlerWithValidation);
