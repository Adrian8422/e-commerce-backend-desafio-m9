
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";

import * as yup from "yup"
import { schemaQuery } from "lib/middlewares/schemaMiddleware";
import { Owner } from "models/owner";
import { Billing } from "models/billings";
import { middlewareMercadoPago } from "lib/middlewares/mercadopagoMiddle";
import { checkOrderAndCreateBilling } from "controllers/orders";

  async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
 await checkOrderAndCreateBilling(id)
 
   res.status(200).send({message:"todo salio ok tenes un producto para enviar"})
 
}
const handler = methods({
  post:postHandler
})
export default middlewareMercadoPago(handler)


