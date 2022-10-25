import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getAllMyOrders } from "controllers/orders";
import { addProductInCart, quitAllProductsCart, quitProductCart } from "controllers/cart";

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const {id} = req.query
  const dataBody = req.body
  const userId = token.userId
  const response = await addProductInCart(id,userId,dataBody)
  console.log(response)
  res.send(response)
}
async function deleteAllProdutcsHandler (req:NextApiRequest,res:NextApiResponse,token){
   const response = await quitAllProductsCart(token.userId)
  res.send(response)
}


const handler = methods({
  delete:deleteAllProdutcsHandler,
  post: postHandler,
  
});
export default authMiddleware(handler);