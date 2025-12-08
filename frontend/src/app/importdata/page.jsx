"use client";
import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/data-entry/";

export default function ImportPage() {
  const [models, setModels] = useState([]);
  const [file, setFile] = useState(null);
  const [model, setModel] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Toast system
//   function showToast(message, type) {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   }

  // Load models from Django
  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setModels(data.data);
      } catch {
        showToast("Failed to load models", "error");
      }
    }
    fetchModels();
  }, []);

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return; // Prevent double submit
    setLoading(true);

    if (!file || !model) {
      showToast("Please select file and model!", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", model);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.status === 200) {
        showToast("Import data successfully!", "success");
      } else {
        showToast(result.error || "Something went wrong!", "error");
      }
    } catch (error) {
      showToast("Server error!", "error");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black flex items-center justify-center p-6">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold animate-slide-in 
          ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Card */}
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-white mb-6 drop-shadow">
          Import CSV Data
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* CSV File */}
          <div>
            <label className="block text-white font-medium mb-2">Upload CSV File</label>
            <div className="border border-gray-500/40 rounded-xl p-3 bg-white/5 hover:bg-white/10 transition">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-white cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-white font-medium mb-2">Select Model</label>
            <select
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-white/10 text-white border border-gray-500/40 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Choose --</option>
              {models.map((m) => (
                <option key={m} value={m} className="text-black">
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-all shadow-lg 
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-700/50"}`}
          >
            {loading ? "Uploading..." : "Import Data"}
          </button>
        </form>
      </div>
    </div>
  );
}
