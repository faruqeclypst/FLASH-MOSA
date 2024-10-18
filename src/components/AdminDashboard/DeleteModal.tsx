import React from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  registrationCode?: string;
  nameOrTeam?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName,
  registrationCode,
  nameOrTeam
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-sm mx-auto">
        <h2 className="text-2xl font-bold mb-4">Konfirmasi Hapus</h2>
        <p className="mb-4">
          Apakah Anda yakin ingin menghapus {itemName}?
        </p>
        {registrationCode && (
          <p className="mb-2">
            <span className="font-semibold">Kode Pendaftaran:</span> {registrationCode}
          </p>
        )}
        {nameOrTeam && (
          <p className="mb-2">
            <span className="font-semibold">Nama/Tim:</span> {nameOrTeam}
          </p>
        )}
        <p className="mb-6 text-red-600 font-semibold">
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;