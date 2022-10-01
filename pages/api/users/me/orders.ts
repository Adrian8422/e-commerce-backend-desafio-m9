import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getAllMyOrders } from "controllers/orders";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const userId = token.userId;
  const response = await getAllMyOrders(userId).catch((err) => {
    res.status(401).send({
      message: "no hay ordenes",
      error: err,
    });
  });

  res.send(response);
}

const handler = methods({
  get: getHandler,
});
export default authMiddleware(handler);
