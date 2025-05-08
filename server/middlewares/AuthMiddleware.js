import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });
  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "You are unauthorized" });
  }
};


const guestMethod = (req, res, next) => {
  const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_KEY);
      return res.status(403).json({ message: "Guests only route" });
    } catch (err) {
      console.log(err);
    }
  }
  next();
}

export {verifyToken, guestMethod};