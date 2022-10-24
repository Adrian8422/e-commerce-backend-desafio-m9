import test from "ava"
import { IncomingMessage } from "http";
import { decoded } from "lib/functions/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";

test('decoded authMiddleware', t => {

t.pass()
});