import bcrypt from "bcryptjs";
import * as yup from "yup";

import { MutationMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import { formatYupError } from "../../utils/formatYupErrors";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "./ErrorMessages";
import { sendEmail } from "../../utils/sendEmail";
import { createConfirmationEmailLink } from "../../utils/createConfirmEmailLink";

// Validate Schema
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailNotLongEnough)
    .max(255)
    .email(invalidEmail),
  password: yup
    .string()
    .min(3, passwordNotLongEnough)
    .max(255)
});

/**
 * Mutation files
 */
const Mutations: MutationMap = {
  register: async (
    _,
    args: GQL.IRegisterOnMutationArguments,
    { redis, url }
  ) => {
    try {
      await validationSchema.validate(args, { abortEarly: false });
    } catch (err) {
      return formatYupError(err);
    }
    // Check if Email is already exist
    const { email, password, firstName } = args;
    const userAlreadyExist = await User.findOne({
      where: { email },
      select: ["id"]
    });
    if (userAlreadyExist) {
      return [
        {
          path: "email",
          message: duplicateEmail
        }
      ];
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({
      firstName,
      email,
      password: hashedPassword
    });

    await user.save();
    await sendEmail(
      email,
      await createConfirmationEmailLink(url, user.id, redis)
    );
    return null;
  }
};

export default Mutations;
