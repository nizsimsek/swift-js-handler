import About from "@/pages/about";
import Login from "@/pages/auth/login";
import Home from "@/pages/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "@/pages/auth/register";
import Room from "@/pages/room";

const LiveRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/room" element={<Room />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </Router>
  );
};

export default LiveRouter;
