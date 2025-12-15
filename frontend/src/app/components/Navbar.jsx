"use client";
import { useState } from "react";
import Link from "next/link";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600 tracking-wide">
          AutoDjango
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
          <Link href="/data-entry" className="text-gray-700 hover:text-blue-600 transition">Import Data</Link>
          <Link href="/data-export" className="text-gray-700 hover:text-blue-600 transition">Export Data</Link>
          
          {/* Dropdown Menu */}
          <div className="relative group">
            <button className="text-gray-700 hover:text-blue-600 transition">
              Tools ▼
            </button>

            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg py-3 w-44">
              <Link href="/bulk-email" className="block px-4 py-2 hover:bg-gray-100">Bulk Email</Link>
              <Link href="/tracking-email" className="block px-4 py-2 hover:bg-gray-100">Email Tracking</Link>
              <Link href="/reports" className="block px-4 py-2 hover:bg-gray-100">Reports</Link>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-3xl text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4 animate-slideDown">
          <Link href="/" className="block text-gray-700 hover:text-blue-600">Home</Link>
          <Link href="/data-entry" className="block text-gray-700 hover:text-blue-600">Import Data</Link>
          <Link href="/data-export" className="block text-gray-700 hover:text-blue-600">Export Data</Link>

          {/* Mobile Dropdown */}
          <details className="text-gray-700">
            <summary className="cursor-pointer py-2">Tools</summary>
            <div className="pl-4 space-y-2">
              <Link href="/bulk-email" className="block hover:text-blue-600">Bulk Email</Link>
              <Link href="/tracking-email" className="block hover:text-blue-600">Email Tracking</Link>
              <Link href="/reports" className="block hover:text-blue-600">Reports</Link>
            </div>
          </details>

          <Link
            href="/contact"
            className="block bg-blue-600 text-white text-center px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}
