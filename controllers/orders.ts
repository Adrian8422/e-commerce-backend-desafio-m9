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
import { getDataOwner } from "./owner";
type CreateOrderResponse={
  url:string
}
export async function createPreferenceAndOrderOneProductMp(productId, userId, color,version,quantity) :Promise <CreateOrderResponse>{
  
  const product = await getProductIdAlgolia(productId)
  console.log("producto",product)
  if (!product) {
    console.log("no encontramos el producto en la base de datos");
    return null
  
  }
  const order = await Order.createOrder({
    ownerId:product["ownerId"],
    productId: [product["objectID"]],
    userId: userId,
    status: "pending",
    createdAt: new Date(),
    aditional_info: {
      color,
      version,
      quantity: [quantity] 
      ////NECESITO CONVERTIR ESTO DE ORDERS.TS CONTROLLER EN UN ARRAY EL QUANTITY ASI EN EL MOMENDO DE HACER EL BILLING 
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
          quantity: quantity,
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




  
  await user.pull()
  

  ////cart lo traemos para que una vez que se efectue todo se vacie el carrito automaticamente


  
  
   const newBilling =  await Billing.createBilling({
    productId:myOrderDB.data.productId.map((prodId)=>prodId),
    quantity:myOrderDB.data.aditional_info.quantity.map((quantity)=>quantity),
    ownerId:myOrderDB.data.ownerId,
    userId:user.id,
    address: user.data.address,
    message:"Pedido realizado con éxito, realizar envío al usuario comprador",
    userEmail:user.data.email,
    name:user.data.name,
    status:"closed"
     })

     console.log("billing a ver si se crea",newBilling)
     const owner = await getDataOwner(myOrderDB.data.ownerId)
     
        

     await sendEmailSuccessSale(user.data.email);
     await  sendEmailOwnerSuccessVenta(owner.email)


     /// El error esta aca, que cuando hacemos el descuento de stock por compra de un solo producto sin carro realiza bien la tarea la funcion stockmanagement, pero cuando realizamos la pref desde el carrito con mas productos ahi se rompe la funcion por ende tampoco quita los productos del carrito en la base de datos :DDD Solucionarlo :_OPK=UY")YY)E
     const quantityAndId = myOrderDB.data.aditional_info.quantity



     
     
     // aca envio que producto y cuantos a la funcion stockManagement para que haga los calculos de stock :D
     quantityAndId.map(async(prod)=>{
       await stockManagement(prod.id ,prod.quantity) 

     })
     await quitAllProductsCart(myOrderDB.data.userId)

     
     return newBilling


} 




