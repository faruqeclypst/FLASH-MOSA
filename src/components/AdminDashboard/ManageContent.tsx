// ManageContent.tsx

import React, { useState, useEffect } from 'react';
import { useFirebase } from '../../hooks/useFirebase';
import { FlashEvent, Activity, Competition } from '../../types';
import EventInfoManager from './EventInfoManager';
import CompetitionsManager from './CompetitionsManager';
import GalleryManager from './GalleryManager';
import ConfirmUpdateModal from './ConfirmUpdateModal';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import classNames from 'classnames';
import { showAlert } from '../ui/Alert';
import { compressImage } from '../../utils/imageCompression';

const ManageContent: React.FC = () => {
  const { data: flashEvent, updateData } = useFirebase<FlashEvent>('flashEvent');
  const [formData, setFormData] = useState<FlashEvent>({
    title: '',
    heroImage: '',
    heroVideo: '',
    aboutFlash: '',
    aboutImage: '',
    activities: [],
    competitions: [],
    gallery: [],
    eventDate: '',
    registrationPeriod: {
      startDate: '',
      endDate: ''
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('eventInfo');

  useEffect(() => {
    if (flashEvent) {
      setFormData(flashEvent);
    }
  }, [flashEvent]);

  const handleIconUpload = async (index: number, file: File) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `competitions/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      const updatedCompetitions = [...formData.competitions];
      updatedCompetitions[index] = { ...updatedCompetitions[index], icon: downloadURL };
      setFormData(prev => ({ ...prev, competitions: updatedCompetitions }));
    } catch (error) {
      console.error("Error uploading icon: ", error);
    }
  };
  
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: any }
  ) => {
    // Jika parameter adalah event
    if ('target' in e) {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    } 
    // Jika parameter adalah object langsung
    else {
      const { name, value } = e;
      
      if (name === 'saveBasicInfo') {
        try {
          await updateData(formData);
          showAlert('success', 'Informasi dasar berhasil disimpan');
        } catch (error) {
          console.error('Error saving basic info:', error);
          showAlert('error', 'Gagal menyimpan informasi dasar');
        }
        return;
      }
      
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files) return;

      const storage = getStorage();
      const uploadPromises = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `flashEvent/gallery/${Date.now()}_${file.name}`);
        uploadPromises.push(
          uploadBytes(storageRef, file).then((snapshot) => getDownloadURL(snapshot.ref))
        );
      }

      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Pastikan gallery adalah array
      const currentGallery = Array.isArray(formData.gallery) ? formData.gallery : [];
      
      // Update data dengan gallery yang baru
      const newData = {
        ...formData,
        gallery: [...currentGallery, ...uploadedUrls]
      };

      await updateData(newData);
      setFormData(newData);
      showAlert('success', 'Foto berhasil diunggah');

    } catch (error) {
      console.error('Error uploading file: ', error);
      showAlert('error', 'Gagal mengunggah foto');
    }
  };

  const handleCompetitionChange = async (index: number, field: keyof Competition | 'competition', value: any) => {
    try {
      const updatedCompetitions = [...formData.competitions];
      if (field === 'competition') {
        // Jika menyimpan seluruh objek competition
        updatedCompetitions[index] = value;
      } else {
        // Jika menyimpan field tertentu
        updatedCompetitions[index] = {
          ...updatedCompetitions[index],
          [field]: value
        };
      }
      
      // Update di state lokal
      setFormData(prev => ({ ...prev, competitions: updatedCompetitions }));
      
      // Update di Firebase
      const updatedEvent = {
        ...formData,
        competitions: updatedCompetitions
      };
      
      await updateData(updatedEvent);
    } catch (error) {
      console.error('Error updating competition:', error);
      throw error;
    }
  };

  const handleAddCompetition = async () => {
    const newCompetition: Competition = {
      name: '',
      description: '',
      rules: [],
      icon: '',
      type: 'single' as const,
      categories: [],
      isActive: true,
      registrationFee: 0,
      teamSize: 2,
      requirePassportPhoto: false,
      documentUrl: '',
      eventDate: '',
      bankAccount: {
        number: '',
        holder: ''
      }
    };

    const newCompetitions = [...formData.competitions, newCompetition];
    
    try {
      // Update local state
      setFormData(prev => ({ ...prev, competitions: newCompetitions }));
      // Save to Firebase
      await updateData({ ...formData, competitions: newCompetitions });
    } catch (error) {
      console.error('Error adding competition:', error);
      showAlert('error', 'Gagal menambahkan kompetisi');
    }
  };

  const handleRemoveCompetition = async (index: number) => {
    const updatedCompetitions = formData.competitions.filter((_, i) => i !== index);
    try {
      // Update local state
      setFormData(prev => ({ ...prev, competitions: updatedCompetitions }));
      // Save to Firebase
      await updateData({ ...formData, competitions: updatedCompetitions });
      showAlert('success', 'Kompetisi berhasil dihapus');
    } catch (error) {
      console.error('Error removing competition:', error);
      showAlert('error', 'Gagal menghapus kompetisi');
    }
  };

  const handleAddRule = (competitionIndex: number) => {
    const updatedCompetitions = [...formData.competitions];
    updatedCompetitions[competitionIndex].rules.push('');
    setFormData(prev => ({ ...prev, competitions: updatedCompetitions }));
  };

  const handleRuleChange = (competitionIndex: number, ruleIndex: number, value: string) => {
    const updatedCompetitions = [...formData.competitions];
    updatedCompetitions[competitionIndex].rules[ruleIndex] = value;
    setFormData(prev => ({ ...prev, competitions: updatedCompetitions }));
  };

  const handleRemoveRule = (competitionIndex: number, ruleIndex: number) => {
    const updatedCompetitions = [...formData.competitions];
    updatedCompetitions[competitionIndex].rules = updatedCompetitions[competitionIndex].rules.filter((_, i) => i !== ruleIndex);
    setFormData(prev => ({ ...prev, competitions: updatedCompetitions }));
  };

  const handleRemoveGalleryImage = async (index: number): Promise<void> => {
    const updatedGallery = formData.gallery.filter((_, i) => i !== index);
    try {
      // Update local state
      setFormData(prev => ({ ...prev, gallery: updatedGallery }));
      // Save to Firebase
      await updateData({ ...formData, gallery: updatedGallery });
      showAlert('success', 'Foto berhasil dihapus');
    } catch (error) {
      console.error('Error removing gallery image:', error);
      showAlert('error', 'Gagal menghapus foto');
    }
  };

  const handleOpenModal = (e: React.FormEvent) => {
    if (selectedSection === 'eventInfo' || selectedSection === 'webImageSetting') {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmUpdate = async () => {
    try {
      await updateData(formData);
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const sections = [
    { id: 'eventInfo', label: 'Info Event' },
    { id: 'competitions', label: 'Kompetisi' },
    { id: 'gallery', label: 'Galeri' }
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'eventInfo':
        return (
          <EventInfoManager 
            formData={formData} 
            handleChange={handleChange} 
            handleFileUpload={handleFileUpload}
          />
        );
      case 'competitions':
        return (
          <div>
            <CompetitionsManager
              competitions={formData.competitions}
              handleCompetitionChange={handleCompetitionChange}
              handleAddCompetition={handleAddCompetition}
              handleRemoveCompetition={handleRemoveCompetition}
              handleAddRule={handleAddRule}
              handleRuleChange={handleRuleChange}
              handleRemoveRule={handleRemoveRule}
              handleIconUpload={handleIconUpload}
            />
          </div>
        );
      case 'gallery':
        return (
          <div>
            <GalleryManager 
              gallery={formData.gallery}
              handleImageUpload={handleFileUpload}
              handleRemoveGalleryImage={handleRemoveGalleryImage}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (!flashEvent) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kelola Konten</h1>
        <p className="text-gray-600 mt-1">Update informasi dan konten FLASH</p>
      </div>
      
      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-nowrap overflow-x-auto -mx-4 px-4 pb-4 md:pb-0 md:mx-0 md:px-0 gap-2 md:gap-4 scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={classNames(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base',
                selectedSection === section.id
                  ? 'bg-green-800 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ManageContent;