import { NextApiRequest,NextApiResponse } from "next";
import methods from "micro-method-router"
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { updateByIdProduct, getProductIdAlgolia, deleteByIdProduct } from "controllers/products";
async function getHandler (req:NextApiRequest,res:NextApiResponse,token){
  const {productId} = req.query
  const response = await getProductIdAlgolia(productId).catch((err)=>{
    res.status(401).send({message:err})
  })
  res.send(response)
}
async function patchHandler(req:NextApiRequest,res:NextApiResponse, token){
  const ownerId = token.ownerId
  const {title,price,categories,shipment,description,stock} = req.body
  const {productId} = req.query
  if(!title && !price && !categories  && !shipment && !description && !stock){
    res.status(400).send({message:"faltan datos en el body"})
  }
  const response = await updateByIdProduct(productId,ownerId,{
    title,price,categories,shipment,description,stock
  })
console.log(response)
  res.send(response)

}
async function deleteHandler(req:NextApiRequest,res:NextApiResponse, token){
  const {productId} = req.query
  if(!productId){
    res.status(400).send({message:"error no encontramos id del producto"})
  }
  const response =  await deleteByIdProduct(productId)
  res.send(response)

}

const handler = methods({
  get:getHandler,
  patch:patchHandler,
  delete:deleteHandler
})

export default authMiddleware(handler)


