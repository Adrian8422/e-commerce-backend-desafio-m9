import { authOwnerCodeReturnToken } from "controllers/ownerAuth";
import { NextApiRequest,NextApiResponse } from "next";


export default async function (req:NextApiRequest,res:NextApiResponse){
const {email,code} =req.body
const response= await  authOwnerCodeReturnToken(email,code)
res.send(response)
}