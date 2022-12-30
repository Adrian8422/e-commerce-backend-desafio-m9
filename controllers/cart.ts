import { createPreference } from "lib/connections/mercadopago";
import { Cart } from "models/cart";
import { Order } from "models/orders";
import { getProductIdAlgolia } from "./products";

export async function addProductInCart(
  idProduct,
  userId: string,
  quantity: number
) {
  const product = await getProductIdAlgolia(idProduct);
  if (product["stock"] == 0) {
    return { message: "producto agotado, no podemos agregarlo al carrito" };
  }
  if (product["stock"] - quantity < 0) {
    return {
      message: `no hay esa cantidad de stock, solo quedan ${product["stock"]}`,
    };
  }

  if (!product) {
    console.log("no encontramos ese producto");
    return null;
  }

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
    createdAt: new Date(),
  });

  return addProductInCart.data;
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
    userId: userId,
    status: "pending",
    createdAt: new Date(),
    aditional_info: {
      quantity: productsInCart.map((prod) => {
        return { id: prod.data.productId, quantity: prod.data.quantity };
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
      success: "https://portfolio-6357a.web.app/",
      pending: "https://portfolio-6357a.web.app/",
    },
    notification_url:
      "https://e-commerce-backend-desafio-m9.vercel.app/api/webhooks/mercadopago",
    //  "https://webhook.site/15eead9d-9d4c-4d53-8dc9-86ad7dba0dd4"
  });
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
  if (!products) {
    return { message: "no hay productos en el carrito" };
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
  const product = await Cart.productCartGetById(idProd);
  if (!product) {
    return { message: "no encontramos ese producto en el carrito" };
  }
  product.data.quantity = newQuantity;
  product.push();
  return product;
}
