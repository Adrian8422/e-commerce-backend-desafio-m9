import { getDataUser, patchUpdateDataUser } from "controllers/user";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { schemaBody } from "lib/middlewares/schemaMiddleware";
import { middlewareCors } from "lib/middlewares/cors";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const user = await getDataUser(token.userId).catch((err) =>
    res.status(401).send({ error: err })
  );
  res.send(user);
}
//
const bodySchema = yup
  .object()
  .shape({
    name: yup.string().notRequired(),
    cellphone: yup.string().notRequired(),
    address: yup.string().notRequired(),
  })
  .noUnknown(true)
  .strict();

async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { name, cellphone, address } = req.body;

  const user = await patchUpdateDataUser(token.userId, {
    name,
    cellphone,
    address,
  }).catch((err) => {
    res.status(401).send({
      message: "error en modificar datos del usuario",
      error: err,
    });
  });

  res.send(user);
}
const patchHandleWithValidation = schemaBody(bodySchema, patchHandler);
const handler = methods({
  get: getHandler,
  patch: patchHandleWithValidation,
});
const handlerAndValidation = authMiddleware(handler);
export default middlewareCors(handlerAndValidation);
