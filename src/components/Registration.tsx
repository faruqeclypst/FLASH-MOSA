import React, { useState } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent, Registration } from '../types';

const RegistrationForm: React.FC = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');
  const { pushData } = useFirebase<Registration>('registrations');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    competition: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pushData({ ...formData, status: 'pending' });
      alert('Registration submitted successfully!');
      setFormData({ name: '', email: '', school: '', competition: '' });
    } catch (error) {
      alert('Error submitting registration. Please try again.');
    }
  };

  if (!flashEvent) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Register for a Competition</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="school" className="block mb-2">School</label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="competition" className="block mb-2">Competition</label>
            <select
              id="competition"
              name="competition"
              value={formData.competition}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select a competition</option>
              {flashEvent.competitions.map((competition, index) => (
                <option key={index} value={competition.name}>{competition.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegistrationForm;