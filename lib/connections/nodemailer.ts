import nodemailer from "nodemailer";

export function transporter() {
  return nodemailer.createTransport({
    host: process.env.HOST_NODEMAILER,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "manbassman1996@gmail.com", // generated ethereal user
      pass: process.env.API_KEY_MAILER, // generated ethereal password
    },
  });
}
export async function sendEmailToUser(emailUser, code) {
  await transporter()
    .sendMail({
      from: '"Forgot password 👻" <manbassman1996@gmail.com>', // sender address
      to: emailUser, // list of receivers
      subject: ` `, // Subject line
      text: ` `, // plain text body
      html: `<strong> Tu código es: ${code} </strong>
 `, // html body
    })
    .catch((error) => {
      console.log("aca esta", error);
    });
}
export async function sendEmailSuccessSale(emailUser) {
  await transporter()
    .sendMail({
      from: '"Forgot password 👻" <manbassman1996@gmail.com>', // sender address
      to: emailUser, // list of receivers
      subject: ` `, // Subject line
      text: ` `, // plain text body
      html: `<strong> Pedido comprado con éxito :D </strong>
 `, // html body
    })
    .catch((error) => {
      console.log("aca esta", error);
    });
}
export async function sendEmailOwnerSuccessVenta(emailUser) {
  await transporter()
    .sendMail({
      from: '"Forgot password 👻" <manbassman1996@gmail.com>', // sender address
      to: emailUser, // list of receivers
      subject: ` `, // Subject line
      text: ` `, // plain text body
      html: `<strong> Te realizaron una compra, chequea tu app para ver donde enviar y demas :D </strong>
 `, // html body
    })
    .catch((error) => {
      console.log("aca esta", error);
    });
}
// send mail with defined transport object

const tran = transporter();
tran.verify().then(() => {
  console.log("Ready for send emails");
});