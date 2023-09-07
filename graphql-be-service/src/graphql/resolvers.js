import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { validationResult } from "express-validator";

const resolvers = {
  Mutation: {
    signup: async (_, { username, email, password }) => {
      try {
        await check('email', 'Invalid email').isEmail().run(req)
        await check('password','Password must be at least 8 characters long').isLength({ min: 8 }).run(req);

        const errors = validationResult(req)
      

        const existingUsername = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });
        if (existingUsername || existingEmail) {
          throw new Error('User already exists')

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
        }
      } catch (error) {
          return {
            error: {
              message: error.message,
              code: 400,
            }
          }
      }
    },

    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {expiresIn: '1h' }
      );

      return { token, user };
    },

    Query: {
      getUser: async (_, args) => {
        try {
          // Your data retrieval logic here
          const user = await User.findById(args.userId);
  
          if (!user) {
            throw new Error('User not found');
          }
  
          return user;
        } catch (error) {

          return {
            error: {
              message: error.message,
              code: '404',
            },
          };
        }
      },
    }
  },
}


export default resolvers;