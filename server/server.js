const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes"); 
const aiRoutes = require("./routes/aiRoutes");
const postRoutes = require('./routes/postRoutes');
const verifyToken = require('./middleware/verifyToken');
const checkLoggedIn = require("./middleware/checkLoggedIn")
const { Register } = require("./controllers/auth");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "client"));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
//client index.ejs serve:
app.use(express.static(path.join(__dirname, "..", "client")));

// File storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "./uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },

  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });


//routes
app.use("/auth", authRoutes);
app.use('/ai', aiRoutes);
app.use("/users", userRoutes);
app.use('/posts', postRoutes);

app.post("/auth/register", upload.single("userImg"), Register);
app.get("/", checkLoggedIn, (req, res) => {
  res.render("index");
});
app.get("/home", verifyToken, (req, res) => {
  res.render("home");
});
// Render the user profile page for the authenticated user
app.get("/userProfile", verifyToken, (req, res) => {
  res.render("userProfile");
});
// Render the user profile page for a specific user
app.get("/userProfile/:userId", verifyToken, (req, res) => {
    res.render("userProfile");
});

// Connect to MongoDB and start the server
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Node API app is running on port 3000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
