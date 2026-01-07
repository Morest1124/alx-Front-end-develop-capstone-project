import React, { useState, useEffect, useRef } from 'react';
import { Upload, Clock, CheckCircle, FileText, AlertCircle, ShieldCheck } from 'lucide-react';


const ProjectSubmission = ({ deadline, escrowAmount, onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE_GB = 2;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_GB * 1024 * 1024 * 1024;

  // Timer logic for the submission deadline
  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(deadline).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("EXPIRED");
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
  };

  const validateAndAddFiles = (selectedFiles) => {
    const validFiles = selectedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`File ${file.name} exceeds the 2GB limit.`);
        return false;
      }
      return true;
    });
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    
    setUploadProgress(10);
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSubmitted(true);
          return 100;
        }
        return prev + 15;
      });
    }, 500);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-green-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600 w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Project Submitted!</h2>
        <p className="text-gray-600 mb-8">Your files have been successfully uploaded and the client has been notified.</p>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4 text-left">
          <ShieldCheck className="text-blue-600 w-6 h-6 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900">Escrow Security Notification</h4>
            <p className="text-sm text-blue-800 mt-1">
              As per our platform policy, the funds of <strong>${escrowAmount}</strong> will be automatically released to your account in <strong>5 days</strong> unless the client raises a dispute.
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Submit Your Work</h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">Please upload all final deliverables for your project.</p>
        </div>
        
        <div className="bg-black text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg ring-4 ring-gray-50">
          <div className="bg-gray-800 p-2 rounded-lg">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Time Remaining</p>
            <p className="text-xl font-mono font-bold tracking-tighter">{timeLeft}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); validateAndAddFiles(Array.from(e.dataTransfer.files)); }}
            onClick={() => fileInputRef.current.click()}
            className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}`}
          >
            <input 
              type="file" 
              multiple 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Upload className="text-gray-600 w-8 h-8 group-hover:text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Drag & drop files here</h3>
            <p className="text-gray-500 mt-2">or click to browse your computer</p>
            <div className="mt-6 flex gap-2">
               <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600">Max 2GB</span>
               <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600">ZIP, PDF, MP4</span>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                <h4 className="font-bold text-gray-700">Selected Files ({files.length})</h4>
              </div>
              <ul className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
                {files.map((file, idx) => (
                  <li key={idx} className="px-6 py-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="text-blue-500 w-5 h-5 flex-shrink-0" />
                      <span className="truncate font-medium text-gray-700">{file.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Submission Rules
            </h4>
            <ul className="space-y-4 text-blue-100 text-sm">
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Final work must be uploaded in high resolution or original source formats.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Once submitted, funds are locked in Escrow for a 5-day review period.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>If no dispute is filed, 100% of agreed funds will be disbursed automatically.</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex gap-3 items-start">
            <AlertCircle className="text-amber-600 w-5 h-5 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Ensure you have included all assets. You cannot edit this submission once the review period starts.
            </p>
          </div>

          <button 
            disabled={files.length === 0 || uploadProgress > 0}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-95 shadow-lg
              ${files.length === 0 || uploadProgress > 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200'}`}
          >
            {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmission;