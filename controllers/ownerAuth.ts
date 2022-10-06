import { AuthOwner } from "models/authowner";
import { Owner } from "models/owner";
import gen from "random-seed";
import addMinutes from "date-fns/addMinutes";
import { sendEmailToUser } from "lib/connections/nodemailer";
import { generate } from "lib/functions/jwt";

//// Create code random
var seed = "VARIABLENene";
var random = gen.create(seed);

export async function findOrCreateOwner (email){
  const authOwner= await AuthOwner.getByEmail(email)
  if(authOwner){
    console.log("encontramos el owner")
       authOwner.data.code=123223
    await authOwner.push()
    return authOwner
  }else {
    const newOwner = await Owner.createOwner({
      email:email,
      createdAt:new Date()
    })
    const newAuthOwner = await AuthOwner.createAuthOwner({
      ownerId:newOwner.id,
      email:email,
      expires:new Date(),
      code:"",
      createdAt:new Date()
    })
 
    return newAuthOwner.data
  }

}

export async function sendCodeOwner(email:string){
  const authOwner = await findOrCreateOwner(email)

  const code = random.intBetween(100000, 999999);
  const now = new Date();
  const inTwentyMinutesExpires = addMinutes(now, 20);
  if(!authOwner){
    return {message:"error en find or create"}
  }
  authOwner.data.code = code
  authOwner.data.expires  = inTwentyMinutesExpires
  await authOwner.push()
  await sendEmailToUser(authOwner.data.email, authOwner.data.code);
  return {
    message: "codigo enviado a su email :D",
  };
}
export async function authOwnerCodeReturnToken (email,code){

  const authOwner= await AuthOwner.findByEmailAndCode(email,code)
  if(!authOwner){
    return {message:"error no encontramos un usuario ocn ese codigo and email"}
  }

  const expired = authOwner.isCodeExpired()
  if(expired){
    authOwner.data.code=""
    await authOwner.push()
    return {message:"código expirado"}
  }
  var tokenGenerate = generate({ownerId:authOwner.data.ownerId})
  return {tokenGenerate}

}

