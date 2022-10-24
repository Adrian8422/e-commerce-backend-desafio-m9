import { getMerchantOrder } from "lib/connections/mercadopago";
import {
  sendEmailOwnerSuccessVenta,
  sendEmailSuccessSale,
  sendEmailToUser,
} from "lib/connections/nodemailer";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { Order } from "models/orders";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { User } from "models/user";
// import { readFirstEndpoint, readSegundoEndpoint, sendEmailSuccess } from "controllers/orders";
// import {  sendEmailSuccess } from "controllers/orders";
import * as yup from "yup"
import { schemaQuery } from "lib/middlewares/schemaMiddleware";
import { Owner } from "models/owner";
import { Billing } from "models/billings";
import { middlewareMercadoPago } from "lib/middlewares/mercadopagoMiddle";
import { checkOrderAndCreateBilling } from "controllers/orders";
let querySchema  = yup.object().shape({
  topic:yup.string().required(),
  id:yup.number().required()

}).noUnknown(true).strict()

  async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
 await checkOrderAndCreateBilling(id)
 
   res.status(200).send({message:"todo salio ok tenes un producto para enviar"})
  //pasamos el req al middleware
 
}
const handler = methods({
  post:postHandler
})
export default middlewareMercadoPago(handler)

// export default schemaOrderId(querySchema,getAndFilaniceOrder)

