import { NextApiRequest, NextApiResponse } from "next";

import methods from "micro-method-router";
import { getOffsetAndLimitFromReq } from "lib/functions/requests";
import { productIndex } from "lib/connections/algolia";
import { getProductQueryInALgolia } from "controllers/products";
import * as yup from "yup"
import { schemaQuery } from "lib/middlewares/schemaMiddleware";

let querySchema = yup.object().shape({
  q:yup.string().required(),
  limit:yup.string().required(),
  offset:yup.string().required()
  //realizarlo cuando vayamos por los endpoints owner

}).noUnknown(true).strict()

  async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const search = req.query.q as string;
    const response = await getProductQueryInALgolia(search, req).catch((err)=>{
      res.status(401).send({
        message:"no encontramos ese producto",
        error:err
      })
    })
    res.send(response);
  }
  const handler = methods({
    get:getHandler
  })

export  default schemaQuery(querySchema,handler)



