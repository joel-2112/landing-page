import React, { useState, useEffect } from "react";
import "./GP.css";

const GuidePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowPopup(true);
    }, 10000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (showPopup && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (showPopup && countdown === 0) {
      handleSkip();
    }
  }, [showPopup, countdown]);

  const handleViewGuide = () => {
    window.open("https://www.youtube.com/@teamworksc", "_blank");
    setShowPopup(false);
  };

  const handleSkip = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="guide-popup-overlay">
      <div className="guide-card-modern">
        {/* Animated Countdown Circle */}
        <div className="countdown-ring">
          <span>{countdown}</span>
        </div>

        <div className="guide-header">
          <h2>እንኳን ደህና መጡ!</h2>
          <p>ስርዓቱን ለመጠቀም ቀላል እንዲሆንልዎ ይህን አጭር መመሪያ ይመልከቱ።</p>
        </div>

        <div className="video-preview-wrapper" onClick={handleViewGuide}>
          <img src="team.png" alt="Video Guide" className="preview-img" />
          <div className="play-overlay">
            <div className="play-icon-pulse">▶</div>
          </div>
        </div>

        <div className="guide-footer-actions">
          <button className="btn-watch" onClick={handleViewGuide}>
             መመሪያውን ይመልከቱ
          </button>
          <button className="btn-skip-text" onClick={handleSkip}>
            አሁን ይለፍ ⏭
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidePopup;