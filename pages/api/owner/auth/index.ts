import { findOrCreateOwner, sendCodeOwner } from "controllers/ownerAuth";
import { schemaAuth } from "lib/middlewares/schemaMiddleware";
import { NextApiRequest,NextApiResponse } from "next";
import * as yup from "yup"
const bodySchema = yup.object().shape({
  email:yup.string().required()
}).noUnknown(true).strict()
 async function postHandler (req:NextApiRequest,res:NextApiResponse){
  const {email} = req.body
const response=await  sendCodeOwner(email).catch((err)=>res.status(401).send({message:err}))
console.log(response)
res.send(response)
}
export default schemaAuth(bodySchema,postHandler)