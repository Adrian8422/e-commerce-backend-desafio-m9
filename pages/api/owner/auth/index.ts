import { sendCodeOwner } from "controllers/ownerAuth";
import { middlewareCors } from "lib/middlewares/cors";
import { schemaAuth } from "lib/middlewares/schemaMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
const bodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
  })
  .noUnknown(true)
  .strict();
async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  const response = await sendCodeOwner(email).catch((err) =>
    res
      .status(401)
      .send({ error: err, meesage: "email incorrecto, vuelve a probar" })
  );
  res.send(response);
}
const handlerWithValidation = schemaAuth(bodySchema, postHandler);

export default middlewareCors(handlerWithValidation);
