import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getAllMyOrders } from "controllers/orders";
import { addProductInCart, quitProductCart } from "controllers/cart";

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const {id} = req.query
  const userId = token.userId
  const response = await addProductInCart(id,userId)
  console.log(response)
  res.send(response)
}
async function deleteHandler (req:NextApiRequest,res:NextApiResponse){
  const {id} = req.query
  const response = await quitProductCart(id)
  res.send(response)
}

const handler = methods({
  post: postHandler,
  delete:deleteHandler
});
export default authMiddleware(handler);