import { useCallback } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // update path as needed

const useAttendance = () => {
  // 🟢 Store attendance
  const storeAttendance = useCallback(async (attendanceData) => {
    try {
      const attendanceWithTimestamp = {
        ...attendanceData,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "attendance"), attendanceWithTimestamp);
      return { id: docRef.id, ...attendanceWithTimestamp };
    } catch (error) {
      console.error("storeAttendance error:", error);
      throw new Error("Failed to store attendance");
    }
  }, []);

  // 📄 Get all attendance
  const getAllAttendance = useCallback(async () => {
    try {
      const snapshot = await getDocs(query(collection(db, "attendance"), orderBy("createdAt", "desc")));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("getAllAttendance error:", error);
      throw new Error("Failed to fetch all attendance");
    }
  }, []);

  // 👤 Get attendance for a specific employee
  const getEmployeeAttendance = useCallback(async (employeeId) => {
    try {
      const q = query(
        collection(db, "attendance"),
        where("employeeId", "==", employeeId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("getEmployeeAttendance error:", error);
      throw new Error("Failed to fetch employee attendance");
    }
  }, []);

  return {
    storeAttendance,
    getAllAttendance,
    getEmployeeAttendance,
  };
};

export default useAttendance;
