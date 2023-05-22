import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import sendCode from '../services/sendMail.js';
import validateRequest from '../utils/validationUtils.js';
import {
  signupValidation,
  loginValidation,
  verifyValidation,
} from './../validators/authValidator.js';

const { genSalt, hash, compare } = bcrypt;

const signUp = async (req, res, next) => {
  try {
    const validationErrors = validateRequest(req.body, signupValidation);
    if (validationErrors)
      return res.status(400).json({ errors: validationErrors });

    const isUserExists = await User.findOne({ email: req.body.email });
    if (isUserExists) return res.status(400).json({ errors: 'User exists' });

    const salt = await genSalt(10);
    const password = await hash(req.body.password, salt);

    const verificationCode = Math.floor(Math.random() * 1000000);

    const user = new User({
      email: req.body.email,
      password: password,
      verificationCode: verificationCode,
    });

    await user.save();
    sendCode(user);
    return res
      .status(200)
      .json({ message: 'Verification code email sent successfully' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validationErrors = validateRequest(req.body, loginValidation);
    if (validationErrors)
      return res.status(400).json({ errors: validationErrors });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .json({ errors: 'Your Credentials are not correct' });

    const validPassword = await compare(req.body.password, user.password);
    if (!validPassword)
      return res
        .status(400)
        .json({ errors: 'Your Credentials are not correct' });

    if (user.isVerified == false)
      return res
        .status(400)
        .send('User is not verified, please verify and login');

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.TOKEN_SECRET,
    );

    return res.status(200).json({ token: token });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const validationErrors = validateRequest(req.body, verifyValidation);
    if (validationErrors)
      return res.status(400).json({ errors: validationErrors });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ errors: 'User does not exist' });

    if (user.isVerified == true) {
      return res.status(400).json({ errors: 'User is already verified' });
    }

    if (user.verificationCode != req.body.verificationCode) {
      return res.status(400).json({ errors: 'Invalid verification code' });
    }

    await User.findOneAndUpdate({ _id: user._id }, { isVerified: true });
    return res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    next(error);
  }
};

export { signUp, login, verify };
