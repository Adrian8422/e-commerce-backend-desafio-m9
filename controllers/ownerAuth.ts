import { AuthOwner } from "models/authowner";
import { Owner } from "models/owner";
import gen from "random-seed";
import addMinutes from "date-fns/addMinutes";
import { sendEmailToUser } from "lib/connections/nodemailer";
import { generate } from "lib/functions/jwt";

//// Create code random
var seed = "VARIABLENene";
var random = gen.create(seed);

export async function findOwnerProducts(email: string) {
  const authOwner = await AuthOwner.getByEmail(email);
  if (authOwner) {
    console.log("encontramos el owner");
    return authOwner;
  }

  if (!authOwner) {
    return null;
  }
}

type SendCode = {
  message: string;
};

export async function sendCodeOwner(email: string): Promise<SendCode> {
  const authOwner = await findOwnerProducts(email);

  const code = random.intBetween(100000, 999999);
  const now = new Date();
  const inTwentyMinutesExpires = addMinutes(now, 20);
  if (!authOwner) {
    return { message: "email incorrecto, prueba nuevamente" };
  }
  authOwner.data.code = code;
  authOwner.data.expires = inTwentyMinutesExpires;
  await authOwner.push();
  await sendEmailToUser(authOwner.data.email, authOwner.data.code);
  return {
    message: "codigo enviado a su email :D",
  };
}

type AuthOwnerReturnToken = {
  token: string;
};
type AuthOwnerReturnMessage = {
  message: string;
};

export async function authOwnerCodeReturnToken(
  email: string,
  code: number
): Promise<AuthOwnerReturnToken | AuthOwnerReturnMessage> {
  const authOwner = await AuthOwner.findByEmailAndCode(email, code);
  if (!authOwner) {
    return {
      message: "error no encontramos un usuario ocn ese codigo and email",
    };
  }

  const expired = authOwner.isCodeExpired();
  if (expired) {
    authOwner.data.code = "";
    await authOwner.push();
    return { message: "código expirado" };
  }
  var token = generate({ ownerId: authOwner.data.ownerId });
  return { token };
}
