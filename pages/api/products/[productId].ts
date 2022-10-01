import { NextApiRequest, NextApiResponse } from "next";

import methods from "micro-method-router";
import { getOffsetAndLimitFromReq } from "lib/functions/requests";
import { productIndex } from "lib/connections/algolia";
import { getProductIdAlgolia } from "controllers/products";

module.exports = methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const productId = req.query.productId;
    const response = await getProductIdAlgolia(productId).catch((err) => {
      res.status(401).send({
        message: "no encontramos ese productId en la base de datos",
        error: err,
      });
    });

    res.send(response);
  },
});
