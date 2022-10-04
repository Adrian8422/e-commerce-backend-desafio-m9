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

  const user = await patchDataAddress(token.userId, address).catch((err)=>{
    res.status(401).send({
      message:"error en modificar datos del usuario",
      error:err

    })
  })
  res.send(user);
}
const handler = methods({
  patch: handlerAddress,
});
export default authMiddleware(handler);
