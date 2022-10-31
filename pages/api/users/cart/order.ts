import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { createPreferenceAndOrder } from "controllers/cart";


async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
 const idUser = token.userId
 const response = await  createPreferenceAndOrder(idUser).catch((err)=>res.status(401).send({message:err}))
 res.send(response)
 
}



const handler = methods({

  post: postHandler,
  
});
export default authMiddleware(handler);