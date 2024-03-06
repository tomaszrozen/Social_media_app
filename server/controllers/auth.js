const User = require("../models/userModel");

// LOGIN USER
exports.Login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // Username not found
      return res.status(401).json({ message: "Invalid user" });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      // Incorrect password
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();

    res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 }); // secure true to allow https only
    return res.status(201).json({ userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REGISTER USER
exports.Register = async (req, res) => {
  try {
    const userImg = req.file ? req.file.filename : "";
    const { firstName, lastName, email, password, dob, gender} = req.body;
    

    // Check if the user with the provided email address already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      dob,
      gender,
      userImg,
    });

    // Save the user to the database
    savedUser = await user.save();

    // Generate JWT token for the new user
    const token = user.generateAuthToken();

    res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });
    return res.status(201).json({ userId: savedUser._id });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(", ") });
    }
    res.status(500).json({ error: error.message });
  }
};
