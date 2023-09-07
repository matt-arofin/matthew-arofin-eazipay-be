import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js'; 


const generateToken = (user) => {
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
};

export const signup = async ({ username, email, password }) => {
  try {

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new Error('Username already exists');
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    console.log(newUser);
    await newUser.save();

    const token = generateToken(newUser);

    const userResponse = {
      token,
      user: {
        username: newUser.username,
        email: newUser.email
      }
    }

    return userResponse;
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
};

export const login = async ({ username, password }) => {
  try {
    console.log(username, password);

    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid Credentials');
    }

    const token = generateToken(user);

    const userResponse = {
      token,
      user: {
        username: newUser.username,
        email: newUser.email
      }
    }

    return userResponse;
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
};