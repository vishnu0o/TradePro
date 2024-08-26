import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import registratedUser from "../database/registratedUser.js";
import generateToken from "../utils/generateToken.js";

// @desc    register
// @route   post /api/auth/registerOrLogin
// @access  user

export const registrationController = asyncHandler(async (req, res) => {
  try {
    let { email, password } = req.body;
    const isUserExist = await registratedUser.findOne({
      email: email,
    });
    if (isUserExist) {
      bcrypt
        .compare(password, isUserExist.password)
        .then((isMatch) => {
          if (isMatch) {  
            let token = generateToken(isUserExist._id);
            res.status(201).json({
              token,
              name: isUserExist.email,
              UserId: isUserExist._id,
              message: "Login successfully",
            });
          } else {
            res.status(400).json("Password is incorrect");
          }
        })
        .catch((err) => {
          res.status(500).send("Error occurred while comparing passwords");
        });
    } else {
      password = await bcrypt.hash(password, 10);
      const createUserAuthentication = await registratedUser.create({
        email: email,
        password: password,
      });

      let token = generateToken(email);

      res.status(200).json({
        message: "Registrated successfully",
        data: { token: token, email: email },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});
