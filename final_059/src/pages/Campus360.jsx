import { useEffect, useRef, useState } from "react";
import "./Campus360.css";

export default function Campus360() {
  const [appMode, setAppMode] = useState("video");
  const audioRef = useRef(null);

  // Call backend to launch Unity EXE
 const handleDiveIn = () => {
  alert(
    "The complete 360° Unity tour is available only in the desktop demonstration version and is not included in this web deployment due to hosting limitations."
  );
};

  // Stop music when leaving intro screen
  useEffect(() => {
    if (appMode !== "video" && audioRef.current) {
      audioRef.current.pause();
    }
  }, [appMode]);

  return (
    <div className="campus-container">

      {/* VIDEO INTRO */}
      {appMode === "video" && (
        <div className="video-section">

          {/* Background Music */}
          <audio ref={audioRef} autoPlay loop>
            <source src="/Under_the_Banasthali_Sun.mp3" type="audio/mpeg" />
          </audio>

          {/* Background Video */}
          <video className="fullscreen-video" autoPlay muted loop playsInline>
            <source src="/movie.mp4" type="video/mp4" />
          </video>

          {/* Overlay Content */}
          <div className="overlay-content">
            <h1>CampusVerse</h1>
            <p className="subtitle">Virtual Flyover Tour</p>

            <button
              className="dive-in-btn"
              onClick={handleDiveIn}
            >
              DIVE INTO TOUR ➡
            </button>
                
            <div className="tour-note">
  <strong>⚠️ Note:</strong> The complete 360° Unity tour is available only in
  the desktop demonstration version and cannot be viewed in the deployed web
  version due to hosting restrictions.
</div>
          </div>
        </div>
      )}

      {/* LOADING SCREEN */}

    </div>
  );
}