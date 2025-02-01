import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2,
  FileText,
  LayoutList
} from 'lucide-react';
import DeleteModal from './DeleteModal';
import classNames from 'classnames';

// Add cache constants with shorter duration for admin interface
const GALLERY_MANAGER_CACHE_KEY = 'gallery_manager_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface GalleryManagerProps {
  gallery: string[];
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveGalleryImage: (index: number) => Promise<void>;
}

const GalleryManager: React.FC<GalleryManagerProps> = ({
  gallery,
  handleImageUpload,
  handleRemoveGalleryImage
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [cachedGallery, setCachedGallery] = useState<string[]>([]);

  // Add caching logic
  useEffect(() => {
    const loadCachedData = () => {
      const cached = localStorage.getItem(GALLERY_MANAGER_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
        if (!isExpired) {
          setCachedGallery(data);
          return true;
        }
        localStorage.removeItem(GALLERY_MANAGER_CACHE_KEY);
      }
      return false;
    };

    // Try to load from cache first
    const hasCachedData = loadCachedData();

    // If we have new gallery data and no valid cache, update cache
    if (gallery && !hasCachedData) {
      const cacheData = {
        data: gallery,
        timestamp: Date.now()
      };
      localStorage.setItem(GALLERY_MANAGER_CACHE_KEY, JSON.stringify(cacheData));
      setCachedGallery(gallery);
    }
  }, [gallery]);

  // Update cache when gallery changes (after upload or delete)
  useEffect(() => {
    if (gallery) {
      const cacheData = {
        data: gallery,
        timestamp: Date.now()
      };
      localStorage.setItem(GALLERY_MANAGER_CACHE_KEY, JSON.stringify(cacheData));
      setCachedGallery(gallery);
    }
  }, [gallery]);

  const openDeleteModal = (index: number) => {
    setImageToDelete(index);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setImageToDelete(null);
  };

  const confirmDelete = async (): Promise<void> => {
    if (imageToDelete !== null) {
      await handleRemoveGalleryImage(imageToDelete);
      // Cache will be updated automatically when gallery prop changes
    }
    closeDeleteModal();
  };

  // Use cached gallery with fallback to prop
  const displayGallery = cachedGallery.length > 0 ? cachedGallery : gallery;

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galeri</h1>
          <p className="text-gray-600 mt-1">Kelola galeri foto FLASH</p>
        </div>
        
        {/* Stats Card */}
        <div className="bg-indigo-50 px-4 py-2 rounded-lg flex items-center gap-3">
          <div className="p-1.5 bg-indigo-100 rounded-md">
            <LayoutList className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-indigo-600 font-medium">Total Foto</p>
            <p className="text-lg font-semibold text-indigo-700 leading-none">
              {displayGallery?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upload Button */}
        <label
          htmlFor="gallery-upload"
          className="group bg-white rounded-xl border border-dashed border-gray-200 hover:border-indigo-500 transition-all duration-300 h-[280px] flex flex-col items-center justify-center gap-4 hover:bg-indigo-50/50 cursor-pointer"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="gallery-upload"
            multiple
          />
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <Upload className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="text-gray-900 font-medium">Tambah Foto</p>
            <p className="text-sm text-gray-500 mt-1">Klik untuk mengunggah foto</p>
          </div>
        </label>

        {/* Gallery Cards */}
        {displayGallery?.map((image, index) => (
          <div 
            key={index}
            className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Image Preview */}
            <div className="relative h-48">
              <img 
                src={image} 
                alt={`Galeri ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              {/* Quick Actions Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-end p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => openDeleteModal(index)}
                    className="p-2 bg-white/90 hover:bg-white text-red-500 rounded-lg backdrop-blur-sm transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {(!displayGallery || displayGallery.length === 0) && (
          <div className="col-span-2 lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum ada foto
              </h3>
              <p className="text-gray-500">
                Mulai dengan mengunggah foto untuk galeri FLASH
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName="foto ini"
      />
    </div>
  );
};

export default GalleryManager;