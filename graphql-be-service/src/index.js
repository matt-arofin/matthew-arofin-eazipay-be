import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import typeDefs from "./graphqlschema";
// import resolvers from "./graphql/resolvers";

dotenv.config();

const app = express();

mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

const server = new ApolloServer({
  // typeDefs,
  // resolvers,
  context: ({ req }) => {
    // auth middleware
    return {
      //auth logic
    };
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}` )
})