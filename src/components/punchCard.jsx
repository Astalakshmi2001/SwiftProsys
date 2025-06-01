// @ts-nocheck
import React, { useState, useEffect } from 'react';

function PunchCard() {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workingHours, setWorkingHours] = useState('00:00:00');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isPunchedIn && punchInTime) {
      const interval = setInterval(() => {
        const diff = new Date() - new Date(punchInTime);
        const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        setWorkingHours(`${hours}:${minutes}:${seconds}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPunchedIn, punchInTime]);

  const handlePunchIn = () => {
    setIsPunchedIn(true);
    const now = new Date();
    setPunchInTime(now);
    setPunchOutTime(null);
  };

  const handlePunchOut = () => {
    setIsPunchedIn(false);
    setPunchOutTime(new Date());
  };

  const formatTime = (date) => date ? new Date(date).toLocaleTimeString('en-GB') : '--:--:--';

  return (
    <div className="card shadow-lg border-0 h-100" style={{ borderRadius: '20px' }}>
      <div className="card-header text-white py-4" style={{
        background: 'linear-gradient(to right, #00c6ff, #0072ff)',
        borderRadius: '20px 20px 0 0'
      }}>
        <h5 className="card-title mb-0 fw-bold fs-4 text-center">
          ⏰ Time Tracker
        </h5>
      </div>

      <div className="card-body p-5">
        {/* Status Badge */}
        <div className="text-center mb-4">
          <span className={`badge px-4 py-2 fs-6 fw-bold ${isPunchedIn ? 'bg-success' : 'bg-secondary'}`} style={{
            borderRadius: '30px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            {isPunchedIn ? '🟢 Checked In' : '🔴 Checked Out'}
          </span>
        </div>

        {/* Working Hours */}
        <div className="text-center mb-5">
          <div className="p-4 bg-dark text-white rounded-4">
            <small className="d-block mb-2 text-uppercase">Working Hours</small>
            <div className="h1 mb-0 fw-bold font-monospace">{workingHours}</div>
          </div>
        </div>

        {/* Punch Times */}
        <div className="row mb-4">
          <div className="col-6">
            <div className="p-3 bg-light border border-success-subtle rounded text-center">
              <div className="text-success mb-2 fs-4">📥</div>
              <div className="small fw-semibold text-muted">Punch In</div>
              <div className="fw-bold fs-5 text-success">{formatTime(punchInTime)}</div>
            </div>
          </div>
          <div className="col-6">
            <div className="p-3 bg-light border border-danger-subtle rounded text-center">
              <div className="text-danger mb-2 fs-4">📤</div>
              <div className="small fw-semibold text-muted">Punch Out</div>
              <div className="fw-bold fs-5 text-danger">{punchOutTime ? formatTime(punchOutTime) : '--:--:--'}</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="d-grid mb-4">
          <button
            onClick={isPunchedIn ? handlePunchOut : handlePunchIn}
            className="btn btn-lg fw-bold text-white"
            style={{
              background: isPunchedIn
                ? 'linear-gradient(to right, #ff758c, #ff7eb3)'
                : 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
              borderRadius: '15px',
              letterSpacing: '1px',
              transition: '0.3s ease'
            }}
          >
            {isPunchedIn ? '📤 Punch Out' : '📥 Punch In'}
          </button>
        </div>

        {/* Current Time */}
        <div className="text-center">
          <div className="p-3 bg-body-tertiary rounded">
            <small className="text-muted fw-semibold">
              🕒 Current Time: {currentTime.toLocaleTimeString('en-GB')}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PunchCard;
