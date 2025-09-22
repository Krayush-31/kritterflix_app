import { useState, useEffect } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaArrowLeft } from "react-icons/fa";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      try {
        const res = await API.get("/tv/popular?language=en-US&page=1");
        setPopularShows(res.data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const res = await API.get(`/search/tv?query=${query}`);
          setResults(res.data.results || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const displayedShows = query.length > 2 ? results : popularShows;

  return (
    <div className="pt-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto text-white">
      
      <div className="flex items-center gap-3 mb-6">
        
        <button
          onClick={() => navigate("/")}
          className="p-3 rounded-full bg-black/40 backdrop-blur-md shadow-md hover:bg-black/60 transition"
        >
          <FaArrowLeft className="text-white" />
        </button>

        
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full 
                       bg-black/40 backdrop-blur-md shadow-md
                       text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />
        </div>
      </div>

    
      {loading && (
        <p className="text-center text-white mt-4">
          Recommending the best Content...
        </p>
      )}

     
      <div className="mt-6">
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4 
                     rounded-2xl bg-black/40 backdrop-blur-md shadow-xl"
        >
          {displayedShows.map((show) => (
            <Link
              to={`/show/${show.id}`}
              key={show.id}
              className="hover:scale-105 transition-transform group relative"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={
                    show.poster_path
                      ? `https://image.tmdb.org/t/p/w200${show.poster_path}`
                      : "https://via.placeholder.com/200x300?text=No+Image"
                  }
                  alt={show.name}
                  className="rounded-xl shadow-lg group-hover:brightness-110 transition duration-300"
                />
              </div>
              <p className="text-sm mt-2 text-white text-center truncate">
                {show.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

     
      {!loading && query.length > 2 && displayedShows.length === 0 && (
        <p className="text-center text-gray-400 mt-4">
          No results found for "{query}"
        </p>
      )}
    </div>
  );
}
