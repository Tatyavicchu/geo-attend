import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import submitBg from "../images/wall2.jpg";

export default function StudentPage() {
  const { sessionId } = useParams();
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [university, setUniversity] = useState("");
  const [locationGranted, setLocationGranted] = useState(false);

  // Ask for location permission
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      () => setLocationGranted(true),
      () => alert("Location is required!")
    );
  }, []);

  const handleSubmit = async () => {
    if (!locationGranted) {
      alert("Enable location to submit");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const payload = {
        session_id: sessionId,
        name,
        roll,
        university,
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      };

      const res = await fetch("http://127.0.0.1:8000/submit-attendance/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(
        `Attendance Submitted! ${data.within_radius ? "Inside" : "Outside"} radius`
      );
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${submitBg})` }}
    >
      <div className="max-w-lg w-full p-6 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Student Attendance
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Roll Number */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Roll Number
          </label>
          <input
            type="text"
            placeholder="Enter Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* University Roll */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-800 mb-1">
            University Roll
          </label>
          <input
            type="text"
            placeholder="Enter University Roll"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}
