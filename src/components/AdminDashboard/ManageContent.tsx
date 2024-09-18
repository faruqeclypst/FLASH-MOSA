import React, { useState, useEffect } from 'react';
import { useFirebase } from '../../hooks/useFirebase';
import { FlashEvent, Activity, Competition } from '../../types';
import EventInfoManager from './EventInfoManager';
import ActivitiesManager from './ActivitiesManager';
import CompetitionsManager from './CompetitionsManager';
import GalleryManager from './GalleryManager';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebase';
import { Tab } from '@headlessui/react';

const ManageContent: React.FC = () => {
  const { data: flashEvent, updateData } = useFirebase<FlashEvent>('flashEvent');
  const [formData, setFormData] = useState<FlashEvent>({
    title: '',
    heroImage: '',
    aboutFlash: '',
    activities: [],
    competitions: [],
    gallery: []
  });

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
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
        console.error("Error uploading image: ", error);
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
      activities: [...prev.activities, { name: '', description: '', image: '' }]
    }));
  };

  const handleRemoveActivity = (index: number) => {
    const updatedActivities = formData.activities.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, activities: updatedActivities }));
  };

  const handleCompetitionChange = (index: number, field: keyof Competition, value: string) => {
    const updatedCompetitions = [...formData.competitions];
    updatedCompetitions[index] = { ...updatedCompetitions[index], [field]: value };
    setFormData(prev => ({ ...prev, competitions: updatedCompetitions }));
  };

  const handleAddCompetition = () => {
    setFormData(prev => ({
      ...prev,
      competitions: [...prev.competitions, { name: '', description: '', rules: [], icon: '' }]
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

  const handleRemoveGalleryImage = (index: number) => {
    const updatedGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, gallery: updatedGallery }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateData(formData);
      alert('Content updated successfully!');
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Failed to update content. Please try again.');
    }
  };

  if (!flashEvent) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Manage Content</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl mb-8">
            {['Event Info', 'Activities', 'Competitions', 'Gallery'].map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  `w-full py-2.5 text-sm font-medium leading-5 text-blue-700 rounded-lg
                  focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60
                  ${
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  }`
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel className="bg-white rounded-xl p-6 shadow-md">
              <EventInfoManager 
                formData={formData} 
                handleChange={handleChange} 
                handleImageUpload={handleImageUpload}
              />
            </Tab.Panel>
            <Tab.Panel className="bg-white rounded-xl p-6 shadow-md">
              <ActivitiesManager
                activities={formData.activities}
                handleActivityChange={handleActivityChange}
                handleAddActivity={handleAddActivity}
                handleRemoveActivity={handleRemoveActivity}
                handleImageUpload={handleImageUpload}
              />
            </Tab.Panel>
            <Tab.Panel className="bg-white rounded-xl p-6 shadow-md">
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
            </Tab.Panel>
            <Tab.Panel className="bg-white rounded-xl p-6 shadow-md">
              <GalleryManager 
                gallery={formData.gallery}
                handleImageUpload={handleImageUpload}
                handleRemoveGalleryImage={handleRemoveGalleryImage}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-semibold shadow-lg"
          >
            Update Content
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageContent;