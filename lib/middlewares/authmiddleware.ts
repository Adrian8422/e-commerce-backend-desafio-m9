import { decoded } from "lib/functions/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";

export function authMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    const token = parseBearerToken(req);
    if (!token) {
      return { message: "no encontramos ningún token" };
    }
    const decodedToken = decoded(token);
    if (!decodedToken) {
      return { message: "token incorrecto" };
    } else {
      callback(req, res, decodedToken);
      return { message: "token correcto :D" };
    }
  };
}
