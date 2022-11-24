import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import NextCors from "nextjs-cors";

// export function middlewareCors(callback) {
//   return async function (req: NextApiRequest, res: NextApiResponse) {
//     await NextCors(req, res, {
//       methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
//       origin: "*",
//       optionsSuccessStatus: 200,
//     });
//     callback(req, res);
//   };
// }

export function middlewareCors(callback) {
  return async function (req: NextRequest) {
    if (req.method == "OPTIONS") {
      return await new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          "Access-Control-Allow-Headers":
            req.headers.get("Access-Control-Request-Headers") || "",
          Vary: "Access-Control-Request-Headers",
          "Content-Length": "0",
        },
      });
    }
    callback();
  };
}
