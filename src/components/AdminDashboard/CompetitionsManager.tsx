import React from 'react';
import { Competition } from '../../types';

interface CompetitionsManagerProps {
  competitions: Competition[];
  handleCompetitionChange: (index: number, field: keyof Competition, value: string) => void;
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
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Competitions</h2>
      {competitions.map((competition, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg">
          <div className="flex items-center mb-2">
            <div className="mr-4">
              {competition.icon ? (
                <img src={competition.icon} alt={competition.name} className="w-16 h-16 object-cover rounded-full" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  No Icon
                </div>
              )}
            </div>
            <div className="flex-grow">
              <input
                type="text"
                value={competition.name}
                onChange={(e) => handleCompetitionChange(index, 'name', e.target.value)}
                placeholder="Competition Name"
                className="w-full px-3 py-2 border rounded-lg mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleIconUpload(index, e.target.files[0]);
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
          <textarea
            value={competition.description}
            onChange={(e) => handleCompetitionChange(index, 'description', e.target.value)}
            placeholder="Competition Description"
            className="w-full px-3 py-2 border rounded-lg mb-2"
          ></textarea>
          <h3 className="font-bold mb-2">Rules</h3>
          {competition.rules.map((rule, ruleIndex) => (
            <div key={ruleIndex} className="flex mb-2">
              <input
                type="text"
                value={rule}
                onChange={(e) => handleRuleChange(index, ruleIndex, e.target.value)}
                placeholder="Rule"
                className="flex-grow px-3 py-2 border rounded-lg mr-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveRule(index, ruleIndex)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Remove Rule
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddRule(index)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2"
          >
            Add Rule
          </button>
          <button
            type="button"
            onClick={() => handleRemoveCompetition(index)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Remove Competition
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddCompetition}
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        Add Competition
      </button>
    </div>
  );
};

export default CompetitionsManager;