import { getDataUser, patchUpdateDataUser } from "controllers/user";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const user = await getDataUser(token.userId);
  res.send(user);
}
async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { name, birthday, address } = req.body;

  const user = await patchUpdateDataUser(token.userId, {
    name,
    birthday,
    address,
  }).catch((err)=>{
    res.status(401).send({
      message:"error en modificar datos del usuario",
      error:err
    })
  })

  res.send(user);
}
const handler = methods({
  get: getHandler,
  patch: patchHandler,
});
export default authMiddleware(handler);
