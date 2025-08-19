
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(httpStatus.FORBIDDEN).json({ msg: `Permission Denied` });
    }
    next();
  };
};
