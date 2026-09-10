import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../services/auth.js';

export const registerController = async (req, res) => {
  const user = await registerUser(req.body);

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: userWithoutPassword,
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const session = await loginUser(email, password);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken } = req.cookies;

  const session = await refreshUserSession(refreshToken);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  await logoutUser(sessionId, refreshToken);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
