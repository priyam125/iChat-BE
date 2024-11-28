import vine, { errors } from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { updateProfileSchema } from "../validation/profileValidation.js";
import {renameSync, unlink} from "fs";

class ProfileController {
  static async updateProfile(req, res) {
    try {
      // console.log("req.user", req.user);
      const userId = req.user.id;

      const payload = req.body;

      const validate = vine.compile(updateProfileSchema);
      const validatedPayload = await validate.validate(payload);

      const { firstName, lastName, color } = validatedPayload;

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          firstName,
          lastName,
          color,
          profileSetup: true,
        },
      });

      if (!user) {
        return res
          .status(404)
          .send({
            error: "User not found",
            message: "User with given id not found",
          });
      }

      return res.status(200).json({
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages[0].message);
        return res.status(400).send({
          error: "Validation error",
          message: error.messages[0].message,
        });
      }
      console.log(error);
      return res.status(500).send({
        error: "Internal server error",
        message:
          "Something went wrong, check internet connection and try again later.",
      });
    }
  }

  static async addProfileImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate MIME type
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/svg+xml", "image/webp"];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ 
          error: "Validation Error", 
          message: "Invalid file type. Only JPEG, PNG, and JPG, SVG, and WebP files are allowed." 
        });
      }

      // Validate file size (e.g., max 2MB)
      const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes
      if (req.file.size > maxFileSize) {
        return res.status(400).json({ 
          error: "Validation Error", 
          message: "File size exceeds 2MB limit." 
        });
      }

      // Validate file using Vine
      // const validate = vine.compile(addProfileImageSchema);
      // await validate.validate({ file: req.file });

      const date = Date.now();
      let fileName = "uploads/profile/" + date + req.file.originalname;
      renameSync(req.file.path, fileName); 

      const userId = req.user.id;
      const user = await prisma.user.update({
        where: {
          id: userId, 
        },
        data: {
          image: fileName,
        },
      });

      return res
        .status(200)
        .json({
          message: "Profile image updated successfully",
          image: user.image,
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  }
}

export default ProfileController;
