import bcrypt from 'bcrypt';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import { User } from '../db/User.js';
import { Session } from '../db/Session.js';

const createSession = async (userId) => {
  const accessToken = crypto.randomBytes(30).toString('hex');
  const refreshToken = crypto.randomBytes(30).toString('hex');

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);

  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

export const registerUser = async (payload) => {
  const { email, password } = payload;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return User.create({
    ...payload,
    password: hashedPassword,
  });
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteMany({
    userId: user._id.toString(),
  });

  return createSession(user._id.toString());
};

export const refreshUserSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Unauthorized');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token expired');
  }

  const userId = session.userId;

  await Session.deleteOne({ _id: session._id });

  return createSession(userId);
};

export const logoutUser = async (sessionId, refreshToken) => {
  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Unauthorized');
  }

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteOne({ _id: session._id });
};
