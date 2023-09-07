import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/user.js";
import { signup, login } from "../auth/auth.js";

const resolvers = {
  Query: {
    getUser: async (_, user) => {
      try {
        const user = await User.findOne( user.id );

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
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      try {      
        return signup({ username, email, password })
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
      try {
        return login({ username, password });
      } catch (error) {
        return {
          error: {
            message: error.message,
            code: 400,
          }
        }
      }
    }
  },
}


export default resolvers;