import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import Loader from "../component/Loader";
import { FaArrowLeft, FaHeart, FaRegHeart } from "react-icons/fa";

export default function ShowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === item.id);
      const updated = exists
        ? prev.filter((fav) => fav.id !== item.id)
        : [...prev, item];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  useEffect(() => {
    const fetchShowDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/tv/${id}`);
        setShow(res.data);
        const showSeasons = res.data.seasons || [];
        setSeasons(showSeasons);
        setSelectedSeason(showSeasons?.[0]?.season_number || 1);

        if (showSeasons?.[0]?.season_number) {
          const epRes = await API.get(
            `/tv/${id}/season/${showSeasons[0].season_number}`
          );
          setEpisodes(epRes.data.episodes || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch show details.");
      } finally {
        setLoading(false);
      }
    };
    fetchShowDetails();
  }, [id]);

  useEffect(() => {
    if (!selectedSeason) return;
    const fetchEpisodes = async () => {
      setSeasonLoading(true);
      setError(null);
      try {
        const res = await API.get(`/tv/${id}/season/${selectedSeason}`);
        setEpisodes(res.data.episodes || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch episodes for this season.");
      } finally {
        setSeasonLoading(false);
      }
    };
    fetchEpisodes();
  }, [id, selectedSeason]);

  if (loading || !show) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <Loader show={true} size={60} color="#fff" />
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className=" w-full relative mb-6 rounded-xl overflow-hidden shadow-lg h-[400px]">
        <img
          src={
            show.poster_path
              ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image"
          }
          alt={show.name}
          className=" w-full h-full object-contain rounded-xl"
        />

        
        <button
          onClick={() => toggleFavorite(show)}
          className="absolute top-4 right-4 text-3xl transition-transform duration-200"
        >
          {isFavorite(show.id) ? (
            <FaHeart className="text-red-500 scale-125" />
          ) : (
            <FaRegHeart className="text-white" />
          )}
        </button>

        {/* Overlay with show name and Play button */}
        <div className="absolute bottom-4 left-4 bg-black/50 rounded-md px-4 py-2 flex items-center gap-4">
          <h2 className="text-2xl font-bold">{show.name}</h2>
          <button
            className="bg-white text-black px-4 py-1 rounded-lg font-semibold hover:bg-gray-200 transition"
            onClick={() => navigate(`/player/${id}`)}
          >
            ▶ Play
          </button>
        </div>
      </div>
      {seasons.length > 0 && (
        <div className="mb-6">
          <label className="mr-2 font-semibold">Select Season:</label>
          <select
            className="bg-gray-800 text-white rounded px-3 py-1"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
          >
            {seasons.map((season) => (
              <option key={season.id} value={season.season_number}>
                {season.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {seasonLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader show={true} size={40} color="#fff" />
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {episodes.length === 0 && (
            <p>No episodes available for this season.</p>
          )}
          {episodes.map((ep) => (
            <div
              key={ep.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300 shadow-lg hover:shadow-xl flex gap-4"
            >
              <div className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24">
                <img
                  src={
                    ep.still_path
                      ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                      : "https://via.placeholder.com/300x168?text=No+Image"
                  }
                  alt={ep.name}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Episode {ep.episode_number}
                    </span>
                    <h3 className="text-lg font-semibold">{ep.name}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-1">
                    {ep.air_date && (
                      <span>{new Date(ep.air_date).toLocaleDateString()}</span>
                    )}
                    {ep.runtime && <span>{ep.runtime} min</span>}
                    {ep.vote_average > 0 && (
                      <span>⭐ {ep.vote_average.toFixed(1)}</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 line-clamp-3">
                    {ep.overview || "No description available."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
