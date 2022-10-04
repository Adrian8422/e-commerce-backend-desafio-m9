import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { getOrderById } from "controllers/orders";
async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId } = req.query;

  const response = await getOrderById(orderId).catch((err)=>{
    res.status(401).send({
      message :"Error en id o no existe ese id",
      error:err
    })
  })
  res.send(response);
}
// ahora traer el controller - ya me lee el parametro query
const handler = methods({
  get: getHandler,
});
export default authMiddleware(handler);
