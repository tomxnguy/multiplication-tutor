import { BrowserRouter as Router, Routes, Route } from "react-router";
import Header from "./Components/Header";
import MultiplicationTutor from "./Pages/MultiplicationTutor";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MultiplicationTutor />} />
      </Routes>
    </Router>
  );
}

export default App;
