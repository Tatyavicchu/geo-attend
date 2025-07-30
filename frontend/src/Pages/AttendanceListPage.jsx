import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import listBg from "../images/wall2.jpg";

export default function AttendanceListPage() {
  const { sessionId } = useParams();
  const [data, setData] = useState(null);

  // Fetch attendance data
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/attendance-list/${sessionId}`)
      .then((res) => res.json())
      .then(setData);
  }, [sessionId]);

  if (!data) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  // Export CSV
  const downloadCSV = () => {
    const headers = ["Name", "Roll", "University Roll", "In Range", "Status"];
    const rows = data.attendees.map((a) => [
      a.name,
      a.roll,
      a.university,
      a.within_radius ? "Yes" : "No",
      a.within_radius ? "Present" : "Absent",
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${data.subject}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  // Export PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Attendance - ${data.subject} (${data.section})`, 14, 15);

    const tableData = data.attendees.map((a, idx) => [
      idx + 1,
      a.name,
      a.roll,
      a.university,
      a.within_radius ? "Yes" : "No",
      a.within_radius ? "Present" : "Absent",
    ]);

    doc.autoTable({
      head: [["#", "Name", "Roll", "University Roll", "In Range", "Status"]],
      body: tableData,
      startY: 20,
    });

    doc.save(`attendance_${data.subject}.pdf`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${listBg})` }}
    >
      <div className="max-w-2xl w-full p-6 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md border border-white/20">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Attendance - {data.subject} ({data.section})
        </h2>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => window.print()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Print
          </button>
          <button
            onClick={downloadCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Download CSV
          </button>
          <button
            onClick={downloadPDF}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Download PDF
          </button>
        </div>

        {/* Attendance List */}
        <ul>
          {data.attendees.map((a, idx) => (
            <li
              key={idx}
              className="border-b py-3 flex justify-between text-gray-700 items-center"
            >
              <div>
                <p className="font-medium">
                  {a.name} ({a.roll})
                </p>
                <p className="text-sm text-gray-500">{a.university}</p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded text-white text-sm ${
                    a.within_radius ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {a.within_radius ? "Present" : "Absent"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
