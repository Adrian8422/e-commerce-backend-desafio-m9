import { firestore } from "lib/connections/firestore";
import isAfter from "date-fns/isAfter";

const collection = firestore.collection("auth");

export class Auth {
  id: string;
  data: any;
  ref: FirebaseFirestore.DocumentReference;
  constructor(id) {
    this.ref = collection.doc(id);
    this.id = id;
  }

  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    this.ref.update(this.data);
  }
  static cleanEmail(email: string) {
    return email.trim().toLowerCase();
  }
  isCodeExpired() {
    const now = new Date();
    const expired = this.data.expires.toDate();
    return isAfter(now, expired);
  }

  static async findByEmail(email: string) {
    const cleanEmail = Auth.cleanEmail(email);
    const result = await collection.where("email", "==", cleanEmail).get();
    if (result.docs.length) {
      const first = result.docs[0];
      const newAuth = new Auth(first.id);
      newAuth.data = first.data();
      return newAuth;
    } else {
      console.log("no encontramos ese email en la base de datos");
      return null;
    }
  }
  static async createNewAuth(data) {
    const snapAuth = await collection.add(data);
    const newAuth = new Auth(snapAuth.id);
    newAuth.data = data;
    return newAuth;
  }
  

  static async findByEmailAndCode(email: string, code: number) {
    const cleanEmail = Auth.cleanEmail(email);

    const results = await collection
      .where("email", "==", cleanEmail)
      .where("code", "==", code)
      .get();

    if (results.empty) {
      console.log("no hay resultados con ese email and code");
      return null;
    } else {
      const first = results.docs[0];
      const newAuth = new Auth(first.id);
      newAuth.data = first.data();
      return newAuth;
    }
  }
}
