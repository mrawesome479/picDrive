import React, { useContext, useRef, useState, useEffect } from "react";
import { useFolder } from "../context/FolderContext";
import { useSearch } from "../context/SearchContext";
import FolderIcon from "../assets/folderClosed.png";
import ImageIcon from "../assets/imageFileIcon.png";
import deleteIcon from "../assets/icons8-delete-50.png";
import uploadIcon from "../assets/uploadIcon.png";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import HomeIcon from "../assets/homeIcon.png";
import ArrowLeft from "../assets/arrowRight.png";

const MainUI = () => {
  const { folders, selectedFolderId, selectFolder, handleImageUpload } =
    useFolder();
  const { query, results } = useSearch();
  const { user } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [modalImage, setModalImage] = useState(null);

  // Current folder
  const currentFolder =
    selectedFolderId && selectedFolderId !== "home"
      ? folders.find((f) => f._id === selectedFolderId)
      : null;

  // Child folders
  const childFolders = folders.filter(
    (f) => f.parentId === (currentFolder?._id || null)
  );

  // Breadcrumb
  const buildBreadcrumb = () => {
    const path = [];
    let folder = currentFolder;
    while (folder) {
      path.unshift(folder);
      folder = folders.find((f) => f._id === folder.parentId) || null;
    }
    return [{ name: "Home", _id: "home" }, ...path];
  };
  const breadcrumb = buildBreadcrumb();

  // Fetch images for selected folder
  useEffect(() => {
    const fetchImages = async () => {
      if (!selectedFolderId || selectedFolderId === "home") {
        setImages([]);
        return;
      }
      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await axios.get(
          `${backendUrl}/api/images/${selectedFolderId}/images`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setImages(res.data);
      } catch (error) {
        if (error.response && error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Somthing went wrong");
        }
      }
    };
    fetchImages();
  }, [selectedFolderId, user.token]);

  // Delete image
  const deleteImage = async (imageId, folderId = selectedFolderId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL;
      await axios.delete(
        `${backendUrl}/api/images/${folderId}/images/${imageId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setImages((prev) => prev.filter((img) => img._id !== imageId));
      toast.success("Image deleted successfully!");
    } catch {
      if (error.response && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Somthing went wrong");
      }
    }
  };

  // Upload handler
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedFolderId || selectedFolderId === "home") return;
    try {
      const imageUrl = await handleImageUpload(file);
      const backendUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.post(
        `${backendUrl}/api/images/${selectedFolderId}/images`,
        { url: imageUrl, name: file.name },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (res.status === 201) {
        setImages((prev) => [...prev, res.data]);
        toast.success("Image uploaded successfully!");
      }
    } catch (err) {
      toast.error("Something went wrong while uploading image.");
    }
  };

  return (
    <div className="flex-1 h-full p-5 flex flex-col">
      {/* Breadcrumb + Upload */}
      <div
        className={`${
          query ? "hidden" : ""
        } mb-4 flex items-center justify-between text-sm text-gray-600`}
      >
        <div className="flex items-center">
          <img className="h-5 w-5 mr-2" src={HomeIcon} alt="icon" />
          {breadcrumb.map((part, idx) => (
            <span key={part._id} className="flex items-center">
              <span
                className={`cursor-pointer hover:underline ${
                  idx === breadcrumb.length - 1
                    ? "font-semibold text-black"
                    : ""
                }`}
                onClick={() => selectFolder(part._id)}
              >
                {part.name}
              </span>
              {idx < breadcrumb.length - 1 && (
                <span className="mx-1">
                  <img className="h-4 w-4" src={ArrowLeft} alt="arrowLeft" />
                </span>
              )}
            </span>
          ))}
        </div>

        <div className="pl-2">
          <button
            onClick={() => fileInputRef.current.click()}
            className={`${
              selectedFolderId === "home" ? "hidden" : ""
            } flex items-center gap-2 border-2 hover:scale-105 border-blue-700 border-dotted text-blue-600 font-semibold py-2 px-4 rounded-lg cursor-pointer transition-transform duration-300`}
          >
        
            <span className="w-5 h-5rounded-full flex items-center justify-center">
              <img src={uploadIcon} alt="upload" />
            </span>
            Upload Image
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Show search results if query exists */}
      {query && (
        <div className="mb-6">
          <p className="font-semibold mb-3 text-lg">
            Search Results for "<span className="text-blue-500">{query}</span>":
          </p>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((img) => {
                const fId = folders.find(
                  (folder) => folder._id === img.folderId
                );
                return (
                  <div
                    onDoubleClick={() => setModalImage(img)}
                    key={`${img._id}-${img.folderId}`} // unique per folder
                    className="relative flex flex-col items-center cursor-pointer p-3 rounded-lg shadow-sm 
                         hover:bg-gray-100 hover:scale-105 transform transition-all duration-300"
                  >
                    {/* Delete Button */}
                    <button
                      className="absolute top-1 right-1 text-red-500 rounded-full p-1 hover:bg-red-200 hover:scale-110 transition-transform duration-200"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering double click
                        deleteImage(img._id, img.folderId);
                      }}
                    >
                      <img className="h-4 w-4" src={deleteIcon} alt="delete" />
                    </button>

                    <img
                      src={ImageIcon}
                      alt={img.name}
                      className="h-16 w-16 mb-2 rounded-lg border border-gray-200 shadow-sm"
                    />

                    <span className="text-sm truncate w-full text-center font-medium">
                      {img.name}
                    </span>

                    <span className="text-xs text-gray-500 mt-1">
                      Folder: {fId?.name || "Unknown"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 italic mt-2">
              No images found for "
              <span className="text-blue-500">{query}</span>".
            </p>
          )}
        </div>
      )}

      {/* Regular folder & images grid */}
      {!query && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {childFolders.map((folder) => (
            <div
              key={folder._id}
              className="flex flex-col items-center cursor-pointer p-2 rounded-lg 
                   hover:bg-gray-100 hover:scale-105 transform transition-all duration-300"
              onDoubleClick={() => selectFolder(folder._id)}
            >
              <img src={FolderIcon} alt="Folder" className="h-12 w-12 mb-2" />
              <span className="text-sm text-center truncate">
                {folder.name}
              </span>
            </div>
          ))}
          {images.map((img) => (
            <div
              key={img._id}
              className="relative flex flex-col items-center cursor-pointer p-2 rounded-lg 
                   hover:bg-gray-100 hover:scale-105 transform transition-all duration-300"
              onDoubleClick={() => setModalImage(img)}
            >
              <button
                className="absolute top-1 right-1 text-red-500 rounded-full p-1 hover:bg-red-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering double click
                  deleteImage(img._id);
                }}
              >
                <img className="h-4 w-4" src={deleteIcon} alt="delete" />
              </button>
              <img
                src={ImageIcon}
                alt={img.name}
                className="h-12 w-12 mb-2 rounded-md shadow-sm"
              />
              <span className="text-sm truncate w-full text-center">
                {img.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full relative">
            {/* Image */}
            <img
              src={modalImage.url}
              alt={modalImage.name}
              className="w-full max-h-[80vh] object-contain"
            />

            {/* Buttons */}
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setModalImage(null)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!query && childFolders.length === 0 && images.length === 0 && (
        <div className="text-gray-500 text-center mt-10">
          This folder is empty.
        </div>
      )}
    </div>
  );
};

export default MainUI;
