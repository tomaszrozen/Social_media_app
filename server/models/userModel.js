const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [24, "Password must be less than 24 characters long"],
      validate: {
        validator: function (value) {
          // Require at least one uppercase letter, one lowercase letter, one special character and one number
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/;
          return regex.test(value);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
      },
    },
    firstName: {
      type: String,
      required: [true, "Please enter a name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter a last name"],
    },
    dob: {
      type: Date,
      required: [true, "Please provide your date of birth"],
    },
    gender: {
      type: String,
      required: [true, "Please choose a gender"],
    },
    userImg: {
      type: String,
      required: false,
      default: "",
    },
    userDescription: {
      type: String,
      required: false,
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    sentFriendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving to database
userSchema.pre("save", async function (next) {
  const user = this;
   // Check if the password is modified or if it's a new user
  if (user.isModified("password") || user.isNew) {
    try {
      // Generate a salt for password hashing
      const salt = await bcrypt.genSalt();
      // Hash the user's password using the generated salt
      const hash = await bcrypt.hash(user.password, salt);
      // Set the hashed password back to the user object
      user.password = hash;
      next();
    } catch (err) {
      return next(err);
    }
  } else {
     // If the password is not modified, proceed to the next middleware
    return next();
  }
});

// Compare password with hashed password in database
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate a JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};
// Static method to find a user by decoding a JWT token
userSchema.statics.findByToken = async function (token) {
  try {
    // Verify and decode the JWT token using the provided secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user in the database based on the decoded user ID from the token
    const user = await this.findOne({ _id: decoded._id });
    return user;
  } catch (err) {
    throw new Error(`Error verifying token: ${err.message}`);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
