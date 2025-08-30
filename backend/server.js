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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/images", imageRoutes);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
