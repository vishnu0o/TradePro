import jwt from "jsonwebtoken";

const verifyUserToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  const token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    console.log(decoded, "decoded.userdecoded.userdecoded.user");

    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};

export default verifyUserToken;
