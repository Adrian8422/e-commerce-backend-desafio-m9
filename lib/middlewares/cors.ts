import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export function middlewareCors(callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    await NextCors(req, res, {
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      origin: "*",
      optionsSuccessStatus: 200,
    });
    callback(req, res);
  };
}
