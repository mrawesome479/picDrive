import React, { useEffect, useState } from "react";
import createFolderIcon from "../assets/createFolderIcon.png";
import FolderIcon from "../assets/folderClosed.png";
import homeIcon from "../assets/homeIcon.png";
import { useFolder } from "../context/FolderContext";
import deleteFolderIcon from "../assets/icons8-delete-50.png";

const Sidebar = () => {
  const [currentFolder, setCurrentFolder] = useState("home");
  const {
    folders,
    createFolder,
    deleteFolder,
    selectedFolderId,
    selectFolder,
  } = useFolder();

  // only folders directly under Home (parentId === null)
  const topLevelFolders = folders.filter((f) => !f.parentId);

  const handleCreateFolder = async (e) => {
    const name = prompt("Enter folder name:");

    if (!name) return;

    if (selectedFolderId === "home") {
      // create under Home (top-level)
      await createFolder(name, null);
    } else {
      // create nested under the selected folder
      await createFolder(name, selectedFolderId);
    }
  };

  const folderToDelete = async (e) => {
    if (selectedFolderId === "home") return; // never delete virtual Home

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this folder?"
    );
    if (!confirmDelete) return;

    try {
      await deleteFolder(selectedFolderId);
      selectFolder("home"); // reset selection after deletion
    } catch (error) {
      if (error.response && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Somthing went wronggg");
      }
    }
  };

  return (
    <div className="bg-[#FAFAFA] w-72 border-r border-gray-300 p-5">
      <div className="flex flex-col w-full h-full">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <p className="font-bold">Folders</p>

          <div className="flex gap-2">
            {/* Create Folder */}
            <div
              onClick={handleCreateFolder}
              className="flex items-center justify-center h-10 w-10 rounded-md hover:bg-blue-200 cursor-pointer transition-colors duration-200"
            >
              <img
                className="h-6 w-6"
                src={createFolderIcon}
                alt="Create Folder"
              />
            </div>

            {/* Delete Folder */}
            <div
              onClick={() =>
                selectedFolderId !== "home" && folderToDelete(currentFolder)
              }
              className={`flex items-center justify-center h-10 w-10 rounded-md 
        ${
          selectedFolderId === "home"
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-red-200 cursor-pointer"
        } 
        transition-colors duration-200`}
            >
              <img
                className="h-8 w-8"
                src={deleteFolderIcon}
                alt="Delete Folder"
              />
            </div>
          </div>
        </div>

        {/* Folder list */}
        <div className="bg-[FAFAFA] w-full flex-1 pt-5">
          <div className="w-full h-full flex flex-col">
            {/* Virtual Home folder */}
            <div
              className={`flex items-center cursor-pointer p-2 rounded-md mb-2 ${
                selectedFolderId === "home" ? "bg-blue-100" : ""
              }`}
              onClick={() => {
                selectFolder("home");
              }}
            >
              <img src={homeIcon} className="h-5 w-5 mr-2" alt="Home" />
              <span className="font-semibold">Home</span>
            </div>

            {/* Actual top-level folders */}
            <div className="ml-5 flex flex-col">
              {topLevelFolders.map((folder) => (
                <div
                  key={folder._id}
                  className={`flex items-center cursor-pointer p-2 rounded-md mb-1 ${
                    selectedFolderId === folder._id ? "bg-blue-100" : ""
                  }`}
                  onClick={() => selectFolder(folder._id)}
                >
                  <img
                    src={FolderIcon}
                    className="h-5 w-5 mr-2"
                    alt={folder.name}
                  />
                  <span>{folder.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
