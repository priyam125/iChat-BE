import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../validation/authValidation.js";
import prisma from "../config/db.config.js";
import vine, { errors } from "@vinejs/vine";
import jwt from "jsonwebtoken";

// Calculate the maximum age for a JWT token in milliseconds.
// This is set to 3 days, which is calculated as follows:
// 3 days * 24 hours/day * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second
const maxAge = 3 * 24 * 60 * 60 * 1000;

class AuthController {
  static async register(req, res) {
    try {
      const payload = req.body;

      const validator = vine.compile(registerSchema);
      const validatedPayload = await validator.validate(payload);

      const userExists = await prisma.user.findUnique({
        where: {
          email: validatedPayload.email,
        },
      });

      if (userExists) {
        return res
          .status(400)
          .send({ error: "User already exists", message: "User already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      validatedPayload.password = bcrypt.hashSync(
        validatedPayload.password,
        salt
      );

      const user = await prisma.user.create({
        data: validatedPayload,
      });

      const jwtPayload = {
        id: user.id,
        email: user.email,
      };

      const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: maxAge,
      });

      res.cookie("access_token", token, {
        maxAge: maxAge,
        secure: true,
        sameSite: "none",
      });

      return res.status(201).json({ message: "Account created successfully", user });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages[0].message);
        return res
          .status(400)
          .send({
            error: "Validation error",
            message: error.messages[0].message,
          });
      }
      return res
        .status(500)
        .send({
          error: "Internal server error",
          message:
            "Something went wrong, check internet connection and try again later.",
        });
    }
  }

  static async login(req, res) {
    // console.log(req.body);
    
    try {
      const payload = req.body;

      const validate = vine.compile(loginSchema);
      const validatedPayload = await validate.validate(payload);

      const { email, password } = validatedPayload;

      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res
          .status(404)
          .send({ error: "Authentication failed", message: "User not found" });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(401)
          .send({
            error: "Authentication failed",
            message: "Invalid password",
          });
      }

      const jwtPayload = {
        id: user.id,
        email: user.email,
      };

      const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: maxAge,
      });

      res.cookie("access_token", token, {
        maxAge: maxAge,
        secure: true,
        sameSite: "none",
      });

      return res.send({
        message: "Logged in successfully",
        user,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages[0].message);
        return res
          .status(400)
          .send({
            error: "Validation error",
            message: error.messages[0].message,
          });
      }
      console.log(error);
      return res
        .status(500)
        .send({
          error: "Internal server error",
          message:
            "Something went wrong, check internet connection and try again later.",
        });
    }
  }

  static async getUser(req, res) {
    try {
      // const user = await prisma.user.findFirst();
      // return res.send(user);

      //we get the user id from the request passed by the middleware
      console.log("req.user", req.user);
      const userId = req.user.id;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if(!user) {
        return res
          .status(404)
          .send({ error: "User not found", message: "User with given id not found" });
      }

      return res.status(200).json({
        message: "User found successfully",
        user,
      })
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({
          error: "Internal server error",
          message:
            "Something went wrong, check internet connection and try again later.",
        });
    }
  }
}

export default AuthController;
