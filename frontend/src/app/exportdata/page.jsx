"use client";
import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/data-export/";
const STATUS_API = "http://127.0.0.1:8000/api/task-status/";

export default function ExportPage() {
  const [models, setModels] = useState([]);
  const [model, setModel] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  function showToast(message, type) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // FETCH MODELS
  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/data-entry/");
        const data = await res.json();
        setModels(data.data);
      } catch {
        showToast("Failed to load models", "error");
      }
    }
    fetchModels();
  }, []);

  // HANDLE EXPORT
  async function handleExport(e) {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    if (!model) {
      showToast("Please select a model!", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        showToast(data.error || "Something went wrong!", "error");
        setLoading(false);
        return;
      }

      const taskId = data.task_id;
      showToast("Export started...", "success");

      // ---- POLLING CELERY STATUS ----
      const checkInterval = setInterval(async () => {
        const rs = await fetch(`${STATUS_API}?task_id=${taskId}`);
        const st = await rs.json();

        console.log("Task Status:", st.state);

        if (st.state === "SUCCESS") {
          clearInterval(checkInterval);

          if (st.result?.download_url) {
            const downloadUrl = "http://127.0.0.1:8000" + st.result.download_url;

            // Trigger browser download
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = st.result.file_name;
            link.click();
          }

          showToast("Your data has been exported!", "success");
          setLoading(false);
        }

        if (st.state === "FAILURE") {
          clearInterval(checkInterval);
          showToast("Export failed!", "error");
          setLoading(false);
        }
      }, 3000);

    } catch (error) {
      showToast("Server error!", "error");
      setLoading(false);
    }
  } // END handleExport

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 to-black flex items-center justify-center p-6">

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold 
            ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}
        >
          {toast.message}
        </div>
      )}

      {/* CARD */}
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Export CSV Data
        </h1>

        <form onSubmit={handleExport} className="space-y-6">

          {/* MODEL SELECTOR */}
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

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-all shadow-lg 
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            {loading ? "Exporting..." : "Export Data"}
          </button>

        </form>
      </div>
    </div>
  );
}
