import Login from "@/pages/auth/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "@/pages/auth/register";
import Room from "@/pages/room";

const LiveRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/room" element={<Room />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </Router>
  );
};

export default LiveRouter;
