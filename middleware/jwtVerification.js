const jwt = require("jsonwebtoken");
const { apiFailureMessage } = require("../common/constants");

exports.userVerification = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token)
      throw {
        message: apiFailureMessage.TOKEN_NOT_PROVIDED,
      };
    token = token.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (decode.exp < Math.floor(new Date().getTime() / 1000))
      throw { message: apiFailureMessage.TOKEN_EXPIRED };
    req.body.userId = decode.userId;
    next();
  } catch (err) {
    res.status(400).send({
      message: err.message || apiFailureMessage.AUTHENTICATION_FAILED,
      statusCode: 400,
    });
  }
};
