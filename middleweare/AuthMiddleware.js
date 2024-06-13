const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const token = req.headers["product_pro"];
  let verified;
  try {
    verified = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res
      .status(400)
      .send({ status: 400, message: "JWT not provided Please login" });
  }
  if (verified) {
    req.locals = verified;
    next();
  } else {
    return res.status(400).send({
      status: 400,
      message: "not authenticated please login ",
    });
  }
};
module.exports = { isAuth };
