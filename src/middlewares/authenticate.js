import createHttpError from 'http-errors';
import { Session } from '../db/Session.js';
import { User } from '../db/User.js';

export const authenticate = async (req, res, next) => {
  const authorization = req.get('Authorization');

  if (!authorization) {
    return next(createHttpError(401, 'Unauthorized'));
  }

  const [bearer, accessToken] = authorization.split(' ');

  if (bearer !== 'Bearer' || !accessToken) {
    return next(createHttpError(401, 'Unauthorized'));
  }

  const session = await Session.findOne({ accessToken });

  if (!session) {
    return next(createHttpError(401, 'Unauthorized'));
  }

  if (session.accessTokenValidUntil < new Date()) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);

  if (!user) {
    return next(createHttpError(401, 'Unauthorized'));
  }

  req.user = user;

  next();
};
