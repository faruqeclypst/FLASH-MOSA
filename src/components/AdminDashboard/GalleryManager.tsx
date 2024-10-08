import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

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
    }
    closeDeleteModal();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Galeri</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl p-6">
        <div className="mb-6">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="gallery-upload"
              multiple
            />
            <label
              htmlFor="gallery-upload"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
            >
              <Upload size={24} className="mr-2 text-gray-500" />
              <span className="text-gray-500 font-medium">Unggah Gambar</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((image, index) => (
            <div key={index} className="relative group aspect-w-1 aspect-h-1">
              <div className="w-full h-full overflow-hidden rounded-lg bg-gray-200">
                <img 
                  src={image} 
                  alt={`Galeri ${index + 1}`} 
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openDeleteModal(index)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                    aria-label="Hapus Gambar"
                    type="button"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {gallery.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-12">
              <ImageIcon size={48} className="mb-2" />
              <p>Belum ada gambar di galeri</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName="gambar ini"
      />
    </div>
  );
};

export default GalleryManager;