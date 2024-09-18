import { useState, useEffect } from 'react';
import { ref, onValue, set, push } from 'firebase/database';
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

  return { data, loading, error, updateData, pushData };
};