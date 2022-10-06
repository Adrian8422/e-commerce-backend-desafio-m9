import {firestore} from "lib/connections/firestore"
const collection = firestore.collection("billings")
export class Billing {
  id:string;
  productId:string
  userId:string
  data:any;
  ref:FirebaseFirestore.DocumentReference
  constructor(id){
    this.id= id,
    this.ref = collection.doc(id)
  }
  async pull (){
    const snap = await this.ref.get()
    this.data = snap.data()
  }
  async push (){
    this.ref.update(this.data)
  }
  static async createBilling(data){
    const snap = await collection.add(data)
    const newBilling = new Billing(snap.id)
    newBilling.data = data
    return data
  }
}