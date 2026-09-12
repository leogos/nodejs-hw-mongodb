import { Router } from 'express';

import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';

import {
  registerSchema,
  loginSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutController));

router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
