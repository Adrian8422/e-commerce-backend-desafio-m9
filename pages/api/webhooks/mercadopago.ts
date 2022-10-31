
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";

import * as yup from "yup"
import { schemaQuery } from "lib/middlewares/schemaMiddleware";
import { Owner } from "models/owner";
import { Billing } from "models/billings";
import { middlewareMercadoPago } from "lib/middlewares/mercadopagoMiddle";
import { checkOrderAndCreateBilling } from "controllers/orders";
let querySchema  = yup.object().shape({
  topic:yup.string().required(),
  id:yup.number().required()

}).noUnknown(true).strict()

  async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
 await checkOrderAndCreateBilling(id)
 
   res.status(200).send({message:"todo salio ok tenes un producto para enviar"})
 
}
const postHandlerWithValidation = schemaQuery(querySchema,postHandler)
const handler = methods({
  post:postHandlerWithValidation
})
export default middlewareMercadoPago(handler)


