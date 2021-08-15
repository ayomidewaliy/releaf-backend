import { json } from "body-parser";
import express from "express";
import { verifyToken } from "./utils/validate-token";

const user = require("./routes/user.route");
const staff = require("./routes/staff.route");
const clock = require("./routes/clock.route");
const cors = require("cors");

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const app = express();
app.use(json());
app.use(cors(corsOptions));

app.use("/user", user);
app.use("/staffs", verifyToken, staff);
app.use("/clock", clock);

// PORT
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server Started at PORT ${PORT}`);
});
