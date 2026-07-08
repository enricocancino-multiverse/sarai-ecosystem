"use client";

import { useEffect, useRef, useState } from "react";

type AttendanceLog = {
  id: string;
  name: string;
  dept: string;
  time: string;
  date: string;
  type: string;
  status: "On Desk" | "Left Desk";
  photo: string;
};

const STORAGE_KEY = "sarai-attendance-logs";
const demoAttendanceLogs: AttendanceLog[] = [
  { id: "SARAI-001", name: "Dr. Maria Santos", dept: "SARAI", time: "08:15 AM", date: "June 17, 2026", type: "Sign In", status: "On Desk", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
  { id: "SARAI-002", name: "Engr. Juan Dela Cruz", dept: "CEST", time: "08:30 AM", date: "June 17, 2026", type: "Sign In", status: "On Desk", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150" },
  { id: "SARAI-003", name: "Clarissa Ramirez", dept: "OJT", time: "09:02 AM", date: "June 17, 2026", type: "Sign In", status: "On Desk", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" },
  { id: "SARAI-004", name: "Arnel Bautista", dept: "OTHERS", time: "05:00 PM", date: "June 16, 2026", type: "Sign Out", status: "Left Desk", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
];

export function AttendancePageContent({ userName = "SARAI Staff" }: { userName?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState(userName || "SARAI Staff");
  const [department, setDepartment] = useState("SARAI");
  const [actionType, setActionType] = useState("Sign In");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(() => {
    if (typeof window === "undefined") {
      return demoAttendanceLogs;
    }

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AttendanceLog[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fall back to the seeded demo entries when storage is unavailable.
    }

    return demoAttendanceLogs;
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const resetForm = () => {
    setEmployeeId("");
    setEmployeeName(userName || "SARAI Staff");
    setCapturedPhoto(null);
    setCurrentStep(1);
    setCameraError(false);
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const handleStartProcess = async (action: string) => {
    setActionType(action);
    if (!employeeId || !employeeName) {
      alert("Please enter Employee ID and Name");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStream(stream);
      setCameraError(false);
      setCurrentStep(2);
    } catch (err) {
      console.warn("Camera start failed", err);
      setCameraError(true);
      setCameraStream(null);
      setCurrentStep(2);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setCapturedPhoto(dataUrl);
        stopCamera();
        setCurrentStep(3);
        return;
      }
    }

    setCapturedPhoto("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop");
    setCurrentStep(3);
  };

  const handleSubmitAttendance = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
    const isCheckIn = ["Sign In", "AM IN", "PM IN"].includes(actionType);
    const status: AttendanceLog["status"] = isCheckIn ? "On Desk" : "Left Desk";

    const newLog: AttendanceLog = {
      id: employeeId || `SARAI-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      name: employeeName || "Unknown",
      dept: department,
      time,
      date,
      type: actionType,
      status,
      photo: capturedPhoto || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    };

    setAttendanceLogs((prev) => [newLog, ...prev]);
    setCurrentStep(4);
    setCapturedPhoto(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attendanceLogs));
    }
  }, [attendanceLogs]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const todayLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date());
  const todayEntries = attendanceLogs.filter((log) => log.date === todayLabel).length;
  const checkedInCount = attendanceLogs.filter((log) => log.status === "On Desk").length;
  const latestAction = attendanceLogs[0];

  const filteredLogs = attendanceLogs.filter((log) => {
    const matchesSearch = log.name.toLowerCase().includes(searchQuery.toLowerCase()) || log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === "All" || log.dept === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-4xl border border-emerald-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Attendance Hub</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Camera-verified desk check-in</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Run the SARAI attendance workflow with clear steps, photo validation, and a live log directory.</p>
          </div>
          <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Active workflow step {currentStep} of 4</div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Today&apos;s Entries</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{todayEntries}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Currently On Desk</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{checkedInCount}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Latest Action</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{latestAction ? `${latestAction.type} • ${latestAction.name}` : "Waiting for first submission"}</p>
          </div>
        </div>

        <div className="mt-6 rounded-4xl border border-slate-200 bg-slate-50 p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Step {currentStep}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{actionType}</div>
          </div>

          <div className="space-y-4">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-800">
                    Employee / ID Number
                    <input
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                      placeholder="e.g. SARAI-2026-085"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-800">
                    Full Name
                    <input
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                      placeholder="e.g. Dr. Maria Santos"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm text-slate-800">
                  Station / Department
                  <select
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="SARAI">SARAI</option>
                    <option value="CEST">CEST</option>
                    <option value="OJT">OJT</option>
                    <option value="OTHERS">OTHERS</option>
                    <option value="Administration">Administration</option>
                  </select>
                </label>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { action: "AM IN", label: "Morning Arrival", tone: "bg-amber-500 text-white" },
                    { action: "AM OUT", label: "Lunch Break", tone: "bg-violet-500 text-white" },
                    { action: "PM IN", label: "Afternoon Return", tone: "bg-emerald-500 text-white" },
                    { action: "PM OUT", label: "End of Day", tone: "bg-sky-500 text-white" },
                  ].map((option) => (
                    <button
                      key={option.action}
                      type="button"
                      onClick={() => handleStartProcess(option.action)}
                      className={`rounded-3xl px-4 py-5 text-left font-semibold shadow-sm transition hover:scale-[1.01] ${option.tone}`}
                    >
                      <span className="block text-sm opacity-90">{option.label}</span>
                      <span className="mt-3 block text-xl">{option.action}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Camera Verification</p>
                    <p className="mt-1 text-sm text-slate-600">Position yourself at your desk and capture a quick verification photo.</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${["AM IN", "PM IN"].includes(actionType) ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                    {actionType}
                  </span>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-900 p-3">
                  {cameraError ? (
                    <div className="flex min-h-65 flex-col items-center justify-center gap-3 rounded-3xl bg-slate-800 p-6 text-center text-slate-200">
                      <div className="text-4xl">📷</div>
                      <p className="text-sm font-semibold">Camera unavailable</p>
                      <p className="max-w-md text-xs text-slate-400">Please allow the browser to access your camera or continue with the fallback capture.</p>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden rounded-3xl bg-black">
                      <video ref={videoRef} autoPlay playsInline muted className="h-65 w-full object-cover" />
                      <div className="pointer-events-none absolute inset-0 border border-dashed border-slate-300/40" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => { stopCamera(); setCurrentStep(1); }} className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    ← Back to Details
                  </button>
                  <button type="button" onClick={capturePhoto} className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    📸 Take Desk Photo
                  </button>
                </div>
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold text-slate-900">Confirm Attendance Entry</p>
                  <p className="mt-2 text-sm text-slate-600">Review your desk capture and details before final submission.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-[260px_1fr]">
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    <img src={capturedPhoto ?? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop"} alt="Desk capture" className="h-full w-full object-cover" />
                    <div className="bg-slate-900 px-3 py-2 text-center text-xs text-slate-200">Desk Capture • Approved Verification</div>
                  </div>
                  <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-slate-900">Name</p>
                        <p className="text-slate-600">{employeeName || "—"}</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-slate-900">ID Number</p>
                        <p className="text-slate-600">{employeeId || "—"}</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-slate-900">Department</p>
                        <p className="text-slate-600">{department}</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-slate-900">Action</p>
                        <p className="text-slate-600">{actionType}</p>
                      </div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                      Tip: confirm the employee details before submitting. The desk photo helps validate physical presence.
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => { setCapturedPhoto(null); setCurrentStep(1); }} className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Start Over
                  </button>
                  <button type="button" onClick={handleSubmitAttendance} className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    ✓ Submit {actionType}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Success</p>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-900">{actionType} Recorded Successfully!</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Thank you, {employeeName || "team member"}. Your attendance has been saved to the live SARAI station feed.</p>
                </div>
                <div className="rounded-3xl bg-white p-5 text-left text-sm text-slate-700">
                  <p className="font-semibold">Desk health reminder</p>
                  <ul className="mt-3 space-y-2 text-slate-600">
                    <li>• Keep your desk view aligned with the camera.</li>
                    <li>• Take short breaks to rest your eyes every hour.</li>
                    <li>• Keep water nearby for better focus.</li>
                  </ul>
                </div>
                <button type="button" onClick={resetForm} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Return to Attendance Hub
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-4xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Active Attendance Logs</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">Live station feed</h3>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{filteredLogs.length} entries</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
            <input
              type="text"
              placeholder="Search name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="All">All Stations</option>
              <option value="SARAI">SARAI</option>
              <option value="CEST">CEST</option>
              <option value="OJT">OJT</option>
              <option value="OTHERS">OTHERS</option>
              <option value="Administration">Administration</option>
            </select>
          </div>
        </div>

        <div className="rounded-4xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                <p className="text-xl">🔍</p>
                <p className="mt-3 text-sm">No attendance entries match your search.</p>
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={index} className="rounded-3xl border border-slate-200 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                      <img src={log.photo} alt={log.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-slate-900">{log.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{log.id}</span>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-300" />
                        <span>{log.dept}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-slate-900">{log.time}</p>
                      <p className="text-slate-500">{log.date}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className={`rounded-full px-3 py-1 ${log.type.includes("Sign In") ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                      {log.type}
                    </span>
                    <span className={`rounded-full px-3 py-1 ${log.status === "On Desk" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AttendanceRoutePage() {
  return <AttendancePageContent userName="SARAI Staff" />;
}
