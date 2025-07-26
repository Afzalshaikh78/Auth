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

//change password

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    //extract old and new password
    const { oldPassword, newPassword } = req.body;

    //find the current loggin user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
      //check if the old password matches
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "old password is incorrect",
      });
    }



    //check if the old password and new password are same
    if (oldPassword === newPassword) {      
      return res.status(400).json({
        success: false,
        message: "new password and old password cannot be same",
      });
    }

    //hash the new password

    const salt = await bcrypt.genSalt(10);
    const newhashedPassword = await bcrypt.hash(newPassword, salt);

    //update the password

     user.password = newhashedPassword;

     await user.save();

     res.status(200).json({
       success: true,
       message: "password changed successfully",
       user,
     });
    
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  loginUser,
  registerUser,
  changePassword,
};
