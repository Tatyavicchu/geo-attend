import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
import AttendanceListPage from "./pages/AttendanceListPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminPage />} />
        <Route path="/attendance/:sessionId" element={<StudentPage />} />
        <Route path="/attendance-list/:sessionId" element={<AttendanceListPage />} />
      </Routes>
    </Router>
  );
}
