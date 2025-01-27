const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

const { notifyUsers } = require("./controllers/Course");
const schedule = require("node-schedule");

dotenv.config();
const PORT = process.env.PORT || 4000;

// Connect Database
database.connect();

// Add Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://skillstep.vercel.app",
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/reach", contactUsRoute);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

// Schedule job to run daily at 12:01 AM
schedule.scheduleJob("1 0 * * *", notifyUsers);

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
