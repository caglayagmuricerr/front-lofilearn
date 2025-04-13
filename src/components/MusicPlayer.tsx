import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
} from "lucide-react";

const songs = [
  {
    title: "Good Night Lofi",
    artist: "FASSounds",
    url: "/assets/music/good-night-lofi-cozy-chill-music-160166.mp3",
  },
  {
    title: "Dreaming Through Dusk",
    artist: "RibhavAgrawal",
    url: "/assets/music/dreaming-through-dusk-lofi-beats-281206.mp3",
  },
  {
    title: "Chill Lofi",
    artist: "SoulProdMusic",
    url: "/assets/music/chill-lofi-160893.mp3",
  },
  {
    title: "Coverless Book Lofi",
    artist: "AmbientAUDIOVISION",
    url: "/assets/music/coverless-book-lofi-186307.mp3",
  },
  {
    title: "Cafe Crumble",
    artist: "snoozybeats",
    url: "/assets/music/cafe-crumble-lofi-beat-309578.mp3",
  },
  {
    title: "Lullaby for Strangers",
    artist: "RibhavAgrawal",
    url: "/assets/music/lullaby-for-strangers-lofi-beats-281208.mp3",
  },
];

const songsArr = Object.values(songs);

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [repeatOne, setRepeatOne] = useState(false);
  const [progress, setProgress] = useState(0);
  const [autoplayMessage, setAutoplayMessage] = useState("");
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeSliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentSongIndex].url;
      audioRef.current.play();
    }
  }, [currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setAutoplayMessage("Click play to start lofi music 🎵");
        });

      audioRef.current.addEventListener("ended", handleSongEnd);
      audioRef.current.addEventListener("timeupdate", updateProgress);
      audioRef.current.addEventListener("loadedmetadata", updateDuration);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleSongEnd);
        audioRef.current.removeEventListener("timeupdate", updateProgress);
        audioRef.current.removeEventListener("loadedmetadata", updateDuration);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        volumeSliderRef.current &&
        !volumeSliderRef.current.contains(event.target as Node)
      ) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          setAutoplayMessage("Click play to start lofi music 🎵");
        });
      }
      setIsPlaying(!isPlaying);
      setAutoplayMessage("");
    }
  };

  const playNext = () => {
    if (repeatOne) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songsArr.length);
    }
    setAutoplayMessage("");
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (repeatOne) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      setCurrentSongIndex(
        (prevIndex) => (prevIndex - 1 + songsArr.length) % songsArr.length
      );
    }
    setIsPlaying(true);
    setAutoplayMessage("");
  };

  const handleSongEnd = () => {
    if (repeatOne) {
      audioRef.current?.play();
    } else {
      playNext();
    }
  };

  const toggleRepeat = () => {
    setRepeatOne(!repeatOne);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const progressPercent = (currentTime / duration) * 100;
      setProgress(progressPercent);

      // update the CSS variable for the progress fill
      document.documentElement.style.setProperty(
        "--progress",
        `${progressPercent}%`
      );

      setCurrentTime(formatTime(currentTime));
    }
  };

  const updateDuration = () => {
    if (audioRef.current) {
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(event.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime =
        (newProgress / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-xl p-3 rounded-2xl flex flex-col items-center gap-2 z-50 w-[300px] sm:w-[500px]">
      <audio
        ref={audioRef}
        src={songsArr[currentSongIndex].url}
        loop={repeatOne}
      />

      {autoplayMessage && (
        <div className="absolute -top-8 text-sm text-green-500 bg-gray-100 px-2 py-1 rounded-lg">
          {autoplayMessage}
        </div>
      )}

      {/* Progress Bar */}
      <input
        type="range"
        min="0"
        max="98"
        value={progress}
        onChange={handleProgressChange}
        className="progressbar-style w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
      />
      {isMobile ? (
        // *******************
        // ** Mobile Layout **
        // *******************
        <div className="flex flex-col items-center gap-2">
          <div className="text-center">
            <span className="text-sm font-medium text-gray-200">
              {songs[currentSongIndex].title}
            </span>
            <span className="text-xs text-gray-300 block">
              {songs[currentSongIndex].artist}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleRepeat}
              className={`p-2 mr-2 rounded-full text-white ${
                repeatOne
                  ? "bg-chestnut-500 hover:bg-chestnut-400"
                  : "bg-chestnut-400 hover:bg-chestnut-500"
              }`}
            >
              <Repeat size={16} />
            </button>
            <button
              onClick={playPrevious}
              className="p-2 rounded-full bg-green-400 hover:bg-green-500"
            >
              <SkipBack size={16} />
            </button>
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-chestnut-400 hover:bg-chestnut-500"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={playNext}
              className="p-2 rounded-full bg-green-400 hover:bg-green-500"
            >
              <SkipForward size={16} />
            </button>
            <button onClick={toggleVolumeSlider} className="relative ml-2 ">
              {volume === 0 ? (
                <VolumeX size={20} className="text-green-500" />
              ) : (
                <Volume2 size={20} className="text-green-500" />
              )}

              {showVolumeSlider && (
                <div
                  ref={volumeSliderRef}
                  className="absolute left-1/2 transform -translate-x-1/2 top-[-120px] bg-white shadow-lg p-2 rounded-lg"
                  style={{ width: "40px" }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider-vertical"
                    style={{
                      writingMode: "vertical-lr",
                      transform: "rotate(180deg)",
                      width: "100%",
                      height: "80px",
                    }}
                  />
                </div>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button
              onClick={playPrevious}
              className="p-2 rounded-full bg-green-400 hover:bg-green-500"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-chestnut-400 hover:bg-chestnut-500"
            >
              {isPlaying ? <Pause size={26} /> : <Play size={26} />}
            </button>

            <button
              onClick={playNext}
              className="p-2 rounded-full bg-green-400 hover:bg-green-500"
            >
              <SkipForward size={18} />
            </button>

            <span className="text-sm text-white font-mono min-w-[60px] ml-4">
              {currentTime} / {duration}
            </span>
          </div>

          <div className="text-center">
            <span className="text-sm font-medium text-gray-200 truncate block">
              {songs[currentSongIndex].title}
            </span>
            <span className="text-xs text-gray-300 block">
              {songs[currentSongIndex].artist}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full text-white ${
                repeatOne
                  ? "bg-green-500 hover:bg-green-400"
                  : "bg-green-400 hover:bg-green-500"
              }`}
            >
              <Repeat size={20} />
            </button>

            <div className="relative flex items-center gap-2">
              <button onClick={toggleVolumeSlider}>
                {volume === 0 ? (
                  <VolumeX size={20} className="text-green-500" />
                ) : (
                  <Volume2 size={20} className="text-green-500" />
                )}
              </button>

              {showVolumeSlider && (
                <div
                  ref={volumeSliderRef}
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-2 rounded-lg"
                  style={{ width: "40px" }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider-vertical"
                    style={{
                      writingMode: "vertical-lr",
                      transform: "rotate(180deg)",
                      width: "100%",
                      height: "80px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
