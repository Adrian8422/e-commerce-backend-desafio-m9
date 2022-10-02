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

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { topic } = req.query;
  const {id} = req.query
 
  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);
    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const myOrder = new Order(orderId);
      await myOrder.pull();
      myOrder.data.status = "closed";
      await myOrder.push();
      await myOrder.pull();
      console.log(myOrder);
      
      // // const user = new User(myOrder.userId);
      // // await user.pull();
      
      // await sendEmailSuccessSale(user.data.email);
      res.send(myOrder.data);
    }
  }
}

