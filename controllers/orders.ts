import { productIndex } from "lib/connections/algolia";
import { getProductIdAlgolia } from "./products";
import { Order } from "models/orders";
import { User } from "models/user";
import { createPreference, getMerchantOrder } from "lib/connections/mercadopago";
import { sendEmailSuccessSale } from "lib/connections/nodemailer";

export async function createPreferenceAndOrderMp(productId, userId, dataBody) {
  const product = await getProductIdAlgolia(productId);
  if (!product) {
    console.log("no encontramos el producto en la base de datos");
    return null;
  }
  const order = await Order.createOrder({
    productId: product["objectID"],
    userId: userId,
    status: "pending",
    createdAt: new Date(),
    aditional_info: {
      ...dataBody,
    },
  });
  if (order) {
    const createPreferenceMp = await createPreference({
      external_reference: order.id,
      items: [
        {
          title: product["title"],
          description: product["description"],
          picture_url: "http://www.myapp.com/myimage.jpg",
          quantity: 1,
          currency_id: "$",
          unit_price: product["price"],
        },
      ],
      back_urls: {
        success: "https://portfolio-6357a.web.app/",
        pending: "https://portfolio-6357a.web.app/",
      },
      notification_url:
        // "https://e-commerce-backend-desafio-m9.vercel.app/api/webhooks/mercadopago",
        "https://webhook.site/15eead9d-9d4c-4d53-8dc9-86ad7dba0dd4"
    });
    return createPreferenceMp.init_point;
  }
}

export async function getAllMyOrders(userId) {
  const response = await Order.getMyOrders(userId);
  if (!response) {
    console.log("no hay ordenes con este usuario");
    return null;
  }
  return response;
}
export async function getOrderById(idOrder) {
  const order = await Order.getMyOrderById(idOrder);
  if (!order) {
    return { message: "no encontramos esa orden con ese id" };
  }
  return order;
}

export async function getOrderAndUpdateStatusFromMP(topic,id) {

    if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);
    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const myOrder = new Order(orderId);
      await myOrder.pull();
      myOrder.data.status = "closed";
      await myOrder.push();
      const currentOrder = new Order(orderId)
      await currentOrder.pull()
      return currentOrder
   
      }
      }
}
export async function sendEmailSuccess(topic,id){
  const order = await getOrderAndUpdateStatusFromMP(topic,id)
  const user = new User(order.data.userId)
  await user.pull()
  
  if(order.data.status == "closed"){
    await sendEmailSuccessSale(user.data.email);
  }
  return {order,user}
}
