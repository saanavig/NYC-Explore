import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Login from "./login";
import Signup from "./signup";

function App() {
return (
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    </Router>
);
}

export default App;
