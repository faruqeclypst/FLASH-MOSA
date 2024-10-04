import { useState, useEffect } from 'react';
import { ref, onValue, set, push, remove, query, limitToLast, get, orderByChild } from 'firebase/database';
import { db } from '../services/firebase';

export const useFirebase = <T>(path: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const dbRef = ref(db, path);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      setData(snapshot.val());
      setLoading(false);
    }, (error) => {
      setError(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path]);

  const updateData = async (newData: Partial<T>) => {
    try {
      await set(ref(db, path), { ...data, ...newData });
    } catch (error) {
      setError(error as Error);
    }
  };

  const pushData = async (newData: Partial<T>) => {
    try {
      await push(ref(db, path), newData);
    } catch (error) {
      setError(error as Error);
    }
  };

  const deleteData = async (id: string) => {
    try {
      await remove(ref(db, `${path}/${id}`));
    } catch (error) {
      setError(error as Error);
    }
  };

  const getLatestRegistrationCode = async (): Promise<string> => {
    const registrationsRef = ref(db, 'registrations');
    const q = query(registrationsRef, orderByChild('registrationCode'), limitToLast(1));
    
    try {
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const latestRegistration = Object.values(snapshot.val())[0] as { registrationCode: string };
        return latestRegistration.registrationCode;
      }
      return 'FLASH#0000';
    } catch (error) {
      console.error('Error fetching latest registration code:', error);
      return 'FLASH#0000';
    }
  };

  return { data, loading, error, updateData, pushData, deleteData, getLatestRegistrationCode };
};