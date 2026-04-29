// import { useState } from "react";
// import { APPOINTMENTS, PETS } from "../../data/mockData";
// import { Search, FileText, Edit2, X, Calendar, CheckCircle2 } from "lucide-react";

// export default function DoctorAppointments() {
//   const [appointments, setAppointments] = useState(
//     APPOINTMENTS.filter((a) => a.doctorId === "doc_001" && a.date === "2025-04-25")
//   );
//   const [searchPetId, setSearchPetId] = useState("");
//   const [prescribeAppt, setPrescribeAppt] = useState<typeof APPOINTMENTS[0] | null>(null);
//   const [prescription, setPrescription] = useState("");
//   const [savedPrescriptions, setSavedPrescriptions] = useState<Record<string, string>>({});

//   const filtered = appointments.filter((a) =>
//     a.petId.includes(searchPetId) || a.petName.toLowerCase().includes(searchPetId.toLowerCase())
//   );

//   const handlePrescribe = (appt: typeof APPOINTMENTS[0]) => {
//     setPrescribeAppt(appt);
//     setPrescription(savedPrescriptions[appt._id] || "");
//   };

//   const handleSavePrescription = () => {
//     if (!prescribeAppt) return;
//     setSavedPrescriptions((prev) => ({ ...prev, [prescribeAppt._id]: prescription }));
//     setAppointments((prev) =>
//       prev.map((a) => a._id === prescribeAppt._id ? { ...a, status: "Visited" } : a)
//     );
//     setPrescribeAppt(null);
//     setPrescription("");
//   };

//   return (
//     <div className="p-6 lg:p-8 max-w-7xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900">Today's Appointments</h1>
//         <p className="text-gray-500 mt-1">April 25, 2025 — Manage and prescribe</p>
//       </div>

//       {/* Search */}
//       <div className="relative mb-5 max-w-sm">
//         <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//         <input
//           placeholder="Search by Pet ID or Name..."
//           value={searchPetId}
//           onChange={(e) => setSearchPetId(e.target.value)}
//           className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//         />
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="font-bold text-gray-900">Appointment List</h2>
//           <span className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
//             {filtered.length} appointments
//           </span>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
//                 <th className="pb-3 pr-4">Pet ID</th>
//                 <th className="pb-3 pr-4">Pet Name</th>
//                 <th className="pb-3 pr-4">Owner Contact</th>
//                 <th className="pb-3 pr-4">Time</th>
//                 <th className="pb-3 pr-4">Type</th>
//                 <th className="pb-3 pr-4">Status</th>
//                 <th className="pb-3">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filtered.map((appt) => (
//                 <tr key={appt._id} className="hover:bg-gray-50 transition">
//                   <td className="py-4 pr-4 text-xs font-mono text-gray-500">{appt.petId}</td>
//                   <td className="py-4 pr-4 text-sm font-medium text-gray-900">{appt.petName}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{appt.ownerContact}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{appt.time}</td>
//                   <td className="py-4 pr-4">
//                     <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{appt.type}</span>
//                   </td>
//                   <td className="py-4 pr-4">
//                     <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
//                       appt.status === "Accepted" ? "bg-green-100 text-green-700" :
//                       appt.status === "Visited" ? "bg-blue-100 text-blue-700" :
//                       "bg-yellow-100 text-yellow-700"
//                     }`}>
//                       {appt.status}
//                     </span>
//                   </td>
//                   <td className="py-4">
//                     <button
//                       onClick={() => handlePrescribe(appt)}
//                       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
//                         savedPrescriptions[appt._id]
//                           ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
//                           : "bg-teal-50 text-teal-600 hover:bg-teal-100"
//                       }`}
//                     >
//                       {savedPrescriptions[appt._id] ? (
//                         <><Edit2 className="w-3.5 h-3.5" /> Edit Rx</>
//                       ) : (
//                         <><FileText className="w-3.5 h-3.5" /> Prescribe</>
//                       )}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {filtered.length === 0 && (
//                 <tr>
//                   <td colSpan={7} className="text-center py-10 text-gray-400">
//                     <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
//                     <p>No appointments found</p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Prescribe Modal */}
//       {prescribeAppt && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
//             <div className="flex items-center justify-between p-6 border-b border-gray-100">
//               <div>
//                 <h2 className="font-bold text-gray-900 text-lg">Write Prescription</h2>
//                 <p className="text-sm text-gray-500">For: {prescribeAppt.petName} ({prescribeAppt.ownerName})</p>
//               </div>
//               <button onClick={() => setPrescribeAppt(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             <div className="p-6">
//               {/* Appointment info */}
//               <div className="grid grid-cols-2 gap-3 mb-5">
//                 {[
//                   { label: "Pet ID", value: prescribeAppt.petId },
//                   { label: "Date", value: prescribeAppt.date },
//                   { label: "Time", value: prescribeAppt.time },
//                   { label: "Type", value: prescribeAppt.type },
//                   { label: "Reason", value: prescribeAppt.reason },
//                 ].map(({ label, value }) => (
//                   <div key={label} className="bg-gray-50 p-3 rounded-xl">
//                     <p className="text-xs text-gray-400">{label}</p>
//                     <p className="text-sm font-medium text-gray-900">{value}</p>
//                   </div>
//                 ))}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Prescription & Notes
//                 </label>
//                 <textarea
//                   rows={6}
//                   value={prescription}
//                   onChange={(e) => setPrescription(e.target.value)}
//                   placeholder="Write diagnosis, medications, dosage instructions, follow-up notes..."
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 p-6 pt-0">
//               <button
//                 onClick={() => setPrescribeAppt(null)}
//                 className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSavePrescription}
//                 disabled={!prescription.trim()}
//                 className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium cursor-pointer transition flex items-center justify-center gap-2"
//               >
//                 <CheckCircle2 className="w-4 h-4" /> Save Prescription
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useState, useEffect } from "react";
// import { Search, FileText, Edit2, X, Calendar, CheckCircle2 } from "lucide-react";

