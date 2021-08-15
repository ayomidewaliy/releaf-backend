import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IStaff extends mongoose.Document {
  fullname: string;
  email: string;
  address: string;
  age: string;
  designation: string;
  staffID: string;
}

const staffSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    default: true,
  },
  staffID: {
    type: String,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Staff = mongoose.model<IStaff>("Staff", staffSchema);
export default Staff;
