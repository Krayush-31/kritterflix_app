import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ShowDetails from "./pages/ShowDetails";
import Search from "./pages/Search";
import Navbar from "./component/Navbar";
import PlayerPage from "./component/PlayerPage";

function App() {
  return (
    <Router>
      <div className="text-white">
        <div className="mb-5">
          <Navbar />
        </div>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/show/:id" element={<ShowDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/player/:id" element={<PlayerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
