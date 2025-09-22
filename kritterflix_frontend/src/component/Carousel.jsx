import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Carousel = ({ items, onItemClick }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -clientWidth : clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full hidden md:flex items-center justify-center"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full hidden md:flex items-center justify-center"
      >
        <FaChevronRight />
      </button>

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

        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 relative group cursor-pointer w-32 sm:w-40 md:w-48 lg:w-52 snap-start"
            onClick={() => onItemClick && onItemClick(item)}
          >
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={item.name || item.title}
              className="w-full h-48 sm:h-60 md:h-72 lg:h-80 object-cover rounded-lg shadow-md transition-transform duration-300 transform group-hover:scale-105"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
              <h3 className="text-white text-xs sm:text-sm md:text-base font-semibold line-clamp-2">
                {item.name || item.title}
              </h3>
              <p className="text-yellow-400 text-xs mt-0.5">
                ⭐ {item.vote_average}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
