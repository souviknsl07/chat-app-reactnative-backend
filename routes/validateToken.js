import { redisClient } from "./auth.js";

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json("Unauthorized1");
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json("Unauthorized2");
    }
    console.log("you shall pass");
    return next();
  });
};

export default verifyToken;
