import { getAllidProd } from "controllers/products"
import {NextApiRequest,NextApiResponse} from "next"


export default async function (req:NextApiRequest,res:NextApiResponse){
  const response = await getAllidProd()
  res.send(response)

}