import React from 'react';
import { Activity } from '../../types';
import { PlusCircle, X, Upload } from 'lucide-react';

interface ActivitiesManagerProps {
  activities: Activity[];
  handleActivityChange: (index: number, field: keyof Activity, value: string) => void;
  handleAddActivity: () => void;
  handleRemoveActivity: (index: number) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => Promise<void>;
}

const ActivitiesManager: React.FC<ActivitiesManagerProps> = ({ 
  activities, 
  handleActivityChange, 
  handleAddActivity, 
  handleRemoveActivity,
  handleImageUpload 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Activities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Activity {index + 1}</h3>
                <button
                  onClick={() => handleRemoveActivity(index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-300"
                  aria-label="Remove Activity"
                >
                  <X size={24} />
                </button>
              </div>
              <input
                type="text"
                value={activity.name}
                onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
                placeholder="Activity Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <textarea
                value={activity.description}
                onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                placeholder="Activity Description"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 h-32 resize-none"
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'activities', index)}
                  className="hidden"
                  id={`activity-image-${index}`}
                />
                <label
                  htmlFor={`activity-image-${index}`}
                  className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                >
                  <Upload size={20} className="mr-2" />
                  Upload Image
                </label>
              </div>
              {activity.image && (
                <div className="mt-4 relative group">
                  <img src={activity.image} alt={activity.name} className="w-full h-48 object-cover rounded-md" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleActivityChange(index, 'image', '')}
                      className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-colors duration-300"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={handleAddActivity}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          <PlusCircle size={24} className="mr-2" />
          Add New Activity
        </button>
      </div>
    </div>
  );
};

export default ActivitiesManager;