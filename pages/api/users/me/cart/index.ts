import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getAllMyOrders } from "controllers/orders";
import * as yup  from "yup"

import { addProductInCart, getMyCurrentCart, quitAllProductsCart} from "controllers/cart";
import { schemaBodyAndQuery, schemaQuery } from "lib/middlewares/schemaMiddleware";
let querySchema = yup.object().shape({
  id: yup.string().required(),
  
 
}).noUnknown(true).strict()
let bodySchema = yup.object().shape({
  quantity: yup.number().required(),
  
 
}).noUnknown(true).strict()
async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const {id} = req.query
  const {quantity} = req.body
  const quantityNumber = parseInt(quantity)
  const userId = token.userId
  const response = await addProductInCart(id,userId,quantityNumber)
  console.log(response)
  res.send(response)
}
async function getMyCart(req:NextApiRequest,res:NextApiResponse,token){
  const userId = token.userId
  const response = await getMyCurrentCart(userId)
  res.send(response)
}
async function deleteAllProdutcsHandler (req:NextApiRequest,res:NextApiResponse,token){
   const response = await quitAllProductsCart(token.userId)
  res.send(response)
}

const postHandlerWithValidation = schemaBodyAndQuery(bodySchema,querySchema,postHandler)
const handler = methods({
  delete:deleteAllProdutcsHandler,
  get:getMyCart,
  post: postHandlerWithValidation,
  
});
export default authMiddleware(handler);