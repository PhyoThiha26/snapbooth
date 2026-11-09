
import { useRef, useState, useEffect } from "react";
import {
  Camera,
  CameraOff,
  RefreshCw,
  RotateCcw,
  Download
} from "lucide-react";
import "./CameraStudio.css";


const STRIP_THEMES = {
  classic: {
    name: "Classic",
    background: "#FFFFFF",
    text: "#51434E",
    accent: "#E9DCE3"
  },
  blush: {
    name: "Blush",
    background: "#F5E1E5",
    text: "#805B69",
    accent: "#E8C3CE"
  },
  lavender: {
    name: "Lavender",
    background: "#EAE5F4",
    text: "#665B80",
    accent: "#D2C6E8"
  }
};


// Combine multiple photos into one vertical strip
async function createPhotoStrip(photos, theme, decorations) {
  const images = await Promise.all(
    photos.map((src) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
    })
  );

  

const width = Math.max(...images.map((image) => image.width));
const padding = 40;
const gap = 30;
const headerHeight = 110;
const footerHeight = 150;

const heights = images.map(
  (image) => (image.height / image.width) * width
);

const height =
  padding * 2 +
  headerHeight +
  heights.reduce((total, item) => total + item, 0) +
  gap * (images.length - 1) +
  footerHeight;

const canvas = document.createElement("canvas");
canvas.width = width + padding * 2;
canvas.height = height;

const context = canvas.getContext("2d");

// Background
context.fillStyle = theme.background;
context.fillRect(0, 0, canvas.width, canvas.height);

// Header
context.textAlign = "center";
context.fillStyle = theme.text;
context.font = "bold 28px Arial";
context.fillText("SNAPBOOTH", canvas.width / 2, 65);

// Decorative sticker
if (decorations.sticker) {
  context.font = "32px Arial";
  context.fillText(decorations.sticker, canvas.width / 2, 100);
}

// Photos and frames
let y = padding + headerHeight;

images.forEach((image, index) => {
  const photoHeight = heights[index];

  context.drawImage(
    image,
    padding,
    y,
    width,
    photoHeight
  );

  const frameColor = FRAME_STYLES[decorations.frameStyle].color;

  if (frameColor) {
    context.strokeStyle = frameColor;
    context.lineWidth = 8;
    context.strokeRect(
      padding + 4,
      y + 4,
      width - 8,
      photoHeight - 8
    );
  }

  y += photoHeight + gap;
});

// Footer
context.fillStyle = theme.text;
context.textAlign = "center";
context.font = "italic 22px Arial";

context.fillText(
  decorations.caption || "A little moment to remember",
  canvas.width / 2,
  y + 35
);

context.font = "15px Arial";
context.fillText(
  "A LITTLE MOMENT TO KEEP",
  canvas.width / 2,
  y + 75
);

context.font = "13px Arial";
context.fillText(
  new Date().toLocaleDateString(),
  canvas.width / 2,
  y + 105
);

return canvas.toDataURL("image/png");

}


const PHOTO_FILTERS = {
  original: {
    name: "Original",
    css: "none"
  },
  soft: {
    name: "Soft",
    css: "saturate(0.85) sepia(0.12)"
  },
  vintage: {
    name: "Vintage",
    css: "sepia(0.35) saturate(0.8)"
  },
  mono: {
    name: "B&W",
    css: "grayscale(1)"
  }
};


const STICKERS = [
  { name: "None", value: "" },
  { name: "Heart", value: "♡" },
  { name: "Sparkle", value: "✦" },
  { name: "Star", value: "★" },
  { name: "Flower", value: "✿" },
  { name: "Love", value: "♥" }
];

const FRAME_STYLES = {
  none: {
    name: "No Frame",
    color: null
  },
  white: {
    name: "White",
    color: "#FFFFFF"
  },
  pink: {
    name: "Pink",
    color: "#D9A8B9"
  },
  lavender: {
    name: "Lavender",
    color: "#B9A9D5"
  }
};


function CameraStudio() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [error, setError] = useState("");

  const [photoCount, setPhotoCount] = useState(3);
  const [photos, setPhotos] = useState([]);
  const [currentShot, setCurrentShot] = useState(1);
  const [countdown, setCountdown] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("classic");
  const [selectedFilter, setSelectedFilter] = useState("original");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [selectedSticker, setSelectedSticker] = useState("♡");
