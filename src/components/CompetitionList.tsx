import React from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent, Competition } from '../types';

const CompetitionList: React.FC = () => {
  const { data: flashEvent, loading, error } = useFirebase<FlashEvent>('flashEvent');

  if (loading) {
    return <p>Loading competitions...</p>;
  }

  if (error) {
    return <p>Error loading competitions: {error.message}</p>;
  }

  // Tambahkan pemeriksaan ini
  if (!flashEvent || !flashEvent.competitions) {
    return <p>No competition data available.</p>;
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Competitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {flashEvent.competitions.map((competition: Competition, index: number) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                {competition.icon ? (
                  <img 
                    src={competition.icon} 
                    alt={`${competition.name} icon`} 
                    className="w-16 h-16 object-cover rounded-full mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-gray-500 text-2xl">🏆</span>
                  </div>
                )}
                <h3 className="text-xl font-bold">{competition.name}</h3>
              </div>
              <p className="mb-4">{competition.description}</p>
              <h4 className="font-bold mb-2">Rules:</h4>
              <ul className="list-disc list-inside">
                {competition.rules && competition.rules.map((rule: string, ruleIndex: number) => (
                  <li key={ruleIndex}>{rule}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompetitionList;