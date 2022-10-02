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

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { id, topic } = req.query;
  const userId = token.userId;
  const user = new User(userId);
  await user.pull();
  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);
    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const myOrder = new Order(orderId);
      await myOrder.pull();
      myOrder.data.status = "closed";
      await myOrder.push();
      console.log(myOrder);
      await sendEmailSuccessSale(user.data.email);
      res.send(myOrder.data);
    }
  }
}
const handler = methods({
  post: postHandler,
});
export default authMiddleware(handler);