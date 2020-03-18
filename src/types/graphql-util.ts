import { Redis } from "ioredis";
import { Response } from "express";

export interface MutationMap {
  [key: string]: (
    parent: any,
    args: any,
    context: { redis: Redis; url: string; response: Response },
    info: any
  ) => any;
}

export interface QueryMap {
  [key: string]: (parent: any, args: any, context: {}, info: any) => any;
}
