import { isAfter } from "date-fns";
import { firestore } from "lib/connections/firestore";

const collection = firestore.collection("authowner")

export class AuthOwner{
  id:string;
  data:any;
  ref:FirebaseFirestore.DocumentReference
  constructor(id){
  this.id = id
  this.ref = collection.doc(id)
  }
  async pull (){
    const snap = await this.ref.get()
    this.data = snap.data
  }
  async push (){
    this.ref.update(this.data)
  }
  isCodeExpired(){
    const now = new Date();
    const expired = this.data.expires.toDate();
    return isAfter(now, expired);
  }
  static async createAuthOwner(data){
    const snap = await collection.add(data)
    const newAuthOwner = new AuthOwner(snap.id)
    newAuthOwner.data=data
    return newAuthOwner
  }
  static async getByEmail(email){
    const cleanEmail = email.trim().toLowerCase()
    const results = await collection.where("email","==",cleanEmail).get()
    if(results.docs.length){
      const first = results.docs[0]
      const newOwner = new AuthOwner(first.id)
      newOwner.data = first.data()
      return newOwner
    }else{
      console.log("no encontramos ese owner email")
      return null
    }
    

  }
  static async  findByEmailAndCode(email:string,code:number){
    const cleanEmail = email.trim().toLowerCase()
    const results= await collection.where("email","==",cleanEmail).where("code","==",code).get()
    if(results.empty){
      console.log("no hay resultados con ese email and code");
      return null


    }else{
    const first = results.docs[0]
    const newAuthOwner = new AuthOwner(first.id)
    newAuthOwner.data = first.data()
    return newAuthOwner
    }
  }

}