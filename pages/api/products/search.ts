import { NextApiRequest, NextApiResponse } from "next";

import methods from "micro-method-router";
import { getOffsetAndLimitFromReq } from "lib/functions/requests";
import { productIndex } from "lib/connections/algolia";
import { getProductInALgolia } from "controllers/products";

module.exports = methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const search = req.query.q as string;
    const response = await getProductInALgolia(search, req);
    res.send(response);
  },
});
