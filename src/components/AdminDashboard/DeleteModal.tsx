import React from 'react';
import Modal from '../ui/Modal';

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
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="sm"
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hapus {itemName}
        </h3>
        {registrationCode && nameOrTeam ? (
          <p className="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus {itemName} dengan kode {registrationCode} ({nameOrTeam})?
            Data yang sudah dihapus tidak dapat dikembalikan.
          </p>
        ) : (
          <p className="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus {itemName} ini? 
            Data yang sudah dihapus tidak dapat dikembalikan.
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;