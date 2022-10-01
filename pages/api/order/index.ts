import { authMiddleware } from "lib/middlewares/authmiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { createPreferenceAndOrderMp } from "controllers/orders";
async function postHanlder(req: NextApiRequest, res: NextApiResponse, token) {
  ///// ver como hacer para crear order Preference porque no me la estaria tomando, hacer una order primero en la base d edatos y luego hacer la preferencia en mercado pago :DDD relaxx que ya lo vamos a solucionar :DDDD
  const { productId } = req.query;
  const dataBody = req.body;
  const userId = token.userId;
  const respuesta = await createPreferenceAndOrderMp(
    productId,
    userId,
    dataBody
  ).catch((err) => {
    res.status(401).send({ message: "no encontramos el producto", error: err });
  });

  res.send({ url: respuesta });
}
const handler = methods({
  post: postHanlder,
});
export default authMiddleware(handler);
