import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { getDataOwner } from "controllers/owner";
import { middlewareCors } from "lib/middlewares/cors";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const ownerId = token.ownerId;
  const user = await getDataOwner(ownerId).catch((err) =>
    res.status(401).send({ error: err })
  );
  res.send(user);
}
const handlerWithValidation = authMiddleware(getHandler);

export default middlewareCors(handlerWithValidation);
