import express, { NextFunction, Request, Response } from "express";
import { check, CustomValidator, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { authenticate } from "../config/user.service";
import User from "../models/user.model";

const router = express.Router();

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

const isValidEmail: CustomValidator = (value) => {
  return User.find({ email: value }).then((res: any) => {
    if (res.length > 0) {
      return Promise.reject("E-mail already in use");
    }
  });
};

router.post(
  "/signup",
  [
    check("email").custom(isValidEmail),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 8,
    }),
  ],

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { fullname, email, password } = req.body;
    try {
      const user = new User({
        fullname,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      return res
        .json({
          data: {},
          message: "User signed up successfully",
        })
        .status(201);
    } catch (err) {
      res.status(500).send("Error in Saving");
    }
  }
);

/**
 * @method - POST
 * @param - /login
 * @description - User Login
 */
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 8,
    }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const user = await User.findOne({ email: req.body.email });

    const { email, password } = req.body;
    authenticate({ email, password })
      .then(({ ...user }) => {
        res.json(user);
      })
      .catch((error) => {
        res.json({ error: error }).status(401);
      });
  }
);

module.exports = router;
