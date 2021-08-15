const config = require("../config/config.json");
import mongoose from "mongoose";
import User from "../models/user.model";
import Staff from "../models/staff.model";
import Clock from "../models/clock.model";

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(
  process.env.MONGODB_URI || config.connectionString,
  connectionOptions
);

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export const db = {
  User: User,
  Staff: Staff,
  Clock: Clock,
  isValidId,
};
