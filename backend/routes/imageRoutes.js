// routes/imageRoutes.js
const express =  require("express");
const  authMiddleware  =  require("../middlewares/authMiddleware.js");
const {
  getImagesInFolder,
  addImageToFolder,
  deleteImage,
  searchImages
}  = require("../controllers/imageController.js");

const router = express.Router();


router.get("/search", authMiddleware, searchImages);

router.get("/:folderId/images", authMiddleware, getImagesInFolder);

router.post("/:folderId/images", authMiddleware, addImageToFolder);

router.delete("/:folderId/images/:imageId", authMiddleware, deleteImage);

module.exports = router
