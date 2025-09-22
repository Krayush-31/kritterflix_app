import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function FeaturedBanner({ shows = []}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  if (!shows || shows.length === 0) return null;

  const currentShow = shows[currentIndex];

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? shows.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === shows.length - 1 ? 0 : prev + 1));
  };

  

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden rounded-xl mb-8 shadow-lg">
      
      <img
        src={
          currentShow.backdrop_path
            ? `https://image.tmdb.org/t/p/original${currentShow.backdrop_path}`
            : currentShow.poster_path
            ? `https://image.tmdb.org/t/p/w500${currentShow.poster_path}`
            : "https://via.placeholder.com/800x450?text=No+Image"
        }
        alt={currentShow.name || currentShow.title}
        className="w-full h-full object-cover rounded-xl"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 rounded-xl flex flex-col justify-end p-6 md:p-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-4xl font-bold">{currentShow.name || currentShow.title}</h2>

        
        </div>

        <div className="flex items-center gap-4">
          <span className="text-yellow-400 font-semibold">⭐ {currentShow.vote_average}</span>
          <button
            onClick={() => navigate(`/player/${currentShow.id}`)}
            className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            ▶ Play
          </button>
        </div>
      </div>

      {/* Left/Right Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
