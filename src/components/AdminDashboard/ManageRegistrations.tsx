import React from 'react';
import { useFirebase } from '../../hooks/useFirebase';
import { Registration } from '../../types';

const ManageRegistrations: React.FC = () => {
  const { data: registrations, updateData } = useFirebase<Record<string, Registration>>('registrations');

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    if (registrations) {
      await updateData({ [id]: { ...registrations[id], status: newStatus } });
    }
  };

  if (!registrations) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Registrations</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">School</th>
            <th className="p-2 text-left">Competition</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(registrations).map(([id, registration]) => (
            <tr key={id} className="border-b">
              <td className="p-2">{registration.name}</td>
              <td className="p-2">{registration.email}</td>
              <td className="p-2">{registration.school}</td>
              <td className="p-2">{registration.competition}</td>
              <td className="p-2">{registration.status}</td>
              <td className="p-2">
                {registration.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(id, 'approved')}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(id, 'rejected')}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageRegistrations;