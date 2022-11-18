import { NextApiRequest, NextApiResponse } from "next";

export function schemaBodyAndQuery(bodySchema, querySchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse, token) {
    try {
      await querySchema.validate(req.query);
    } catch (err) {
      res.status(422).send({ fields: "query", message: err });
    }
    try {
      await bodySchema.validate(req.body);
      callback(req, res, token);
    } catch (err) {
      res.status(422).send({ fields: "body", message: err });
    }
  };
}

export function schemaAuth(bodySchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const validationBody = await bodySchema.validate(req.body);
      if (validationBody) {
        callback(req, res);
      }
    } catch (err) {
      res.status(422).send({ fields: "body", message: err });
    }
  };
}

export function schemaQuery(querySchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse, token) {
    try {
      const validationQuery = await querySchema.validate(req.query);
      if (validationQuery) {
        callback(req, res, token);
      }
    } catch (err) {
      res.status(422).send({ fields: "query", message: err });
    }
  };
}

export function schemaBody(bodySchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse, token) {
    try {
      const validationBody = await bodySchema.validate(req.body);
      if (validationBody) {
        callback(req, res, token);
      }
    } catch (err) {
      res.status(422).send({ fields: "body", message: err });
    }
  };
}
