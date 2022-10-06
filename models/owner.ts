import { firestore } from "lib/connections/firestore";

const collection = firestore.collection("owner")
export class Owner {
  id:string;
  data:any;
  ref:FirebaseFirestore.DocumentReference
  constructor(id){
    this.id=id,
    this.ref = collection.doc(id)
  }
  async pull (){
    const snap =await  this.ref.get()
    this.data = snap.data()
  }
  async push (){
    this.ref.update(this.data)
  }
  static async  createOwner(data){
    const snap = await  collection.add(data)
    const newOwner = new Owner(snap.id)
    newOwner.data = data
    return newOwner
  }
}