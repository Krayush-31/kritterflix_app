import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "./Loader";
import API from "../api";

export default function PlayerPage() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [videos, setVideos] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const showRes = await API.get(`/tv/${id}?language=en-US`);
        setShow(showRes.data);

        const videoRes = await API.get(`/tv/${id}/videos?language=en-US`);
        setVideos(videoRes.data.results || []);

        const episodeRes = await API.get(`/tv/${id}/season/1?language=en-US`);
        setEpisodes(episodeRes.data.episodes || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <Loader show={true} size={60} color="#fff" />
      </div>
    );
  }
  if (!show) return <p className="text-center text-red-500">Show not found</p>;

  const trailer = videos.find((v) => v.type === "Trailer") || videos[0];

  return (
    <div className="bg-black min-h-screen text-white">
    <div className="absolute top-4 left-4 z-50 mt-[60px]">
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 px-4 py-2 rounded-md bg-black/60 text-white font-semibold hover:bg-black/80 transition-colors shadow-lg"
  >
    <FaArrowLeft />
  </button>
</div>

<div className="relative w-full h-[70vh] bg-black">
  {trailer ? (
    <iframe
      className="w-full h-full relative z-10"
      src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
      title={trailer.name}
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  ) : (
    <div className="flex items-center justify-center h-full">
      <p>No trailer available</p>
    </div>
  )}
</div>


      <div className="px-6 py-6 space-y-4">
        <h1 className="text-3xl font-bold">{show.name}</h1>
        <p className="text-gray-300">{show.overview}</p>
        <p>⭐ {show.vote_average.toFixed(1)} / 10</p>
        <p>📅 First Air Date: {show.first_air_date}</p>
      </div>

      <div className="px-6 py-6">
        <h2 className="text-2xl font-semibold mb-4">Previous Episodes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {episodes
            .filter((ep) => ep.episode_number < 4)
            .map((ep) => (
              <div
                key={ep.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() =>
                  navigate(`/player/${id}?ep=${ep.episode_number}`)
                }
              >
                <h3 className="font-bold">
                  Ep {ep.episode_number}: {ep.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {ep.overview.slice(0, 100)}...
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Next Episodes */}
      <div className="px-6 py-6">
        <h2 className="text-2xl font-semibold mb-4">Next Episodes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {episodes
            .filter((ep) => ep.episode_number > 1) 
            .slice(0, 3)  
            .map((ep) => (
              <div
                key={ep.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() =>
                  navigate(`/player/${id}?ep=${ep.episode_number}`)
                }
              >
                <h3 className="font-bold">
                  Ep {ep.episode_number}: {ep.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {ep.overview.slice(0, 100)}...
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
