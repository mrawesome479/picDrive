const Folder = require("../models/Folder");
const Image = require("../models/Image")
const cloudinary = require("../Utils/cloudinary")



const createFolder = async (req, res) => {
  const { name, parentId } = req.body;
  try {
    const folder = new Folder({
      name,
      parentId: parentId || null,
      ownerId: req.user.id,
    });
    await folder.save();
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ error: "Internal server error"});
  }
};

const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ ownerId: req.user.id });
    res.status(200).json(folders);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteFolders = async (req, res) => {
  const folderId = req.params.folderId;

  try {
    const getAllChildIds = (folders, id) => {
      let ids = [id];
      folders
        .filter((f) => f.parentId && f.parentId.toString() === id.toString())
        .forEach((child) => {
          ids = ids.concat(getAllChildIds(folders, child._id));
        });
      return ids;
    };

    const allFolders = await Folder.find({ ownerId: req.user.id });
    const idsToDelete = getAllChildIds(allFolders, folderId);

    await Folder.deleteMany({ _id: { $in: idsToDelete } });
    await Image.deleteMany({ folderId: { $in: idsToDelete } });
    res
      .status(200)
      .json({
        deletedIds: idsToDelete,
        message: "Folder and its children deleted",
      });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCloudinarySignature = (req, res) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: "images-db" },
      process.env.CLOUDINARY_API_SECRET
    );
    return res.json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: "images-db",
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate signature" });
  }
};

module.exports = {
  createFolder,
  getFolders,
  deleteFolders,
  getCloudinarySignature
};
