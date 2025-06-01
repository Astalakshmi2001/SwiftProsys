import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const ClockInDashboard = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [attendanceData, setAttendanceData] = useState([
    { date: "Fri, 10 March 2023", clockIn: "--:--", clockOut: "--:--" },
    { date: "Thu, 09 March 2023", clockIn: "09:00", clockOut: "19:30" },
    { date: "Wed, 08 March 2023", clockIn: "09:12", clockOut: "18:30" },
    { date: "Tue, 07 March 2023", clockIn: "09:10", clockOut: "18:30" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    if (!isClockedIn) {
      const time = dayjs();
      setStartTime(time);
      setIsClockedIn(true);
    } else {
      const time = dayjs();
      setEndTime(time);
      setIsClockedIn(false);
      setAttendanceData([
        {
          date: currentTime.format("ddd, DD MMMM YYYY"),
          clockIn: startTime.format("HH:mm"),
          clockOut: time.format("HH:mm"),
        },
        ...attendanceData,
      ]);
      setStartTime(null);
      setEndTime(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-blue-600 font-bold">Hi Muhammad!</h2>
          <p className="text-sm text-gray-500">Please check your attendance...</p>
          <div className="flex items-center mt-4">
            <img
              src="https://via.placeholder.com/60"
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="font-semibold">Muhammad Rifky Andrianto</h3>
              <p className="text-sm text-gray-600">UI/UX Designer</p>
            </div>
          </div>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded">
            View Profile
          </button>
          <div className="mt-4">
            <p className="text-lg font-mono text-blue-500">{currentTime.format("HH:mm:ss")}</p>
            <p className="text-sm text-gray-600">{currentTime.format("dddd, DD MMMM YYYY")}</p>
          </div>
        </div>

        {/* Select Project + Clock In */}
        <div className="bg-white rounded shadow p-4 md:col-span-2">
          <h3 className="font-semibold text-gray-700">Select Project</h3>
          <p className="text-sm text-gray-500">
            PT Linov Roket Prestasi
            <br />
            Jl. Menteng Pulo, Menteng Dalam, Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12870
          </p>
          <button className="text-blue-500 text-sm underline mt-1">See Location</button>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-700">Attendance</h4>
            <div className="flex justify-between my-2">
              <div>
                <p className="text-xs text-gray-400">Start Time</p>
                <p className="text-lg">{startTime ? startTime.format("HH:mm") : "--:--"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">End Time</p>
                <p className="text-lg">{endTime ? endTime.format("HH:mm") : "--:--"}</p>
              </div>
            </div>
            <button
              onClick={handleClockIn}
              className="w-full bg-blue-500 text-white py-2 rounded hover:scale-105 transition-transform"
            >
              {isClockedIn ? "Clock Out" : "Clock In"}
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded shadow mt-6 p-4">
        <h3 className="text-gray-700 font-semibold mb-4">Recent Attendance</h3>
        <div className="overflow-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Clock In</th>
                <th className="p-2">Clock Out</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{record.date}</td>
                  <td className="p-2">{record.clockIn}</td>
                  <td className="p-2">{record.clockOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClockInDashboard;