// type Appointment = {
//   _id: string;
//   type: string;
//   petId: string;
//   petName: string;
//   doctorId: string;
//   doctorName: string;
//   clinicId: string;
//   clinicName: string;
//   date: string;
//   time: string;
//   reason: string;
//   ownerId: string;
//   ownerName?: string;
//   ownerContact?: string;
//   status: string;
//   createdAt?: string;
// };

// type MedicalRecord = {
//   petId: string;
//   petName: string;
//   doctorId: string;
//   doctorName: string;
//   clinicId: string;
//   clinicName: string;
//   date: string;
//   diagnosis: string;
//   prescription: string;
//   notes: string;
//   type: string;
//   ownerId: string;
//   ownerContact?: string;
// };

// export default function DoctorAppointments() {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [searchPetId, setSearchPetId] = useState("");
//   const [prescribeAppt, setPrescribeAppt] = useState<Appointment | null>(null);
//   const [prescription, setPrescription] = useState("");
//   const [diagnosis, setDiagnosis] = useState("");
//   const [notes, setNotes] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [savedPrescriptions, setSavedPrescriptions] = useState<Record<string, string>>({});

//   const API_URL =  'https://pet-care-server-one.vercel.app';
//   const DOCTOR_ID = "doc_001";
//   const today = new Date().toISOString().split('T')[0];

//   // Fetch today's appointments for this doctor
//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/appointments`);
//       if (!response.ok) throw new Error('Failed to fetch appointments');
//       const data = await response.json();
      
