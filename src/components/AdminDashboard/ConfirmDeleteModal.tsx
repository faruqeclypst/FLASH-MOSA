// src/components/AdminDashboard/ConfirmDeleteModal.tsx

import React, { useState, useEffect } from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset states when modal is opened
      setIsDeleting(false);
      setDeleteSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      setDeleteSuccess(true);
    } catch (error) {
      console.error('Error deleting item:', error);
      setDeleteSuccess(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setDeleteSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        {!deleteSuccess ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Konfirmasi Penghapusan</h2>
            <p className="mb-6">Apakah Anda yakin ingin menghapus {itemName}? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
                disabled={isDeleting}
              >
                Batalkan
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                disabled={isDeleting}
              >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Penghapusan Berhasil!</h2>
            <p className="mb-6">{itemName} telah berhasil dihapus.</p>
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

export default ConfirmDeleteModal;