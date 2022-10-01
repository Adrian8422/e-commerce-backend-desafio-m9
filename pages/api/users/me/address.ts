import {
  getDataUser,
  patchDataAddress,
  patchUpdateDataUser,
} from "controllers/user";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";

async function handlerAddress(
  req: NextApiRequest,
  res: NextApiResponse,
  token
) {
  const { address } = req.body;

  const user = await patchDataAddress(token.userId, address);
  res.send(user.data);
}
const handler = methods({
  patch: handlerAddress,
});
export default authMiddleware(handler);
