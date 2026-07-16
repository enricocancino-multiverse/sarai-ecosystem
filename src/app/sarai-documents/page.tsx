"use client";

import { useState } from "react";
import { Plus, Search, Trash2, Share2, Printer, Edit2, X, ArrowLeft, Save, Eye, Check } from "lucide-react";

type UserRole = "staff" | "admin" | "superadmin" | null;

type DocumentItem = {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  status: string;
  priority: "High" | "Normal" | "Low";
  description?: string; // Content of the document sheet
};

const initialDocuments: DocumentItem[] = [
  { id: "DTS-2025-001", subject: "Budget Proposal FY2025", from: "Finance", to: "Director", date: "2025-06-28", status: "In Transit", priority: "High", description: "Enclosed is the comprehensive financial breakdown and budget allocation requests for fiscal year 2025 development targets." },
  { id: "DTS-2025-002", subject: "Project SARAI Phase 2 MOU", from: "DOST R1", to: "Legal", date: "2025-06-27", status: "Received", priority: "High", description: "Memorandum of Understanding outlining data sharing protocols and cross-agency responsibilities for Project SARAI agricultural mapping updates." },
  { id: "DTS-2025-003", subject: "Quarterly Activity Report Q2", from: "Admin", to: "Planning", date: "2025-06-26", status: "Approved", priority: "Normal", description: "A detailed timeline log monitoring station throughput efficiency indicators, attendance logs, and digital registry transformations completed this quarter." },
  { id: "DTS-2025-004", subject: "Livelihood Technology Vouchers", from: "CEST", to: "Finance", date: "2025-06-25", status: "For Signature", priority: "Normal", description: "Grant distribution verification documentation processing regional livelihood fund disbursements intended for technology voucher recipients." },
];

const statusColor: Record<string, string> = {
  "In Transit": "bg-blue-50 text-blue-700 border-blue-200",
  Received: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Approved: "bg-green-50 text-green-700 border-green-200",
  "For Signature": "bg-amber-50 text-amber-700 border-amber-200",
  Delivered: "bg-slate-50 text-slate-600 border-slate-200",
};

const priorityDot: Record<string, string> = {
  High: "bg-rose-500",
  Normal: "bg-amber-400",
  Low: "bg-slate-300",
};

