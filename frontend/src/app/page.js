import Link from "next/link";
import Navbar from "./components/Navbar";


export default function Home() {
  const items = [
    { title: "Import Data", desc: "Imports data from CSV files to any table", color: "bg-blue-100", url: "/importdata" },
    { title: "Export Data", desc: "Exports data to a CSV file", color: "bg-green-100", url: "/exportdata" },
    { title: "Bulk Emails", desc: "Sends bulk emails to users", color: "bg-yellow-100",url:"/bulkemail" },
  ];

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4 py-12">
        <Navbar/>
      <h1 className="text-3xl font-bold text-center mb-10">
        Automate The Boring Stuff With Django
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Link href={item.url} key={index} className="block">
            <div
              className={`p-6 rounded-xl shadow-md h-full min-h-40 flex flex-col justify-center
              cursor-pointer transition-transform transform hover:-translate-y-2 hover:shadow-xl ${item.color}`}
            >
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
