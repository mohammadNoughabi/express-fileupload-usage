const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const FileSystem = require("./utils/FileSystem");

const app = express();

const fileSystem = new FileSystem({
  uploadDir: "./uploads",
  maxFileSize: 10 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
});

fileSystem.init(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/upload-single-file", async (req, res) => {
  try {
    const result = await fileSystem.uploadSingle(
      req.files?.singleFile,
      "single"
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post("/upload-multiple-files", async (req, res) => {
  try {
    const result = await fileSystem.uploadMultiple(
      req.files?.multipleFiles,
      "multiple"
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

const connectDb = () => {
  mongoose
    .connect("mongodb://localhost:27017/express-fileupload")
    .then(() => {
      console.log("MongoDb connected successfully");
    })
    .catch((error) => {
      console.log("MongoDb connection failed", error);
    });
};

app.listen(3000, () => {
  connectDb();
  console.log("Listening on port 3000");
});
