// Sidebar Mode
// src/components/AdminDashboard/ManageRegistrations.tsx
import React, { useState, useCallback } from 'react';
import { Competition, SchoolCategory } from '../../types';
import { PlusCircle, X, Upload, Plus, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

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
  const [selectedCompetition, setSelectedCompetition] = useState<number | null>(
    competitions.length > 0 ? 0 : null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [competitionToDelete, setCompetitionToDelete] = useState<number | null>(null);

  const schoolCategories: SchoolCategory[] = ['SD/MI', 'SMP/MTs', 'SMA/SMK/MA', 'UMUM'];

  const toggleCategory = useCallback((index: number, category: SchoolCategory) => {
    const currentCategories = competitions[index].categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    handleCompetitionChange(index, 'categories', newCategories);
  }, [competitions, handleCompetitionChange]);

  const safeHandleAddRule = useCallback((index: number) => {
    if (!Array.isArray(competitions[index].rules)) {
      handleCompetitionChange(index, 'rules', []);
    }
    handleAddRule(index);
  }, [competitions, handleCompetitionChange, handleAddRule]);

  const openDeleteModal = useCallback((index: number) => {
    setCompetitionToDelete(index);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setCompetitionToDelete(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (competitionToDelete !== null) {
      await handleRemoveCompetition(competitionToDelete);
      if (selectedCompetition === competitionToDelete) {
        setSelectedCompetition(null);
      }
      closeDeleteModal();
    }
  }, [competitionToDelete, handleRemoveCompetition, selectedCompetition, closeDeleteModal]);
  

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 p-4">Kompetisi</h2>
        
        {/* Tombol Add New di atas */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => {
              handleAddCompetition();
              setSelectedCompetition(competitions.length);
            }}
            className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            <PlusCircle size={20} className="mr-2" />
            Tambah Baru!
          </button>
        </div>

        <ul>
          {competitions.map((competition, index) => (
            <li
              key={index}
              className={`p-4 cursor-pointer hover:bg-gray-200 transition-colors duration-300 ${
                selectedCompetition === index ? 'bg-blue-100' : ''
              }`}
              onClick={() => setSelectedCompetition(index)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {competition.name || `Kompetisi ${index + 1}`}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(index);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors duration-300"
                  aria-label="Hapus Kompetisi"
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
        {selectedCompetition !== null && competitions[selectedCompetition] && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {competitions[selectedCompetition].name || `Kompetisi ${selectedCompetition + 1}`}
                </h3>
              </div>

              {/* Competition Form Fields */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {competitions[selectedCompetition].icon ? (
                    <img src={competitions[selectedCompetition].icon} alt={competitions[selectedCompetition].name} className="w-20 h-20 object-cover rounded" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                      No Icon
                    </div>
                  )}
                </div>
                <div className="flex-grow space-y-2">
                  <input
                    type="text"
                    value={competitions[selectedCompetition].name}
                    onChange={(e) => handleCompetitionChange(selectedCompetition, 'name', e.target.value)}
                    placeholder="Nama Kompetisi"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                    required
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleIconUpload(selectedCompetition, e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id={`competition-icon-${selectedCompetition}`}
                    />
                    <label
                      htmlFor={`competition-icon-${selectedCompetition}`}
                      className="flex items-center justify-center w-full p-2 border border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                    >
                      <Upload size={20} className="mr-2" />
                      Unggah Ikon
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor={`competition-type-${selectedCompetition}`} className="block text-sm font-medium text-gray-700">
                  Tipe Kompetisi
                </label>
                <select
                  id={`competition-type-${selectedCompetition}`}
                  value={competitions[selectedCompetition].type}
                  onChange={(e) => handleCompetitionChange(selectedCompetition, 'type', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="single">Individu</option>
                  <option value="team">Tim</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kategori Kompetisi
                </label>
                <div className="flex flex-wrap gap-2">
                  {schoolCategories.map((category) => (
                    <button
                      key={category}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleCategory(selectedCompetition, category);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        competitions[selectedCompetition].categories?.includes(category)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      } transition-colors duration-300`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {competitions[selectedCompetition].type === 'team' && (
                <div className="space-y-2">
                  <label htmlFor={`team-size-${selectedCompetition}`} className="block text-sm font-medium text-gray-700">
                    Ukuran Tim
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      id={`team-size-${selectedCompetition}`}
                      value={competitions[selectedCompetition].teamSize || ''}
                      onChange={(e) => handleCompetitionChange(selectedCompetition, 'teamSize', parseInt(e.target.value))}
                      placeholder="Ukuran Tim"
                      min="2"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required={competitions[selectedCompetition].type === 'team'}
                    />
                  </div>
                </div>
              )}

              <textarea
                value={competitions[selectedCompetition].description}
                onChange={(e) => handleCompetitionChange(selectedCompetition, 'description', e.target.value)}
                placeholder="Deskripsi Kompetisi"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 h-32 resize-none"
              />

              <div className="space-y-2">
                <h4 className="font-semibold text-lg text-gray-700">Aturan</h4>
                {Array.isArray(competitions[selectedCompetition].rules) && competitions[selectedCompetition].rules.length > 0 ? (
                  competitions[selectedCompetition].rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => handleRuleChange(selectedCompetition, ruleIndex, e.target.value)}
                        placeholder="Aturan"
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(selectedCompetition, ruleIndex)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors duration-300"
                        aria-label="Hapus Aturan"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Belum ada aturan yang ditambahkan.</p>
                )}
                <button
                  type="button"
                  onClick={() => safeHandleAddRule(selectedCompetition)}
                  className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-300"
                >
                  <Plus size={20} className="mr-1" /> Tambah Aturan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isDeleteModalOpen && (
  <ConfirmDeleteModal
    isOpen={isDeleteModalOpen}
    onClose={closeDeleteModal}
    onConfirm={confirmDelete}
    itemName={competitionToDelete !== null && competitions[competitionToDelete] 
      ? competitions[competitionToDelete].name || `Kompetisi ${competitionToDelete + 1}` 
      : ''}
  />
)}
    </div>
  );
};

export default CompetitionsManager;


// Normal
// src/components/AdminDashboard/ManageRegistrations.tsx
// import React from 'react';
// import { Competition, SchoolCategory } from '../../types';
// import { PlusCircle, X, Upload, Plus, Trash2, Users } from 'lucide-react';

// interface CompetitionsManagerProps {
//   competitions: Competition[];
//   handleCompetitionChange: (index: number, field: keyof Competition, value: any) => void;
//   handleAddCompetition: () => void;
//   handleRemoveCompetition: (index: number) => void;
//   handleAddRule: (competitionIndex: number) => void;
//   handleRuleChange: (competitionIndex: number, ruleIndex: number, value: string) => void;
//   handleRemoveRule: (competitionIndex: number, ruleIndex: number) => void;
//   handleIconUpload: (index: number, file: File) => void;
// }

// const CompetitionsManager: React.FC<CompetitionsManagerProps> = ({
//   competitions,
//   handleCompetitionChange,
//   handleAddCompetition,
//   handleRemoveCompetition,
//   handleAddRule,
//   handleRuleChange,
//   handleRemoveRule,
//   handleIconUpload
// }) => {
//   const schoolCategories: SchoolCategory[] = ['SD/MI', 'SMP/MTs', 'SMA/SMK/MA', 'UMUM'];

//   const toggleCategory = (index: number, category: SchoolCategory) => {
//     const currentCategories = competitions[index].categories || [];
//     let newCategories: SchoolCategory[];
//     if (currentCategories.includes(category)) {
//       newCategories = currentCategories.filter(c => c !== category);
//     } else {
//       newCategories = [...currentCategories, category];
//     }
//     handleCompetitionChange(index, 'categories', newCategories);
//   };

//   const safeHandleAddRule = (index: number) => {
//     if (!Array.isArray(competitions[index].rules)) {
//       handleCompetitionChange(index, 'rules', []);
//     }
//     handleAddRule(index);
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Competitions</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {competitions.map((competition, index) => (
//           <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
//             <div className="p-6 space-y-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold text-gray-800">Competition {index + 1}</h3>
//                 <button
//                   onClick={() => handleRemoveCompetition(index)}
//                   className="text-red-500 hover:text-red-700 transition-colors duration-300"
//                   aria-label="Remove Competition"
//                   type="button"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
              
//               <div className="flex items-center space-x-4">
//                 <div className="flex-shrink-0">
//                   {competition.icon ? (
//                     <img src={competition.icon} alt={competition.name} className="w-20 h-20 object-cover rounded-full" />
//                   ) : (
//                     <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
//                       No Icon
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex-grow space-y-2">
//                   <input
//                     type="text"
//                     value={competition.name}
//                     onChange={(e) => handleCompetitionChange(index, 'name', e.target.value)}
//                     placeholder="Competition Name"
//                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
//                     required
//                   />
//                   <div className="relative">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         if (e.target.files && e.target.files[0]) {
//                           handleIconUpload(index, e.target.files[0]);
//                         }
//                       }}
//                       className="hidden"
//                       id={`competition-icon-${index}`}
//                     />
//                     <label
//                       htmlFor={`competition-icon-${index}`}
//                       className="flex items-center justify-center w-full p-2 border border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
//                     >
//                       <Upload size={20} className="mr-2" />
//                       Upload Icon
//                     </label>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="space-y-2">
//                 <label htmlFor={`competition-type-${index}`} className="block text-sm font-medium text-gray-700">
//                   Competition Type
//                 </label>
//                 <select
//                   id={`competition-type-${index}`}
//                   value={competition.type}
//                   onChange={(e) => handleCompetitionChange(index, 'type', e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                   required
//                 >
//                   <option value="single">Single</option>
//                   <option value="team">Team</option>
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Competition Categories
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {schoolCategories.map((category) => (
//                     <button
//                       key={category}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         toggleCategory(index, category);
//                       }}
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         competition.categories?.includes(category)
//                           ? 'bg-blue-500 text-white'
//                           : 'bg-gray-200 text-gray-700'
//                       } transition-colors duration-300`}
//                     >
//                       {category}
//                     </button>
//                   ))}
//                 </div>
//               </div>
              
//               {competition.type === 'team' && (
//                 <div className="space-y-2">
//                   <label htmlFor={`team-size-${index}`} className="block text-sm font-medium text-gray-700">
//                     Team Size
//                   </label>
//                   <div className="flex items-center space-x-2">
//                     <Users size={20} className="text-gray-500" />
//                     <input
//                       type="number"
//                       id={`team-size-${index}`}
//                       value={competition.teamSize || ''}
//                       onChange={(e) => handleCompetitionChange(index, 'teamSize', parseInt(e.target.value))}
//                       placeholder="Team Size"
//                       min="2"
//                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                       required={competition.type === 'team'}
//                     />
//                   </div>
//                 </div>
//               )}
              
//               <textarea
//                 value={competition.description}
//                 onChange={(e) => handleCompetitionChange(index, 'description', e.target.value)}
//                 placeholder="Competition Description"
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 h-32 resize-none"
//               />
              
//               <div className="space-y-2">
//                 <h4 className="font-semibold text-lg text-gray-700">Rules</h4>
//                 {Array.isArray(competition.rules) && competition.rules.length > 0 ? (
//                   competition.rules.map((rule, ruleIndex) => (
//                     <div key={ruleIndex} className="flex items-center space-x-2">
//                       <input
//                         type="text"
//                         value={rule}
//                         onChange={(e) => handleRuleChange(index, ruleIndex, e.target.value)}
//                         placeholder="Rule"
//                         className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveRule(index, ruleIndex)}
//                         className="p-2 text-red-500 hover:text-red-700 transition-colors duration-300"
//                         aria-label="Remove Rule"
//                       >
//                         <Trash2 size={20} />
//                       </button>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 italic">No rules added yet.</p>
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => safeHandleAddRule(index)}
//                   className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-300"
//                 >
//                   <Plus size={20} className="mr-1" /> Add Rule
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="flex justify-center mt-8">
//         <button
//           type="button"
//           onClick={handleAddCompetition}
//           className="flex items-center bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
//         >
//           <PlusCircle size={24} className="mr-2" />
//           Add New Competition
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CompetitionsManager;
