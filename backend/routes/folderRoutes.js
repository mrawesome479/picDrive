const express = require("express");
const {
  getFolders,
  createFolder,
  deleteFolders,
  getCloudinarySignature,
} = require("../controllers/folderController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/image-upload-signature", authMiddleware, getCloudinarySignature);
router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware, getFolders);
router.delete("/:folderId", authMiddleware, deleteFolders);

module.exports = router;
