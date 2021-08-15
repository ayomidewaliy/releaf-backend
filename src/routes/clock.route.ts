import express, { NextFunction, Request, Response } from "express";
import { check, CustomValidator, validationResult } from "express-validator";
import Clock from "../models/clock.model";
import Staff from "../models/staff.model";

const router = express.Router();

const start = new Date();
start.setHours(0, 0, 0, 0);

const end = new Date();
end.setHours(23, 59, 59, 999);

const checkIfClockedIn = async (params: any) => {
  const res = await Clock.findOne({
    createdAt: { $gte: start, $lt: end },
    _staffId: params,
  });

  if (res) {
    throw "You have clocked in today";
  }
};

/**
 * @method - POST
 * @param - /clockin
 * @description - Staff Clock In
 */
router.post(
  "/clockin",
  [check("staffID", "Please enter staff ID").notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const staffID = req.body.staffID;

      const staff = await Staff.findOne({ staffID });

      if (staff) {
        await checkIfClockedIn(staff._id);
        const clock = new Clock({ _staffId: staff._id });

        await clock.save();

        return res
          .json({
            data: null,
            message: "Staff clocked in successfully",
            success: true,
          })
          .status(204);
      }

      return res
        .json({
          data: null,
          message: "Staff with ID not found",
          success: false,
        })
        .status(404);
    } catch (error) {
      res.status(400).send({ error });
    }
  }
);

/**
 * @method - PATCH
 * @param - /clockout
 * @description - Staff Clock Out
 */

router.post(
  "/clockout",
  [check("staffID", "Please enter staff ID").notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const staffID = req.body.staffID;

      const staff = await Staff.findOne({ staffID });

      if (staff) {
        const clock = await Clock.findOne({
          createdAt: { $gte: start, $lt: end },
          _staffId: staff._id,
        });

        console.log("====================================");
        console.log(clock);
        console.log("====================================");

        if (clock) {
          await Clock.findByIdAndUpdate(clock._id, {
            clockOutTime: Date.now(),
          });

          return res
            .json({
              data: null,
              message: "Staff clocked out successfully",
              success: true,
            })
            .status(204);
        }
        return res
          .json({
            data: null,
            message: "You have not clocked in today. Please clock in first!",
            success: false,
          })
          .status(200);
      }

      return res
        .json({
          data: null,
          message: "Staff with ID not found",
          success: false,
        })
        .status(404);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error in Updating");
    }
  }
);

module.exports = router;
