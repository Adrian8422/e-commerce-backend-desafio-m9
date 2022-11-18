import { patchDataAddress } from "controllers/user";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { schemaBody } from "lib/middlewares/schemaMiddleware";
import * as yup from "yup";

const bodySchema = yup
  .object()
  .shape({
    address: yup.string().required(),
  })
  .noUnknown(true)
  .strict();
async function handlerAddress(
  req: NextApiRequest,
  res: NextApiResponse,
  token
) {
  const { address } = req.body;

  const user = await patchDataAddress(token.userId, address).catch((err) => {
    res.status(401).send({
      message: "error en modificar direccion del usuario",
      error: err,
    });
  });
  res.send(user);
}
const patchAddressWithValidate = schemaBody(bodySchema, handlerAddress);
const handler = methods({
  patch: patchAddressWithValidate,
});
export default authMiddleware(handler);
