import mongoose from "mongoose";

export interface IClockedInOut extends mongoose.Document {
  _staffId: any;
  clockInTime: any;
  clockOutTime: any;
  clockInDate: any;
  createdAt: any;
}

const clockInOutSchema = new mongoose.Schema({
  _staffId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Staff",
  },
  clockInTime: { type: Date, default: Date.now, required: true },
  clockOutTime: { type: Date, default: null, required: false },
  clockInDate: { type: Date, default: new Date(), required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
});

const Clock = mongoose.model<IClockedInOut>(
  "EmployeeClockInOut",
  clockInOutSchema
);

export default Clock;
