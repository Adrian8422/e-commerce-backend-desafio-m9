import { getAllProd } from "controllers/products";
import { middlewareCors } from "lib/middlewares/cors";
import { NextApiRequest, NextApiResponse } from "next";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const response = await getAllProd();
  res.send(response);
}

export default middlewareCors(getHandler);
