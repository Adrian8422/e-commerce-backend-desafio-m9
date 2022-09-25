import { NextApiRequest, NextApiResponse } from "next";

import methods from "micro-method-router";
import { authCodeReturnToken } from "controllers/auth";

export default async function (req: NextApiRequest, res: NextApiResponse) {
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
