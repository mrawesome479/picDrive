import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";
import { toast } from "react-toastify";

const FolderContext = createContext();

export const useFolder = () => useContext(FolderContext);

export const FolderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [folders, setFolders] = useState([]); 
  const [selectedFolderId, setSelectedFolderId] = useState("home"); // currently open folder in main UI

  // Fetch folders from backend
  const fetchFolders = async () => {
    if (!user?.token) return;
    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(`${backendUrl}/api/folders`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.status === 200) {
        setFolders(response.data);
      }
    } catch (error) {
      if (error.response && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Somthing went wrong");
      }
    }
  };

  // Create folder
  const createFolder = async (name, parentId = null) => {
    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        `${backendUrl}/api/folders`,
        { name, parentId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const newFolder = response.data;
      const updatedFolders = [...folders, newFolder];
      setFolders(updatedFolders);
    } catch (error) {
      if (error.response && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Somthing went wrong");
      }
    }
  };

  // Delete folder
  const deleteFolder = async (folderId) => {
    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.delete(
        `${backendUrl}/api/folders/${folderId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const deletedIds = response.data.deletedIds;
      const updatedFolders = folders.filter((f) => !deletedIds.includes(f._id));
      setFolders(updatedFolders);
    } catch (error) {
      if (error.response && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Somthing went wrong");
      }
    }
  };

  // Select folder
  const selectFolder = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleImageUpload = async (imageToUpload) => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    // Step 1: Get signature and other details from backend
    const sigRes = await axios.get(
      `${backendUrl}/api/folders/image-upload-signature`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const { apiKey, timestamp, signature, folder, cloudName } = sigRes.data;

    // Step 2: Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", imageToUpload);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      formData
    );

    const imageUrl = uploadRes.data.secure_url;

    // Step 3: Return the image URL to be saved in DB
    return imageUrl;
  };

  // Fetch folders on mount
  useEffect(() => {
    if (user && user.token) {
      fetchFolders();
    }
  }, [user]);

  return (
    <FolderContext.Provider
      value={{
        folders,
        selectedFolderId,
        fetchFolders,
        createFolder,
        deleteFolder,
        selectFolder,
        handleImageUpload,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
