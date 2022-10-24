import { authOwnerCodeReturnToken } from "controllers/ownerAuth";
import { schemaAuth } from "lib/middlewares/schemaMiddleware";
import { NextApiRequest,NextApiResponse } from "next";
import * as yup from "yup"

let bodySchema = yup.object().shape({
  email: yup.string().required(),
  code:yup.number().required()

}).noUnknown(true).strict()

async function postHanlder(req:NextApiRequest,res:NextApiResponse){
const {email,code} =req.body
const response= await  authOwnerCodeReturnToken(email,code)
res.send(response)
}

export default schemaAuth(bodySchema,postHanlder)
