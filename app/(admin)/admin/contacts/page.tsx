"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchContacts } from "@/app/store/slices/contactSlice";
import { FaEye, FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
import Pagination from "@/app/components/ui/Pagination";
import { IoTimeOutline } from "react-icons/io5";

// Interface defining the Contact Message structure
interface ContactMessage {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "read" | "replied" | string;
  createdAt?: string;
}

export default function AdminContactsPage() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, status, error } = useAppSelector((state) => state.contact);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const totalPages = Math.ceil(data.length / limit);
  const paginatedOrders = data.slice(
    (page - 1) * limit,
    page * limit
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchContacts());
    }
  }, [status, dispatch]);

  // ---------------- LOADING ----------------
  if (status === "loading") {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-xs uppercase tracking-widest text-neutral-500 animate-pulse bg-neutral-100 px-4 py-2 rounded-full border border-neutral-200">
          Loading contact messages...
        </div>
      </div>
    );
  }

  // ---------------- ERROR ----------------
  if (status === "failed") {
    return (
      <div className="p-10 flex justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm max-w-md w-full uppercase tracking-wider text-center">
          Failed to load messages: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10  mx-auto space-y-8 min-h-screen bg-neutral-50/50">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 uppercase">Contact Messages</h1>
          <p className="text-neutral-500 text-xs mt-1">Manage, view, and respond to incoming customer submissions.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-neutral-200 shadow-sm text-xs font-medium text-neutral-600">
          Total Submissions: <span className="font-bold text-neutral-900">{data?.length || 0}</span>
        </div>
      </div>

      {/* Main Table Layout */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="p-4 pl-6">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4 max-w-xs truncate">Message Snippet</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100 text-sm text-neutral-700">
              {/* {data && data.length > 0 ? ( */}
                {/* // data.map((msg: any) => ( */}
              {paginatedOrders && paginatedOrders.length > 0 ? (
                paginatedOrders.map((msg: any) => (
                  <tr key={msg._id} className="hover:bg-neutral-50/70 transition-colors duration-150 group">
                    <td className="p-4 pl-6 font-medium text-neutral-900">
                      {msg.firstName} {msg.lastName}
                    </td>
                    <td className="p-4 text-neutral-600 font-mono text-xs">{msg.email}</td>
                    <td className="p-4 text-neutral-600 text-xs">{msg.phone}</td>
                    <td className="p-4 max-w-xs truncate text-neutral-500 font-light">
                      {msg.message}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                          msg.status === "new"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : msg.status === "read"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-500 text-xs font-light">
                      {msg.createdAt && new Date(msg.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="cursor-pointer inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-md text-xs font-medium tracking-wide shadow-sm hover:shadow active:scale-[0.98] transition-all duration-200"
                      >
                        <FaEye size={12} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-400 font-light">
                    No records found. Incoming submissions will populate here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

              <Pagination
                                  page={page}
                                  totalPages={totalPages}
                                  onPageChange={setPage}
                                />
                            
                            {(paginatedOrders.length === 0) && (
                              <div className="py-20 text-center space-y-3">
                                 <IoTimeOutline size={40} className="mx-auto text-neutral-200" />
                                 <p className="text-neutral-400 text-sm italic">No orders found in this category.</p>
                              </div>
                            )}
        </div>
      </div>

      {/* ---------------- MESSAGE DETAILED VIEW MODAL ---------------- */}
    {selectedMessage && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    {/* Animated Backdrop Blur Overlay */}
    <div 
      className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md transition-opacity duration-500 ease-out"
      onClick={() => setSelectedMessage(null)}
    />

    {/* Modal Architecture Window */}
    <div className="bg-white w-full max-w-2xl border border-neutral-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] relative z-10 transform transition-all duration-300 animate-in fade-in zoom-in-98 slide-in-from-bottom-4 ease-out">
      
      {/* Modal Header */}
      <div className="border-b border-neutral-100 px-6 py-6 flex items-start justify-between gap-4">
        <div>
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em] block mb-1">
            Enquiry Submission
          </span>
          <h3 className="text-xl font-light text-neutral-900 tracking-tight uppercase">
            {selectedMessage.firstName} <span className="font-semibold">{selectedMessage.lastName}</span>
          </h3>
        </div>
        <button 
          onClick={() => setSelectedMessage(null)}
          className="text-neutral-400 hover:text-black p-1.5 transition-colors duration-200 hover:bg-neutral-50"
          aria-label="Close modal"
        >
          <FaTimes size={14} />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-8">
        
        {/* Info Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          
          <div className="flex items-start gap-3.5 pb-3 border-b border-neutral-100/70">
            <FaUser className="text-neutral-400 mt-0.5 shrink-0" size={12} />
            <div>
              <p className="text-[9px] uppercase font-bold text-neutral-400 tracking-[0.15em]">Client Name</p>
              <p className="text-xs font-semibold text-neutral-800 mt-1">{selectedMessage.firstName} {selectedMessage.lastName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 pb-3 border-b border-neutral-100/70">
            <FaEnvelope className="text-neutral-400 mt-0.5 shrink-0" size={12} />
            <div className="min-w-0 w-full">
              <p className="text-[9px] uppercase font-bold text-neutral-400 tracking-[0.15em]">Email Address</p>
              <p className="text-xs font-semibold text-neutral-800 mt-1 truncate font-mono">{selectedMessage.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 pb-3 border-b border-neutral-100/70 sm:border-0">
            <FaPhone className="text-neutral-400 mt-0.5 shrink-0" size={12} />
            <div>
              <p className="text-[9px] uppercase font-bold text-neutral-400 tracking-[0.15em]">Phone Connection</p>
              <p className="text-xs font-semibold text-neutral-800 mt-1 font-mono">{selectedMessage.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 pb-3 border-b border-neutral-100/70 sm:border-0">
            <FaCalendarAlt className="text-neutral-400 mt-0.5 shrink-0" size={12} />
            <div>
              <p className="text-[9px] uppercase font-bold text-neutral-400 tracking-[0.15em]">Date Logged</p>
              <p className="text-xs font-semibold text-neutral-800 mt-1">
                {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                }) : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Message Content Area */}
        <div className="space-y-2.5 pt-2">
          <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 block">
            Message Transcript
          </label>
          <div className="bg-neutral-50 border border-neutral-100 p-5 text-xs text-neutral-600 leading-relaxed font-normal max-h-52 overflow-y-auto whitespace-pre-wrap selection:bg-neutral-200">
            {selectedMessage.message}
          </div>
        </div>
      </div>

      {/* Modal Actions Footer */}
      <div className="border-t border-neutral-100 px-6 py-5 flex items-center justify-end gap-3 bg-white">
        <button
          onClick={() => setSelectedMessage(null)}
          className="bg-white border border-neutral-200 hover:border-neutral-900 text-neutral-600 hover:text-black px-5 h-11 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-200"
        >
          Dismiss
        </button>
        <a
          href={`mailto:${selectedMessage.email}`}
          className="flex items-center justify-center bg-black text-white hover:bg-neutral-800 px-6 h-11 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-200 shadow-sm"
        >
          Reply via Email
        </a>
      </div>

    </div>
  </div>
)}
    </div>
  );
}