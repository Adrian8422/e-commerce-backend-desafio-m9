import { getMerchantOrder } from "lib/connections/mercadopago";
import { sendEmailOwnerSuccessVenta, sendEmailSuccessSale } from "lib/connections/nodemailer";
import { Billing } from "models/billings";
import { Order } from "models/orders";
import { Owner } from "models/owner";
import { User } from "models/user";
import { NextApiRequest, NextApiResponse } from "next";

export  function middlewareMercadoPago(callback){
  return async function (req:NextApiRequest,res:NextApiResponse) {
    const { id, topic } = req.query;
    if(topic !== "merchant_order"){
     res.status(200) 
    }
    const order = await getMerchantOrder(id);
    if(order.order_status !=="paid"){
    res.status(200)

    }
    const orderId = order.external_reference;
    const myOrderDB = new Order(orderId);
    await myOrderDB.pull();
    if(myOrderDB.data.status == "closed"){
      res.status(200).send({message:"orden ya cerrada"})
    }
    if(myOrderDB.data.status =="pending"){
      callback(req,res)
    }


    
  }

}