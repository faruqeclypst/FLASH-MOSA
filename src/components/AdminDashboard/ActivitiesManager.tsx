import React, { useState } from 'react';
import { Activity } from '../../types';
import { PlusCircle, X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface ActivitiesManagerProps {
  activities: Activity[];
  handleActivityChange: (index: number, field: keyof Activity, value: string) => void;
  handleAddActivity: () => void;
  handleRemoveActivity: (index: number) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, index: number) => Promise<void>;
}

const ActivitiesManager: React.FC<ActivitiesManagerProps> = ({
  activities,
  handleActivityChange,
  handleAddActivity,
  handleRemoveActivity,
  handleImageUpload
}) => {
  const [selectedActivity, setSelectedActivity] = useState<number | null>(
    activities.length > 0 ? 0 : null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);

  const openDeleteModal = (index: number) => {
    setActivityToDelete(index);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setActivityToDelete(null);
  };

  const confirmDelete = async () => {
    if (activityToDelete !== null) {
      handleRemoveActivity(activityToDelete);
      if (selectedActivity === activityToDelete) {
        setSelectedActivity(null);
      }
    }
    closeDeleteModal();
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 p-4">Aktivitas</h2>
        
        {/* Tombol Add New di atas */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => {
              handleAddActivity();
              setSelectedActivity(activities.length);
            }}
            className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            <PlusCircle size={20} className="mr-2" />
            Tambah Baru!
          </button>
        </div>

        <ul>
          {activities.map((activity, index) => (
            <li
              key={index}
              className={`p-4 cursor-pointer hover:bg-gray-200 transition-colors duration-300 ${
                selectedActivity === index ? 'bg-blue-100' : ''
              }`}
              onClick={() => setSelectedActivity(index)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {activity.name || `Aktivitas ${index + 1}`}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(index);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors duration-300"
                  aria-label="Hapus Aktivitas"
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-y-auto">
        {selectedActivity !== null && activities[selectedActivity] && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {activities[selectedActivity].name || `Aktivitas ${selectedActivity + 1}`}
                </h3>
              </div>

              {/* Activity Form Fields */}
              <div className="flex items-center space-x-4">
                <div className="flex-grow space-y-2">
                  <input
                    type="text"
                    value={activities[selectedActivity].name}
                    onChange={(e) => handleActivityChange(selectedActivity, 'name', e.target.value)}
                    placeholder="Nama Aktivitas"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                    required
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, selectedActivity)}
                      className="hidden"
                      id={`activity-image-${selectedActivity}`}
                    />
                    <label
                      htmlFor={`activity-image-${selectedActivity}`}
                      className="flex items-center justify-center w-full p-2 border border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                    >
                      {activities[selectedActivity].image ? (
                        <>
                          <ImageIcon size={20} className="mr-2" />
                          Ganti Gambar
                        </>
                      ) : (
                        <>
                          <Upload size={20} className="mr-2" />
                          Unggah Gambar
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <textarea
                value={activities[selectedActivity].description}
                onChange={(e) => handleActivityChange(selectedActivity, 'description', e.target.value)}
                placeholder="Deskripsi Aktivitas"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 h-32 resize-none"
              />

              {activities[selectedActivity].image && (
                <div className="mt-4 relative group">
                  <img src={activities[selectedActivity].image} alt={activities[selectedActivity].name} className="w-full h-48 object-cover rounded-md" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={() => handleActivityChange(selectedActivity, 'image', '')}
                      className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-colors duration-300"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={activityToDelete !== null ? activities[activityToDelete].name || `Aktivitas ${activityToDelete + 1}` : ''}
      />
    </div>
  );
};

export default ActivitiesManager;