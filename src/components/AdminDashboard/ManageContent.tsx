// ManageContent.tsx

import React, { useState, useEffect } from 'react';
import { useFirebase } from '../../hooks/useFirebase';
import { FlashEvent, Activity, Competition } from '../../types';
import EventInfoManager from './EventInfoManager';
import ActivitiesManager from './ActivitiesManager';
import CompetitionsManager from './CompetitionsManager';
import GalleryManager from './GalleryManager';
import ConfirmUpdateModal from './ConfirmUpdateModal';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebase';

const ManageContent: React.FC = () => {
  const { data: flashEvent, updateData } = useFirebase<FlashEvent>('flashEvent');
  const [formData, setFormData] = useState<FlashEvent>({
    title: '',
    heroImage: '',
    heroVideo: '',
    aboutFlash: '',
    activities: [],
    competitions: [],
    gallery: [],
    eventDate: '' 
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
      const storageRef = ref(storage, `competitions/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      const updatedCompetitions = [...formData.competitions];
      updatedCompetitions[index] = { ...updatedCompetitions[index], icon: downloadURL };
      setFormData(prev => ({ ...prev, competitions: updatedCompetitions }));
    } catch (error) {
      console.error("Error uploading icon: ", error);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `flashEvent/${field}/${Date.now()}_${file.name}`);
      
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        if (field === 'activities' && index !== undefined) {
          const updatedActivities = [...formData.activities];
          updatedActivities[index] = { ...updatedActivities[index], image: downloadURL };
          setFormData(prev => ({ ...prev, activities: updatedActivities }));
        } else if (field === 'gallery') {
          setFormData(prev => ({ ...prev, gallery: [...prev.gallery, downloadURL] }));
        } else {
          setFormData(prev => ({ ...prev, [field]: downloadURL }));
        }
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    }
  };

  const handleActivityChange = (index: number, field: keyof Activity, value: string) => {
    const updatedActivities = [...formData.activities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    setFormData(prev => ({ ...prev, activities: updatedActivities }));
  };

  const handleAddActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [
        ...prev.activities,
        { name: '', description: '', image: '' }
      ]
    }));
  };

  const handleRemoveActivity = (index: number) => {
    const updatedActivities = formData.activities.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, activities: updatedActivities }));
  };

  const handleCompetitionChange = (index: number, field: keyof Competition, value: any) => {
    const updatedCompetitions = [...formData.competitions];
    updatedCompetitions[index] = { ...updatedCompetitions[index], [field]: value };
    setFormData(prev => ({ ...prev, competitions: updatedCompetitions }));
  };

  const handleAddCompetition = () => {
    setFormData(prev => ({
      ...prev,
      competitions: [
        ...prev.competitions,
        { name: '', description: '', rules: [], icon: '', type: 'single', categories: [] }
      ]
    }));
  };

  const handleRemoveCompetition = (index: number) => {
    const updatedCompetitions = formData.competitions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, competitions: updatedCompetitions }));
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
    setFormData(prev => ({ ...prev, gallery: updatedGallery }));
    return Promise.resolve(); // Mengembalikan Promise
  };

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
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
    { id: 'activities', label: 'Aktivitas' },
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
      case 'activities':
        return (
          <ActivitiesManager
            activities={formData.activities}
            handleActivityChange={handleActivityChange}
            handleAddActivity={handleAddActivity}
            handleRemoveActivity={handleRemoveActivity}
            handleImageUpload={(e, index) => handleFileUpload(e, 'activities', index)}
          />
        );
      case 'competitions':
        return (
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
        );
      case 'gallery':
        return (
          <GalleryManager 
            gallery={formData.gallery}
            handleImageUpload={(e) => handleFileUpload(e, 'gallery')}
            handleRemoveGalleryImage={handleRemoveGalleryImage}
          />
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Kelola Konten</h1>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-8 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setSelectedSection(section.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${
              selectedSection === section.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <form onSubmit={handleOpenModal} className="space-y-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          {renderContent()}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-semibold shadow-lg"
          >
            Update Content
          </button>
        </div>
      </form>

      <ConfirmUpdateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmUpdate}
      />
    </div>
  );
};

export default ManageContent;