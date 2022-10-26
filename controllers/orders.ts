import { productIndex } from "lib/connections/algolia";
import { getProductIdAlgolia, stockManagement } from "./products";
import { Order } from "models/orders";
import { User } from "models/user";
import { createPreference, getMerchantOrder } from "lib/connections/mercadopago";
import { sendEmailOwnerSuccessVenta, sendEmailSuccessSale } from "lib/connections/nodemailer";
import { Owner } from "models/owner";
import { Billing } from "models/billings";
import { Cart } from "models/cart";
import { quitAllProductsCart } from "./cart";
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
    productId: [product["objectID"]],
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
          quantity: order.data.aditional_info.quantity,
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
  

  ////cart lo traemos para que una vez que se efectue todo se vacie el carrito automaticamente


  
  await sendEmailSuccessSale(user.data.email);
  await  sendEmailOwnerSuccessVenta(owner.data.email)
   const newBilling =  await Billing.createBilling({
    productId:myOrderDB.data.productId,
    ownerId:owner.id,
    userId:user.id,
    address: user.data.address,
    message:"Pedido realizado con éxito, realizar envío al usuario comprador",
    userEmail:user.data.email,
    name:user.data.name,
    status:"closed"
     })


     /// El error esta aca, que cuando hacemos el descuento de stock por compra de un solo producto sin carro realiza bien la tarea la funcion stockmanagement, pero cuando realizamos la pref desde el carrito con mas productos ahi se rompe la funcion por ende tampoco quita los productos del carrito en la base de datos :DDD Solucionarlo :_OPK=UY")YY)E

     if(!myOrderDB.data.productId[1]){
       const cantidadPedidas = myOrderDB.data.aditional_info.quantity
       // aca envio que producto y cuantos a la funcion stockManagement para que haga los calculos de stock :D
      await stockManagement(myOrderDB.data.productId ,cantidadPedidas as number) 
    } else if (myOrderDB.data.productId[1]){
      await stockManagement(myOrderDB.data.productId.id,myOrderDB.data.productId.quantity)
      await quitAllProductsCart(myOrderDB.data.userId)
      
     }

     
     return newBilling


} 




