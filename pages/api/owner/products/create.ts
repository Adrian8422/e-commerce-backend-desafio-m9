import { createProductsInAirtable } from "controllers/products";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest,NextApiResponse } from "next";
import methods from "micro-method-router"
async function postHandler(req:NextApiRequest,res:NextApiResponse, token){
  const ownerId = token.ownerId
  console.log("id del owner",token)
  const {title,price,categories,shipment,description,stock} = req.body


 const response =await createProductsInAirtable({
  ownerId,title,price,categories,shipment,description,stock
 })

//  ver porque no me crea los productos en airtable, a esos productos cuando los creo tengo que pasarle el parametro ownerId para que lo guarde y dsp en algolia se lo agrego tambien 
  res.send(response)
}
const handler = methods({
  post:postHandler
})

export default authMiddleware(handler)