import { createPreference } from "lib/connections/mercadopago";
import { Cart } from "models/cart";
import { Order } from "models/orders";
import { deleteByIdProduct, getArrayProductsIdAlgolia, getProductIdAlgolia } from "./products";

export async function addProductInCart(idProduct,userId,quantity){
  
  const product = await getProductIdAlgolia(idProduct)

  if(!product){
    console.log("no encontramos ese producto")
    return null
  }
 
   const addProductInCart =  await Cart.createProductInCart({
       ownerId:product["ownerId"],
       title:product["title"],
       categories:product["categories"],
       description:product["description"],
       price:product["price"],
       quantity:quantity,
       productId: product["objectID"],
       userId: userId,
       createdAt: new Date(),
      })
      
      return addProductInCart.data
    }
    // /// es el nombre  productsInCart. del map que esta mas arriba para crear los productos en el cart, eso tenemos que ponerlo para ver como hacemos lo que escribi abajo 
    //  productsInCart.map(async(prod)=>{const productoAver = await (await prod).data
    // console.log(productoAver)})
    //  /// esta linea de arriba ver como se la aplico al createPreference que esta abajo, para que haga el mapeo en base a los productos que ya agregamos al carrito. Tambien colocar el quantity en el body para que cuando agregemos los productos al carrito se especifique cuantos son los que compramos por ej 2. Y en base a la cantidad que pusimos en el carrito tambien colocarlo en quantity de la preferencia que creamos dsp de la order. Vamos que se puede Adri :DDDDD
    
    // const order = await Order.createOrder({
    //    ownerId:products.results[0]["ownerId"],
    //    productId: products.results.map((prod)=> prod.objectID),
    //    userId: userId,
    //    status: "pending",
    //    createdAt: new Date(),
    //    aditional_info: {
    //     quantity:quantity,
    //   },
       
    //  })

//      const createPreferenceMp = await createPreference({
//        external_reference: order.id,

//        items: 
//          products.results.map((producto)=>(
//            {     
//              title: producto["title"],
//              description: producto["description"],
//              picture_url: "http://www.myapp.com/myimage.jpg",
//              quantity: 1,
//              currency_id: "$",
//              unit_price: producto["price"],
//            }
//            )
         
//        )
//        ,
//        back_urls: {
//          success: "https://portfolio-6357a.web.app/",
//          pending: "https://portfolio-6357a.web.app/",
//        },
//        notification_url:
//          "https://e-commerce-backend-desafio-m9.vercel.app/api/webhooks/mercadopago",
//         //  "https://webhook.site/15eead9d-9d4c-4d53-8dc9-86ad7dba0dd4"
//         });
//         console.log("preference",createPreferenceMp.init_point)
// return {url:createPreferenceMp.init_point}
  export async function createPreferenceAndOrder (userId){
    const productsInCart = await Cart.productsCartGetByUserId(userId)
    // console.log("productos controller",productsInCart)
     if(!productsInCart)
     {
       return {message:"no encontramos productos de este usuario en el carro"}
   }
    //    productsInCart.map((prod)=>{const newProd = new Cart(prod.id)
    // newProd.data = prod.data()
    // return newProd  
  // })
  // createPreferenceAndOrder   CART.TS CONTROLLER
  //// ACA TENGO QUE CREAR LA ORDEN UNA SOLA CON LOS DATOS DE TODOS LOS PRODUCTOS AGREGADOS AL CARRO Y LUEGO REALIZAR LA PREFERENCIA, DALE QUE SE PUEDE ADRIIIIII :DDDDDDD YA LE ENCONTRAMOS SOLUCION A LO DEL QUANTITY
     const order = await Order.createOrder({
         ownerId:productsInCart[0]["ownerId"],
         productId: productsInCart.map((prod)=> prod["productId"]),
         userId: userId,
         status: "pending",
         createdAt: new Date(),
         aditional_info: {
          quantity:productsInCart.map((prod)=>{ return {id:prod.productId,quantity:prod.quantity}})
        },
       
       })
  //  return order.data
         const createPreferenceMp = await createPreference({
        external_reference: order.id,

        items: 
          productsInCart.map((producto)=>(
            {     
              title: producto["title"],
              description: producto["description"],
              picture_url: "http://www.myapp.com/myimage.jpg",
              quantity: 1,
              currency_id: "$",
              unit_price: producto["price"],
            }
            )
         
        )
        ,
        back_urls: {
         success: "https://portfolio-6357a.web.app/",
          pending: "https://portfolio-6357a.web.app/",
        },
        notification_url:
          "https://e-commerce-backend-desafio-m9.vercel.app/api/webhooks/mercadopago",
         //  "https://webhook.site/15eead9d-9d4c-4d53-8dc9-86ad7dba0dd4"
         });
         console.log("preference",createPreferenceMp.init_point)
 return {url:createPreferenceMp.init_point}

  }
   export async function quitProductCart(idProduct){
     const product =  await Cart.productCartGetById(idProduct)
     if(!product){
       return {message:"no encontramos ese producto"}
     }
     const deleteProduct = await Cart.deleteProductFromCart(product.id)
     return deleteProduct
  

  }
  export async function getMyCurrentCart(userId){
    const products = await Cart.productsCartGetByUserId(userId)
    return products

  }
  export async function quitAllProductsCart(idUser){
    const products = await Cart.productsCartGetByUserId(idUser)
    if(!products){
      return {message:"no hay productos en el carrito"}
    }
    if(products){

      products.map(async(oneProduct)=>{
          const response = await Cart.destroyCart(oneProduct.id)
      
         return response
      }
      )
    }
  }
  
