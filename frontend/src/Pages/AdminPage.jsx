import { useState } from "react";
import CopyLinkBox from "../components/CopyLinkBox";
import adminBg from "../images/wall.jpg";
import logo from "../images/logo.png"; // Add your logo file here

export default function AdminPage() {
  const [adminId, setAdminId] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [radius, setRadius] = useState("");
  const [expiry, setExpiry] = useState(2);
  const [generatedLink, setGeneratedLink] = useState("");

  const handleGenerate = async () => {
    if (!adminId || !subject || !section || !radius) {
      alert("Fill all fields");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const payload = {
        adminId,
        subject,
        section,
        radius,
        expiry,
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      };

      const res = await fetch("http://127.0.0.1:8000/generate-link/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setGeneratedLink(`http://localhost:5173/attendance/${data.sessionId}`);
    });
  };

  const handleViewAttendance = () => {
    if (!generatedLink) {
      alert("Generate link first");
      return;
    }
    const sessionId = generatedLink.split("/").pop();
    window.location.href = `/attendance-list/${sessionId}`;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center px-4"
      style={{ backgroundImage: `url(${adminBg})` }}
    >
      {/* HEADER with logo */}
      <div className="flex items-center gap-3 mt-6 mb-6">
        <img src={logo} alt="GeoAttend Logo" className="h-12 w-12 rounded-full border border-gray-200 shadow" />
        <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
          GeoAttend
        </h1>
      </div>

      {/* Glass effect form */}
      <div className="max-w-lg w-full p-6 rounded-2xl shadow-lg bg-black/10 backdrop-blur-lg border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Generate Attendance Link
        </h2>

        {/* Fields */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Admin ID
          </label>
          <input
            type="text"
            placeholder="Enter Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Subject
          </label>
          <input
            type="text"
            placeholder="Enter Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Section
          </label>
          <input
            type="text"
            placeholder="Enter Section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Radius (meters)
          </label>
          <input
            type="number"
            placeholder="Enter Radius"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Expiry (minutes)
          </label>
          <input
            type="number"
            placeholder="Enter Expiry Time"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Buttons */}
        <button
          onClick={handleGenerate}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-3"
        >
          Generate Link
        </button>

        {generatedLink && (
          <>
            <CopyLinkBox link={generatedLink} />
            <button
              onClick={handleViewAttendance}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mt-3"
            >
              View Attendance
            </button>
          </>
        )}
      </div>
    </div>
  );
}
