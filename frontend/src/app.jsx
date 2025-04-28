import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import About from "./about";
import Home from "./home";
import Navbar from "./components/Navbar";
import Profile from "./profile";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;
