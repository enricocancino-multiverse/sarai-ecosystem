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
const demoAttendanceLogs: AttendanceLog[] = [];

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
  const [cameraStatus, setCameraStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [cameraMessage, setCameraMessage] = useState("Allow camera access to capture your desk verification.");
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const resetForm = () => {
    setEmployeeId("");
    setEmployeeName(userName || "SARAI Staff");
    setCapturedPhoto(null);
    setCurrentStep(1);
    setCameraError(false);
    setCameraStatus("idle");
    setCameraMessage("Allow camera access to capture your desk verification.");
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
    }
    setCameraStatus("idle");
  };

  const handleStartProcess = async (action: string) => {
    setActionType(action);
    if (!employeeId || !employeeName) {
      alert("Please enter Employee ID and Name");
      return;
    }

    setCameraError(false);
    setCameraStatus("loading");
    setCameraMessage("Connecting to your camera...");
    setCurrentStep(2);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(true);
      setCameraStatus("error");
      setCameraMessage("This browser does not support camera access.");
      return;
    }

    const candidateConstraints = [
      { video: { facingMode: { ideal: "environment" } }, audio: false },
      { video: { facingMode: { ideal: "user" } }, audio: false },
      { video: true, audio: false },
    ] as const;

    let lastError: unknown;

    for (const constraints of candidateConstraints) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current?.play();
              setCameraStatus("ready");
              setCameraMessage("Camera is live.");
            } catch {
              setCameraStatus("error");
              setCameraMessage("The camera preview started, but playback could not begin.");
            }
          };
        }
        setCameraStream(stream);
        setCameraError(false);
        return;
      } catch (err) {
        lastError = err;
      }
    }

    console.warn("Camera start failed", lastError);
    setCameraError(true);
    setCameraStatus("error");
    setCameraMessage("Camera access was blocked or unavailable.");
    setCameraStream(null);
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.error("Video or canvas ref not found");
      return;
    }

    try {
      if (video.paused) {
        await video.play();
      }

      for (let attempt = 0; attempt < 8; attempt += 1) {
        if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error("Video dimensions are 0", { width: video.videoWidth, height: video.videoHeight });
        alert("Camera is not displaying properly. Please try again.");
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Could not get canvas context");
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");

      if (!dataUrl || dataUrl === "data:," || dataUrl.length < 100) {
        console.error("Generated data URL is invalid", dataUrl?.length);
        alert("Failed to capture image. Please try again.");
        return;
      }

      setCapturedPhoto(dataUrl);
      stopCamera();
      setCurrentStep(3);
    } catch (error) {
      console.error("Error capturing photo:", error);
      alert("Failed to capture photo. Please try again.");
    }
  };

  const handleSubmitAttendance = () => {
    if (!capturedPhoto) {
      alert("Please capture a desk photo before submitting.");
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
    const isCheckIn = ["Sign In", "AM IN", "PM IN"].includes(actionType);
    const status: AttendanceLog["status"] = isCheckIn ? "On Desk" : "Left Desk";

    const newLog: AttendanceLog = {
      id: employeeId,
      name: employeeName,
      dept: department,
      time,
      date,
      type: actionType,
      status,
      photo: capturedPhoto || "",
    };

    setAttendanceLogs((prev) => [newLog, ...prev]);
    setCurrentStep(4);
    setCapturedPhoto(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

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

  const filteredLogs = attendanceLogs.filter((log) => {
    const matchesSearch = log.name.toLowerCase().includes(searchQuery.toLowerCase()) || log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === "All" || log.dept === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] max-w-7xl mx-auto">
      {/* Interaction Side */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Attendance Terminal</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">East Bldg Special</h2>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
            <div className="space-y-4">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Employee ID Number
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Station / Department
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="SARAI">SARAI</option>
                      <option value="CEST">CEST</option>
                      <option value="OJT">OJT</option>
                      <option value="OTHERS">OTHERS</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>

                  <div className="grid gap-3 grid-cols-2 pt-2">
                    {[
                      { action: "AM IN", label: "Morning Arrival", tone: "bg-slate-900 text-white hover:bg-slate-800" },
                      { action: "AM OUT", label: "Lunch Break", tone: "bg-slate-100 text-slate-900 hover:bg-slate-200" },
                      { action: "PM IN", label: "Afternoon Return", tone: "bg-emerald-600 text-white hover:bg-emerald-700" },
                      { action: "PM OUT", label: "End of Day", tone: "bg-slate-100 text-slate-900 hover:bg-slate-200" },
                    ].map((option) => (
                      <button
                        key={option.action}
                        type="button"
                        onClick={() => handleStartProcess(option.action)}
                        className={`rounded-xl p-4 text-left font-semibold transition-all ${option.tone}`}
                      >
                        <span className="block text-xs opacity-75">{option.label}</span>
                        <span className="mt-1 block text-lg font-bold">{option.action}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl bg-black aspect-video border border-slate-200">
                    {cameraError ? (
                      <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-400">
                        <p className="text-sm font-semibold">{cameraMessage}</p>
                      </div>
                    ) : (
                      <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => { stopCamera(); setCurrentStep(1); }} className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                      Cancel
                    </button>
                    <button type="button" onClick={capturePhoto} className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                      Capture Image
                    </button>
                  </div>
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-black min-h-40 sm:min-h-auto aspect-square sm:aspect-auto flex items-center justify-center">
                      {capturedPhoto ? (
                        <img src={capturedPhoto} alt="Desk" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-slate-400 text-sm">No image</div>
                      )}
                    </div>
                    <div className="space-y-2 text-sm self-center">
                      <p className="text-slate-600"><span className="font-semibold text-slate-900">ID:</span> {employeeId}</p>
                      <p className="text-slate-600"><span className="font-semibold text-slate-900">Department:</span> {department}</p>
                      <p className="text-slate-600"><span className="font-semibold text-slate-900">Action:</span> {actionType}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => { setCapturedPhoto(null); setCurrentStep(1); }} className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                      Re-take
                    </button>
                    <button type="button" onClick={handleSubmitAttendance} className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                      Confirm Submit
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="py-6 text-center space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-600 font-bold">✓</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{actionType} Authenticated</h3>
                    <p className="mt-1 text-sm text-slate-500">The timestamp log has been securely appended to the digital feed.</p>
                  </div>
                  <button type="button" onClick={resetForm} className="mt-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Directory Logs Side */}
<div className="space-y-4 flex flex-col max-h-[70vh]">
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between gap-4 mb-3">
      <h3 className="text-lg font-bold text-slate-900">Live Station Feed</h3>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{filteredLogs.length} Records</span>
    </div>

    <div className="grid gap-2 sm:grid-cols-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search logs..."
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <select
        value={filterDept}
        onChange={(e) => setFilterDept(e.target.value)}
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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

  <div className="flex-1 overflow-y-auto pr-1 space-y-2">
    {filteredLogs.length === 0 ? null : (
      filteredLogs.map((log, index) => (
        <div key={index} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 overflow-hidden text-sm font-semibold text-slate-600">
              {log.photo ? (
                <img src={log.photo} alt="Verification" className="w-full h-full object-cover" />
              ) : (
                <span>{log.status === "On Desk" ? "●" : "◌"}</span>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{log.id}</p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                <span>{log.dept}</span>
                <span>•</span>
                <span className={`font-medium ${log.status === "On Desk" ? "text-emerald-600" : "text-slate-500"}`}>{log.status}</span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${log.type.includes("IN") ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
              {log.type}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">{log.time}</p>
          </div>
        </div>
      ))
    )}
  </div>
</div>
</div>
  );
}

export default function AttendanceRoutePage() {
  return <AttendancePageContent userName="SARAI Staff" />;
}