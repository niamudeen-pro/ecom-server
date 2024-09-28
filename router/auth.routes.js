const express = require("express");
const userRouter = express.Router();
const authControllers = require("../controller/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const {
  validateRegisterSchema,
  validateLoginSchema,
} = require("../middleware/validtion.middleware");

userRouter
  .route("/register")
  .post(validateRegisterSchema, authControllers.register);

userRouter.route("/user").get(verifyToken, authControllers.user);

userRouter.route("/login").post(validateLoginSchema, authControllers.login);

userRouter.route("/refresh-token/:userId").get(authControllers.refreshToken);

module.exports = userRouter;
