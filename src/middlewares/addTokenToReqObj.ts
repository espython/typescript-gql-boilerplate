import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

// jsonwebtoken decoded object
interface Decoded extends Object {
  userId: string;
}
// overwrite request object
interface RequestObject extends Request {
  [key: string]: any;
}

// the add token to request Middleware
const addTokenToRequestObj = (
  request: RequestObject,
  response: Response,
  next: NextFunction
): void => {
  const { token } = request.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET!) as Decoded;

    request.userId = userId;
  }
  next();
};

export default addTokenToRequestObj;
