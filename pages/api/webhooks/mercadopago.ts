import { getMerchantOrder } from "lib/connections/mercadopago";
import {
  sendEmailSuccessSale,
  sendEmailToUser,
} from "lib/connections/nodemailer";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { Order } from "models/orders";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { User } from "models/user";
import { sendEmailSuccess } from "controllers/orders";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { topic } = req.query;
  const {id} = req.query
  const response = await sendEmailSuccess(topic,id)
res.send(response)
}

