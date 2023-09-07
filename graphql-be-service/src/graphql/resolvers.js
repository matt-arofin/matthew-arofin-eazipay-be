import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";

const resolvers = {
  Mutation: {
    signup: async (_, { username, email, password }) => {
      const existingUsername = await User.findOne({ username });
      const existingEmail = await User.findOne({ email });
      if (existingUsername || existingEmail) {
        throw new Error('User already exists')
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        username,
        email,
        password: hashedPassword,
      });

      await user.save();

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {expiresIn: '1h' }
      );

      return { token, user };
    },

    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compareSync(password, user.password);
      if (!isPAsswordValid) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {expiresIn: '1h' }
      );

      return { token, user };
    },
  },
};

export default resolvers;