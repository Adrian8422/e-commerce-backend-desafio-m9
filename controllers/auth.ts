import { User } from "models/user";
import { Auth } from "models/auth";
import gen from "random-seed";
import addMinutes from "date-fns/addMinutes";
import { sendEmailToUser } from "lib/connections/nodemailer";
import { generate } from "lib/functions/jwt";
import { getRandomValues } from "crypto";

//// Create code random
var seed = "asas";
var random = gen.create(seed);

export async function findOrCreateAuthAndUser(email: string) {
  const auth = await Auth.findByEmail(email);

  if (auth) {
    console.log("encontramos el registro");
    return auth;
  } else {
    const newUser = await User.createNewUser({
      email: email,
      createdAt: new Date(),
    });
    const newAuth = await Auth.createNewAuth({
      userId: newUser.id,
      email: newUser.data.email,
      code: "",
      expires: new Date(),
      createdAt: new Date(),
    });
    console.log("auth creado");
    return newAuth;
  }
}
type SendCode = {
  token: string;
};
type SendMessage = {
  message: string;
};

export async function sendCode(email: string): Promise<SendCode | SendMessage> {
  const auth = await findOrCreateAuthAndUser(email);
  const code = generateCodeRandom();
  // let code = random.intBetween(10000, 99999);
  const now = new Date();
  const inTwentyMinutesExpires = addMinutes(now, 5);

  if (!auth) {
    return {
      message: "error en findOrcreate",
    };
  }
  auth.data.code = code;
  auth.data.expires = inTwentyMinutesExpires;
  await sendEmailToUser(auth.data.email, auth.data.code);
  await auth.push();
  return {
    message: "codigo enviado a su email :D",
  };
}

type AuthCodeReturnToken = {
  token: string;
};
type AuthCodeReturnMessage = {
  message: string;
};
export async function authCodeReturnToken(
  email: string,
  code: number
): Promise<AuthCodeReturnToken | AuthCodeReturnMessage> {
  const auth = await Auth.findByEmailAndCode(email, code);
  if (!auth) {
    return {
      message: "error, no encontramos registro con ese email and code",
    };
  }

  const expired = auth.isCodeExpired();
  if (expired) {
    auth.data.code = "";
    auth.push();
    return { message: "código expirado, volve a pedir tu nuevo código" };
  } else {
    var token = generate({ userId: auth.data.userId });
    console.log("token generado");
    return { token };
  }
}
function generateCodeRandom() {
  var randNum = Math.floor(Math.random() * 90000) + 10000;
  return randNum;
}
