import React, { useState, useEffect } from 'react';
import { useFirebase } from '../../hooks/useFirebase';
import { Registration } from '../../types';
import { Tab } from '@headlessui/react';

const ManageRegistrations: React.FC = () => {
  const { data: registrations, updateData, deleteData } = useFirebase<Record<string, Registration>>('registrations');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegistrations, setFilteredRegistrations] = useState<[string, Registration][]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileUrls, setFileUrls] = useState<{ ktsSuratAktif?: string; buktiPembayaran?: string }>({});

  useEffect(() => {
    if (registrations) {
      const filtered = Object.entries(registrations).filter(([_, registration]) => 
        (filterStatus === 'all' || registration.status === filterStatus) &&
        (registration.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.school?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.competition.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.city.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRegistrations(filtered);
    }
  }, [registrations, filterStatus, searchTerm]);

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    if (registrations) {
      await updateData({ [id]: { ...registrations[id], status: newStatus } });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      await deleteData(id);
    }
  };

  const openModal = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsModalOpen(true);
    setFileUrls({
      ktsSuratAktif: registration.ktsSuratAktif,
      buktiPembayaran: registration.buktiPembayaran,
    });
  };

  const closeModal = () => {
    setSelectedRegistration(null);
    setIsModalOpen(false);
    setFileUrls({});
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
                    <th className="p-3 text-left">School Category</th>
                    <th className="p-3 text-left">School</th>
                    <th className="p-3 text-left">City</th>
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
                      <td className="p-3">{registration.name || registration.registrantName || 'N/A'}</td>
                      <td className="p-3">{registration.email}</td>
                      <td className="p-3">{registration.schoolCategory || 'N/A'}</td>
                      <td className="p-3">{registration.school || 'N/A'}</td>
                      <td className="p-3">{registration.city}</td>
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
                        <button
                          onClick={() => openModal(registration)}
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition duration-300"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleStatusChange(id, 'approved')}
                          className={`${
                            registration.status === 'approved' 
                              ? 'bg-green-300 cursor-not-allowed' 
                              : 'bg-green-500 hover:bg-green-600'
                          } text-white px-3 py-1 rounded mr-2 transition duration-300`}
                          disabled={registration.status === 'approved'}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(id, 'rejected')}
                          className={`${
                            registration.status === 'rejected' 
                              ? 'bg-red-300 cursor-not-allowed' 
                              : 'bg-red-500 hover:bg-red-600'
                          } text-white px-3 py-1 rounded mr-2 transition duration-300`}
                          disabled={registration.status === 'rejected'}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleStatusChange(id, 'pending')}
                          className={`${
                            registration.status === 'pending' 
                              ? 'bg-yellow-300 cursor-not-allowed' 
                              : 'bg-yellow-500 hover:bg-yellow-600'
                          } text-white px-3 py-1 rounded mr-2 transition duration-300`}
                          disabled={registration.status === 'pending'}
                        >
                          Pending
                        </button>
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

      {isModalOpen && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={closeModal}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-2xl font-semibold text-gray-900">Registration Details</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 text-xl font-bold">
                  &times;
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <section>
                    <h4 className="font-semibold text-lg text-gray-700 mb-2">Personal Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedRegistration.name || selectedRegistration.registrantName}</p>
                      <p><span className="font-medium">Email:</span> {selectedRegistration.email}</p>
                      <p><span className="font-medium">WhatsApp:</span> {selectedRegistration.whatsapp}</p>
                      {selectedRegistration.gender && <p><span className="font-medium">Gender:</span> {selectedRegistration.gender}</p>}
                      {selectedRegistration.birthDate && <p><span className="font-medium">Birth Date:</span> {selectedRegistration.birthDate}</p>}
                    </div>
                  </section>
                  
                  <section>
                    <h4 className="font-semibold text-lg text-gray-700 mb-2">Competition Details</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Competition:</span> {selectedRegistration.competition}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold
                          ${selectedRegistration.status === 'approved' ? 'bg-green-200 text-green-800' : 
                            selectedRegistration.status === 'rejected' ? 'bg-red-200 text-red-800' : 
                            'bg-yellow-200 text-yellow-800'}`}>
                          {selectedRegistration.status.charAt(0).toUpperCase() + selectedRegistration.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </section>
                  
                  {selectedRegistration.teamName && (
                    <section>
                      <h4 className="font-semibold text-lg text-gray-700 mb-2">Team Information</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <p><span className="font-medium">Team Name:</span> {selectedRegistration.teamName}</p>
                        {selectedRegistration.teamMembers && (
                          <div>
                            <span className="font-medium">Team Members:</span>
                            <ul className="list-disc list-inside ml-4">
                              {selectedRegistration.teamMembers.map((member, index) => (
                                <li key={index}>{member}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                  
                  {selectedRegistration.schoolCategory && (
                    <section>
                      <h4 className="font-semibold text-lg text-gray-700 mb-2">School Information</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <p><span className="font-medium">School Category:</span> {selectedRegistration.schoolCategory}</p>
                        <p><span className="font-medium">School:</span> {selectedRegistration.school}</p>
                      </div>
                    </section>
                  )}
                  
                  <section>
                    <h4 className="font-semibold text-lg text-gray-700 mb-2">Location</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><span className="font-medium">City:</span> {selectedRegistration.city}</p>
                    </div>
                  </section>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-700 mb-2">Documents</h4>
                  {fileUrls.ktsSuratAktif && (
                    <section className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium mb-2">KTS / Surat Aktif:</p>
                      <a href={fileUrls.ktsSuratAktif} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mb-2 inline-block">
                        Download KTS / Surat Aktif
                      </a>
                      <div className="mt-2 border border-gray-300 rounded-lg overflow-hidden h-44">
                        <iframe
                          src={`${fileUrls.ktsSuratAktif}#toolbar=0`}
                          className="w-full h-full"
                          title="KTS / Surat Aktif"
                        >
                          This browser does not support PDFs. Please download the PDF to view it.
                        </iframe>
                      </div>
                    </section>
                  )}
                  {fileUrls.buktiPembayaran && (
                    <section className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium mb-2">Bukti Pembayaran:</p>
                      <a href={fileUrls.buktiPembayaran} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mb-2 inline-block">
                        Download Bukti Pembayaran
                      </a>
                      <div className="mt-2 border border-gray-300 rounded-lg overflow-hidden h-44">
                        <iframe
                          src={`${fileUrls.buktiPembayaran}#toolbar=0`}
                          className="w-full h-full"
                          title="Bukti Pembayaran"
                        >
                          This browser does not support PDFs. Please download the PDF to view it.
                        </iframe>
                      </div>
                    </section>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRegistrations;