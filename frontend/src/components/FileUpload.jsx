import React, { useState, useRef } from "react";
import { Upload, File, Trash2, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { uploadDocument, deleteFile, clearAll } from "../utils/api";

export default function FileUpload({ files, onFilesChange }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const fileRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0]; 
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setMessage(null);

    try {
      const result = await uploadDocument(file, setProgress);
      setMessage({ type: "success", text: result.message });
      onFilesChange();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "Upload failed",
      });
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  const handleDelete = async (filename) => {
    try {
      await deleteFile(filename);
      setMessage({ type: "success", text: `Deleted ${filename}` });
      onFilesChange();
    } catch {
      setMessage({ type: "error", text: "Delete failed" });
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Clear all documents?")) return;
    await clearAll();
    setMessage({ type: "success", text: "All documents cleared" });
    onFilesChange();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Upload size={20} className="text-blue-500" />
        Upload Documents
      </h2>

      {/* Upload Button */}
      <label className="block w-full cursor-pointer">
        <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
          {uploading ? (
            <div className="space-y-2">
              <Loader size={28} className="mx-auto text-blue-500 animate-spin" />
              <p className="text-sm text-blue-600">Uploading... {progress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Upload size={28} className="mx-auto text-blue-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">   
                Click to upload PDF or TXT
              </p>
              <p className="text-xs text-gray-400 mt-1">Max 50MB</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>

      {/* Status Message */}
      {message && (
        <div
          className={`mt-3 p-3 rounded-lg flex items-center gap-2 text-sm ${ 
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {message.text}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Indexed Files ({files.length})
            </p>
            <button
              onClick={handleClearAll}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Clear All
            </button>
          </div>
          {files.map((file) => (
            <div
              key={file}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <File size={14} className="text-blue-400 shrink-0" />
                <span className="text-sm text-gray-700 truncate">{file}</span>
              </div>
              <button
                onClick={() => handleDelete(file)}
                className="text-gray-300 hover:text-red-500 ml-2 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
