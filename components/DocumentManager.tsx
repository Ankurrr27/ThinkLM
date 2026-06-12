"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FileText, Trash2, Upload, Search, FileUp, Loader2, Info } from "lucide-react";
import { getDocuments, deleteDocument, uploadDocument } from "../services/document";

interface DocItem {
  id: string;
  filename: string;
  size?: number;
  mimetype?: string;
  uploadedAt?: string;
}

export default function DocumentManager({
  workspaceId,
  onDocumentsChange,
}: {
  workspaceId: string;
  onDocumentsChange?: () => void;
}) {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load documents
  const loadDocs = useCallback(async () => {
    if (!workspaceId) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const res = await getDocuments(workspaceId, token);
      setDocs(res.data || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  // Handle Drag & Drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("Only PDF files are supported.");
        return;
      }
      setSelectedFile(file);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("Only PDF files are supported.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile || !workspaceId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setUploading(true);
      await uploadDocument(selectedFile, workspaceId, token);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadDocs();
      onDocumentsChange?.();
      toast.success("Document uploaded and indexed successfully!");
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : undefined;

      if (status === 429) {
        toast.error("Gemini API quota exceeded. Get a valid API key at aistudio.google.com", { duration: 6000 });
      } else {
        toast.error(msg || "Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setDeletingId(docId);
      await deleteDocument(docId, token);
      await loadDocs();
      onDocumentsChange?.();
      toast.success("Document deleted.");
    } catch {
      toast.error("Delete failed. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatBytes = (bytes?: number, decimals = 1) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const filteredDocs = docs.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="doc-manager-container panel">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="panel-title">Sources & Documents</span>
          <span className="badge">{docs.length}</span>
        </div>
      </div>
      <div className="panel-body flex flex-col gap-4">
        {/* Drag & Drop Upload Zone */}
        <div 
          className={`dropzone ${dragActive ? "active" : ""} ${selectedFile ? "has-file" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={!selectedFile && !uploading ? triggerFileInput : undefined}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf,.pdf" 
            className="hidden-file-input"
          />
          
          {selectedFile ? (
            <div className="selected-file-details">
              <FileText className="file-preview-icon" />
              <div className="file-info-text">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-size">{formatBytes(selectedFile.size)}</p>
              </div>
              <div className="upload-actions">
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="secondary-button"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  className="primary-button"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin h-3.5 w-3.5" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      Upload Source
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="dropzone-prompt">
              <FileUp className="upload-prompt-icon" />
              <p className="upload-prompt-main">Drag & drop PDF here</p>
              <p className="upload-prompt-sub">or click to browse from files</p>
            </div>
          )}
        </div>

        {/* Search & Listing */}
        <div className="doc-search-wrapper">
          <Search className="search-icon" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..." 
            className="field"
          />
        </div>

        {/* Documents List */}
        <div className="doc-list-scrollable">
          {loading && docs.length === 0 ? (
            <div className="loading-state">
              <Loader2 className="animate-spin h-6 w-6 text-[var(--accent)]" />
              <p>Loading documents...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="empty-docs-state">
              <Info className="empty-docs-icon" />
              <p className="empty-docs-title">
                {searchQuery ? "No matching documents" : "No documents uploaded"}
              </p>
              <p className="empty-docs-desc">
                {searchQuery 
                  ? "Try adjusting your search query." 
                  : "Upload PDF documents to train the AI assistant for this workspace."}
              </p>
            </div>
          ) : (
            <div className="doc-list-items">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="doc-item-row">
                  <div className="doc-item-left">
                    <div className="doc-icon-wrapper">
                      <FileText className="doc-item-icon" />
                    </div>
                    <div className="doc-item-meta">
                      <p className="doc-item-name" title={doc.filename}>{doc.filename}</p>
                      <p className="doc-item-size">
                        {formatBytes(doc.size)}
                        {doc.uploadedAt && ` • ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    title="Delete document"
                    className="danger-icon-button"
                  >
                    {deletingId === doc.id ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
