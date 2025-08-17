import createError from "http-errors";

export function allow(...roles) {
  console.log(`RBAC: Allowing roles: ${roles.join(", ")}`);
  return (req, _res, next) => {
    console.log(`The req.user is: ${JSON.stringify(req.user)}`);
    if (!roles.includes(req.user.role)) {
      return next(createError(403, "Forbidden"));
    }
    next();
  };
}

export function ownBase(req, _res, next) {
  const { baseId } = req.body;
  if (req.user.role !== "Admin" && baseId && !req.user.baseId?.equals(baseId)) {
    return next(createError(403, "Cross-base action denied"));
  }
  next();
}