const [frameStyle, setFrameStyle] = useState("white");
const [caption, setCaption] = useState("A little moment to remember");

  // Attach the camera stream after the video element appears
  useEffect(() => {
    if (isCameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOn]);

  const startCamera = async (mode = facingMode) => {
    try {
      setError("");

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      setIsCameraOn(true);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access your camera. Please check camera permissions.");
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsCameraOn(false);
    setCapturedImage(null);
    setPhotos([]);
    setCountdown(null);
    setCurrentShot(1);
  };

  const switchCamera = async () => {
    const newMode = facingMode === "user" ? "environment" : "user";

    setFacingMode(newMode);
    setCapturedImage(null);
    setPhotos([]);
    setCountdown(null);
    setCurrentShot(1);

    await startCamera(newMode);
  };

  const takePhoto = () => {
    if (!isCameraOn || countdown !== null || capturedImage) return;

    setPhotos([]);
    setCurrentShot(1);
    setCountdown(3);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setPhotos([]);
    setCurrentShot(1);
    setCountdown(null);
  };

  // Countdown and automatic photo capture
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((value) => value - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(async () => {
      const video = videoRef.current;

      if (!video || !video.videoWidth) {
        setError("Camera is not ready. Please try again.");
        setCountdown(null);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");

      context.filter = `
        ${PHOTO_FILTERS[selectedFilter].css}
        brightness(${brightness}%)
        contrast(${contrast}%)
        `;

      if (facingMode === "user") {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const photo = canvas.toDataURL("image/png");
      const updatedPhotos = [...photos, photo];

      setPhotos(updatedPhotos);

      if (updatedPhotos.length >= photoCount) {
        try {
          const strip = await createPhotoStrip(
            updatedPhotos,
            STRIP_THEMES[selectedTheme],
            {
                sticker: selectedSticker,
                frameStyle: frameStyle,
                caption: caption
            }
            );
          setCapturedImage(strip);
        } catch (err) {
          console.error("Strip creation error:", err);
          setError("Unable to create your photo strip.");
        }

        setCountdown(null);
      } else {
        setCurrentShot(updatedPhotos.length + 1);
        setCountdown(3);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [
  countdown,
  photos,
  photoCount,
  facingMode,
  selectedTheme,
  selectedFilter,
  brightness,
  contrast,
  selectedSticker,
  frameStyle,
  caption
]);

  // Stop the camera when leaving this component
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <section className="camera-studio">
      <div className="camera-heading">
        <span>YOUR PERSONAL PHOTO STUDIO</span>
        <h2>Let's take a picture.</h2>
        <p>Get ready, find your angle, and capture your moments.</p>
      </div>

      <div className="photo-count-selector">
        <label htmlFor="photo-count">Number of photos</label>

        <select
          id="photo-count"
          value={photoCount}
          onChange={(event) => setPhotoCount(Number(event.target.value))}
          disabled={countdown !== null || Boolean(capturedImage)}
        >
          <option value={2}>2 Shots</option>
          <option value={3}>3 Shots</option>
          <option value={4}>4 Shots</option>
        </select>
      </div>


    <div className="theme-selector">
    <label>Choose your photo strip theme</label>

    <div className="theme-options">
        {Object.entries(STRIP_THEMES).map(([key, theme]) => (
        <button
            key={key}
            className={`theme-option ${
            selectedTheme === key ? "active" : ""
            }`}
            onClick={() => setSelectedTheme(key)}
            disabled={countdown !== null || Boolean(capturedImage)}
        >
            <span
            className="theme-swatch"
            style={{ backgroundColor: theme.background }}
            />

            {theme.name}
        </button>
        ))}
    </div>
    </div>

    <div className="editing-controls">
  <div className="filter-section">
    <h3>Choose your filter</h3>

    <div className="filter-options">
      {Object.entries(PHOTO_FILTERS).map(([key, filter]) => (
        <button
          key={key}
          className={`filter-option ${
            selectedFilter === key ? "active" : ""
          }`}
          onClick={() => setSelectedFilter(key)}
          disabled={countdown !== null || Boolean(capturedImage)}
        >
          <span
            className={`filter-preview filter-${key}`}
          />
          {filter.name}
        </button>
      ))}
    </div>
  </div>

  <div className="adjustment-section">
    <div className="adjustment-control">
      <label htmlFor="brightness">
        Brightness <span>{brightness}%</span>
      </label>

      <input
        id="brightness"
        type="range"
        min="70"
        max="130"
        value={brightness}
        disabled={countdown !== null || Boolean(capturedImage)}
        onChange={(event) =>
          setBrightness(Number(event.target.value))
        }
      />
    </div>

    <div className="adjustment-control">
      <label htmlFor="contrast">
        Contrast <span>{contrast}%</span>
      </label>

      <input
        id="contrast"
        type="range"
        min="70"
        max="130"
        value={contrast}
        disabled={countdown !== null || Boolean(capturedImage)}
        onChange={(event) =>
          setContrast(Number(event.target.value))
        }
      />
    </div>

    <button
      className="reset-editing-btn"
      onClick={() => {
        setSelectedFilter("original");
        setBrightness(100);
        setContrast(100);
      }}
      disabled={countdown !== null || Boolean(capturedImage)}
    >
      Reset adjustments
    </button>
  </div>
</div>


<div className="decoration-controls">

  <h3>Decorate your photo strip</h3>

  {/* Sticker selection */}
  <div className="decoration-group">
    <label>Choose a sticker</label>

    <div className="sticker-options">
      {STICKERS.map((sticker) => (
        <button
          key={sticker.name}
          className={
            selectedSticker === sticker.value ? "active" : ""
          }
          onClick={() => setSelectedSticker(sticker.value)}
          disabled={countdown !== null || Boolean(capturedImage)}
        >
          {sticker.value || "None"}
        </button>
      ))}
    </div>
  </div>

  {/* Frame selection */}
  <div className="decoration-group">
    <label>Photo frame</label>

    <div className="frame-options">
      {Object.entries(FRAME_STYLES).map(([key, frame]) => (
        <button
          key={key}
          className={frameStyle === key ? "active" : ""}
          onClick={() => setFrameStyle(key)}
          disabled={countdown !== null || Boolean(capturedImage)}
        >
          {frame.name}
        </button>
      ))}
    </div>
  </div>

  {/* Custom caption */}
  <div className="decoration-group">
    <label htmlFor="photo-caption">Your caption</label>

    <input
      id="photo-caption"
      type="text"
      maxLength={40}
      value={caption}
      placeholder="Write something special..."
      onChange={(event) => setCaption(event.target.value)}
      disabled={countdown !== null || Boolean(capturedImage)}
    />

    <small>{caption.length}/40 characters</small>
  </div>

</div>



      <div className="camera-preview">
        {isCameraOn && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
            style={{
                filter: `
                ${PHOTO_FILTERS[selectedFilter].css}
                brightness(${brightness}%)
                contrast(${contrast}%)
                `
            }}
            />
        )}

        {capturedImage && (
          <img
            src={capturedImage}
            alt="Your finished photo strip"
            className="captured-photo"
          />
        )}

        {!isCameraOn && !capturedImage && (
          <div className="camera-placeholder">
            <Camera size={48} />
            <h3>Your camera is waiting</h3>
            <p>Turn on your camera to start your photo session.</p>
          </div>
        )}

        {countdown !== null && (
          <div className="countdown-overlay">
            {countdown > 0 ? countdown : "Smile!"}
          </div>
        )}
      </div>

      {countdown !== null && (
        <p className="shot-progress">
          Photo {currentShot} of {photoCount}
        </p>
      )}

      {capturedImage && (
        <p className="shot-progress">
          Your {photoCount}-photo strip is ready!
        </p>
      )}

      {error && <p className="camera-error">{error}</p>}

      <div className="camera-controls">
        {!isCameraOn ? (
          <button onClick={() => startCamera()}>
            <Camera size={18} />
            Start Camera
          </button>
        ) : capturedImage ? (
          <>
            <button onClick={retakePhoto}>
              <RotateCcw size={18} />
              Retake Session
            </button>

            <a
              href={capturedImage}
              download="snapbooth-strip.png"
              className="download-photo-btn"
            >
              <Download size={18} />
              Download Strip
            </a>
          </>
        ) : (
          <>
            <button
              onClick={switchCamera}
              className="secondary-camera-btn"
              disabled={countdown !== null}
            >
              <RefreshCw size={18} />
              Switch Camera
            </button>

            <button
              onClick={takePhoto}
              disabled={countdown !== null}
            >
              <Camera size={18} />
              Start Photo Session
            </button>

            <button onClick={stopCamera}>
              <CameraOff size={18} />
              Turn Off
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default CameraStudio;
