import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Check localStorage if needed
          const uid = firebaseUser.uid || localStorage.getItem('uid');
          localStorage.setItem('uid', uid); // ✅ Ensure it's stored

          const q = query(collection(db, 'employees'), where('uid', '==', uid));
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const profile = doc.data();

            console.log("✔️ Firestore user:", profile);

            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...profile });
            setRole(profile.role || 'user');
          } else {
            console.warn("⚠️ No profile found in Firestore for uid:", uid);
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
            setRole('user');
          }

        } catch (err) {
          console.error('Auth Firestore error:', err);
          setAuthError('Failed to load profile data');
          setUser(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, role, loading, authError };
};

export default useAuth;
