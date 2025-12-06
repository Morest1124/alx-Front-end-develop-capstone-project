import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, Film, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadFile } from '../api';

const FileUpload = ({ category = 'other', onUploadComplete, multiple = false, allowedTypes = '*' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFiles = async (files) => {
        setError(null);
        setSuccess(null);
        setUploading(true);

        // Convert FileList to Array
        const fileArray = Array.from(files);

        if (!multiple && fileArray.length > 1) {
            setError("Only one file allowed");
            setUploading(false);
            return;
        }

        try {
            const uploadedFiles = [];
            for (const file of fileArray) {
                // Validate size (simple client-side check)
                if (file.size > 100 * 1024 * 1024) {
                    throw new Error(`File ${file.name} is too large (max 100MB)`);
                }

                const response = await uploadFile(file, category, '');
                uploadedFiles.push(response);
            }

            setSuccess("Upload successful!");
            if (onUploadComplete) onUploadComplete(uploadedFiles);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);

            // Clear input
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const getIcon = () => {
        if (category === 'image') return <Image className="w-10 h-10 text-gray-400" />;
        if (category === 'video') return <Film className="w-10 h-10 text-gray-400" />;
        return <Upload className="w-10 h-10 text-gray-400" />;
    };

    return (
        <div className="w-full">
            <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer
          ${isDragging ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}
          ${error ? 'border-red-300 bg-red-50' : ''}
          ${success ? 'border-green-300 bg-green-50' : ''}
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    multiple={multiple}
                    accept={allowedTypes}
                />

                {uploading ? (
                    <div className="flex flex-col items-center animate-pulse">
                        <Upload className="w-10 h-10 text-primary mb-2 animate-bounce" />
                        <p className="text-sm text-gray-500 font-medium">Uploading...</p>
                    </div>
                ) : success ? (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                        <p className="text-sm text-green-600 font-medium">Upload Complete!</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center text-center">
                        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                        <p className="text-xs text-red-400 mt-1">Click to try again</p>
                    </div>
                ) : (
                    <>
                        {getIcon()}
                        <p className="mt-2 text-sm text-gray-600 font-medium">
                            Click or drag file to upload
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Supports {category === 'other' ? 'all files' : category} (Videos, Images, Docs, Code)
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
