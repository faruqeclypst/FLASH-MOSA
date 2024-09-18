import React from 'react';
import { FlashEvent } from '../../types';
import { Upload, Image as ImageIcon, Calendar, Clock } from 'lucide-react';

interface EventInfoManagerProps {
  formData: FlashEvent;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, field: string) => Promise<void>;
}

const EventInfoManager: React.FC<EventInfoManagerProps> = ({ formData, handleChange, handleImageUpload }) => {
  // Memisahkan tanggal dan waktu dari formData.eventDate dengan pengecekan tambahan
  const [eventDate, eventTime] = formData.eventDate ? formData.eventDate.split('T') : ['', ''];
  const timeValue = eventTime ? eventTime.slice(0, 5) : '';

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'eventDate') {
      const newDateTime = `${value}T${timeValue || '00:00'}`;
      handleChange({ target: { name: 'eventDate', value: newDateTime } } as React.ChangeEvent<HTMLInputElement>);
    } else if (name === 'eventTime') {
      const newDateTime = `${eventDate || new Date().toISOString().split('T')[0]}T${value}`;
      handleChange({ target: { name: 'eventDate', value: newDateTime } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Information</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:space-x-6">
            {/* Left Column */}
            <div className="flex-1 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter event title"
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      value={eventDate}
                      onChange={handleDateTimeChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-1">Event Time</label>
                  <div className="relative">
                    <input
                      type="time"
                      id="eventTime"
                      name="eventTime"
                      value={eventTime}
                      onChange={handleDateTimeChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="aboutFlash" className="block text-sm font-medium text-gray-700 mb-1">About Flash</label>
                <textarea
                  id="aboutFlash"
                  name="aboutFlash"
                  value={formData.aboutFlash}
                  onChange={handleChange}
                  rows={10}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Describe the Flash event"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 mt-4 md:mt-0">
              <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
              <div className="relative">
                <input
                  type="file"
                  id="heroImage"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'heroImage')}
                  className="hidden"
                />
                <label
                  htmlFor="heroImage"
                  className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                >
                  {formData.heroImage ? (
                    <>
                      <ImageIcon size={20} className="mr-2" />
                      Change Hero Image
                    </>
                  ) : (
                    <>
                      <Upload size={20} className="mr-2" />
                      Upload Hero Image
                    </>
                  )}
                </label>
              </div>
              {formData.heroImage ? (
                <div className="mt-4 relative group">
                  <img 
                    src={formData.heroImage} 
                    alt="Hero" 
                    className="w-full h-[361px] object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'heroImage', value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                      className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-colors duration-300"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 border-2 border-dashed border-gray-300 rounded-md h-[400px] flex items-center justify-center text-gray-400">
                  No image uploaded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfoManager;