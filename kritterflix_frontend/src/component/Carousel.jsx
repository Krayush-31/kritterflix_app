import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from "react-icons/fa";

const Carousel = ({ items, onItemClick, onToggleFavorite, isFavorite }) => {
  const scrollRef = useRef(null);
  const [clickedHeart, setClickedHeart] = useState(null); // track heart click for animation

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -clientWidth : clientWidth,
        behavior: "smooth",
      });
    }
  };

  const handleHeartClick = (item) => {
    setClickedHeart(item.id);
    onToggleFavorite(item);

    // reset the animation after 300ms
    setTimeout(() => setClickedHeart(null), 300);
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full hidden md:flex items-center justify-center"
      >
        <FaChevronLeft />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full hidden md:flex items-center justify-center"
      >
        <FaChevronRight />
      </button>

      {/* Scrollable Items */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto py-4 px-2 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {items.map((item) => {
          const favorited = isFavorite(item.id);
          const isAnimating = clickedHeart === item.id;

          return (
            <div
              key={item.id}
              className="flex-shrink-0 relative group cursor-pointer w-32 sm:w-40 md:w-48 lg:w-52 snap-start"
            >
              {/* Poster Image */}
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={item.name || item.title}
                className="w-full h-48 sm:h-60 md:h-72 lg:h-80 object-cover rounded-lg shadow-md transition-transform duration-300 transform group-hover:scale-105"
                onClick={() => onItemClick && onItemClick(item)}
              />

              {/* Heart Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleHeartClick(item);
                }}
                className={`
                  absolute top-2 right-2 drop-shadow-md 
                  text-2xl transition-transform duration-200
                  ${favorited ? "text-red-500" : "text-white"}
                  ${isAnimating ? "scale-150" : "scale-100"}
                `}
              >
                {favorited ? <FaHeart /> : <FaRegHeart />}
              </button>

              {/* Overlay Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                <h3 className="text-white text-xs sm:text-sm md:text-base font-semibold line-clamp-2">
                  {item.name || item.title}
                </h3>
                <p className="text-yellow-400 text-xs mt-0.5">
                  ⭐ {item.vote_average}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
