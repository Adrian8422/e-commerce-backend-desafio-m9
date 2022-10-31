import { NextApiRequest,NextApiResponse } from "next";
import {authMiddleware} from "lib/middlewares/authmiddleware"
import { getDataOwner } from "controllers/owner";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  console.log(token)
  const ownerId =token.ownerId
  const user = await getDataOwner(ownerId).catch((err)=>res.status(401).send({error:err}))
  res.send(user);
}
export default authMiddleware(getHandler)

