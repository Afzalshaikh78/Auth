//register controller
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    //extract user information from req.body
    const { username, email, password, role } = req.body;
    //check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "user registered successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "unable to register user",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//--------------------------------------------------------------------------------------

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //check if user exists
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    //if password matches, return user object
    //bearer token will be added to response header

    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      role: user.role,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
