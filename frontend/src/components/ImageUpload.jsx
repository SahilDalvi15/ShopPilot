import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 5, 
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  label = 'Product Images'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Accepted: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`);
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    return true;
  };

  const handleFiles = (files) => {
    setError('');
    const validFiles = [];
    const newImages = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check max images limit
      if (newImages.length + validFiles.length >= maxImages) {
        setError(`Maximum ${maxImages} images allowed`);
        break;
      }

      if (validateFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            file,
            preview: e.target.result,
            id: Date.now() + Math.random(),
          });
          
          if (newImages.length === images.length + validFiles.length + 1) {
            onImagesChange(newImages);
          }
        };
        reader.readAsDataURL(file);
        validFiles.push(file);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    setError('');
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-gray-400">({images.length}/{maxImages})</span>
      </label>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={`p-4 rounded-full ${
              dragActive ? 'bg-purple-100' : 'bg-gray-100'
            }`}
          >
            <Upload className={`w-8 h-8 ${dragActive ? 'text-purple-600' : 'text-gray-400'}`} />
          </div>
          
          <div>
            <p className="text-gray-900 font-medium">
              {dragActive ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-gray-500 text-sm mt-1">or</p>
            <button
              type="button"
              onClick={onButtonClick}
              className="mt-2 text-purple-600 font-medium hover:text-purple-700 transition"
            >
              browse files
            </button>
          </div>

          <p className="text-xs text-gray-400">
            Max {maxImages} images • Max {maxSizeMB}MB each • {acceptedTypes.map(t => t.split('/')[1]).join(', ')}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={image.preview || image}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              >
                <X className="w-4 h-4 text-gray-600 hover:text-red-600" />
              </button>

              {/* Primary Badge (for first image) */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !error && (
        <div className="flex items-center justify-center gap-3 text-gray-400 p-8 bg-gray-50 rounded-xl">
          <ImageIcon className="w-8 h-8" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
