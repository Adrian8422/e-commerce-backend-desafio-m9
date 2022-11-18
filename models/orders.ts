import { isThisSecond } from "date-fns";
import { firestore } from "lib/connections/firestore";

const collection = firestore.collection("orders");

export class Order {
  id: string;
  userId: string;
  data: any;
  ref: FirebaseFirestore.DocumentReference;
  productId: string;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }

  async pull() {
    const snap = await this.ref.get();
    return (this.data = snap.data());
  }
  async push() {
    this.ref.update(this.data);
  }
  static async createOrder(data) {
    const order = await collection.add(data);
    const newOrder = new Order(order.id);
    newOrder.data = data;
    return newOrder;
  }
  static async getMyOrders(userId) {
    const results = await collection.where("userId", "==", userId).get();
    if (results.empty) {
      return { message: "no encontramos ninguna orden de este usuario" };
    } else {
      return results.docs.map((order) => order.data());
    }
  }
  static async getMyOrderById(id) {
    const result = await collection.doc(id).get();
    if (!result) {
      return { message: "no encontramos ninga orden con ese id" };
    }
    const newOrder = new Order(result.id);
    newOrder.data = result.data();
    return newOrder.data;
  }
}
