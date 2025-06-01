import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const ClockInDashboard = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [attendanceData, setAttendanceData] = useState([
    { project: "US Marines", date: "Fri, 10 March 2023", shift: "General", clockIn: "--:--", clockOut: "--:--" },
    { project: "Russian Army", date: "Thu, 09 March 2023", shift: "General", clockIn: "09:00", clockOut: "19:30" },
    { project: "US Marines", date: "Wed, 08 March 2023", shift: "General", clockIn: "09:12", clockOut: "18:30" },
    { project: "Cyber Division", date: "Tue, 07 March 2023", shift: "General", clockIn: "09:10", clockOut: "18:30" },
  ]);
  const photoURL = '';
  const fullName = "Astalakshmi"
  const designation = "Project Leader"
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = ""; 
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generateAvatarUrl = (name) => {
    const firstLetter = name.charAt(0);
    const backgroundColor = getRandomColor();
    const imageSize = 130;
    return `https://ui-avatars.com/api/?background=${backgroundColor}&size=${imageSize}&color=FFF&font-size=0.60&name=${firstLetter}`;
  };

  useEffect(() => {
    let timer;
    if (isClockedIn && startTime) {
      timer = setInterval(() => {
        const now = dayjs();
        const diff = now.diff(startTime, 'second');
        setElapsedTime(diff);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isClockedIn, startTime]);


  const handleClockIn = () => {
    const time = dayjs();

    if (!isClockedIn) {
      setStartTime(time);
      setIsClockedIn(true);
      setElapsedTime(0);
      setEndTime(null);
      setAttendanceData([
        {
          project: selectedProject,
          date: currentTime.format("ddd, DD MMMM YYYY"),
          shift: selectedShift,
          clockIn: time.format("HH:mm:ss"),
          clockOut: "--:--:--",
        },
        ...attendanceData,
      ]);
    } else {
      setEndTime(time);
      setIsClockedIn(false);
      setStartTime(null);
      setElapsedTime(null);
      const updatedData = [...attendanceData];
      const latestEntry = { ...updatedData[0] };
      latestEntry.clockOut = time.format("HH:mm:ss");
      updatedData[0] = latestEntry;

      setAttendanceData(updatedData);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-white rounded shadow-sm p-4">
          <h2 className="text-blue-500 font-bold">Hi {fullName} !</h2>
          <p className="text-xs text-gray-500">Please check your attendance...</p>
          <div className="flex items-center mt-3">
            <img
              src={photoURL ? photoURL : generateAvatarUrl(fullName)}
              alt="UserImage"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h6 className="font-semibold">{fullName}</h6>
              <p className="text-sm text-gray-600 mb-0">{designation}</p>
            </div>
          </div>
          <button className="mt-4 w-full border-1 border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors">
            View Profile
          </button>
        </div>

        <div className="bg-white rounded shadow-sm p-4 md:col-span-2">
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-700">Attendance</h4>
              <div className="flex gap-2">
                <select
                  name="Select Shift"
                  id="shift"
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                >
                  <option value="">Select Shift</option>
                  <option value="Shift-1">Shift 1</option>
                  <option value="General">General</option>
                  <option value="Shift-2">Shift 2</option>
                </select>
                <select
                  name="Select Project"
                  id="project"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                >
                  <option value="">Select project</option>
                  <option value="Russian Army">Russian Army</option>
                  <option value="US Marines">US Marines</option>
                  <option value="Cyber Division">Cyber Division</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between my-2">
              <div>
                <p className="text-xs text-gray-400">Start Time</p>
                <p className="text-lg">
                  {startTime ? startTime.add(elapsedTime, 'second').format("HH:mm:ss") : "--:--:--"}
                </p>
                <p className="text-sm text-gray-600">{currentTime.format("dddd, DD MMMM YYYY")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">End Time</p>
                <p className="text-lg">{endTime ? endTime.format("HH:mm:ss") : "--:--:--"}</p>
              </div>
            </div>
            <button
              onClick={handleClockIn}
              className="w-full border-1 border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-500 hover:text-white transition-transform"
            >
              {isClockedIn ? "Punch Out" : "Punch In"}
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded shadow-sm mt-2 p-4">
        <h5 className="text-gray-700 font-semibold mb-4">Recent Attendance</h5>
        <div className="overflow-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Project</th>
                <th className="p-2">Date</th>
                <th className="p-2">Shift</th>
                <th className="p-2">Punch In</th>
                <th className="p-2">Punch Out</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{record.project}</td>
                  <td className="p-2">{record.date}</td>
                  <td className="p-2">{record.shift}</td>
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
