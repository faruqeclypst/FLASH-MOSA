// src/components/AdminDashboard/ConfirmUpdateModal.tsx

import React, { useState, useEffect } from 'react';

interface ConfirmUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const ConfirmUpdateModal: React.FC<ConfirmUpdateModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset states when modal is opened
      setIsUpdating(false);
      setUpdateSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsUpdating(true);
    try {
      await onConfirm();
      setUpdateSuccess(true);
    } catch (error) {
      console.error('Error updating content:', error);
      setUpdateSuccess(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setUpdateSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        {!updateSuccess ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Konfirmasi Update</h2>
            <p className="mb-6">Apakah Anda yakin ingin Update konten? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
                disabled={isUpdating}
              >
                Batalkan
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Update Berhasil!</h2>
            <p className="mb-6">Konten telah berhasil diperbarui.</p>
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
              >
                Tutup
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmUpdateModal;