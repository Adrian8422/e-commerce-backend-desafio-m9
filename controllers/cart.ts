import { createPreference } from "lib/connections/mercadopago";
import { Cart } from "models/cart";
import { Order } from "models/orders";
import { deleteByIdProduct, getArrayProductsIdAlgolia, getProductIdAlgolia } from "./products";

export async function addProductInCart(idsProducts,userId){
  const products = await getArrayProductsIdAlgolia(idsProducts)

  if(!products){
    console.log("no encontramos ese producto")
    return null
  }
  products.results.map(async(prod)=>{
    await Cart.createProductInCart({
        ownerId:prod["ownerId"],
        title:prod["title"],
        categories:prod["categories"],
        description:prod["description"],
        price:prod["price"],
        stock:prod["stock"],
        productId: prod["objectID"],
        userId: userId,
        createdAt: new Date(),
      })
          
    })
    
    const order = await Order.createOrder({
       ownerId:products.results[0]["ownerId"],
       productId: products.results.map((prod)=> prod.objectID),
       userId: userId,
       status: "pending",
       createdAt: new Date(),
       
     })

     const createPreferenceMp = await createPreference({
       external_reference: order.id,

       items: 
         products.results.map((producto)=>(
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
    // const deleteProduct = await Cart.deleteProductFromCart()
    // return deleteProduct 

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
  
