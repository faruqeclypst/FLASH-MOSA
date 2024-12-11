import React, { useState, useEffect } from 'react';
import { Activity } from '../../types';
import { 
  PlusCircle, 
  Upload, 
  Image as ImageIcon, 
  Trash2,
  FileText,
  LayoutList,
  Users
} from 'lucide-react';
import DeleteModal from './DeleteModal';
import Modal from '../ui/Modal';
import { showAlert } from '../ui/Alert';
import classNames from 'classnames';

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
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempActivity, setTempActivity] = useState<Activity | null>(null);

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
      try {
        // Tutup modal terlebih dahulu
        setIsDeleteModalOpen(false);
        setShowDetailModal(false);
        
        // Reset selected activity jika yang dihapus sedang dipilih
        if (selectedActivity === activityToDelete) {
          setSelectedActivity(null);
        }
        
        // Panggil handler delete
        await handleRemoveActivity(activityToDelete);
        showAlert('success', 'Aktivitas berhasil dihapus');
        
        // Reset state
        setActivityToDelete(null);
      } catch (error) {
        console.error('Error deleting activity:', error);
        showAlert('error', 'Gagal menghapus aktivitas');
      }
    }
  };

  const handleTempChange = (field: keyof Activity, value: string) => {
    if (selectedActivity !== null && tempActivity) {
      setTempActivity({
        ...tempActivity,
        [field]: value
      });
    }
  };

  useEffect(() => {
    if (selectedActivity !== null && activities[selectedActivity]) {
      setTempActivity({...activities[selectedActivity]});
    }
  }, [selectedActivity, activities]);

  const handleSave = async () => {
    if (selectedActivity !== null && tempActivity) {
      if (!tempActivity.name?.trim()) {
        showAlert('error', 'Nama aktivitas tidak boleh kosong');
        return;
      }

      try {
        setIsSaving(true);
        
        // Simpan semua perubahan
        const fieldsToUpdate: (keyof Activity)[] = ['name', 'description'];
        
        for (const field of fieldsToUpdate) {
          if (tempActivity[field] !== activities[selectedActivity][field]) {
            await handleActivityChange(selectedActivity, field, tempActivity[field] || '');
          }
        }

        showAlert('success', 'Aktivitas berhasil diperbarui');
        setShowDetailModal(false);
      } catch (error) {
        console.error('Error saving activity:', error);
        showAlert('error', 'Gagal menyimpan perubahan');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Tambahkan cleanup effect
  React.useEffect(() => {
    return () => {
      // Cleanup ketika component unmount
      setSelectedActivity(null);
      setActivityToDelete(null);
      setIsDeleteModalOpen(false);
      setShowDetailModal(false);
    };
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aktivitas</h1>
          <p className="text-gray-600 mt-1">Kelola daftar aktivitas FLASH</p>
        </div>
        
        {/* Stats Card */}
        <div className="bg-indigo-50 px-4 py-2 rounded-lg flex items-center gap-3">
          <div className="p-1.5 bg-indigo-100 rounded-md">
            <LayoutList className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-indigo-600 font-medium">Total</p>
            <p className="text-lg font-semibold text-indigo-700 leading-none">
              {activities.length}
            </p>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Activity Cards */}
        {activities.map((activity, index) => (
          <div 
            key={index}
            className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Activity Image/Preview */}
            <div className="relative h-48">
              {activity.image ? (
                <img 
                  src={activity.image} 
                  alt={activity.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                </div>
              )}
              {/* Quick Actions Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-end p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedActivity(index);
                      setShowDetailModal(true);
                    }}
                    className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg backdrop-blur-sm transition-colors"
                    title="Edit"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
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

            {/* Activity Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {activity.name || `Aktivitas ${index + 1}`}
              </h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {activity.description || 'Belum ada deskripsi'}
              </p>
            </div>
          </div>
        ))}

        {/* Add Button Card */}
        <button
          onClick={handleAddActivity}
          className="group bg-white rounded-xl border border-dashed border-gray-200 hover:border-indigo-500 transition-all duration-300 h-[280px] flex flex-col items-center justify-center gap-4 hover:bg-indigo-50/50"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <PlusCircle className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="text-gray-900 font-medium">Tambah Aktivitas</p>
            <p className="text-sm text-gray-500 mt-1">Klik untuk menambah aktivitas baru</p>
          </div>
        </button>

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="col-span-full">
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum ada aktivitas
              </h3>
              <p className="text-gray-500">
                Mulai dengan menambahkan aktivitas baru untuk FLASH
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setTempActivity(null);
        }}
        size="xl"
      >
        {selectedActivity !== null && activities[selectedActivity] && (
          <div className="relative">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                Edit Aktivitas
              </h3>
            </div>

            {/* Content Modal */}
            <div className="p-6 space-y-6">
              {/* Form Fields */}
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Aktivitas
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, selectedActivity)}
                      className="hidden"
                      id={`activity-image-${selectedActivity}`}
                    />
                    {tempActivity?.image ? (
                      <div className="relative group rounded-xl overflow-hidden">
                        <img 
                          src={tempActivity.image} 
                          alt={tempActivity.name}
                          className="w-full h-[300px] object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <div className="flex gap-3">
                            <label
                              htmlFor={`activity-image-${selectedActivity}`}
                              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              Ubah Gambar
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor={`activity-image-${selectedActivity}`}
                        className="flex flex-col items-center justify-center w-full h-[300px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
                      >
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-indigo-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            Klik untuk mengunggah gambar
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG atau JPEG (maks. 10MB)
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Name & Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Aktivitas
                  </label>
                  <input
                    type="text"
                    value={tempActivity?.name || ''}
                    onChange={(e) => handleTempChange('name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Masukkan nama aktivitas"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={tempActivity?.description || ''}
                    onChange={(e) => handleTempChange('description', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Deskripsikan aktivitas ini"
                  />
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-4 py-2 ${
                  isSaving 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white rounded-lg transition-colors`}
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={
          activityToDelete !== null && activities[activityToDelete] 
            ? activities[activityToDelete].name || `Aktivitas ${activityToDelete + 1}`
            : 'aktivitas ini'
        }
      />
    </div>
  );
};

export default ActivitiesManager;