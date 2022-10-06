import { findOrCreateOwner, sendCodeOwner } from "controllers/ownerAuth";
import { NextApiRequest,NextApiResponse } from "next";
export default async function (req:NextApiRequest,res:NextApiResponse){
  const {email} = req.body
const response=await  sendCodeOwner(email)
console.log(response)
res.send(response)
}