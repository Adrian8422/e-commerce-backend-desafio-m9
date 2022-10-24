import { firestore } from "lib/connections/firestore";
const collection = firestore.collection("cart")
export class Cart {
  id:string
  data:any
  ref:FirebaseFirestore.DocumentReference
  constructor(id){
    this.id = id
    this.ref = collection.doc(id)
  }
  async pull(){
    const snap =await this.ref.get()
    this.data = snap.data()
  }
  async push (){
    this.ref.update(this.data)
  }
  async delete (){
    this.ref.delete()
  }
  static async createProductInCart(data){
    const snap = await collection.add(data)
    const newCart= new Cart(snap.id)
    newCart.data =data
    return newCart
  }
  static async productCartGetById (id){
    const product  = await collection.where("productId","==",id).get()
    if(product.empty){
      return null
    }
    const first = product.docs[0]
    const productCart = new Cart(first.id)
    productCart.data = first.data()
    return productCart
  }
  static async deleteProductFromCart(id){
    const product =  await collection.doc(id).delete()
    if(product){
      return {message:"Producto quitado del carrito"}
    }
  
  }

}