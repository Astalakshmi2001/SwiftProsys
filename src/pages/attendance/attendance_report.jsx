import React, { useEffect, useState } from "react";
import useAttendance from "../../hooks/useAttendance";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import * as XLSX from "xlsx";
import { db } from "../../firebaseConfig";
import { addDoc, collection, doc, updateDoc, getDocs } from "firebase/firestore";

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function AttendanceDashboard() {
  const { getAllAttendance } = useAttendance();
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [searchQuery, setSearchQuery] = useState("");
  const [showManualPanel, setShowManualPanel] = useState(false);
  const [showAdjustmentPanel, setShowAdjustmentPanel] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [manualForm, setManualForm] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    date: dayjs().format("YYYY-MM-DD"),
    clockIn: "09:00",
    clockOut: "17:00",
    remarks: "",
  });
  const [adjustmentForm, setAdjustmentForm] = useState({
    clockIn: "",
    clockOut: "",
    remarks: "",
  });
  const [reportType, setReportType] = useState("daily");

  // Dashboard stats
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    onTime: 0,
    inProgress: 0,
    total: 0
  });

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "employees"));
        const employeesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const prepareAttendanceData = (rawData) => {
    const employeeMap = new Map();
    
    // First create a map of all employees with default absent status
    employees.forEach(employee => {
      const key = `${employee.employeeId}-${selectedDate}`;
      employeeMap.set(key, {
        id: '',
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        date: selectedDate,
        shift: employee.shift || 'general',
        remarks: '',
        tracker: [],
        isManual: false,
        isAdjusted: false,
        firstClockIn: null,
        lastClockOut: null,
        totalHours: "--:--:--",
        status: "Absent",
        statusClass: "bg-red-100 text-red-800",
        present: "Absent",
        presentClass: "bg-red-100 text-red-800",
        autoPunchOut: false
      });
    });

    // Process actual attendance data
    rawData.forEach(item => {
      const key = `${item.employeeId}-${item.date}`;
      const existingEntry = employeeMap.get(key) || {
        id: item.id,
        employeeId: item.employeeId,
        firstName: item.firstName,
        lastName: item.lastName,
        date: item.date,
        shift: item.shift || 'general',
        remarks: item.remarks || '',
        tracker: [],
        isManual: item.isManual || false,
        isAdjusted: item.isAdjusted || false,
        firstClockIn: null,
        lastClockOut: null,
        totalHours: "--:--:--",
        status: "Absent",
        statusClass: "bg-red-100 text-red-800",
        present: "Absent",
        presentClass: "bg-red-100 text-red-800",
        autoPunchOut: false
      };

      // Merge tracker data
      existingEntry.tracker = [...existingEntry.tracker, ...(item.tracker || [])];
      existingEntry.isManual = existingEntry.isManual || item.isManual;
      existingEntry.isAdjusted = existingEntry.isAdjusted || item.isAdjusted;
      existingEntry.remarks = existingEntry.remarks || item.remarks;

      employeeMap.set(key, existingEntry);
    });

    return Array.from(employeeMap.values());
  };

  const calculateStats = (data) => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      onTime: 0,
      inProgress: 0,
      total: employees.length
    };

    data.forEach(item => {
      if (item.present === "Present") stats.present++;
      if (item.present === "Absent") stats.absent++;
      if (item.status === "Late") stats.late++;
      if (item.status === "On Time") stats.onTime++;
      if (item.present === "In Progress") stats.inProgress++;
    });

    return stats;
  };

  const processAttendanceData = (rawData) => {
    const groupedData = prepareAttendanceData(rawData);
    
    const processedData = groupedData.map((item) => {
      if (item.tracker.length > 0) {
        // Sort tracker entries by time
        const sortedTracker = item.tracker.sort((a, b) => {
          const timeA = a.clockIn || a.clockOut || "00:00:00";
          const timeB = b.clockIn || b.clockOut || "00:00:00";
          return timeA.localeCompare(timeB);
        });

        let firstClockIn = null;
        let lastClockOut = null;
        let totalMs = 0;

        // Process each punch to calculate hours
        sortedTracker.forEach(punch => {
          if (punch.clockIn && !firstClockIn) {
            firstClockIn = punch.clockIn;
          }
          if (punch.clockOut) {
            lastClockOut = punch.clockOut;
          }

          // Calculate duration if both in and out exist
          if (punch.clockIn && punch.clockOut) {
            const inTime = dayjs(`${item.date} ${punch.clockIn}`);
            const outTime = dayjs(`${item.date} ${punch.clockOut}`);
            if (inTime.isValid() && outTime.isValid()) {
              totalMs += outTime.diff(inTime);
            }
          }
        });

        // Format total hours
        const totalDuration = dayjs.duration(totalMs);
        const totalHours = totalMs > 0 
          ? `${String(totalDuration.hours()).padStart(2, '0')}:${String(totalDuration.minutes()).padStart(2, '0')}:${String(totalDuration.seconds()).padStart(2, '0')}`
          : "--:--:--";

        // Determine status
        let status = "Absent";
        let statusClass = "bg-red-100 text-red-800";
        let present = "Absent";
        let presentClass = "bg-red-100 text-red-800";

        if (firstClockIn) {
          present = lastClockOut ? "Present" : "In Progress";
          presentClass = lastClockOut ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";

          // Check if late based on shift
          const shiftStartTimes = {
            general: "09:00",
            "shift-1": "06:00",
            "shift-2": "14:00"
          };
          
          const gracePeriod = 15; // minutes
          const shiftStart = shiftStartTimes[item.shift] || "09:00";
          const clockInTime = dayjs(`${item.date} ${firstClockIn}`);
          const expectedStart = dayjs(`${item.date} ${shiftStart}`);
          
          if (clockInTime.isAfter(expectedStart.add(gracePeriod, 'minute'))) {
            status = "Late";
            statusClass = "bg-red-100 text-red-800";
          } else {
            status = "On Time";
            statusClass = "bg-blue-100 text-blue-800";
          }
        }

        // Auto punch-out if still working past shift end
        let autoPunchOut = false;
        if (firstClockIn && !lastClockOut) {
          const shiftEndTimes = {
            general: "17:00",
            "shift-1": "14:00",
            "shift-2": "22:00"
          };
          const shiftEnd = shiftEndTimes[item.shift] || "17:00";
          const currentTime = dayjs();
          const shiftEndTime = dayjs(`${item.date} ${shiftEnd}`);
          
          if (currentTime.isAfter(shiftEndTime)) {
            lastClockOut = shiftEnd;
            autoPunchOut = true;
            // Recalculate total hours with auto punch-out
            const outTime = dayjs(`${item.date} ${lastClockOut}`);
            const inTime = dayjs(`${item.date} ${firstClockIn}`);
            totalMs = outTime.diff(inTime);
            present = "Present";
            presentClass = "bg-green-100 text-green-800";
          }
        }

        return {
          ...item,
          firstClockIn,
          lastClockOut,
          totalHours,
          status,
          statusClass,
          present,
          presentClass,
          autoPunchOut,
          tracker: sortedTracker
        };
      }

      return item;
    });

    // Filter to only show records for selected date
    const filteredByDate = processedData.filter(item => 
      item.date === selectedDate
    );

    setStats(calculateStats(filteredByDate));
    return filteredByDate;
  };

  const fetchData = async () => {
    try {
      const records = await getAllAttendance();
      const enriched = processAttendanceData(records);
      setAttendanceData(enriched);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate, reportType, employees]);

  const filteredData = attendanceData.filter((item) => {
    const matchesSearch = searchQuery
      ? item.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      alert("No data found for selected date!");
      return;
    }

    const sheetData = filteredData.map((item) => ({
      Date: item.date,
      EmployeeID: item.employeeId,
      "First Name": item.firstName,
      "Last Name": item.lastName,
      Shift: item.shift,
      Status: item.status,
      "Clock In": item.firstClockIn || "--:--:--",
      "Clock Out": item.lastClockOut || "--:--:--",
      "Total Hours": item.totalHours,
      Attendance: item.present,
      Remarks: item.remarks || "",
      "Auto PunchOut": item.autoPunchOut ? "Yes" : "No",
      Adjusted: item.isAdjusted ? "Yes" : "No",
      Manual: item.isManual ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const fileName = `Attendance_${reportType}_${selectedDate || "All"}_${dayjs().format('YYYY-MM-DD_HH-mm')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleSaveManual = async () => {
    try {
      const { employeeId, firstName, lastName, date, clockIn, clockOut, remarks } = manualForm;
      if (!employeeId || !firstName || !date || !clockIn || !clockOut) {
        return alert("All fields are required!");
      }

      const docRef = await addDoc(collection(db, "attendance"), {
        employeeId,
        firstName,
        lastName,
        date,
        shift: "manual",
        tracker: [{ clockIn, clockOut }],
        remarks,
        isManual: true,
        adjustedBy: "admin",
        adjustedAt: new Date().toISOString(),
      });

      const inTime = dayjs(`2000-01-01T${clockIn}`);
      const outTime = dayjs(`2000-01-01T${clockOut}`);
      const totalMs = outTime.diff(inTime);
      const totalHours = dayjs.duration(totalMs).format("HH:mm:ss");

      const newEntry = {
        id: docRef.id,
        employeeId,
        firstName,
        lastName,
        date,
        shift: "manual",
        remarks,
        tracker: [{ clockIn, clockOut }],
        isManual: true,
        isAdjusted: false,
        firstClockIn: clockIn,
        lastClockOut: clockOut,
        totalHours,
        status: "Manual Entry",
        statusClass: "bg-purple-100 text-purple-800",
        present: "Present",
        presentClass: "bg-green-100 text-green-800",
        autoPunchOut: false,
      };

      setAttendanceData(prev => [...prev, newEntry]);
      
      alert("Manual record added successfully!");
      setShowManualPanel(false);
      setManualForm({
        employeeId: "",
        firstName: "",
        lastName: "",
        date: dayjs().format("YYYY-MM-DD"),
        clockIn: "09:00",
        clockOut: "17:00",
        remarks: "",
      });
      fetchData();
    } catch (err) {
      console.error("Error saving manual entry:", err);
      alert("Failed to save manual entry. Please try again.");
    }
  };

  const handleSaveAdjustment = async () => {
    try {
      if (!selectedRecord) return;
      
      const { clockIn, clockOut, remarks } = adjustmentForm;
      if (!clockIn && !clockOut) {
        return alert("At least one time adjustment is required!");
      }

      await updateDoc(doc(db, "attendance", selectedRecord.id), {
        tracker: [{ 
          clockIn: clockIn || selectedRecord.firstClockIn, 
          clockOut: clockOut || selectedRecord.lastClockOut,
        }],
        remarks: remarks || selectedRecord.remarks,
        isAdjusted: true,
        adjustedBy: "admin",
        adjustedAt: new Date().toISOString(),
      });

      alert("Attendance record updated successfully!");
      setShowAdjustmentPanel(false);
      setSelectedRecord(null);
      fetchData();
    } catch (err) {
      console.error("Error adjusting attendance:", err);
      alert("Failed to update attendance record. Please try again.");
    }
  };

  const handleEmployeeSelect = (e) => {
    const employeeId = e.target.value;
    const employee = employees.find(emp => emp.employeeId === employeeId);
    setManualForm(prev => ({
      ...prev,
      employeeId,
      firstName: employee?.firstName || "",
      lastName: employee?.lastName || ""
    }));
  };

  return (
    <div className="container-fluid bg-gray-100 px-0 relative z-10">
      <div className="bg-white p-3 rounded">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-sm font-medium text-green-800">Present</h3>
            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            <p className="text-xs text-green-600">{Math.round((stats.present / stats.total) * 100)}% of total</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="text-sm font-medium text-red-800">Absent</h3>
            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            <p className="text-xs text-red-600">{Math.round((stats.absent / stats.total) * 100)}% of total</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800">On Time</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.onTime}</p>
            <p className="text-xs text-blue-600">{stats.present > 0 ? Math.round((stats.onTime / stats.present) * 100) : 0}% of present</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-sm font-medium text-yellow-800">Late</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
            <p className="text-xs text-yellow-600">{stats.present > 0 ? Math.round((stats.late / stats.present) * 100) : 0}% of present</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-sm font-medium text-purple-800">In Progress</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
            <p className="text-xs text-purple-600">{stats.present > 0 ? Math.round((stats.inProgress / stats.present) * 100) : 0}% of present</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            {reportType === 'daily' ? 'Daily' : reportType === 'weekly' ? 'Weekly' : 'Monthly'} 
            Attendance Report - {dayjs(selectedDate).format("DD MMM YYYY")}
          </h1>
          <div className="flex gap-2">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border px-3 py-1 rounded text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border px-3 py-1 rounded text-sm"
            />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-3 py-1 rounded text-sm"
            />
            <button
              onClick={exportToExcel}
              className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
            >
              Export Excel
            </button>
            <button
              onClick={() => setShowManualPanel(true)}
              className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
            >
              Manual Entry
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm border border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Date</th>
                <th className="border px-3 py-2 text-left">Emp ID</th>
                <th className="border px-3 py-2 text-left">Employee Name</th>
                <th className="border px-3 py-2 text-left">Shift</th>
                <th className="border px-3 py-2 text-left">Punch In</th>
                <th className="border px-3 py-2 text-left">Punch Out</th>
                <th className="border px-3 py-2 text-left">Total Hours</th>
                <th className="border px-3 py-2 text-left">Status</th>
                <th className="border px-3 py-2 text-left">Attendance</th>
                <th className="border px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, i) => (
                <tr key={`${item.employeeId}-${item.date}-${i}`} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{dayjs(item.date).format("DD-MM-YYYY")}</td>
                  <td className="border px-3 py-2">{item.employeeId}</td>
                  <td className="border px-3 py-2">
                    {item.firstName} {item.lastName}
                  </td>
                  <td className="border px-3 py-2 capitalize">{item.shift}</td>
                  <td className="border px-3 py-2">
                    {item.firstClockIn || "--:--:--"}
                    {item.isManual && <span className="text-xs text-gray-500 ml-1">(M)</span>}
                  </td>
                  <td className="border px-3 py-2">
                    {item.lastClockOut || "--:--:--"}
                    {item.autoPunchOut && <span className="text-xs text-gray-500 ml-1">(A)</span>}
                  </td>
                  <td className="border px-3 py-2">{item.totalHours}</td>
                  <td className="border px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.statusClass}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="border px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.presentClass}`}>
                      {item.present}
                    </span>
                  </td>
                  <td className="border px-3 py-2">
                    <button
                      onClick={() => {
                        setSelectedRecord(item);
                        setAdjustmentForm({
                          clockIn: item.firstClockIn || '',
                          clockOut: item.lastClockOut || '',
                          remarks: item.remarks || '',
                        });
                        setShowAdjustmentPanel(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Panel */}
      {showManualPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-5 rounded shadow-md w-96">
            <h2 className="text-lg font-semibold mb-2">Manual Time Entry</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Employee</label>
              <select
                value={manualForm.employeeId}
                onChange={handleEmployeeSelect}
                className="border w-full p-2 rounded"
                required
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.employeeId}>
                    {employee.firstName} {employee.lastName} ({employee.employeeId})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={manualForm.date}
                onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                className="border w-full p-2 rounded"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">Clock In</label>
                <input
                  type="time"
                  value={manualForm.clockIn}
                  onChange={(e) => setManualForm({ ...manualForm, clockIn: e.target.value })}
                  className="border w-full p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Clock Out</label>
                <input
                  type="time"
                  value={manualForm.clockOut}
                  onChange={(e) => setManualForm({ ...manualForm, clockOut: e.target.value })}
                  className="border w-full p-2 rounded"
                  required
                />
              </div>
            </div>
            <textarea
              placeholder="Remarks (optional)"
              value={manualForm.remarks}
              onChange={(e) => setManualForm({ ...manualForm, remarks: e.target.value })}
              className="border w-full p-2 mb-3 rounded"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSaveManual}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowManualPanel(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjustment Panel */}
      {showAdjustmentPanel && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-5 rounded shadow-md w-96">
            <h2 className="text-lg font-semibold mb-2">Adjust Attendance Record</h2>
            <p className="text-sm mb-4">
              Editing record for <strong>{selectedRecord.firstName} {selectedRecord.lastName}</strong> ({selectedRecord.date})
            </p>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Clock In</label>
              <input
                type="time"
                value={adjustmentForm.clockIn}
                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, clockIn: e.target.value })}
                className="border w-full p-2 rounded"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Clock Out</label>
              <input
                type="time"
                value={adjustmentForm.clockOut}
                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, clockOut: e.target.value })}
                className="border w-full p-2 rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <select
                value={adjustmentForm.remarks}
                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, remarks: e.target.value })}
                className="border w-full p-2 rounded"
              >
                <option value="">Select reason...</option>
                <option value="Forgot to punch">Forgot to punch</option>
                <option value="Half day">Half day</option>
                <option value="On leave">On leave</option>
                <option value="System error">System error</option>
                <option value="Manual adjustment">Manual adjustment</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSaveAdjustment}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowAdjustmentPanel(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}