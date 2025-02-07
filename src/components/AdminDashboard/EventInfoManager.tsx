import React, { useState, useEffect } from 'react';
import { FlashEvent } from '../../types';
import { 
  Upload, 
  Image as ImageIcon, 
  Calendar, 
  Clock, 
  Video, 
  Settings, 
  PictureInPicture,
  Globe,
  FileText,
  LayoutList
} from 'lucide-react';
import classNames from 'classnames';
import { uploadFile } from '../../services/firebase';

// Add cache constants
const EVENT_INFO_CACHE_KEY = 'event_info_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface EventInfoManagerProps {
  formData: FlashEvent;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | 
    { name: string; value: any; type?: string }
  ) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, field: string) => Promise<void>;
}

const EventInfoManager: React.FC<EventInfoManagerProps> = ({ formData, handleChange, handleFileUpload }) => {
  const [cachedFormData, setCachedFormData] = useState(formData);
  const [eventDate, setEventDate] = useState('');
  const [timeValue, setTimeValue] = useState('');

  // Add caching logic
  useEffect(() => {
    const loadCachedData = () => {
      const cached = localStorage.getItem(EVENT_INFO_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
        if (!isExpired) {
          setCachedFormData(data);
          // Set date and time from cached data
          if (data.eventDate) {
            const date = new Date(data.eventDate);
            setEventDate(date.toISOString().split('T')[0]);
            setTimeValue(date.toTimeString().slice(0, 5));
          }
          return true;
        }
        localStorage.removeItem(EVENT_INFO_CACHE_KEY);
      }
      return false;
    };

    // Try to load from cache first
    const hasCachedData = loadCachedData();

    // If we have new form data and no valid cache, update cache
    if (formData && !hasCachedData) {
      const cacheData = {
        data: formData,
        timestamp: Date.now()
      };
      localStorage.setItem(EVENT_INFO_CACHE_KEY, JSON.stringify(cacheData));
      setCachedFormData(formData);
    }
  }, [formData]);

  // Update cache when form data changes
  useEffect(() => {
    if (formData) {
      const cacheData = {
        data: formData,
        timestamp: Date.now()
      };
      localStorage.setItem(EVENT_INFO_CACHE_KEY, JSON.stringify(cacheData));
      setCachedFormData(formData);
    }
  }, [formData]);

  // Handle date and time changes with cache update
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'eventDate') {
      setEventDate(value);
    } else if (name === 'eventTime') {
      setTimeValue(value);
    }

    // Combine date and time for the full eventDate
    const newDate = name === 'eventDate' ? value : eventDate;
    const newTime = name === 'eventTime' ? value : timeValue;
    
    if (newDate && newTime) {
      const newDateTime = `${newDate}T${newTime}`;
      handleChange({
        target: {
          name: 'eventDate',
          value: newDateTime
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleRegistrationPeriodChange = (field: 'startDate' | 'endDate', value: string) => {
    handleChange({
      name: 'registrationPeriod',
      value: {
        ...cachedFormData.registrationPeriod,
        [field]: value
      },
      type: 'registrationPeriod'
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Khusus untuk aboutImage dan titleImage, pastikan formatnya PNG
    if (field === 'aboutImage' || field === 'titleImage') {
      if (file.type !== 'image/png') {
        alert(`${field === 'titleImage' ? 'Gambar judul' : 'Logo'} harus dalam format PNG!`);
        e.target.value = '';
        return;
      }

      try {
        const url = await uploadFile(file, `images/${field}/${Date.now()}_${file.name}`);
        handleChange({ 
          target: { 
            name: field, 
            value: url 
          } 
        } as React.ChangeEvent<HTMLInputElement>);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Gagal mengupload file. Silakan coba lagi.');
      }
    } else {
      // Untuk file lain gunakan handleFileUpload yang ada
      await handleFileUpload(e, field);
    }
  };

  const handleTitleTypeChange = (type: 'text' | 'image') => {
    handleChange({
      target: {
        name: 'titleType',
        value: type
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Use cached form data with fallback to prop
  const displayData = cachedFormData || formData;

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Informasi Acara</h1>
          <p className="text-gray-600 mt-1">Kelola informasi dan konten utama FLASH</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 px-4 py-2 rounded-lg flex items-center gap-3">
            <div className="p-1.5 bg-indigo-100 rounded-md">
              <Globe className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-medium">Status Web</p>
              <p className="text-lg font-semibold text-indigo-700 leading-none">Aktif</p>
            </div>
          </div>
          <div className="bg-indigo-50 px-4 py-2 rounded-lg flex items-center gap-3">
            <div className="p-1.5 bg-indigo-100 rounded-md">
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-medium">Konten</p>
              <p className="text-lg font-semibold text-indigo-700 leading-none">2 Bagian</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Informasi Dasar</h2>
            
            {/* Title Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Acara
              </label>
              
              {/* Title Type Selector */}
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleTitleTypeChange('text')}
                  className={classNames(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    displayData.titleType === 'text' 
                      ? 'bg-emerald-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Teks
                </button>
                <button
                  type="button"
                  onClick={() => handleTitleTypeChange('image')}
                  className={classNames(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    displayData.titleType === 'image' 
                      ? 'bg-emerald-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Gambar
                </button>
              </div>

              {/* Text Title Input */}
              {displayData.titleType === 'text' && (
                <input
                  type="text"
                  name="title"
                  value={displayData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Masukkan judul acara"
                />
              )}

              {/* Image Title Upload */}
              {displayData.titleType === 'image' && (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'titleImage')}
                    className="hidden"
                    id="titleImage"
                  />
                  {displayData.titleImage ? (
                    <div className="relative group rounded-xl overflow-hidden">
                      <div className="w-full h-[100px] bg-gray-100">
                        <img 
                          src={displayData.titleImage} 
                          alt="Title"
                          className="w-full h-full object-contain p-4"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <div className="flex gap-3">
                          <label
                            htmlFor="titleImage"
                            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            Ubah Gambar
                          </label>
                          <button
                            onClick={() => handleChange({ 
                              target: { name: 'titleImage', value: '' }
                            } as React.ChangeEvent<HTMLInputElement>)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="titleImage"
                      className="flex flex-col items-center justify-center w-full h-[100px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
                    >
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Upload gambar judul (PNG dengan background transparan)
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Acara
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    name="eventDate"
                    value={eventDate}
                    onChange={handleDateTimeChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu Acara
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="time"
                    name="eventTime"
                    value={timeValue}
                    onChange={handleDateTimeChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* About Flash */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tentang FLASH
              </label>
              <textarea
                name="aboutFlash"
                value={displayData.aboutFlash}
                onChange={handleChange}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Deskripsikan acara FLASH"
              />
            </div>

            {/* Periode Pendaftaran */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Periode Pendaftaran</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date & Time */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Mulai Pendaftaran
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="date"
                        name="registrationPeriod.startDate"
                        value={displayData.registrationPeriod?.startDate?.split('T')[0] || ''}
                        onChange={(e) => {
                          const currentTime = displayData.registrationPeriod?.startDate?.split('T')[1] || '00:00';
                          handleRegistrationPeriodChange('startDate', `${e.target.value}T${currentTime}`);
                        }}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Mulai Pendaftaran
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="time"
                        name="registrationPeriod.startTime"
                        value={displayData.registrationPeriod?.startDate?.split('T')[1] || '00:00'}
                        onChange={(e) => {
                          const currentDate = displayData.registrationPeriod?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0];
                          handleRegistrationPeriodChange('startDate', `${currentDate}T${e.target.value}`);
                        }}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* End Date & Time */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Akhir Pendaftaran
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="date"
                        name="registrationPeriod.endDate"
                        value={displayData.registrationPeriod?.endDate?.split('T')[0] || ''}
                        onChange={(e) => {
                          const currentTime = displayData.registrationPeriod?.endDate?.split('T')[1] || '23:59';
                          handleRegistrationPeriodChange('endDate', `${e.target.value}T${currentTime}`);
                        }}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Akhir Pendaftaran
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="time"
                        name="registrationPeriod.endTime"
                        value={displayData.registrationPeriod?.endDate?.split('T')[1] || '23:59'}
                        onChange={(e) => {
                          const currentDate = displayData.registrationPeriod?.endDate?.split('T')[0] || new Date().toISOString().split('T')[0];
                          handleRegistrationPeriodChange('endDate', `${currentDate}T${e.target.value}`);
                        }}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Media</h2>
            
            {/* Image Upload Grid - 2 Kolom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'heroImage', label: 'Gambar Utama', accept: 'image/*' },
                { id: 'heroVideo', label: 'Video Utama (Desktop)', accept: 'video/*' },
                { id: 'heroVideoMobile', label: 'Video Utama (Mobile)', accept: 'video/*' },
                { id: 'aboutImage', label: 'Logo FLASH (PNG)', accept: 'image/png' }
              ].map((upload) => (
                <div key={upload.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {upload.label}
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept={upload.accept}
                      onChange={(e) => handleImageUpload(e, upload.id)}
                      className="hidden"
                      id={upload.id}
                    />
                    {displayData[upload.id as keyof FlashEvent] ? (
                      <div className="relative group rounded-xl overflow-hidden">
                        {upload.id === 'heroVideo' || upload.id === 'heroVideoMobile' ? (
                          <video 
                            src={displayData[upload.id]} 
                            className="w-full h-[200px] object-cover"
                            controls
                          />
                        ) : (
                          <div className={classNames(
                            "w-full h-[200px]",
                            upload.id === 'aboutImage' ? "bg-gray-100" : ""
                          )}>
                            <img 
                              src={displayData[upload.id as keyof FlashEvent] as string} 
                              alt={upload.label}
                              className={classNames(
                                "w-full h-full",
                                upload.id === 'aboutImage' ? "object-contain p-4" : "object-cover"
                              )}
                            />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <div className="flex gap-3">
                            <label
                              htmlFor={upload.id}
                              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              Ubah {upload.id === 'heroVideo' ? 'Video' : 'Gambar'}
                            </label>
                            <button
                              onClick={() => handleChange({ 
                                target: { name: upload.id, value: '' }
                              } as React.ChangeEvent<HTMLInputElement>)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor={upload.id}
                        className="flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
                      >
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                            <Upload className="w-6 h-6 text-indigo-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            Klik untuk mengunggah {upload.id === 'heroVideo' ? 'video' : 'gambar'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {upload.id === 'aboutImage' 
                              ? 'Format PNG dengan background transparan'
                              : upload.id === 'heroVideo' 
                                ? 'MP4, WebM (maks. 3MB)' 
                                : 'PNG, JPG atau JPEG (maks. 1MB)'}
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tambahkan Footer dengan Tombol Simpan */}
          <div className="flex justify-end pt-6 mt-8 border-t">
            <button
              type="button"
              onClick={() => handleChange({ 
                name: 'saveBasicInfo', 
                value: true 
              })}
              className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-emerald-700 
                       transition-colors duration-200 flex items-center gap-2"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfoManager;