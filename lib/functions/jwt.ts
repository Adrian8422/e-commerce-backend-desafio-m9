import jwt from "jsonwebtoken";

export function generate(obj) {
  var token = jwt.sign(obj, process.env.JWT_SECRET);
  return token;
}
export function decoded(token) {
  try {
    var tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    return tokenDecoded;
  } catch (error) {
    console.log("error en decoded token");
    return null;
  }
}
