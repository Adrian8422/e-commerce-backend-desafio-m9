import { NextApiRequest, NextApiResponse } from "next";
import { authCodeReturnToken } from "controllers/auth";
import * as yup from "yup";
import { schemaAuth } from "lib/middlewares/schemaMiddleware";
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
  if (email && code) {
    const response = await authCodeReturnToken(email, code).catch((error) => {
      res.status(401).send({
        message: error,
        messageAPI: "error en código o email",
      });
    });
    res.send(response);
  } else {
    res.status(401).send({
      message: "Faltan datos",
    });
  }
}
export default schemaAuth(bodySchema, postHanlder);
