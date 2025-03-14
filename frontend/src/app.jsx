import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import About from "./about";
import Home from "./home";
import Login from "./login";
import Navbar from "./components/Navbar";
import Signup from "./signup";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Router>
    );
}

export default App;
