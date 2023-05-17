import * as functions from "firebase-functions";

export type Middleware =
  (req:functions.Request, res:functions.Response)=> boolean | Promise<boolean>;

type Handler =
  (req:functions.Request, res:functions.Response)=> void | Promise<void>;

export const withMiddlewares = (...mids:Middleware[])=> (handler:Handler) => {
  return functions.https.onRequest(async (req, res) => {
    let next = false;

    for (const mid of mids) {
      next = await mid(req, res);
      if (!next) break;
    }

    if (next) {
      handler(req, res);
    }
  });
};

