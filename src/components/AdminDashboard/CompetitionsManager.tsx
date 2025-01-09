import React, { useState, useEffect } from 'react';
import { Competition, SchoolCategory } from '../../types';
import { 
  PlusCircle, 
  X, 
  Upload, 
  Plus, 
  Trash2,
  Users,
  FileText,
  Calendar
} from 'lucide-react';
import DeleteModal from './DeleteModal';
import Modal from '../ui/Modal';
import classNames from 'classnames';
import { showAlert } from '../ui/Alert';
import BSILogo from '../../assets/img/BSI.png';

interface CompetitionsManagerProps {
  competitions: Competition[];
  handleCompetitionChange: (index: number, field: keyof Competition | 'competition', value: any) => void;
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

  useEffect(() => {
    if (showDetailModal || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDetailModal, isDeleteModalOpen]);

  const handleSave = async () => {
    if (selectedCompetition !== null) {
      const competition = competitions[selectedCompetition];
      console.log('Saving competition:', competition);
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
        const updatedCompetition = {
          ...competition,
          name: competition.name,
          type: competition.type,
          teamSize: competition.teamSize,
          categories: competition.categories,
          description: competition.description,
          rules: competition.rules,
          requirePassportPhoto: competition.requirePassportPhoto || false,
          documentUrl: competition.documentUrl
        };

        for (const [key, value] of Object.entries(updatedCompetition)) {
          if (key in competition) {
            await handleCompetitionChange(selectedCompetition, key as keyof Competition, value);
          }
        }
        
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Competition Cards */}
        {competitions.map((competition, index) => (
          <div 
            key={index}
            className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-center p-2">
              {/* Competition Icon - kiri */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-200 to-purple-50 flex-shrink-0">
                {competition.icon ? (
                  <img 
                    src={competition.icon} 
                    alt={competition.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Competition Info - tengah */}
              <div className="flex-1 px-2">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors whitespace-normal mb-0.5">
                  {competition.name || `Kompetisi ${index + 1}`}
                </h3>
                
                <div className="flex flex-wrap gap-1">
                  <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-medium ${
                    competition.type === 'team' 
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {competition.type === 'team' ? 'Tim' : 'Individu'}
                  </span>
                  {competition.categories?.slice(0, 2).map((category) => (
                    <span key={category} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px]">
                      {category}
                    </span>
                  ))}
                  {(competition.categories?.length || 0) > 2 && (
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px]">
                      +{(competition.categories?.length || 0) - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Actions - kanan */}
              <div className="flex flex-col gap-1.5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={competition.isActive}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCompetitionChange(index, 'isActive', e.target.checked);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-500"></div>
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setSelectedCompetition(index);
                      setShowDetailModal(true);
                    }}
                    className="p-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded transition-colors"
                    title="Edit"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCompetitionToDelete(index);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1 bg-red-50 hover:bg-red-100 text-red-500 rounded transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Button Card - sesuaikan ukurannya */}
        <button
          onClick={handleAddClick}
          className="group bg-white rounded-lg border border-dashed border-gray-200 hover:border-indigo-500 transition-all duration-300 h-[84px] flex items-center justify-center gap-4 hover:bg-indigo-50/50"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-left">
            <p className="text-gray-900 font-medium">Tambah Kompetisi</p>
            <p className="text-sm text-gray-500">Klik untuk menambah baru</p>
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
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Icon and Name Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon Kompetisi
                      </label>
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
                        className="block w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 cursor-pointer transition-colors"
                      >
                        {competitions[selectedCompetition].icon ? (
                          <img
                            src={competitions[selectedCompetition].icon}
                            alt="Competition Icon"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Upload Icon</span>
                          </div>
                        )}
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Kompetisi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={competitions[selectedCompetition].name}
                        onChange={(e) => handleCompetitionChange(selectedCompetition, 'name', e.target.value)}
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Masukkan nama kompetisi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi
                      </label>
                      <textarea
                        value={competitions[selectedCompetition].description}
                        onChange={(e) => handleCompetitionChange(selectedCompetition, 'description', e.target.value)}
                        className="w-full p-2.5 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Deskripsikan kompetisi ini..."
                      />
                    </div>
                  </div>

                  {/* Competition Type and Team Size */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipe Kompetisi <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleCompetitionChange(selectedCompetition, 'type', 'single')}
                          className={`p-3 border rounded-lg flex items-center gap-2 ${
                            competitions[selectedCompetition].type === 'single'
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Users className="w-5 h-5" />
                          <span>Individu</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCompetitionChange(selectedCompetition, 'type', 'team')}
                          className={`p-3 border rounded-lg flex items-center gap-2 ${
                            competitions[selectedCompetition].type === 'team'
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Users className="w-5 h-5" />
                          <span>Tim</span>
                        </button>
                      </div>
                    </div>

                    {competitions[selectedCompetition].type === 'team' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jumlah Anggota Tim <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="2"
                          value={competitions[selectedCompetition].teamSize || ''}
                          onChange={(e) => handleCompetitionChange(selectedCompetition, 'teamSize', parseInt(e.target.value))}
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Min. 2 orang"
                        />
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori <span className="text-red-500">*</span>
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
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            competitions[selectedCompetition].categories?.includes(category)
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          )}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Aturan Kompetisi
                      </label>
                      <button
                        onClick={() => handleAddRule(selectedCompetition)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Aturan</span>
                      </button>
                    </div>
                    
                    {/* Rules Container */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      {competitions[selectedCompetition].rules?.length === 0 ? (
                        <div className="p-4 text-center">
                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            Belum ada aturan. Klik tombol "Tambah Aturan" untuk menambahkan.
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {competitions[selectedCompetition].rules?.map((rule, ruleIndex) => (
                            <div 
                              key={ruleIndex} 
                              className="p-3 flex items-start gap-3 group hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                {ruleIndex + 1}
                              </div>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={rule}
                                  onChange={(e) => handleRuleChange(selectedCompetition, ruleIndex, e.target.value)}
                                  className="w-full bg-transparent border-0 p-0 focus:ring-0 text-gray-700 placeholder-gray-400"
                                  placeholder="Masukkan aturan kompetisi..."
                                />
                              </div>
                              <button
                                onClick={() => handleRemoveRule(selectedCompetition, ruleIndex)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition-all"
                                title="Hapus aturan"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Quick Tips */}
                      {competitions[selectedCompetition].rules?.length > 0 && (
                        <div className="px-4 py-2 bg-indigo-50 rounded-b-lg border-t border-indigo-100">
                          <p className="text-xs text-indigo-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Tips: Urutkan aturan dari yang paling penting</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link Dokumen
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="url"
                          value={competitions[selectedCompetition].documentUrl || ''}
                          onChange={(e) => handleCompetitionChange(selectedCompetition, 'documentUrl', e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="https://drive.google.com/file/..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Pelaksanaan
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="date"
                          value={competitions[selectedCompetition].eventDate?.split('T')[0] || ''}
                          onChange={(e) => handleCompetitionChange(selectedCompetition, 'eventDate', e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={competitions[selectedCompetition].requirePassportPhoto || false}
                          onChange={(e) => handleCompetitionChange(selectedCompetition, 'requirePassportPhoto', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                      <span className="text-sm font-medium text-gray-700">
                        Wajib Pas Foto
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Biaya Pendaftaran
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          value={competitions[selectedCompetition].registrationFee || ''}
                          onChange={(e) => handleCompetitionChange(selectedCompetition, 'registrationFee', parseInt(e.target.value))}
                          className="w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Bank Account Settings */}
                    {competitions[selectedCompetition].registrationFee > 0 && (
                      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={BSILogo}
                            alt="Bank BSI" 
                            className="h-8 object-contain"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Bank Syariah Indonesia (BSI)</p>
                            <p className="text-xs text-gray-600">Pengaturan rekening pembayaran</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nomor Rekening
                            </label>
                            <input
                              type="text"
                              value={competitions[selectedCompetition].bankAccount?.number || ''}
                              onChange={(e) => {
                                const bankAccount = {
                                  ...competitions[selectedCompetition].bankAccount,
                                  number: e.target.value
                                };
                                handleCompetitionChange(selectedCompetition, 'bankAccount', bankAccount);
                              }}
                              className="w-full px-3 py-2 text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Masukkan nomor rekening BSI"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nama Pemilik Rekening
                            </label>
                            <input
                              type="text"
                              value={competitions[selectedCompetition].bankAccount?.holder || ''}
                              onChange={(e) => {
                                const bankAccount = {
                                  ...competitions[selectedCompetition].bankAccount,
                                  holder: e.target.value
                                };
                                handleCompetitionChange(selectedCompetition, 'bankAccount', bankAccount);
                              }}
                              className="w-full px-3 py-2 text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Nama pemilik rekening"
                            />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Catatan: Pastikan nomor rekening dan nama pemilik rekening sudah benar sebelum disimpan
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
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
