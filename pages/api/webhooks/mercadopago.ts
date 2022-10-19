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
import { schemaOrderId } from "lib/middlewares/schemaMiddleware";
import { Owner } from "models/owner";
import { Billing } from "models/billings";
import { middlewareMercadoPago } from "lib/middlewares/mercadopagoMiddle";
import { checkOrderAndCreateBilling } from "controllers/orders";
let querySchema  = yup.object().shape({
  topic:yup.string().required(),
  id:yup.number().required()

}).noUnknown(true).strict()

  async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
 await checkOrderAndCreateBilling(id)
 
   res.status(200).send({message:"todo salio ok tenes un producto para enviar"})
  //pasamos el req al middleware
 
}
const handler = methods({
  post:postHandler
})
export default middlewareMercadoPago(handler)
/// CREAR MIDDLEWARE QUE EN BASE A LA ORDEN SI ESTA PENDIENTE QUE LA ACTUALICE Y CREE UN BILLING Y MANDE LOS EMAILS Y SI LA ORDEN YA ESTA CERRADA QUE RETORNE NULL Y QUITAMOS LAS RESPONSABILIDADES DEL ENDPOINT :DD DSP VER EL VIDEO DALE QUE SE PUEDE ADRIIII :DDDD

// export default schemaOrderId(querySchema,getAndFilaniceOrder)

