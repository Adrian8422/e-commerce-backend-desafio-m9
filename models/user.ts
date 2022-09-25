import { firestore } from "lib/connections/firestore";
const collection = firestore.collection("users");

export class User {
  id: string;
  ref: FirebaseFirestore.DocumentReference;
  data: any;

  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    this.ref.update(this.data);
  }

  static async createNewUser(data) {
    const snapUser = await collection.add(data);
    const newUser = new User(snapUser.id);
    newUser.data = data;
    return newUser;
  }
}
