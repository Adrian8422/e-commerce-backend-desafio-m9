import { getProductIdAlgolia, stockManagement } from "./products";
import { Order } from "models/orders";
import { User } from "models/user";
import { createPreference, getMerchantOrder } from "lib/connections/mercadopago";
import { sendEmailOwnerSuccessVenta, sendEmailSuccessSale } from "lib/connections/nodemailer";
import { Billing } from "models/billings";
import { quitAllProductsCart } from "./cart";
import { getDataOwner } from "./owner";
type CreateOrderResponse={
  url:string
}
export async function createPreferenceAndOrderOneProductMp(productId, userId, color,version,quantity) :Promise <CreateOrderResponse>{
  
  const product = await getProductIdAlgolia(productId)
  if(product["stock"] == 0){
    return {
      url:"producto agotado,no podemos continuar"
    }
  }
  if((product["stock"] - quantity) < 0){
    return {url:`no hay esa cantidad de stock, solo quedan ${product["stock"]}`}
  }
  console.log("producto",product)
  if (!product) {
    console.log("no encontramos el producto en la base de datos");
    return null
  
  }
  /// Creacion de preference y orden en base de datos
  const order = await Order.createOrder({
    ownerId:product["ownerId"],
    productId: [product["objectID"]],
    userId: userId,
    status: "pending",
    createdAt: new Date(),
    aditional_info: {
      color,
      version,
      
      quantity: [{id: product["objectID"],quantity:quantity} ]
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

export async function getAllMyOrders(userId:string) {
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
  
  ///Creamos una  collection Billing para que el dueño del e-commerce pueda chequear que, quien y cuando compraron X producto
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

     const owner = await getDataOwner(myOrderDB.data.ownerId)
     /// Envío de email a usuario comprador y vendedor
     await sendEmailSuccessSale(user.data.email);
     await  sendEmailOwnerSuccessVenta(owner.email)

     const quantityAndId = myOrderDB.data.aditional_info.quantity

    /// Manejo de stock en airtable
     quantityAndId.map(async(prod)=>{
       await stockManagement(prod.id ,prod.quantity) 

     })

    /// Una vez efectuada la compra el carrito se vacía automaticamente
       await quitAllProductsCart(myOrderDB.data.userId)

     
     return newBilling


} 




