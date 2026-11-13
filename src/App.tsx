import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Emergency from "./pages/Emergency";
import Analysis from "./pages/Analysis";
import Education from "./pages/Education";
import DataBreach from "./pages/EmergencyCase/DataBreach";
import Financial from "./pages/EmergencyCase/Financial";
import EmergencyReportView from "./pages/Report/EmergencyReportView";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chat from "./pages/Analysis/Chat";
import Phone from "./pages/Analysis/Phone";
import Screenshot from "./pages/Analysis/Screenshot";
import ResultAnalysisChat from "./pages/ResultAnalysis/ResultChat";
import ResultAnalysiPhone from "./pages/ResultAnalysis/ResultPhone";
import ResultAnalysisScreenshot from "./pages/ResultAnalysis/ResultScreenshot";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";

function ScrollToTop() {
  const { key } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [key]);

  return null;
}

function App() {
  return (
    <div className="relative flex min-h-screen flex-col bg-linear-to-br from-[#F5F7FA] to-[#C3CFE2]">
      <a
        href="#content"
        className="sr-only z-[60] rounded-full bg-white px-4 py-2 font-semibold text-[#446685] shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Lewati ke konten
      </a>

      <ScrollToTop />
      <Navbar />

      <div id="content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/analysis/chat" element={<Chat />} />
          <Route path="/analysis/screenshot" element={<Screenshot />} />
          <Route path="/analysis/resultchat" element={<ResultAnalysisChat />} />
          <Route path="/analysis/resultphone" element={<ResultAnalysiPhone />} />
          <Route
            path="/analysis/resultscreenshot"
            element={<ResultAnalysisScreenshot />}
          />
          <Route path="/analysis/phone" element={<Phone />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/emergency/data" element={<DataBreach />} />
          <Route path="/emergency/financial" element={<Financial />} />
          <Route path="/report/data" element={<EmergencyReportView kind="data" />} />
          <Route
            path="/report/financial"
            element={<EmergencyReportView kind="financial" />}
          />
          <Route path="/education" element={<Education />} />
          <Route path="/privasi" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
