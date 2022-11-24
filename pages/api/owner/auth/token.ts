import { authOwnerCodeReturnToken } from "controllers/ownerAuth";
import { middlewareCors } from "lib/middlewares/cors";
import { schemaAuth } from "lib/middlewares/schemaMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const bodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    code: yup.number().required(),
  })
  .noUnknown(true)
  .strict();

async function postHanlder(req: NextApiRequest, res: NextApiResponse) {
  const { email, code } = req.body;
  const response = await authOwnerCodeReturnToken(email, code).catch((err) =>
    res.status(401).send({ error: err })
  );
  res.send(response);
}

const handlerWithValidation = schemaAuth(bodySchema, postHanlder);
export default middlewareCors(handlerWithValidation);
