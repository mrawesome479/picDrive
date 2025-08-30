const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectToDB = require("./config/db");
const authRoutes = require("./routes/auth");
const folderRoutes = require("./routes/folderRoutes");
const imageRoutes = require("./routes/imageRoutes");

dotenv.config();
connectToDB();

const app = express();

const PORT = process.env.PORT

const allowedOrigins = [
  "http://localhost:5173",         
  "https://pic-drive-kappa.vercel.app/" 
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/images", imageRoutes);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
