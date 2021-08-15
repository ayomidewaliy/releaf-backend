import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
// middleware to validate token
const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "You are not logged in." });
  } else {
    try {
      const verified = jwt.verify(token, "some-secret-shit-goes-here");
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).json({ error: "Token is not valid" });
    }
  }
};

export { verifyToken };
