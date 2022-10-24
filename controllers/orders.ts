import { productIndex } from "lib/connections/algolia";
import { getProductIdAlgolia } from "./products";
import { Order } from "models/orders";
import { User } from "models/user";
import { createPreference, getMerchantOrder } from "lib/connections/mercadopago";
import { sendEmailOwnerSuccessVenta, sendEmailSuccessSale } from "lib/connections/nodemailer";
import { Owner } from "models/owner";
import { Billing } from "models/billings";
type CreateOrderResponse={
  url:string
}
export async function createPreferenceAndOrderMp(productId, userId, dataBody) :Promise <CreateOrderResponse>{
  const product = await getProductIdAlgolia(productId)
  if (!product) {
    console.log("no encontramos el producto en la base de datos");
    return null;
  }
  const order = await Order.createOrder({
    ownerId:product["ownerId"],
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
        "https://e-commerce-backend-desafio-m9.vercel.app/api/webhooks/mercadopago",
        // "https://webhook.site/15eead9d-9d4c-4d53-8dc9-86ad7dba0dd4"
    });
    return {url:createPreferenceMp.init_point};
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

export async function checkOrderAndCreateBilling(id){
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
   const newBilling =  await Billing.createBilling({
    productId:myOrderDB.data.productId.map((id)=>id),
    ownerId:owner.id,
    userId:user.id,
    address: user.data.address,
    message:"Pedido realizado con éxito, realizar envío al usuario comprador",
    userEmail:user.data.email,
    name:user.data.name
     })

     return newBilling


} 


