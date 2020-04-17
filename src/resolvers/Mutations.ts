import bcrypt from "bcryptjs";
import { MutationMap } from "../types/graphql-util";
import { User } from "../entity/User";

/**
 * Mutation files
 */
const Mutations: MutationMap = {
  register: async (
    _,
    { firstName, email, password }: GQL.IRegisterOnMutationArguments
  ) => {
    // Check if Email is already exist
    const userAlreadyExist = User.findOne({ where: { email } });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({
      firstName,
      email,
      password: hashedPassword
    });

    await user.save();
    return true;
  }
};

export default Mutations;
