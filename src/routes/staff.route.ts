import express, { Request, Response } from "express";
import { check, CustomValidator, validationResult } from "express-validator";
import Staff from "../models/staff.model";

const router = express.Router();

/**
 * @method - POST
 * @param - /create
 * @description - Staff Creation
 */

const isValidEmail: CustomValidator = (value) => {
  return Staff.find({ email: value }).then((res: any) => {
    if (res.length > 0) {
      return Promise.reject("E-mail already in use");
    }
  });
};

const isValidStaffID: CustomValidator = (value) => {
  return Staff.find({ staffID: value }).then((res: any) => {
    if (res.length > 0) {
      return Promise.reject("Staff ID already in use");
    }
  });
};

router.post(
  "/create",
  [
    check("email").custom(isValidEmail),
    check("staffID").custom(isValidStaffID),
    check("email", "Please enter a valid email").isEmail(),
    check("fullname", "Please enter a name").notEmpty(),
    check("age", "Please enter age").notEmpty(),
    check("designation", "Please enter designation").notEmpty(),
    check("address", "Please enter address").notEmpty(),
    check("staffID", "Please enter staff ID").notEmpty(),
  ],

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { fullname, email, address, age, designation, staffID } = req.body;
    try {
      const staff = new Staff({
        fullname,
        email,
        address,
        designation,
        staffID,
        age,
      });

      await staff.save();

      return res
        .json({
          data: {},
          message: "Staff created successfully",
          success: true,
        })
        .status(201);
    } catch (err) {
      res.status(500).send("Error in Saving");
    }
  }
);

/**
 * @method - PATCH
 * @param - /update
 * @description - Staff Update
 */
router.patch(
  "/update/:id",
  [check("fullname", "Please enter a name").notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const id = req.params.id;

      const staff = await Staff.findOne({ id });

      if (staff) {
        await Staff.findByIdAndUpdate(id, {
          fullname: req.body.fullname,
        });
        return res
          .json({
            data: staff,
            message: "Staff updated successfully",
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
      res.status(500).send("Error in Updating");
    }
  }
);

/**
 * @method - GET
 * @param - /staffs
 * @description - Get All Staffs
 */

router.get("/staffs", async (res: Response) => {
  try {
    const staff = await Staff.find();
    return res
      .json({
        data: staff,
        message: "All staffs fetched successfully",
        success: true,
      })
      .status(200);
  } catch (error) {
    res.status(500).send("Error in Getting");
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const staff = await Staff.find();
    return res
      .json({
        data: staff,
        message: "All staffs fetched successfully",
        success: true,
      })
      .status(200);
  } catch (err) {
    res.status(500).send("Error in Saving");
  }
});

module.exports = router;
