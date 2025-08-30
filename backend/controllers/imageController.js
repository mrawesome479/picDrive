// controllers/imageController.js
const Image = require("../models/Image.js")
const Folder = require("../models/Folder.js")

const getImagesInFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const images = await Image.find({ folderId, owner: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addImageToFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { url, name, size, type } = req.body;
    // check folder belongs to user
    const folder = await Folder.findOne({ _id: folderId, ownerId: req.user.id });
    if (!folder) return res.status(404).json({ error: "Folder not found" });

    const newImage = await Image.create({
      name,
      url,
      size,
      type,
      folderId,
      owner: req.user.id,
    });

    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await Image.findOneAndDelete({
      _id: imageId,
      owner: req.user.id,
    });
    if (!image) return res.status(404).json({ error: "Image not found" });
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};


const searchImages = async (req, res) => {
  const { query } = req.query;
  try {
    const images = await Image.find({
      owner: req.user.id,
      name: { $regex: query, $options: "i" } // case-insensitive match
    });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
    getImagesInFolder,
    addImageToFolder,
    deleteImage,
    searchImages
}
