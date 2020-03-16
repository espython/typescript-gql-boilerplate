import { v4 } from "uuid";
import { Redis } from "ioredis";

export const createConfirmationEmailLink = async (
  url: string,
  userId: string,
  redis: Redis
): Promise<string> => {
  const id = v4();
  await redis.set(id, userId, "ex", 60 * 60 * 24);
  return `${url}/confirm/${id}`;
};
