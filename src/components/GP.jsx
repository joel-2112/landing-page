import React, { useState, useEffect } from "react";
import "./GP.css";

const GuidePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(20);
  // ቪዲዮው መጫወት መጀመሩን ለማወቅ (አማራጭ)
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowPopup(true);
    }, 10000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    // ቪዲዮው መጫወት ከጀመረ ካውንትዳውኑ እንዲቆም ከፈለጉ እዚህ ጋር ማስተካከል ይቻላል
    if (showPopup && countdown > 0 && !isPlaying) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (showPopup && countdown === 0) {
      handleSkip();
    }
  }, [showPopup, countdown, isPlaying]);

  const handleSkip = () => {
    setShowPopup(false);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  if (!showPopup) return null;

  return (
    <div className="guide-popup-overlay">
      <div className="guide-card-modern">
        {/* Animated Countdown Circle */}
        {!isPlaying && (
          <div className="countdown-ring">
            <span>{countdown}</span>
          </div>
        )}

        <div className="guide-header">
          <h2>እንኳን ደህና መጡ!</h2>
          <p>ስርዓቱን ለመጠቀም ቀላል እንዲሆንልዎ ይህን አጭር መመሪያ ይመልከቱ።</p>
        </div>

        {/* ቪዲዮ ማሳያ - ከ Public ፎልደር */}
        <div className="video-preview-wrapper">
          <video 
            className="preview-img" 
            controls 
            autoPlay 
            onPlay={handleVideoPlay}
            poster="team.png" // ቪዲዮው እስኪከፍት የሚታይ ምስል
          >
            <source src="/guide-video.mp4" type="video/mp4" />
            የእርስዎ ብራውዘር ቪዲዮውን መጫወት አልቻለም።
          </video>
        </div>

        <div className="guide-footer-actions">
          <button className="btn-skip-text" onClick={handleSkip}>
            {isPlaying ? "ጨርሻለሁ" : "አሁን ይለፍ ⏭"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidePopup;