import React from 'react';
import { FlashEvent } from '../../types';

interface EventInfoManagerProps {
  formData: FlashEvent;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, field: string) => Promise<void>;
}

const EventInfoManager: React.FC<EventInfoManagerProps> = ({ formData, handleChange, handleImageUpload }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Event Information</h2>
      <div>
        <label className="block mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-2">Hero Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'heroImage')}
          className="w-full p-2 border rounded"
        />
        {formData.heroImage && (
          <img src={formData.heroImage} alt="Hero" className="mt-2 max-w-xs" />
        )}
      </div>
      <div>
        <label className="block mb-2">About Flash</label>
        <textarea
          name="aboutFlash"
          value={formData.aboutFlash}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>
    </div>
  );
};

export default EventInfoManager;