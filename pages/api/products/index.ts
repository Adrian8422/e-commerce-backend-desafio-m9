import { getAllProd } from "controllers/products";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const response = await getAllProd();
  res.send(response);
}
