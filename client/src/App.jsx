import { useState } from "react";
import axios from "axios";

const App = () => {
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSingleFileUpload = (e) => {
    setSingleFile(e.target.files[0]);
    setMessage({ text: "", type: "" }); // Clear previous messages when new file is selected
  };

  const handleMutipleFileUpload = (e) => {
    setMultipleFiles(e.target.files);
    setMessage({ text: "", type: "" }); // Clear previous messages when new files are selected
  };

  const postSingleFile = async (e) => {
    e.preventDefault();
    
    if (!singleFile) {
      setMessage({ text: "Please select a file first", type: "error" });
      return;
    }
    
    setLoading(true);
    setMessage({ text: "Uploading file...", type: "info" });

    const formData = new FormData();
    formData.append("singleFile", singleFile);

    try {
      let response = await axios.post(
        "http://localhost:3000/upload-single-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setMessage({ text: `Uploading: ${progress}%`, type: "info" });
          },
        }
      );
      setMessage({ text: "File uploaded successfully!", type: "success" });
      console.log(response.data);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || error.message || "Upload failed", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const postMultipleFiles = async (e) => {
    e.preventDefault();
    
    if (!multipleFiles || multipleFiles.length === 0) {
      setMessage({ text: "Please select files first", type: "error" });
      return;
    }
    
    setLoading(true);
    setMessage({ text: "Uploading files...", type: "info" });

    const formData = new FormData();
    for (let i = 0; i < multipleFiles.length; i++) {
      formData.append("multipleFiles", multipleFiles[i]);
    }

    try {
      let response = await axios.post(
        "http://localhost:3000/upload-multiple-files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setMessage({ text: `Uploading: ${progress}%`, type: "info" });
          },
        }
      );
      setMessage({ text: "Files uploaded successfully!", type: "success" });
      console.log(response.data);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || error.message || "Upload failed", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine message styling
  const getMessageClass = () => {
    switch (message.type) {
      case "error":
        return "bg-red-100 border-red-400 text-red-700";
      case "success":
        return "bg-green-100 border-green-400 text-green-700";
      case "info":
        return "bg-blue-100 border-blue-400 text-blue-700";
      default:
        return "bg-gray-100 border-gray-400 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
          File Upload
        </h1>

        {/* Message Display */}
        {message.text && (
          <div
            className={`mb-4 border-l-4 p-4 rounded ${getMessageClass()}`}
            role="alert"
          >
            <p>{message.text}</p>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
              <p className="text-gray-700">Uploading, please wait...</p>
            </div>
          </div>
        )}

        {/* Single File */}
        <div className="my-8">
          <div>
            <label
              className="block text-gray-600 font-medium mb-2"
              htmlFor="singleFile"
            >
              Single File
            </label>
            <input
              type="file"
              id="singleFile"
              name="singleFile"
              onChange={handleSingleFileUpload}
              disabled={loading}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            onClick={postSingleFile}
            disabled={loading || !singleFile}
            className="w-fit bg-blue-500 hover:bg-blue-600 text-white mt-4 p-4 cursor-pointer font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload Single File
          </button>
        </div>

        {/* Multiple Files */}
        <div className="my-8">
          <div>
            <label
              className="block text-gray-600 font-medium mb-2"
              htmlFor="multipleFiles"
            >
              Multiple Files
            </label>
            <input
              type="file"
              id="multipleFiles"
              name="multipleFiles"
              multiple
              onChange={handleMutipleFileUpload}
              disabled={loading}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            onClick={postMultipleFiles}
            disabled={loading || multipleFiles.length === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white mt-4 p-4 w-fit cursor-pointer font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload Multiple Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;