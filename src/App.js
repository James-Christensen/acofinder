import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Table from "./pages/Table";
import Org from "./components/Org";
import TestHome from "./pages/TestHome";

import { ACOProvider } from "./context/context";

function App() {
  return (
    <ACOProvider>
      <Router>
        <div className="flex flex-col justify-between h-screen">
          <Navbar />
          <main className=" px-2">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/table" element={<Table />} />
              <Route path="/test" element={<TestHome />} />
              <Route path="/aco/:id" element={<Org />} />
              <Route path="/notfound" element={<NotFound />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ACOProvider>
  );
}

export default App;