export default function DocumentsPage({ role = "admin" }: { role?: UserRole }) {
  const [documentList, setDocumentList] = useState<DocumentItem[]>(initialDocuments);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Spotlight View Active state
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  // Modal states (For quick structural metadata updates)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

  // Form states
  const [formSubject, setFormSubject] = useState("");
  const [formFrom, setFormFrom] = useState("SARAI");
  const [formTo, setFormTo] = useState("Administration");
  const [formPriority, setFormPriority] = useState<"High" | "Normal" | "Low">("Normal");
  const [formStatus, setFormStatus] = useState("In Transit");

  const statuses = ["All", "In Transit", "Received", "Approved", "For Signature", "Delivered"];

  // Handle selections
  const toggleSelectRow = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (filteredItems: DocumentItem[]) => {
    const filteredIds = filteredItems.map((d) => d.id);
    const allSelected = filteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // Bulk actions
  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
      setDocumentList((prev) => prev.filter((doc) => !selectedIds.includes(doc.id)));
      setSelectedIds([]);
    }
  };

  const handleBulkShare = () => {
    alert(`Sharing ${selectedIds.length} documents securely via distribution lines.`);
  };

  const handleBulkPrint = () => {
    alert(`Triggering system print layout for ${selectedIds.length} manifest profiles.`);
  };

  // Individual Actions
  const handleRowDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this document tracking log?")) {
      setDocumentList((prev) => prev.filter((doc) => doc.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      if (selectedDocument?.id === id) setSelectedDocument(null);
    }
  };

  const openAddModal = () => {
    setEditingDoc(null);
    setFormSubject("");
    setFormFrom("SARAI");
    setFormTo("Administration");
    setFormPriority("Normal");
    setFormStatus("In Transit");
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, doc: DocumentItem) => {
    e.stopPropagation();
    setEditingDoc(doc);
    setFormSubject(doc.subject);
    setFormFrom(doc.from);
    setFormTo(doc.to);
    setFormPriority(doc.priority);
    setFormStatus(doc.status);
    setIsModalOpen(true);
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim()) return;

    if (editingDoc) {
      const updated = documentList.map((doc) =>
        doc.id === editingDoc.id
          ? { ...doc, subject: formSubject, from: formFrom, to: formTo, priority: formPriority, status: formStatus }
          : doc
      );
      setDocumentList(updated);
      // Synchronize changes back to canvas view if focused
      if (selectedDocument?.id === editingDoc.id) {
        const found = updated.find(d => d.id === editingDoc.id);
        if (found) setSelectedDocument(found);
      }
    } else {
      const nextId = `DTS-2026-${String(documentList.length + 1).padStart(3, "0")}`;
      const newDoc: DocumentItem = {
        id: nextId,
        subject: formSubject,
        from: formFrom,
        to: formTo,
        date: new Date().toISOString().split("T")[0],
        status: formStatus,
        priority: formPriority,
        description: "Click to write original sheet data or administrative circular summaries for tracking...",
      };
      setDocumentList((prev) => [newDoc, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Save edits made directly inside the dynamic paper display view
  const handleUpdateDocumentText = (updatedDoc: DocumentItem) => {
    setDocumentList(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    setSelectedDocument(updatedDoc);
  };

  const filtered = documentList.filter((doc) => {
    const matchSearch = doc.subject.toLowerCase().includes(search.toLowerCase()) || doc.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || doc.status === filter;
    return matchSearch && matchFilter;
  });

  const isAllFilteredSelected = filtered.length > 0 && filtered.every((d) => selectedIds.includes(d.id));

  // --- RENDERING: DYNAMIC CANVAS SHEET PROFILE VIEW ---
  if (selectedDocument) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button 
            onClick={() => setSelectedDocument(null)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition bg-slate-100 px-3 py-1.5 rounded-xl"
          >
            <ArrowLeft size={16} /> Back to Registry
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert(`Printing document: ${selectedDocument.id}`)}
              className="p-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
              title="Print Sheet"
            >
              <Printer size={16} />
            </button>
            <button 
              onClick={() => alert(`Generated tracking pass for sharing: ${selectedDocument.id}`)}
              className="p-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
              title="Share Layout"
            >
              <Share2 size={16} />
            </button>
            <button 
              onClick={(e) => { openEditModal(e, selectedDocument); }}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition"
            >
              <Edit2 size={14} /> Adjust Metadata
            </button>
          </div>
        </div>

        {/* Real Document Sheet Canvas */}
        <div className="bg-white border border-slate-300 shadow-xl rounded-2xl p-8 min-h-[60vh] flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Document Grid Blueprint Watermark */}
          <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[16px_16px]" />

          <div className="space-y-6">
            {/* Header block within document */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">Document Tracking Passport</span>
                <input 
                  type="text" 
                  value={selectedDocument.subject}
                  onChange={(e) => handleUpdateDocumentText({ ...selectedDocument, subject: e.target.value })}
                  className="block text-2xl font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-emerald-600 focus:outline-none w-full bg-transparent py-0.5 mt-1"
                />
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm bg-slate-100 text-slate-800 px-3 py-1 rounded-md border border-slate-200">{selectedDocument.id}</span>
                <p className="text-[11px] text-slate-400 mt-1.5 font-mono">Registered: {selectedDocument.date}</p>
              </div>
            </div>

            {/* Config Fields Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-medium block uppercase tracking-wider mb-0.5">Route From</span>
                <input 
                  type="text" 
                  value={selectedDocument.from}
                  onChange={(e) => handleUpdateDocumentText({ ...selectedDocument, from: e.target.value })}
                  className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-600 focus:outline-none w-full"
                />
              </div>
              <div>
                <span className="text-slate-400 font-medium block uppercase tracking-wider mb-0.5">Route To</span>
                <input 
                  type="text" 
                  value={selectedDocument.to}
                  onChange={(e) => handleUpdateDocumentText({ ...selectedDocument, to: e.target.value })}
                  className="font-semibold text-emerald-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-600 focus:outline-none w-full"
                />
              </div>
              <div>
                <span className="text-slate-400 font-medium block uppercase tracking-wider mb-0.5">Priority</span>
                <select
                  value={selectedDocument.priority}
                  onChange={(e) => handleUpdateDocumentText({ ...selectedDocument, priority: e.target.value as any })}
                  className="font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <span className="text-slate-400 font-medium block uppercase tracking-wider mb-0.5">Current Status</span>
                <select
                  value={selectedDocument.status}
                  onChange={(e) => handleUpdateDocumentText({ ...selectedDocument, status: e.target.value })}
                  className="font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  {statuses.filter(s => s !== "All").map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Editable Canvas Body Description */}
            <div className="pt-2">
              <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Internal Notes / Summary Memo</label>
              <textarea
                rows={8}
                value={selectedDocument.description || ""}
                onChange={(e) => handleUpdateDocumentText({ ...selectedDocument, description: e.target.value })}
                placeholder="Write comprehensive internal tracking updates, instructions, or item manifests here..."
                className="w-full bg-slate-50/50 p-4 rounded-xl border border-slate-200 text-sm leading-relaxed text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-inner font-sans"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-8 flex justify-between items-center text-xs text-slate-400">
            <p className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500"/> Changes auto-saved directly to operational registry list</p>
            <p className="font-mono">DTS-SYSTEM-SECURE</p>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERING: MAIN REGISTRY FEED DASHBOARD ---
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header Block */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Digital Logbook</h2>
        <p className="text-sm text-slate-500">Monitor and trace all SARAI exclusive official documents across divisions.</p>
      </div>

      {/* Control Panel: Filters, Combined Search Bar & New Document Button inside same element */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          <div className="flex flex-1 flex-wrap sm:flex-nowrap items-center gap-3 max-w-2xl">
            <div className="flex min-w-60 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <Search size={16} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by document title or ID..."
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Nested Add Button */}
            {(role === "admin" || role === "superadmin") && (
              <button 
                onClick={openAddModal}
                className="flex h-9.5 shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
              >
                <Plus size={16} /> New Document
              </button>
            )}
          </div>

          {/* Conditional Bulk Menu */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 animate-in fade-in-50 duration-200">
              <span className="text-xs font-bold text-emerald-800 pr-2 border-r border-emerald-200">
                {selectedIds.length} Selected
              </span>
              <button onClick={handleBulkShare} title="Share selected" className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition">
                <Share2 size={15} />
              </button>
              <button onClick={handleBulkPrint} title="Print selected" className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition">
                <Printer size={15} />
              </button>
              <button onClick={handleBulkDelete} title="Delete selected" className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition">
                <Trash2 size={15} />
              </button>
              <button onClick={() => setSelectedIds([])} className="p-1 rounded-full text-slate-400 hover:bg-white ml-2">
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                filter === status 
                  ? "border-emerald-600 bg-emerald-600 text-white" 
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Registry Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50/70 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 items-center">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={isAllFilteredSelected}
              onChange={() => toggleSelectAll(filtered)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 accent-emerald-600 cursor-pointer"
            />
          </div>
          <div className="col-span-2">Doc ID</div>
          <div className="col-span-3">Subject</div>
          <div className="col-span-2 hidden lg:block">From → To</div>
          <div className="col-span-2 hidden md:block">Date</div>
          <div className="col-span-2 text-right md:text-left">Status / Actions</div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No active tracking records match your criteria.</div>
          ) : (
            filtered.map((doc) => (
              <div 
                key={doc.id} 
                onClick={() => setSelectedDocument(doc)}
                className={`grid grid-cols-12 items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50/60 cursor-pointer ${
                  selectedIds.includes(doc.id) ? "bg-slate-50" : ""
                }`}
              >
                {/* Selection Box */}
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(doc.id)}
                    onChange={(e) => toggleSelectRow(e, doc.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* ID Tag */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 shrink-0 rounded-full ${priorityDot[doc.priority]}`} title={`${doc.priority} Priority`} />
                    <span className="font-mono text-xs font-bold text-emerald-700">{doc.id}</span>
                  </div>
                </div>

                {/* Document Subject */}
                <div className="col-span-3 min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900" title={doc.subject}>{doc.subject}</p>
                </div>

                {/* Route Logistics */}
                <div className="col-span-2 hidden lg:block text-xs text-slate-500">
                  <p className="truncate font-medium text-slate-700">{doc.from}</p>
                  <p className="truncate text-emerald-600 font-medium">→ {doc.to}</p>
                </div>

                {/* Logged Date */}
                <div className="col-span-2 hidden md:block text-xs font-mono text-slate-400">{doc.date}</div>

                {/* Status Badge & Actions */}
                <div className="col-span-2 flex items-center justify-between gap-2 relative">
                  <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide shrink-0 ${statusColor[doc.status] || "bg-slate-100"}`}>
                    {doc.status}
                  </span>

                  {/* Context Actions Drop-overlay */}
                  <div className="flex items-center gap-1 bg-white pl-2">
                    <button 
                      onClick={(e) => openEditModal(e, doc)}
                      title="Edit Metadata" 
                      className="p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); alert(`Printing document summary manifest: ${doc.id}`); }}
                      title="Print Document" 
                      className="p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                    >
                      <Printer size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); alert(`Shared link tracking parameters for ${doc.id}`); }}
                      title="Share Line" 
                      className="p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                    >
                      <Share2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => handleRowDelete(e, doc.id)}
                      title="Delete Record" 
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Metadata Form Overlay Pop-up Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingDoc ? `Modify Registry Line (${editingDoc.id})` : "Register Incoming Document"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Subject Title</label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g., Procurement Request Voucher"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Origin Unit</label>
                  <select
                    value={formFrom}
                    onChange={(e) => setFormFrom(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="SARAI">SARAI</option>
                    <option value="Finance">Finance</option>
                    <option value="Admin">Admin</option>
                    <option value="CEST">CEST</option>
                    <option value="DOST R1">DOST R1</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Target Routing</label>
                  <select
                    value={formTo}
                    onChange={(e) => setFormTo(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Administration">Administration</option>
                    <option value="Director">Director</option>
                    <option value="Legal">Legal</option>
                    <option value="Planning">Planning</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Priority Metric</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Workflow Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="In Transit">In Transit</option>
                    <option value="Received">Received</option>
                    <option value="Approved">Approved</option>
                    <option value="For Signature">For Signature</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
                >
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}