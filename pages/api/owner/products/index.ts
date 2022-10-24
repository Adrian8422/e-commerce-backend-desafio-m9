import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest,NextApiResponse } from "next";
import methods from "micro-method-router"
import { getAllProductsOwner } from "controllers/products";
import * as yup from "yup"
import { schemaQuery } from "lib/middlewares/schemaMiddleware";
const querySchema = yup.object().shape({
  offset:yup.string().required(),
  limit: yup.string().required()

}) .noUnknown(true).strict()
async function getHandler (req:NextApiRequest,res:NextApiResponse,token){
  const {offset,limit} = req.query
  if(!offset && !limit){
    res.status(401).send({message:"no hay offset and limit"})
  }
  const response = await getAllProductsOwner(offset,limit).catch((err)=>{res.status(401).send({
    error:err
  })})
  res.send(response)


  

}

const getHandlerWithValidation = schemaQuery(querySchema,getHandler)
const handler = methods({
  get:getHandlerWithValidation
})

export default authMiddleware(handler)