//       // Filter for this doctor, today's date, and Accepted status
//       const doctorAppointments = data.filter((a: Appointment) => 
//         // a.doctorId === DOCTOR_ID && 
//         // a.date === today && 
//         a.status === "Accepted" || a.status === "Pending"
//       );
//       setAppointments(doctorAppointments);
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       alert('Failed to load appointments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrescribe = (appt: Appointment) => {
//     setPrescribeAppt(appt);
//     setPrescription(savedPrescriptions[appt._id] || "");
//     setDiagnosis("");
//     setNotes("");
//   };

//   const handleSavePrescription = async () => {
//     if (!prescribeAppt) return;
//     if (!prescription.trim()) {
//       alert("Please enter prescription details");
//       return;
//     }

//     setSaving(true);

//     try {
//       // 1. Create medical record
//       const medicalRecord: MedicalRecord = {
//         petId: prescribeAppt.petId,
//         petName: prescribeAppt.petName,
//         doctorId: prescribeAppt.doctorId,
//         doctorName: prescribeAppt.doctorName,
//         clinicId: prescribeAppt.clinicId,
//         clinicName: prescribeAppt.clinicName,
//         date: today,
//         diagnosis: diagnosis || "Consultation completed",
//         prescription: prescription,
//         notes: notes || "No additional notes",
//         type: prescribeAppt.type,
//         ownerId: prescribeAppt.ownerId,
//         ownerContact: prescribeAppt.ownerContact
//       };

//       // Save medical record to database
//       const medicalResponse = await fetch(`${API_URL}/medical-records`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(medicalRecord)
//       });

//       if (!medicalResponse.ok) throw new Error('Failed to save medical record');

//       // 2. Update appointment status to "Visited"
//       const updateResponse = await fetch(`${API_URL}/appointments/${prescribeAppt._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: "Visited" })
//       });

//       if (!updateResponse.ok) throw new Error('Failed to update appointment status');

//       // 3. Update local state
//       setSavedPrescriptions((prev) => ({ 
//         ...prev, 
//         [prescribeAppt._id]: prescription 
//       }));
      
//       setAppointments((prev) =>
//         prev.map((a) => 
//           a._id === prescribeAppt._id ? { ...a, status: "Visited" } : a
//         )
//       );

//       alert("Prescription saved and appointment marked as Visited!");
//       setPrescribeAppt(null);
//       setPrescription("");
//       setDiagnosis("");
//       setNotes("");

//     } catch (error) {
//       console.error('Error saving prescription:', error);
//       alert('Failed to save prescription. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const filtered = appointments.filter((a) =>
//     a.petId.includes(searchPetId) || 
//     a.petName.toLowerCase().includes(searchPetId.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="p-6 lg:p-8 max-w-7xl mx-auto">
//         <div className="text-center py-16">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
//           <p className="text-gray-500 mt-4">Loading appointments...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 lg:p-8 max-w-7xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900">Today's Appointments</h1>
//         <p className="text-gray-500 mt-1">{today} — Manage and prescribe</p>
//       </div>

//       {/* Search */}
//       <div className="relative mb-5 max-w-sm">
//         <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//         <input
//           placeholder="Search by Pet ID or Name..."
//           value={searchPetId}
//           onChange={(e) => setSearchPetId(e.target.value)}
//           className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//         />
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="font-bold text-gray-900">Appointment List</h2>
//           <span className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
//             {filtered.length} appointments
//           </span>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
//                 <th className="pb-3 pr-4">Pet ID</th>
//                 <th className="pb-3 pr-4">Pet Name</th>
//                 <th className="pb-3 pr-4">Owner Contact</th>
//                 <th className="pb-3 pr-4">Time</th>
//                 <th className="pb-3 pr-4">Type</th>
//                 <th className="pb-3 pr-4">Status</th>
//                 <th className="pb-3">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filtered.map((appt) => (
//                 <tr key={appt._id} className="hover:bg-gray-50 transition">
//                   <td className="py-4 pr-4 text-xs font-mono text-gray-500">{appt.petId}</td>
//                   <td className="py-4 pr-4 text-sm font-medium text-gray-900">{appt.petName}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{appt.ownerContact || 'N/A'}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{appt.time}</td>
//                   <td className="py-4 pr-4">
//                     <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{appt.type}</span>
//                   </td>
//                   <td className="py-4 pr-4">
//                     <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
//                       appt.status === "Accepted" ? "bg-green-100 text-green-700" :
//                       appt.status === "Visited" ? "bg-blue-100 text-blue-700" :
//                       "bg-yellow-100 text-yellow-700"
//                     }`}>
//                       {appt.status}
//                     </span>
//                   </td>
//                   <td className="py-4">
//                     <button
//                       onClick={() => handlePrescribe(appt)}
//                       disabled={appt.status === "Visited"}
//                       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
//                         appt.status === "Visited"
//                           ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                           : savedPrescriptions[appt._id]
//                             ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
//                             : "bg-teal-50 text-teal-600 hover:bg-teal-100"
//                       }`}
//                     >
//                       {appt.status === "Visited" ? (
//                         <><CheckCircle2 className="w-3.5 h-3.5" /> Completed</>
//                       ) : savedPrescriptions[appt._id] ? (
//                         <><Edit2 className="w-3.5 h-3.5" /> Edit Rx</>
//                       ) : (
//                         <><FileText className="w-3.5 h-3.5" /> Prescribe</>
//                       )}
//                     </button>
//                   </td>
//                  </tr>
//               ))}
//               {filtered.length === 0 && (
//                 <tr>
//                   <td colSpan={7} className="text-center py-10 text-gray-400">
//                     <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
//                     <p>No appointments found for today</p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Prescribe Modal */}
//       {prescribeAppt && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
//               <div>
//                 <h2 className="font-bold text-gray-900 text-lg">Write Prescription</h2>
//                 <p className="text-sm text-gray-500">For: {prescribeAppt.petName} ({prescribeAppt.ownerName})</p>
//               </div>
//               <button onClick={() => setPrescribeAppt(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             <div className="p-6 space-y-4">
//               {/* Appointment info */}
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   { label: "Pet ID", value: prescribeAppt.petId },
//                   { label: "Date", value: prescribeAppt.date },
//                   { label: "Time", value: prescribeAppt.time },
//                   { label: "Type", value: prescribeAppt.type },
//                   { label: "Reason", value: prescribeAppt.reason },
//                 ].map(({ label, value }) => (
//                   <div key={label} className="bg-gray-50 p-3 rounded-xl">
//                     <p className="text-xs text-gray-400">{label}</p>
//                     <p className="text-sm font-medium text-gray-900">{value}</p>
//                   </div>
//                 ))}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Diagnosis *
//                 </label>
//                 <input
//                   type="text"
//                   value={diagnosis}
//                   onChange={(e) => setDiagnosis(e.target.value)}
//                   placeholder="e.g., Skin infection, Ear infection, Annual checkup"
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Prescription / Medications *
//                 </label>
//                 <textarea
//                   rows={4}
//                   value={prescription}
//                   onChange={(e) => setPrescription(e.target.value)}
//                   placeholder="Write medications, dosage instructions, duration..."
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Doctor's Notes (Optional)
//                 </label>
//                 <textarea
//                   rows={3}
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   placeholder="Additional notes, follow-up instructions, recommendations..."
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 p-6 pt-0 sticky bottom-0 bg-white border-t border-gray-100">
//               <button
//                 onClick={() => setPrescribeAppt(null)}
//                 className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSavePrescription}
//                 disabled={saving || !prescription.trim()}
//                 className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium cursor-pointer transition flex items-center justify-center gap-2"
//               >
//                 <CheckCircle2 className="w-4 h-4" /> 
//                 {saving ? "Saving..." : "Save Prescription"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Search, FileText, Edit2, X, Calendar, CheckCircle2, Eye } from "lucide-react";

type Appointment = {
  _id: string;
  type: string;
  petId: string;
  petName: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  clinicName: string;
  date: string;
  time: string;
  reason: string;
  ownerId?: string;
  ownerName?: string;
  ownerContact?: string;
  status: string;
  createdAt?: string;
};

type MedicalRecord = {
  _id: string;
  petId: string;
  petName: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  clinicName: string;
  date: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  type: string;
  ownerId: string;
  ownerContact?: string;
  createdAt?: string;
};

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([]);
  const [searchPetId, setSearchPetId] = useState("");
  const [searchHistory, setSearchHistory] = useState("");
  const [prescribeAppt, setPrescribeAppt] = useState<Appointment | null>(null);
  const [prescription, setPrescription] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);
  const [savedPrescriptions, setSavedPrescriptions] = useState<Record<string, string>>({});

  const API_URL = 'https://pet-care-server-one.vercel.app';
  const DOCTOR_ID = "doc_001";
  const today = new Date().toISOString().split('T')[0];

  // Fetch appointments and medical history for this doctor
  useEffect(() => {
    fetchAppointments();
    fetchMedicalHistory();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      
      // Filter for this doctor and pending/accepted status
      const doctorAppointments = data.filter((a: Appointment) => 
        a.status === "Accepted" || a.status === "Pending"
      );
      setAppointments(doctorAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/medical-records`);
      if (!response.ok) throw new Error('Failed to fetch medical records');
      const data = await response.json();
      
      // Show ALL medical records - no doctor ID filter
      setMedicalHistory(data);
    } catch (error) {
      console.error('Error fetching medical history:', error);
    }
  };

  const handlePrescribe = (appt: Appointment) => {
    setPrescribeAppt(appt);
    setPrescription(savedPrescriptions[appt._id] || "");
    setDiagnosis("");
    setNotes("");
  };

  const handleSavePrescription = async () => {
    if (!prescribeAppt) return;
    if (!prescription.trim()) {
      alert("Please enter prescription details");
      return;
    }

    setSaving(true);

    try {
      // Create medical record matching the working demo structure
      const medicalRecord = {
        petId: prescribeAppt.petId,
        petName: prescribeAppt.petName,
        doctorId: prescribeAppt.doctorId,
        doctorName: prescribeAppt.doctorName,
        clinicId: prescribeAppt.clinicId,
        clinicName: prescribeAppt.clinicName,
        date: today,
        diagnosis: diagnosis || "Consultation completed",
        prescription: prescription,
        notes: notes || "No additional notes",
        type: prescribeAppt.type,
        ownerId: "user_001" // Using default ownerId as specified
      };

      console.log("Saving medical record:", medicalRecord);

      // Save medical record to database
      const medicalResponse = await fetch(`${API_URL}/medical-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicalRecord)
      });

      if (!medicalResponse.ok) {
        const errorData = await medicalResponse.json();
        throw new Error(errorData.error || 'Failed to save medical record');
      }

      // 2. Update appointment status to "Visited"
      const updateResponse = await fetch(`${API_URL}/appointments/${prescribeAppt._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: "Visited" })
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update appointment status');
      }

      // 3. Update local state
      setSavedPrescriptions((prev) => ({ 
        ...prev, 
        [prescribeAppt._id]: prescription 
      }));
      
      // Remove from current appointments
      setAppointments((prev) =>
        prev.filter((a) => a._id !== prescribeAppt._id)
      );

      // Refresh medical history
      await fetchMedicalHistory();

      alert("Prescription saved and appointment marked as Visited!");
      setPrescribeAppt(null);
      setPrescription("");
      setDiagnosis("");
      setNotes("");

    } catch (error) {
      console.error('Error saving prescription:', error);
      alert(`Failed to save prescription: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredAppointments = appointments.filter((a) =>
    a.petId.includes(searchPetId) || 
    a.petName.toLowerCase().includes(searchPetId.toLowerCase())
  );

  const filteredHistory = medicalHistory.filter((r) =>
    r.petId.includes(searchHistory) || 
    r.petName.toLowerCase().includes(searchHistory.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(searchHistory.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage today's appointments and view consultation history</p>
      </div>

      {/* Today's Appointments Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-gray-900">Today's Appointments</h2>
            <p className="text-xs text-gray-500 mt-0.5">{today}</p>
          </div>
          <span className="bg-teal-50 text-teal-600 text-xs font-medium px-3 py-1 rounded-full">
            {filteredAppointments.length} pending
          </span>
        </div>

        {/* Search for today's appointments */}
        <div className="relative mb-5 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search by Pet ID or Name..."
            value={searchPetId}
            onChange={(e) => setSearchPetId(e.target.value)}
            className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="pb-3 pr-4">Pet ID</th>
                <th className="pb-3 pr-4">Pet Name</th>
                {/* <th className="pb-3 pr-4">Owner Contact</th> */}
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAppointments.map((appt) => (
                <tr key={appt._id} className="hover:bg-gray-50 transition">
                  <td className="py-4 pr-4 text-xs font-mono text-gray-500">{appt.petId}</td>
                  <td className="py-4 pr-4 text-sm font-medium text-gray-900">{appt.petName}</td>
                  {/* <td className="py-4 pr-4 text-sm text-gray-600">{appt.ownerContact || 'N/A'}</td> */}
                  <td className="py-4 pr-4 text-sm text-gray-600">{appt.time}</td>
                  <td className="py-4 pr-4">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{appt.type}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      appt.status === "Accepted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => handlePrescribe(appt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg text-xs font-medium cursor-pointer transition"
                    >
                      <FileText className="w-3.5 h-3.5" /> Prescribe
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No pending appointments for today</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Previous Consultation History Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-gray-900">Previous Consultation History</h2>
            <p className="text-xs text-gray-500 mt-0.5">All past consultations and prescriptions</p>
          </div>
          <span className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
            {filteredHistory.length} records
          </span>
        </div>

        {/* Search for history */}
        <div className="relative mb-5 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search by Pet ID, Name or Diagnosis..."
            value={searchHistory}
            onChange={(e) => setSearchHistory(e.target.value)}
            className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Pet ID</th>
                <th className="pb-3 pr-4">Pet Name</th>
                {/* <th className="pb-3 pr-4">Owner Contact</th> */}
                <th className="pb-3 pr-4">Diagnosis</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredHistory.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50 transition">
                  <td className="py-4 pr-4 text-sm text-gray-600">{record.date}</td>
                  <td className="py-4 pr-4 text-xs font-mono text-gray-500">{record.petId}</td>
                  <td className="py-4 pr-4 text-sm font-medium text-gray-900">{record.petName}</td>
                  {/* <td className="py-4 pr-4 text-sm text-gray-600">{record.ownerContact || 'N/A'}</td> */}
                  <td className="py-4 pr-4">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                      {record.diagnosis}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => setViewRecord(record)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium cursor-pointer transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Prescription
                    </button>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No consultation history found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescribe Modal */}
      {prescribeAppt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Write Prescription</h2>
                <p className="text-sm text-gray-500">For: {prescribeAppt.petName} ({prescribeAppt.ownerName})</p>
              </div>
              <button onClick={() => setPrescribeAppt(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Pet ID", value: prescribeAppt.petId },
                  { label: "Date", value: prescribeAppt.date },
                  { label: "Time", value: prescribeAppt.time },
                  { label: "Type", value: prescribeAppt.type },
                  { label: "Reason", value: prescribeAppt.reason },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis *</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g., Skin infection, Ear infection, Annual checkup"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prescription / Medications *</label>
                <textarea
                  rows={4}
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Write medications, dosage instructions, duration..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor's Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes, follow-up instructions, recommendations..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0 sticky bottom-0 bg-white border-t border-gray-100">
              <button
                onClick={() => setPrescribeAppt(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrescription}
                disabled={saving || !prescription.trim()}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium cursor-pointer transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> 
                {saving ? "Saving..." : "Save Prescription"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Prescription Modal */}
      {viewRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Prescription Details</h2>
                <p className="text-sm text-gray-500">{viewRecord.date}</p>
              </div>
              <button onClick={() => setViewRecord(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Pet Name", value: viewRecord.petName },
                  { label: "Pet ID", value: viewRecord.petId },
                  { label: "Owner Contact", value: viewRecord.ownerContact || 'N/A' },
                  { label: "Visit Type", value: viewRecord.type },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-xs text-blue-600 font-medium mb-1">Diagnosis</p>
                <p className="text-gray-900">{viewRecord.diagnosis}</p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl">
                <p className="text-xs text-emerald-600 font-medium mb-1">Prescription</p>
                <p className="text-gray-900">{viewRecord.prescription}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-1">Doctor's Notes</p>
                <p className="text-gray-700">{viewRecord.notes || 'No additional notes'}</p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => setViewRecord(null)}
                className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}