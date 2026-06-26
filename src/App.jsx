import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./components/layout/Home";
import DetectionPage from "./components/layout/DetectionPage";

export default function App() {
  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col justify-between"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detect" element={<DetectionPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}