import { NextApiRequest,NextApiResponse } from "next";
import methods from "micro-method-router"
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { updateByIdProduct, getProductIdAlgolia, deleteByIdProduct } from "controllers/products";
import * as yup from "yup"
import { schemaBodyAndQuery, schemaQuery } from "lib/middlewares/schemaMiddleware";
const querySchemaGet = yup.object().shape({
  productId: yup.string().required()
}).noUnknown(true).strict()
async function getHandler (req:NextApiRequest,res:NextApiResponse,token){
  const {productId} = req.query
  const response = await getProductIdAlgolia(productId).catch((err)=>{
    res.status(401).send({message:err})
  })
  res.send(response)
}
const bodySchemaPatch = yup.object().shape({
  title:yup.string().required(),
  price:yup.number().required(),
  categories:yup.string().required(),
  shipment:yup.string().required(),
  description:yup.string().required(),
  stock:yup.number().required()

}).noUnknown(true).strict()
const querySchemaPatch = yup.object().shape({
productId :yup.string().required()

}).noUnknown(true).strict()
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

const getHandlerWithValidation = schemaQuery(querySchemaGet,getHandler)
const patchHandlerWithValidation = schemaBodyAndQuery(bodySchemaPatch,querySchemaPatch,patchHandler)

const handler = methods({
  get:getHandlerWithValidation,
  patch:patchHandlerWithValidation,
  delete:deleteHandler
})

export default authMiddleware(handler)


