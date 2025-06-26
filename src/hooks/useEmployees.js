// hooks/useEmployees.js
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // adjust path to match your file structure

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'employees'));

        const employeeList = snapshot.docs.map(doc => {
          const data = doc.data();
          const { password, ...safeData } = data; // remove password if present
          return { id: doc.id, ...safeData };
        });

        setEmployees(employeeList);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, loading, error };
};

export default useEmployees;
