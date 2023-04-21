import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { middlewareMercadoPago } from "lib/middlewares/mercadopagoMiddle";
import { checkOrderAndCreateBilling } from "controllers/orders";
import { middlewareCors } from "lib/middlewares/cors";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
  await checkOrderAndCreateBilling(id).catch((err) =>
    res.status(200).send({ message: err })
  );

  res
    .status(200)
    .send({ message: "todo salio bien tenes un producto para enviar" });
}
const handler = methods({
  post: postHandler,
});
const handlerWithValidation = middlewareMercadoPago(handler);

export default middlewareCors(handlerWithValidation);
