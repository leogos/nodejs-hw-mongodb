export const validateBody = (schema, options = {}) => {
  return async (req, res, next) => {
    try {
      const isEmptyBody = Object.keys(req.body).length === 0;

      if (options.allowEmptyWithFile && isEmptyBody && req.file) {
        return next();
      }

      await schema.validateAsync(req.body, {
        abortEarly: false,
      });

      next();
    } catch (error) {
      error.status = 400;
      next(error);
    }
  };
};
