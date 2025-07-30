import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./Pages/AdminPage";
import StudentPage from "./Pages/StudentPage";
import AttendanceListPage from "./Pages/AttendanceListPage";

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
