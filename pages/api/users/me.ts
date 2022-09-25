import { getDataUser } from "controllers/user";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse, token) {
  const user = await getDataUser(token.userId);
  res.send(user);
}

export default authMiddleware(handler);
