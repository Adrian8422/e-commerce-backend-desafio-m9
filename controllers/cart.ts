import { createPreference } from "lib/connections/mercadopago";
import { Cart } from "models/cart";
import { Order } from "models/orders";
import { getProductIdAlgolia } from "./products";
import addHours from "date-fns/addHours";
import { addMinutes } from "date-fns";

export async function addProductInCart(
  idProduct,
  userId: string,
  quantity: number
) {
  const product = await getProductIdAlgolia(idProduct);
  if (product["stock"] == 0) {
    return {
      message: "producto agotado, no podemos agregarlo al carrito",
      out_of_stock_error: true,
    };
  }
  if (product["stock"] - quantity < 0) {
    return {
      message: `no hay esa cantidad de stock, solo quedan ${product["stock"]}`,
      low_stock_error: true,
    };
  }

  if (!product) {
    console.log("no encontramos ese producto");
    return null;
  }
  // const getImagesProd = product["images"].find((img) => img.width < 100);
  const getImagesProd = product["images"][0].thumbnails.small;
  const now = new Date();

  ///Creacion de collection Cart (Carrito de compras)
  const addProductInCart = await Cart.createProductInCart({
    ownerId: product["ownerId"],
    title: product["title"],
    categories: product["categories"],
    description: product["description"],
    price: product["price"],
    quantity: quantity,
    productId: product["objectID"],
    userId: userId,
    images: {
      url: getImagesProd.url,
    },
    createdAt: new Date(),
    expires: addHours(now, 4),
    // expires: addMinutes(now, 1),
  });

  return { response: addProductInCart.data, error: false };
}
/// Creacion de preference y orden en base de datos
export async function createPreferenceAndOrder(userId: string) {
  const productsInCart = await Cart.productsCartGetByUserId(userId);
  if (!productsInCart) {
    return { message: "no encontramos productos de este usuario en el carro" };
  }
  const order = await Order.createOrder({
    ownerId: productsInCart[0].data.ownerId,
    productId: productsInCart.map((prod) => prod.data.productId),
    title: productsInCart.map((prod) => prod.data.title),
    userId: userId,
    status: "pending",
    createdAt: new Date(),
    aditional_info: {
      quantity: productsInCart.map((prod) => {
        return {
          title: prod.data.title,
          id: prod.data.productId,
          quantity: prod.data.quantity,
        };
      }),
    },
  });

  const createPreferenceMp = await createPreference({
    external_reference: order.id,

    items: productsInCart.map((producto) => ({
      title: producto.data.title,
      description: producto.data.description,
      picture_url: "http://www.myapp.com/myimage.jpg",
      quantity: producto.data.quantity,
      currency_id: "$",
      unit_price: producto.data.price,
    })),
    back_urls: {
      success:
        "https://e-commerce-front-end-nextjs-desafio-m10.vercel.app/thanks",
      pending: "https://portfolio-6357a.web.app/",
    },
    notification_url:
      "https://e-commerce-backend-desafio-m9.vercel.app/api/webhooks/mercadopago",
    //  "https://webhook.site/15eead9d-9d4c-4d53-8dc9-86ad7dba0dd4"
  });
  await order.pull();
  order.data.aditional_info.url_order = createPreferenceMp.init_point;
  await order.push();
  return { url: createPreferenceMp.init_point };
}
export async function quitProductCart(idProduct: string) {
  const product = await Cart.productCartGetById(idProduct);
  if (!product) {
    return { message: "no encontramos ese producto" };
  }
  const deleteProduct = await Cart.deleteProductFromCart(product.id);
  return deleteProduct;
}
export async function getMyCurrentCart(userId: string) {
  const products = await Cart.productsCartGetByUserId(userId);

  // products.map(async (item) => {
  //   const dateExpired = item.data.expires.toDate();
  //   const expiredCart = await Cart.thisCartExpired(dateExpired);
  //   if (expiredCart == true) {
  //     await quitAllProductsCart(userId);
  //   }
  // });

  if (!products) {
    return { message: "no hay productos en el carrito", error: true };
  }
  return products;
}
export async function quitAllProductsCart(idUser: string) {
  const products = await Cart.productsCartGetByUserId(idUser);
  if (!products) {
    return { message: "no hay productos en el carrito" };
  }
  if (products) {
    products.map(async (oneProduct) => {
      const response = await Cart.destroyCart(oneProduct.id);
    });
    return { message: "productos borrados con éxito" };
  }
}

export async function changeQuantityProdInCart(idProd: string, newQuantity) {
  const productInCart = await Cart.productCartGetById(idProd);
  const product = await getProductIdAlgolia(idProd);
  if (product["stock"] == 0) {
    return {
      message: "producto agotado, no podemos agregarlo al carrito",
      error: true,
    };
  }
  if (product["stock"] - newQuantity < 0) {
    return {
      message: `no hay esa cantidad de stock, solo quedan ${product["stock"]}`,
      error: true,
    };
  }

  if (!productInCart) {
    return { message: "no encontramos ese producto en el carrt" };
  }
  productInCart.data.quantity = newQuantity;
  productInCart.push();
  return productInCart;
}
