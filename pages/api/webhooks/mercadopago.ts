import { getMerchantOrder } from "lib/connections/mercadopago";
import {
  sendEmailSuccessSale,
  sendEmailToUser,
} from "lib/connections/nodemailer";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { Order } from "models/orders";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { User } from "models/user";
import { readFirstEndpoint, readSegundoEndpoint, sendEmailSuccess } from "controllers/orders";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {data_id,type} = req.query as any
  const { topic ,id} = req.query as any
  if(req.query == data_id && req.query == type){
    const body = req.body
    const firstEndpoint = await readFirstEndpoint(data_id,type,body) 
    res.send(firstEndpoint)
  }
  if(topic == "payment"){
    const body = req.body
    const segundoEndpoint = await readSegundoEndpoint(topic,id,body)
    res.send(segundoEndpoint)
  }
  if(topic == "merchant_order"){

    const response = await sendEmailSuccess(topic,id)
  res.send(response)
  }
}

