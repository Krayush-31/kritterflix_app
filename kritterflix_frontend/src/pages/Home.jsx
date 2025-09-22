import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Carousel from "../component/Carousel";
import Loader from "../component/Loader";
import BackgroundImage from "../component/BackgroundImage";
import BgImg from "../assets/logo.jpg";

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    navigate(`/show/${item.id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [popRes, topRes] = await Promise.all([
          API.get("/tv/popular?language=en-US&page=1"),
          API.get("/tv/top_rated?language=en-US&page=1"),
        ]);

        setPopular(popRes.data.results || []);
        setTopRated(topRes.data.results || []);
        setFavorites((popRes.data.results || []).slice(0, 5));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch shows.Come soon to enjoy the best content.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <BackgroundImage imageUrl={BgImg}>
      <div className="pt-20 sm:pt-28 px-3 sm:px-6 lg:px-8 relative z-10 text-white">
        <Loader show={loading} size={60} color="#fff" />

        {!loading && error && (
          <p className="text-center text-red-500 mt-10">{error}</p>
        )}

        {!loading && !error && (
          <div className="space-y-8 sm:space-y-16">
            {favorites.length > 0 && (
              <section>
                <h2 className="text-lg sm:text-2xl font-bold mb-3 px-3 py-1 rounded-md w-fit bg-black/50 whitespace-nowrap">
                  My Personal Favorite's
                </h2>
                <Carousel items={favorites} onItemClick={handleItemClick} />
              </section>
            )}

            {popular.length > 0 && (
              <section>
                <h2 className="text-lg sm:text-2xl font-bold mb-3 px-3 py-1 rounded-md w-fit bg-black/50 whitespace-nowrap">
                  Popular Shows
                </h2>
                <Carousel items={popular} onItemClick={handleItemClick} />
              </section>
            )}

            {topRated.length > 0 && (
              <section>
                <h2 className="text-lg sm:text-2xl font-bold mb-3 px-3 py-1 rounded-md w-fit bg-black/50 text-yellow-400 whitespace-nowrap">
                  Top Rated Shows
                </h2>
                <Carousel items={topRated} onItemClick={handleItemClick} />
              </section>
            )}
          </div>
        )}
      </div>
    </BackgroundImage>
  );
}
