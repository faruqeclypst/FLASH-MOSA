import React, { useState } from 'react';
import { FlashEvent } from '../../types';
import { Upload, Image as ImageIcon, Calendar, Clock, Video, Settings, PictureInPicture } from 'lucide-react';

interface EventInfoManagerProps {
  formData: FlashEvent;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, field: string) => Promise<void>;
}

const EventInfoManager: React.FC<EventInfoManagerProps> = ({ formData, handleChange, handleFileUpload }) => {
  const [selectedSection, setSelectedSection] = useState<'webSetting' | 'webImageSetting'>('webSetting');
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
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 p-4">Informasi Acara</h2>
        <ul>
          <li 
            className={`p-4 cursor-pointer hover:bg-gray-200 transition-colors duration-300 ${selectedSection === 'webSetting' ? 'bg-blue-100' : ''}`}
            onClick={() => setSelectedSection('webSetting')}
          >
            <div className="flex items-center">
              <Settings size={20} className="mr-2" />
              <span className="font-medium">Web Setting</span>
            </div>
          </li>
          <li 
            className={`p-4 cursor-pointer hover:bg-gray-200 transition-colors duration-300 ${selectedSection === 'webImageSetting' ? 'bg-blue-100' : ''}`}
            onClick={() => setSelectedSection('webImageSetting')}
          >
            <div className="flex items-center">
              <PictureInPicture size={20} className="mr-2" />
              <span className="font-medium">Web Image Setting</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedSection === 'webSetting' ? 'Web Setting' : 'Web Image Setting'}
              </h3>
            </div>

            {selectedSection === 'webSetting' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul Acara</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan judul acara"
                  />
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Acara</label>
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
                    <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-1">Waktu Acara</label>
                    <div className="relative">
                      <input
                        type="time"
                        id="eventTime"
                        name="eventTime"
                        value={timeValue}
                        onChange={handleDateTimeChange}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="aboutFlash" className="block text-sm font-medium text-gray-700 mb-1">Tentang Flash</label>
                  <textarea
                    id="aboutFlash"
                    name="aboutFlash"
                    value={formData.aboutFlash}
                    onChange={handleChange}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Deskripsikan acara Flash"
                  />
                </div>
              </div>
            )}

{selectedSection === 'webImageSetting' && (
  <div className="space-y-6">
    {/* Hero Image Upload */}
    <div>
      <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700 mb-1">Gambar Utama</label>
      <div className="mt-1 relative">
        <input
          type="file"
          id="heroImage"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'heroImage')}
          className="hidden"
        />
        {formData.heroImage ? (
          <div className="relative group">
            <img 
              src={formData.heroImage} 
              alt="Hero" 
              className="w-full h-[250px] object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <label
                htmlFor="heroImage"
                className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md transition-colors duration-300 cursor-pointer mr-2"
              >
                Ubah Gambar
              </label>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'heroImage', value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-colors duration-300"
              >
                Hapus Gambar
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="heroImage"
            className="flex flex-col items-center justify-center w-full h-[250px] border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Klik untuk mengunggah gambar utama</p>
            </div>
          </label>
        )}
      </div>
    </div>

    {/* Hero Video Upload */}
    <div>
      <label htmlFor="heroVideo" className="block text-sm font-medium text-gray-700 mb-1">Video Utama</label>
      <div className="mt-1 relative">
        <input
          type="file"
          id="heroVideo"
          accept="video/*"
          onChange={(e) => handleFileUpload(e, 'heroVideo')}
          className="hidden"
        />
        {formData.heroVideo ? (
          <div className="relative group">
            <video 
              src={formData.heroVideo} 
              className="w-full h-[250px] object-cover rounded-md"
              controls
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <label
                htmlFor="heroVideo"
                className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md transition-colors duration-300 cursor-pointer mr-2"
              >
                Ubah Video
              </label>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'heroVideo', value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-colors duration-300"
              >
                Hapus Video
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="heroVideo"
            className="flex flex-col items-center justify-center w-full h-[250px] border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Klik untuk mengunggah video utama</p>
            </div>
          </label>
        )}
      </div>
    </div>

    {/* About Image Upload */}
    <div>
      <label htmlFor="aboutImage" className="block text-sm font-medium text-gray-700 mb-1">Gambar Tentang</label>
      <div className="mt-1 relative">
        <input
          type="file"
          id="aboutImage"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'aboutImage')}
          className="hidden"
        />
        {formData.aboutImage ? (
          <div className="relative group">
            <img 
              src={formData.aboutImage} 
              alt="About" 
              className="w-full h-[250px] object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <label
                htmlFor="aboutImage"
                className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md transition-colors duration-300 cursor-pointer mr-2"
              >
                Ubah Gambar
              </label>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'aboutImage', value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-colors duration-300"
              >
                Hapus Gambar
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="aboutImage"
            className="flex flex-col items-center justify-center w-full h-[250px] border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Klik untuk mengunggah gambar tentang</p>
            </div>
          </label>
        )}
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfoManager;