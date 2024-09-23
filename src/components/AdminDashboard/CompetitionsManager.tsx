import React from 'react';
import { Competition, SchoolCategory } from '../../types';
import { PlusCircle, X, Upload, Plus, Trash2, Users } from 'lucide-react';
// import { PlusCircle, X, Upload, Plus, Trash2, Users, Check } from 'lucide-react';

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
  const schoolCategories: SchoolCategory[] = ['SD/MI', 'SMP/MTs', 'SMA/SMK/MA', 'UMUM'];

  const toggleCategory = (index: number, category: SchoolCategory) => {
    const currentCategories = competitions[index].categories || [];
    let newCategories: SchoolCategory[];
    if (currentCategories.includes(category)) {
      newCategories = currentCategories.filter(c => c !== category);
    } else {
      newCategories = [...currentCategories, category];
    }
    handleCompetitionChange(index, 'categories', newCategories);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Competitions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Competition {index + 1}</h3>
                <button
                  onClick={() => handleRemoveCompetition(index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-300"
                  aria-label="Remove Competition"
                  type="button"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {competition.icon ? (
                    <img src={competition.icon} alt={competition.name} className="w-20 h-20 object-cover rounded-full" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                      No Icon
                    </div>
                  )}
                </div>
                <div className="flex-grow space-y-2">
                  <input
                    type="text"
                    value={competition.name}
                    onChange={(e) => handleCompetitionChange(index, 'name', e.target.value)}
                    placeholder="Competition Name"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" required
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleIconUpload(index, e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id={`competition-icon-${index}`}
                    />
                    <label
                      htmlFor={`competition-icon-${index}`}
                      className="flex items-center justify-center w-full p-2 border border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                    >
                      <Upload size={20} className="mr-2" />
                      Upload Icon
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor={`competition-type-${index}`} className="block text-sm font-medium text-gray-700">
                  Competition Type
                </label>
                <select
                  id={`competition-type-${index}`}
                  value={competition.type}
                  onChange={(e) => handleCompetitionChange(index, 'type', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="single">Single</option>
                  <option value="team">Team</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Competition Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {schoolCategories.map((category) => (
                    <button
                      key={category}
                      onClick={(e) => {
                        e.preventDefault(); // Mencegah form submission
                        toggleCategory(index, category);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        competition.categories?.includes(category)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      } transition-colors duration-300`}
                    >
                      {category}
                      {/* {competition.categories?.includes(category) && (
                        <Check size={16} className="ml-1 inline" />
                      )} */}
                    </button>
                  ))}
                </div>
              </div>
              
              {competition.type === 'team' && (
                <div className="space-y-2">
                <label htmlFor={`team-size-${index}`} className="block text-sm font-medium text-gray-700">
                  Team Size
                </label>
                <div className="flex items-center space-x-2">
                  <Users size={20} className="text-gray-500" />
                  <input
                    type="number"
                    id={`team-size-${index}`}
                    value={competition.teamSize || ''}
                    onChange={(e) => handleCompetitionChange(index, 'teamSize', parseInt(e.target.value))}
                    placeholder="Team Size"
                    min="2"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required={competition.type === 'team'}
                  />
                </div>
              </div>
              )}
              
              <textarea
                value={competition.description}
                onChange={(e) => handleCompetitionChange(index, 'description', e.target.value)}
                placeholder="Competition Description"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 h-32 resize-none"
              />
              
              <div className="space-y-2">
                <h4 className="font-semibold text-lg text-gray-700">Rules</h4>
                {competition.rules.map((rule, ruleIndex) => (
                  <div key={ruleIndex} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => handleRuleChange(index, ruleIndex, e.target.value)}
                      placeholder="Rule"
                      className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(index, ruleIndex)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors duration-300"
                      aria-label="Remove Rule"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddRule(index)}
                  className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-300"
                >
                  <Plus size={20} className="mr-1" /> Add Rule
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={handleAddCompetition}
          className="flex items-center bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          <PlusCircle size={24} className="mr-2" />
          Add New Competition
        </button>
      </div>
    </div>
  );
};

export default CompetitionsManager;