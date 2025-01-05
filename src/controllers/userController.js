import { compare } from "bcrypt";
import { encrypt } from "../utils/bcrypt.js";
import prisma from "../utils/client.js";
import { logger } from "../utils/winston.js";
import { userUpdateValidation, userValidation } from "../validations/user.validation.js";
import {
  generateAccessToken,
  generateRefreshToken,
  parseJwt,
  verifyRefreshToken,
} from "../utils/jwt.js";

export const createUser = async (req, res) => {
  const { error, value } = userValidation(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  try {
    const result = await prisma.user.create({
      data: {
        name: value.name,
        userName: value.userName,
        password: encrypt(value.password),
        role: value.role,
      },
    });
    result.password = "xxxxxxxxxxxxxxxxxx";
    return res.status(200).json({
      message: "User created successfully",
      result,
    });
  } catch (error) {
    logger.error("controllers/userController.js:createUser - " + error.message);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const updateUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      result: null,
    });
  }
  const { error, value } = userUpdateValidation(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  let pass = user.password;
  if (value.password && value.password.length > 0) {
    pass = encrypt(value.password);
  }
  try {
    const result = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: value.name,
        userName: value.userName,
        password: pass,
        role: value.role,
      },
    });
    result.password = "xxxxxxxxxxxxxxxxxx";
    return res.status(200).json({
      message: "User updated successfully",
      result,
    });
  } catch (error) {
    logger.error("controllers/userController.js:updateUser - " + error.message);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        userName: req.body.userName,
      },
    });

    if (!result) {
      return res.status(401).json({
        message: "User not found",
        result: null,
      });
    }

    const isPasswordValid = await compare(req.body.password, result.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Password not match",
        result: null,
      });
    }

    result.password = "xxxxxxxxxxxxxxxxxx";
    const accessToken = generateAccessToken(result);
    const refreshToken = generateRefreshToken(result);

    return res.status(200).json({
      message: "Login success",
      result,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("controllers/userController.js:loginUser - " + error.message);
    return res.status(500).json({
      message: "Internal server error",
      result: null,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    result.password = "xxxxxxxxxxxxxxxxxx";
    return res.status(200).json({
      message: "User deleted succesfully",
      result,
    });
  } catch (error) {
    logger.error("controllers/userController.js:deleteUser - " + error.message);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const result = await prisma.user.findMany({});
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error("controllers/userController.js:getAllUser - " + error.message);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    result.password = "xxxxxxxxxxxxxxxxxx";
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error("controllers/userController.js:getUserById - " + error.message);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const setRefreshToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Verify token failed",
        result: null,
      });
    }
    const verify = verifyRefreshToken(token);
    if (!verify) {
      return res.status(401).json({
        message: "Verify token failed",
        result: null,
      });
    }
    let data = await parseJwt(token);
    const user = await prisma.user.findUnique({
      where: {
        userName: data.userName,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        result: null,
      });
    } else {
      user.password = "xxxxxxxxxxxxxxxxxx";
      const acessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      return res.status(200).json({
        message: "Refresh success",
        result: user,
        acessToken,
        refreshToken,
      });
    }
  } catch (error) {
    logger.error("controllers/userController.js:setRefreshToken - " + error.message);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const result = await prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken,
      },
    });

    if (result.count === 0) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
