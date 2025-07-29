export default function CopyLinkBox({ link }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="mt-4 p-3 border rounded bg-gray-100 flex justify-between items-center">
      <span className="truncate">{link}</span>
      <button
        onClick={copyToClipboard}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Copy
      </button>
    </div>
  );
}
