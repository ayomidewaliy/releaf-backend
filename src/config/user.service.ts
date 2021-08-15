const config = require("../config/config.json");
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "./db";

interface Authenticate {
  email: string;
  password: string;
}

export function generateJwtToken(user: any) {
  return jwt.sign({ sub: user.id, id: user.id }, config.secret, {
    expiresIn: "15m",
  });
}

export function basicDetails(user: any) {
  const { id, fullname, email } = user;
  return { id, fullname, email };
}

export async function authenticate({ email, password }: Authenticate) {
  const user = await db.User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw "Username or password is incorrect";
  }

  const token = generateJwtToken(user);

  return {
    ...basicDetails(user),
    token,
  };
}

export async function getById(id: string) {
  const user = await getUser(id);
  return basicDetails(user);
}

// helper functions

export async function getUser(id: string) {
  if (!db.isValidId(id)) throw "User not found";
  const user = await db.User.findById(id);
  if (!user) throw "User not found";
  return user;
}
