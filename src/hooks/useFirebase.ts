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
      const newRef = push(ref(db, path));
      await set(newRef, newData);
    } catch (error) {
      setError(error as Error);
    }
  };

  const getKeyFromRegistrationCode = async (registrationCode: string) => {
    const dbRef = ref(db, path);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const key = Object.entries(data).find(
        ([_, value]: [string, any]) => value.registrationCode === registrationCode
      )?.[0];
      return key;
    }
    return null;
  };

  const deleteData = async (id: string) => {
    try {
      const key = await getKeyFromRegistrationCode(id);
      if (!key) {
        throw new Error('Data not found');
      }
      await remove(ref(db, `${path}/${key}`));
      return true;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  };

  const getLatestRegistrationCode = async () => {
    try {
      const registrationsRef = ref(db, 'registrations');
      const registrationsQuery = query(
        registrationsRef,
        orderByChild('registrationDate'),
        limitToLast(1)
      );
      
      const snapshot = await get(registrationsQuery);
      
      if (snapshot.exists()) {
        const registrations = Object.values(snapshot.val()) as { registrationCode: string }[];
        if (registrations.length > 0) {
          const lastCode = registrations[0].registrationCode;
          if (lastCode && lastCode.startsWith('FLASH#')) {
            const currentNumber = parseInt(lastCode.split('#')[1]);
            return lastCode;
          }
        }
      }
      
      return 'FLASH#0001';
    } catch (error) {
      console.error('Error fetching latest registration code:', error);
      return 'FLASH#0001';
    }
  };

  return { data, loading, error, updateData, pushData, deleteData, getLatestRegistrationCode };
};