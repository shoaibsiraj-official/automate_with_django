'use client'
import { useState, useEffect } from "react";

export default function SendEmailPage() {
  const [subject, setSubject] = useState("");
  const [emailList, setEmailList] = useState("");
  const [body, setBody] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [listOptions, setListOptions] = useState([]);

  // -----------------------------
  // GET Email Lists
  // -----------------------------
  useEffect(() => {
    fetch("http://localhost:8000/send_email/")
      .then(async (res) => {
        const text = await res.text();

        // Prevent JSON error if server returned HTML
        if (text.startsWith("<")) {
          console.error("HTML Error in GET:", text);
          return;
        }

        const data = JSON.parse(text);
        setListOptions(data.email_lists || []);
      })
      .catch((err) => console.error(err));
  }, []);

  // -----------------------------
  // SEND Email (POST)
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Email-List", emailList);
    formData.append("subject", subject);
    formData.append("body", body);

    if (attachment) {
      formData.append("Attachment", attachment);
    }

    const res = await fetch("http://localhost:8000/send_email/", {
      method: "POST",
      body: formData,
    });

    const text = await res.text();

    if (text.startsWith("<")) {
      console.error("HTML Error in POST:", text);
      alert("Server Error — check console");
      return;
    }

    const data = JSON.parse(text);
    alert(data.message);
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-24 flex justify-center">
      <div className="bg-white w-full max-w-2xl shadow-lg rounded-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Send Bulk Emails
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Email List */}
          <div>
            <label className="block font-semibold mb-1">Email List</label>
            <select
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              className="w-full border rounded-lg p-2"
              required
            >
              <option value="">Select List</option>
              {listOptions.map((list, idx) => (
                <option key={idx} value={list}>{list}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block font-semibold mb-1">Subject</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          {/* Body */}
          <div>
            <label className="block font-semibold mb-1">Message</label>
            <textarea
              rows="6"
              className="w-full border rounded-lg p-2"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Attachment */}
          <div>
            <label className="block font-semibold mb-1">Attachment (Optional)</label>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Send Email
          </button>

        </form>

      </div>
    </div>
  );
}
