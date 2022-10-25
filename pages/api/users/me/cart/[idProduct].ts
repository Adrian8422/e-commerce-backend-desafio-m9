import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { quitProductCart } from "controllers/cart";


async function deleteHandler (req:NextApiRequest,res:NextApiResponse){
  const {idProduct} = req.query
  const response = await quitProductCart(idProduct)
  res.send(response)
}



const handler = methods({
  delete:deleteHandler,

});
export default authMiddleware(handler);