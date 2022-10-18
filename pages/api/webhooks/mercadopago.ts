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
let querySchema  = yup.object().shape({
  topic:yup.string().required(),
  id:yup.number().required()

}).noUnknown(true).strict()

  async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
  const order = await getMerchantOrder(id);
  const orderId = order.external_reference;
  const myOrderDB = new Order(orderId);
  await myOrderDB.pull();
  myOrderDB.data.status = "closed"
  await myOrderDB.push()
  const user =  new User(myOrderDB.data.userId)
  const owner = new Owner(myOrderDB.data.ownerId)
  await user.pull()
  await owner.pull()
  await sendEmailSuccessSale(user.data.email);
  await  sendEmailOwnerSuccessVenta(owner.data.email)
  await Billing.createBilling({
    ownerId:owner.id,
    userId:user.id,
    address: user.data.address,
    message:"Pedido realizado con éxito, realizar envío al usuario comprador",
    userEmail:user.data.email,
    name:user.data.name
     })
     res.status(200).send({message:"todo salio ok tenes un producto para enviar"})
  //pasamos el req al middleware
 
}
const handler = methods({
  post:postHandler
})
export default middlewareMercadoPago(handler)
/// CREAR MIDDLEWARE QUE EN BASE A LA ORDEN SI ESTA PENDIENTE QUE LA ACTUALICE Y CREE UN BILLING Y MANDE LOS EMAILS Y SI LA ORDEN YA ESTA CERRADA QUE RETORNE NULL Y QUITAMOS LAS RESPONSABILIDADES DEL ENDPOINT :DD DSP VER EL VIDEO DALE QUE SE PUEDE ADRIIII :DDDD

// export default schemaOrderId(querySchema,getAndFilaniceOrder)

