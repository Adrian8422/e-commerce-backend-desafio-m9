import { productIndex } from "lib/connections/algolia";
import { getProductIdAlgolia } from "./products";
import { Order } from "models/orders";
import { createPreference } from "lib/connections/mercadopago";

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
        "https://e-commerce-backend-desafio-m9-17c8.vercel.app/webhooks/mercadopago",
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
