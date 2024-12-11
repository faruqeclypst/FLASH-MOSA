import React, { useState } from 'react';
import { Competition, SchoolCategory } from '../../types';
import { 
  PlusCircle, 
  X, 
  Upload, 
  Plus, 
  Trash2,
  Users,
  FileText
} from 'lucide-react';
import DeleteModal from './DeleteModal';
import Modal from '../ui/Modal';
import classNames from 'classnames';
import { showAlert } from '../ui/Alert';

interface CompetitionsManagerProps {
  competitions: Competition[];
  handleCompetitionChange: (index: number, field: keyof Competition, value: any) => void;
  handleAddCompetition: () => void;
  handleRemoveCompetition: (index: number) => void;
  handleAddRule: (competitionIndex: number) => void;
  handleRuleChange: (competitionIndex: number, ruleIndex: number, value: string) => void;
  handleRemoveRule: (competitionIndex: number, ruleIndex: number) => void;
  handleIconUpload: (index: number, file: File) => void;
}

const CompetitionsManager: React.FC<CompetitionsManagerProps> = ({
  competitions,
  handleCompetitionChange,
  handleAddCompetition,
  handleRemoveCompetition,
  handleAddRule,
  handleRuleChange,
  handleRemoveRule,
  handleIconUpload
}) => {
  const [selectedCompetition, setSelectedCompetition] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [competitionToDelete, setCompetitionToDelete] = useState<number | null>(null);

  const schoolCategories: SchoolCategory[] = ['SD/MI', 'SMP/MTs', 'SMA/SMK/MA', 'UMUM'];

  const handleSave = async () => {
    if (selectedCompetition !== null) {
      const competition = competitions[selectedCompetition];
      if (!competition.name?.trim()) {
        showAlert('error', 'Nama kompetisi tidak boleh kosong');
        return;
      }

      if (competition.type === 'team' && (!competition.teamSize || competition.teamSize < 2)) {
        showAlert('error', 'Jumlah anggota tim minimal 2 orang');
        return;
      }

      if (!competition.categories?.length) {
        showAlert('error', 'Pilih minimal satu kategori');
        return;
      }

      try {
        setIsSaving(true);
        await handleCompetitionChange(selectedCompetition, 'name', competition.name);
        showAlert('success', 'Kompetisi berhasil diperbarui');
        setShowDetailModal(false);
        setSelectedCompetition(null);
      } catch (error) {
        console.error('Error saving competition:', error);
        showAlert('error', 'Gagal menyimpan perubahan');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAddClick = () => {
    try {
      handleAddCompetition();
      showAlert('success', 'Kompetisi baru berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding competition:', error);
      showAlert('error', 'Gagal menambahkan kompetisi');
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kompetisi</h1>
          <p className="text-gray-600 mt-1">Kelola daftar kompetisi FLASH</p>
        </div>
        
        {/* Stats Card */}
        <div className="bg-indigo-50 px-4 py-2 rounded-lg flex items-center gap-3">
          <div className="p-1.5 bg-indigo-100 rounded-md">
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-indigo-600 font-medium">Total</p>
            <p className="text-lg font-semibold text-indigo-700 leading-none">
              {competitions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Competition Cards */}
        {competitions.map((competition, index) => (
          <div 
            key={index}
            className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Competition Image/Preview */}
            <div className="relative h-48">
              {competition.icon ? (
                <img 
                  src={competition.icon} 
                  alt={competition.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-300" />
                </div>
              )}
              {/* Quick Actions Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-end p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCompetition(index);
                      setShowDetailModal(true);
                    }}
                    className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg backdrop-blur-sm transition-colors"
                    title="Edit"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCompetitionToDelete(index);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 bg-white/90 hover:bg-white text-red-500 rounded-lg backdrop-blur-sm transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Competition Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {competition.name || `Kompetisi ${index + 1}`}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  competition.type === 'team' 
                    ? 'bg-purple-50 text-purple-700'
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {competition.type === 'team' ? 'Tim' : 'Individu'}
                </span>
                {competition.categories?.map((category) => (
                  <span key={category} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {category}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {competition.description || 'Belum ada deskripsi'}
              </p>
            </div>
          </div>
        ))}

        {/* Add Button Card */}
        <button
          onClick={handleAddClick}
          className="group bg-white rounded-xl border border-dashed border-gray-200 hover:border-indigo-500 transition-all duration-300 h-[280px] flex flex-col items-center justify-center gap-4 hover:bg-indigo-50/50"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <PlusCircle className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="text-gray-900 font-medium">Tambah Kompetisi</p>
            <p className="text-sm text-gray-500 mt-1">Klik untuk menambah kompetisi baru</p>
          </div>
        </button>

        {/* Empty State */}
        {competitions.length === 0 && (
          <div className="col-span-full">
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum ada kompetisi
              </h3>
              <p className="text-gray-500">
                Mulai dengan menambahkan kompetisi baru untuk FLASH
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCompetitionToDelete(null);
        }}
        onConfirm={() => {
          if (competitionToDelete !== null) {
            handleRemoveCompetition(competitionToDelete);
            setIsDeleteModalOpen(false);
            setCompetitionToDelete(null);
          }
        }}
        itemName={
          competitionToDelete !== null && competitions[competitionToDelete]
            ? competitions[competitionToDelete].name || `Kompetisi ${competitionToDelete + 1}`
            : 'kompetisi ini'
        }
      />

      {/* Edit Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        size="xl"
      >
        {selectedCompetition !== null && competitions[selectedCompetition] && (
          <div className="relative">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                Edit Kompetisi
              </h3>
            </div>

            {/* Content Modal */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* Icon Upload */}
                  <div className="flex-shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0] && selectedCompetition !== null) {
                          handleIconUpload(selectedCompetition, e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="competition-icon"
                    />
                    <label
                      htmlFor="competition-icon"
                      className="block w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer"
                    >
                      {competitions[selectedCompetition].icon ? (
                        <img
                          src={competitions[selectedCompetition].icon}
                          alt="Competition Icon"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Name Input */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Kompetisi
                    </label>
                    <input
                      type="text"
                      value={competitions[selectedCompetition].name}
                      onChange={(e) => handleCompetitionChange(selectedCompetition, 'name', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Nama Kompetisi"
                    />
                  </div>
                </div>

                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipe Kompetisi
                  </label>
                  <select
                    value={competitions[selectedCompetition].type}
                    onChange={(e) => handleCompetitionChange(selectedCompetition, 'type', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="single">Individu</option>
                    <option value="team">Tim</option>
                  </select>
                </div>

                {/* Team Size - Hanya muncul jika tipe adalah team */}
                {competitions[selectedCompetition].type === 'team' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah Anggota Tim
                    </label>
                    <input
                      type="number"
                      min="2"
                      value={competitions[selectedCompetition].teamSize || ''}
                      onChange={(e) => handleCompetitionChange(selectedCompetition, 'teamSize', parseInt(e.target.value))}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Masukkan jumlah anggota tim"
                      required
                    />
                  </div>
                )}

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {schoolCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          const currentCategories = competitions[selectedCompetition].categories || [];
                          const newCategories = currentCategories.includes(category)
                            ? currentCategories.filter(c => c !== category)
                            : [...currentCategories, category];
                          handleCompetitionChange(selectedCompetition, 'categories', newCategories);
                        }}
                        className={classNames(
                          'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                          competitions[selectedCompetition].categories?.includes(category)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    value={competitions[selectedCompetition].description}
                    onChange={(e) => handleCompetitionChange(selectedCompetition, 'description', e.target.value)}
                    className="w-full p-2 border rounded-lg h-32 resize-none"
                    placeholder="Deskripsi kompetisi"
                  />
                </div>

                {/* Rules */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Aturan Kompetisi
                  </label>
                  {competitions[selectedCompetition].rules?.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => handleRuleChange(selectedCompetition, ruleIndex, e.target.value)}
                        className="flex-1 p-2 border rounded-lg"
                        placeholder="Aturan kompetisi"
                      />
                      <button
                        onClick={() => handleRemoveRule(selectedCompetition, ruleIndex)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddRule(selectedCompetition)}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Aturan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedCompetition(null);
                }}
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
    </div>
  );
};

export default CompetitionsManager;
