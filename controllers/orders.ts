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

// export async function readFirstEndpoint(data_id,type,body){
// if(type == "payment"){
// console.log(body)
//   return body
// }
//   /// Hacer un if consultando si data_id es de tal valor al igual que con el type y si pasa eso esperado retornar el body 

// }
// export async function readSegundoEndpoint(topic,id,body){
//     /// Hacer un if consultando si data_id es de tal valor al igual que con el type y si pasa eso esperado retornar el body 
//     if(topic=="payment"){
//       console.log(body)
//       return body
//     }
// }

// export async function getOrderAndUpdateStatusFromMP(topic,id) {
//   console.log("entro en getOrderAndUpdate cs")

   
//     const order = await getMerchantOrder(id);
//     if ((order.order_status = "paid")) {
//       const orderId = order.external_reference;
//       const myOrder = new Order(orderId);
//       await myOrder.pull();
   
//       myOrder.data.status = "closed";
//       await myOrder.push();
//       const currentOrder = new Order(orderId)
//       await currentOrder.pull()
//       console.log("entro y vemos la orden nueva",currentOrder)
//       return currentOrder
   
//       }
    
// }
// export async function sendEmailSuccess(topic,id){
//   console.log("entro en la funcion controller senemailSucces")
//   const order = await getOrderAndUpdateStatusFromMP(topic,id)

  
//   if(order){

//     const user = await new User(order.data.userId)
//     const ownerProductList =await new Owner(order.data.ownerId)
//     await user.pull()
//     await ownerProductList.pull()

//     if((order.data.status = "closed")){ 
//       console.log("entro en la funcion para enviar los email a los users correspondientes")
//       await sendEmailSuccessSale(user.data.email);
  
      
//       console.log("data del owner en controllers a punto de enviar email",ownerProductList.data.email)
//       await  sendEmailOwnerSuccessVenta(ownerProductList.data.email)
//      const respuesta = await Billing.createBilling({
//       ownerId:ownerProductList.id,
//       userId:user.id,
//       address: user.data.address,
//       message:"Pedido realizado con éxito, realizar envío al usuario comprador",
//       userEmail:user.data.email,
//       name:user.data.name
//        })
//        console.log("registro billing en db",respuesta)
//        return {order,user,respuesta}
//       }
//   }
  
// }
