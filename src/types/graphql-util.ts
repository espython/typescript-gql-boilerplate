import { Redis } from "ioredis";

export interface MutationMap {
  [key: string]: (
    parent: any,
    args: any,
    context: { redis: Redis; url: string },
    info: any
  ) => any;
}

export interface QueryMap {
  [key: string]: (parent: any, args: any, context: {}, info: any) => any;
}
