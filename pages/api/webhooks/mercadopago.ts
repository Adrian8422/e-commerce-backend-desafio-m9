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
// import { readFirstEndpoint, readSegundoEndpoint, sendEmailSuccess } from "controllers/orders";
import {  sendEmailSuccess } from "controllers/orders";
import * as yup from "yup"
import { schemaOrderId } from "lib/middlewares/schemaMiddleware";
let querySchema  = yup.object().shape({
  topic:yup.string().required(),
  id:yup.number().required()

}).noUnknown(true).strict()
export default async function (req: NextApiRequest, res: NextApiResponse) {
  // const {data_id,type} = req.query as any
  const { topic ,id} = req.query  
//   if(!topic && !id){
// res.status(200).send("no hay topic ni id")
//   }
//   if(topic !=="merchant_order"){
//     res.status(200).send("topic incorrecto")
//   }
  // if(topic && id){

    
    // if(req.query == data_id && req.query == type){
      //   const body = req.body
      //   const firstEndpoint = await readFirstEndpoint(data_id,type,body) .catch((err)=>{
        //     res.status(200).send({
          //       message:err
          //     })
          //   })
          //   res.status(200).send(firstEndpoint)
          // }
          // if(topic == "payment"){
            //   const body = req.body
            //   const segundoEndpoint = await readSegundoEndpoint(topic,id,body).catch((err)=>{
              //     res.status(200).send({
                //       message:err
                //     })
                //   })
                //   res.status(200).send(segundoEndpoint)
                // }
                if(topic == "merchant_order"){
                  
                  const response = await sendEmailSuccess(topic,id).catch((err)=>{
                    res.status(200).send({
        message:err
      })
    })
  res.status(200).send(response)
  }
// }
}

// export default schemaOrderId(querySchema,getAndFilaniceOrder)

