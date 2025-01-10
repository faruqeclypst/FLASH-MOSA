import React, { useState } from 'react';
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

interface EventInfoManagerProps {
  formData: FlashEvent;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | 
    { name: string; value: any; type?: string }
  ) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, field: string) => Promise<void>;
}

const EventInfoManager: React.FC<EventInfoManagerProps> = ({ formData, handleChange, handleFileUpload }) => {
  const [eventDate, eventTime] = formData.eventDate ? formData.eventDate.split('T') : ['', ''];
  const timeValue = eventTime ? eventTime.slice(0, 5) : '';

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'eventDate') {
      const newDateTime = `${value}T${timeValue || '00:00'}`;
      handleChange({ 
        name: 'eventDate', 
        value: newDateTime,
        type: 'datetime' 
      });
    } else if (name === 'eventTime') {
      const newDateTime = `${eventDate || new Date().toISOString().split('T')[0]}T${value}`;
      handleChange({ 
        name: 'eventDate', 
        value: newDateTime,
        type: 'datetime' 
      });
    }
  };

  const handleRegistrationPeriodChange = (field: 'startDate' | 'endDate', value: string) => {
    handleChange({
      name: 'registrationPeriod',
      value: {
        ...formData.registrationPeriod,
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
      name: 'titleType', 
      value: type 
    });
  };

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
                    formData.titleType === 'text' 
                      ? 'bg-indigo-500 text-white'
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
                    formData.titleType === 'image' 
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Gambar
                </button>
              </div>

              {/* Text Title Input */}
              {formData.titleType === 'text' && (
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Masukkan judul acara"
                />
              )}

              {/* Image Title Upload */}
              {formData.titleType === 'image' && (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'titleImage')}
                    className="hidden"
                    id="titleImage"
                  />
                  {formData.titleImage ? (
                    <div className="relative group rounded-xl overflow-hidden">
                      <div className="w-full h-[100px] bg-gray-100">
                        <img 
                          src={formData.titleImage} 
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
                value={formData.aboutFlash}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mulai Pendaftaran
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      name="registrationPeriod.startDate"
                      value={formData.registrationPeriod?.startDate || ''}
                      onChange={(e) => handleRegistrationPeriodChange('startDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Akhir Pendaftaran
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      name="registrationPeriod.endDate"
                      value={formData.registrationPeriod?.endDate || ''}
                      onChange={(e) => handleRegistrationPeriodChange('endDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
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
                    {formData[upload.id as keyof FlashEvent] ? (
                      <div className="relative group rounded-xl overflow-hidden">
                        {upload.id === 'heroVideo' || upload.id === 'heroVideoMobile' ? (
                          <video 
                            src={formData[upload.id]} 
                            className="w-full h-[200px] object-cover"
                            controls
                          />
                        ) : (
                          <div className={classNames(
                            "w-full h-[200px]",
                            upload.id === 'aboutImage' ? "bg-gray-100" : ""
                          )}>
                            <img 
                              src={formData[upload.id as keyof FlashEvent] as string} 
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
                                ? 'MP4, WebM (maks. 100MB)' 
                                : 'PNG, JPG atau JPEG (maks. 10MB)'}
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
              className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-blue-700 
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