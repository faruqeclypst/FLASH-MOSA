import React, { useState, useEffect } from 'react';
import { useFirebase } from '../../hooks/useFirebase';
import { Registration } from '../../types';
import { Tab } from '@headlessui/react';

const ManageRegistrations: React.FC = () => {
  const { data: registrations, updateData, deleteData } = useFirebase<Record<string, Registration>>('registrations');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegistrations, setFilteredRegistrations] = useState<[string, Registration][]>([]);

  useEffect(() => {
    if (registrations) {
      const filtered = Object.entries(registrations).filter(([_, registration]) => 
        (filterStatus === 'all' || registration.status === filterStatus) &&
        (registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.competition.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRegistrations(filtered);
    }
  }, [registrations, filterStatus, searchTerm]);

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    if (registrations) {
      await updateData({ [id]: { ...registrations[id], status: newStatus } });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      await deleteData(id);
    }
  };

  if (!registrations) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Manage Registrations</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search registrations..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl mb-8">
          {['All', 'Pending', 'Approved', 'Rejected'].map((category) => (
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
              onClick={() => setFilterStatus(category.toLowerCase() as any)}
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels>
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <Tab.Panel key={status} className="bg-white rounded-xl p-6 shadow-md overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">No</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">School</th>
                    <th className="p-3 text-left">Competition</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations
                    .filter(([_, reg]) => status === 'all' || reg.status === status)
                    .map(([id, registration], index) => (
                    <tr key={id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{registration.name}</td>
                      <td className="p-3">{registration.email}</td>
                      <td className="p-3">{registration.school}</td>
                      <td className="p-3">{registration.competition}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${registration.status === 'approved' ? 'bg-green-200 text-green-800' : 
                            registration.status === 'rejected' ? 'bg-red-200 text-red-800' : 
                            'bg-yellow-200 text-yellow-800'}`}>
                          {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-3">
                        {registration.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(id, 'approved')}
                              className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 transition duration-300"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(id, 'rejected')}
                              className="bg-red-500 text-white px-3 py-1 rounded mr-2 hover:bg-red-600 transition duration-300"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(id)}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition duration-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ManageRegistrations;