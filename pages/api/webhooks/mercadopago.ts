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
let querySchema  = yup.object().shape({
  topic:yup.string().required(),
  id:yup.number().required()

}).noUnknown(true).strict()
module.exports = methods( { 
  async post(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
  console.log({ id: id, topic: topic });
  if(!id && !topic){
    res.status(200).send("entro aca donde no hay id ni topic")
  }

  /// APARENTEMENTE AHORA FUNCIONO, SOLO ME LO CREO UNA VEZ AL BILLINGS-- HACER EL OTRO IF PARA QUE ME DEVUELVA UN 200 CON ESTO PROXIMO EN EL ENDPOINT
  // if(id && topic =="payment"){
  //   res.status(200).send("topic payment")
  // }

  /// Y MOVER LO QUE MAS PUEDA AL CONTROLLERS :DDDDDD
  if (id && topic === "merchant_order") {
    console.log("entro al endpoint seccion merchant order")
    const order = await getMerchantOrder(id);
    //    ORDER tambien nos devuelve el external_reference == orderId en la api
    // buscar en la collection ese orderId que por ende tendria el userId el cual tambien ir a su collection y conseguir su email
    if ((order.order_status = "paid")) {
      const orderId = order.external_reference;
      const myOrderDB = await new Order(orderId);
      await myOrderDB.pull();
      if(myOrderDB.data.status="closed"){
     res.status(200).send("ya esta realizado ")

      }
    
      myOrderDB.data.status = "closed";
      await myOrderDB.push();
      await myOrderDB.pull();
      const user = new User(myOrderDB.data.userId)
      await user.pull()
      const owner = new Owner(myOrderDB.data.ownerId)
      await owner.pull()
      await sendEmailSuccessSale(user.data.email);
      console.log(myOrderDB)
     await Billing.createBilling({
             ownerId:owner.id,
             userId:user.id,
             address: user.data.address,
             message:"Pedido realizado con éxito, realizar envío al usuario comprador",
             userEmail:user.data.email,
             name:user.data.name
              })
  
      
      console.log("data del owner en controllers a punto de enviar email",owner.data.email)
      await  sendEmailOwnerSuccessVenta(owner.data.email)
      // sendEmail al user("Tu pago fue confirmado")
      // sendEmailInterno("Alguien compró algo")
      res.status(200).send(myOrderDB);
    }
  }
  
}})

// export default schemaOrderId(querySchema,getAndFilaniceOrder)

