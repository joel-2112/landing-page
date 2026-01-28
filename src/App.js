import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing.jsx";
import SignupPage from "./components/pages/SignupPage.jsx";
import GP from "./components/GP.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <GP />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;