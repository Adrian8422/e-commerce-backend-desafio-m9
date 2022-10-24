import { createProductsInAirtable } from "controllers/products";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest,NextApiResponse } from "next";
import methods from "micro-method-router"
import * as yup from "yup"
import { schemaBody } from "lib/middlewares/schemaMiddleware";
const bodySchema  = yup.object().shape({
  title:yup.string().required(),
  price:yup.number().required(),
  categories:yup.string().required(),
  shipment:yup.string().required(),
  description:yup.string().required(),
  stock:yup.number().required()

}).noUnknown(true).strict()
async function postHandler(req:NextApiRequest,res:NextApiResponse, token){
  const ownerId = token.ownerId
  console.log("id del owner",token)
  const {title,price,categories,shipment,description,stock} = req.body


 const response =await createProductsInAirtable({
  ownerId,title,price,categories,shipment,description,stock
 })

  res.send(response)
}
const postHandlerWithValidation = schemaBody(bodySchema,postHandler)
const handler = methods({
  post:postHandlerWithValidation
})

export default authMiddleware(handler)