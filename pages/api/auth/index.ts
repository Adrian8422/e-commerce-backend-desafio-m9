import { NextApiRequest, NextApiResponse } from "next";

import { sendCode } from "controllers/auth";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  const response = await sendCode(email).catch((err) => {
    res.status(401).send({
      message: err,
    });
  });
  res.send(response);
}
