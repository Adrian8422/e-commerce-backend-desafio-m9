import { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "controllers/auth";
import * as yup from "yup";
import { schemaAuth } from "lib/middlewares/schemaMiddleware";
import { middlewareCors } from "pages/api/middleware";
import { NextRequest } from "next/server";
const bodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  const response = await sendCode(email).catch((err) => {
    res.status(401).send({
      message: err,
    });
  });
  res.send(response);
}

const handlerCors = async (req: NextRequest, res: NextApiResponse) => {
  const corsValidation = middlewareCors(req);
  if (corsValidation) {
    schemaAuth(bodySchema, postHandler);
  }
};

export default handlerCors;
