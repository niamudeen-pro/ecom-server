const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const TOKEN_DETAILS = require("../config/index");

// *=================================================
//* user registration logic
// *================================================

const register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    } else {
      const { username, email, phone, password, isAdmin } = req.body;

      const userExist = await User.findOne({ email });

      if (userExist) {
        return res.status(400).send({ code: "EMAIL_ALREADY_EXIST" });
      }

      const userCreated = await User.create({
        username,
        email,
        phone,
        password,
        isAdmin,
      });

      res.status(201).send({
        success: true,
        data: userCreated,
        code: "SUCCESS",
      });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).send({ msg: error, code: "ERROR" });
  }
};

// *=================================================
//* user login logic
// *================================================

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    } else {
      const { email, password } = req.body;

      const userExist = await User.findOne({ email });
      if (!userExist) {
        return res.status(400).send({
          code: "INVALID_CREDENTIALS",
        });
      }

      const isPasswordMatch = await bcrypt.compare(
        password,
        userExist.password
      );

      const payload = {
        userId: userExist._id.toString(),
      };

      // json web token
      const token = jwt.sign(payload, TOKEN_DETAILS.JWT_SECRET_KEY, {
        expiresIn: TOKEN_DETAILS.ACCESS_TOKEN_EXPIRATION_TIME,
      });

      if (isPasswordMatch) {
        res.status(200).send({
          access_token: token,
          userId: userExist._id.toString(),
          code: "SUCCESS",
        });
      } else {
        return res.status(401).send({
          code: "INVALID_CREDENTIALS",
        });
      }
    }
  } catch (error) {
    res.status(500).send({ msg: error, code: "ERROR" });
  }
};

// *=================================================
//* USER BY ID logic
// *================================================

const user = async (req, res) => {
  try {
    const { userId } = req.user;

    const userResponse = await User.findById({ _id: userId }).lean();

    if (!userResponse) {
      return res.status(400).send({
        code: "NOT_FOUND",
      });
    } else {
      const user = {
        ...userResponse,
      };
      delete user.password;

      res.status(200).send({
        user,
        code: "SUCCESS",
      });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).send({ msg: error, code: "ERROR" });
  }
};

// *=================================================
//* REFRESH_TOKEN
// *================================================

const refreshToken = async (req, res) => {
  const { userId } = req.params;

  const token = req?.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(200).send({
      success: false,
      message: "A token is required for authorization",
    });
  }

  try {
    const token = jwt.sign(
      {
        userId: userId,
      },
      TOKEN_DETAILS.JWT_SECRET_KEY,
      {
        expiresIn: TOKEN_DETAILS.ACCESS_TOKEN_EXPIRATION_TIME,
      }
    );

    return res.status(200).send({
      access_token: token,
      code: "SUCCESS",
    });
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).send({ message: "invalid token" });
  }
};
module.exports = { login, register, user, refreshToken };
