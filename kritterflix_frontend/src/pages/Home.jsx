import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Carousel from "../component/Carousel";
import Loader from "../component/Loader";
import BackgroundImage from "../component/BackgroundImage";
import BgImg from "../assets/logo.jpg";
import FeaturedBanner from "../component/featuredBanner";

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

  // Initialize favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        const parsedFavorites = JSON.parse(stored);
        // Ensure it's an array before setting state
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      } catch (error) {
        console.error("Error parsing favorites from localStorage", error);
      }
    }
  }, []);  // This effect runs only once on mount

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);  // Only run when `favorites` state changes

  // Toggle favorite add/remove
  const handleToggleFavorite = (item) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === item.id);
      if (exists) {
        // If already in favorites, remove it
        return prev.filter((fav) => fav.id !== item.id);
      } else {
        // Add item to favorites
        return [...prev, item];
      }
    });
  };

  // Check if a show is in favorites
  const isFavorite = (id) => {
    return favorites.some((fav) => fav.id === id);
  };

  // Fetch popular and top rated shows
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
      } catch (err) {
        console.error(err);
        setError("Failed to fetch shows. Come soon to enjoy the best content.");
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

        {!loading && !error && (
          <div className="space-y-8 sm:space-y-16">
            {/* Netflix-style featured banner */}
            <FeaturedBanner 
              shows={popular} 
              
            />

            {/* Personal Favorites Carousel */}
            {favorites.length > 0 && (
              <section>
                <h2 className="text-lg sm:text-2xl font-bold mb-3 px-3 py-1 rounded-md w-fit bg-black/50 whitespace-nowrap">
                  My Personal Favorite's
                </h2>
                <Carousel 
                  items={favorites} 
                  onItemClick={handleItemClick} 
                  onToggleFavorite={handleToggleFavorite} 
                  isFavorite={isFavorite}
                />
              </section>
            )}

            {/* Popular Shows Carousel */}
            {popular.length > 0 && (
              <section>
                <h2 className="text-lg sm:text-2xl font-bold mb-3 px-3 py-1 rounded-md w-fit bg-black/50 whitespace-nowrap">
                  Popular Shows
                </h2>
                <Carousel 
                  items={popular} 
                  onItemClick={handleItemClick} 
                  onToggleFavorite={handleToggleFavorite} 
                  isFavorite={isFavorite}
                />
              </section>
            )}

            {/* Top Rated Shows Carousel */}
            {topRated.length > 0 && (
              <section>
                <h2 className="text-lg sm:text-2xl font-bold mb-3 px-3 py-1 rounded-md w-fit bg-black/50 text-yellow-400 whitespace-nowrap">
                  Top Rated Shows
                </h2>
                <Carousel 
                  items={topRated} 
                  onItemClick={handleItemClick} 
                  onToggleFavorite={handleToggleFavorite} 
                  isFavorite={isFavorite}
                />
              </section>
            )}
          </div>
        )}
      </div>
    </BackgroundImage>
  );
}
