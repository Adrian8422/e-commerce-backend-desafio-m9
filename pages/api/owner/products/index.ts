import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest,NextApiResponse } from "next";
import methods from "micro-method-router"
import { getAllProductsOwner } from "controllers/products";

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
const handler = methods({
  get:getHandler
})

export default authMiddleware(handler)