import { useCallback } from "react";

const API_BASE_URL = "http://localhost:3000/api";

const useAttendance = () => {
  const storeAttendance = useCallback(async (attendanceData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceData),
      });

      let result;
      try {
        result = await res.json();
      } catch (parseErr) {
        // JSON parsing failed
        throw new Error("Server response is not valid JSON");
      }

      if (!res.ok) {
        throw new Error(result.message || "Failed to store attendance");
      }

      return result;
    } catch (error) {
      console.error("storeAttendance error:", error);
      throw error;
    }
  }, []);

  const getAllAttendance = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance`);
      if (!res.ok) throw new Error("Failed to fetch all attendance");
      return await res.json();
    } catch (error) {
      console.error("getAllAttendance error:", error);
      throw error;
    }
  }, []);

  const getEmployeeAttendance = useCallback(async (employeeId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/${employeeId}`);
      if (!res.ok) throw new Error("Failed to fetch employee attendance");
      return await res.json();
    } catch (error) {
      console.error("getEmployeeAttendance error:", error);
      throw error;
    }
  }, []);

  return {
    storeAttendance,
    getAllAttendance,
    getEmployeeAttendance,
  };
};

export default useAttendance;