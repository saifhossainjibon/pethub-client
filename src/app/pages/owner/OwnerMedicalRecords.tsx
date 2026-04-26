// import { useState } from "react";
// import { MEDICAL_RECORDS } from "../../data/mockData";
// import { FileText, Download, Search, Eye, X } from "lucide-react";

// export default function OwnerMedicalRecords() {
//   const records = MEDICAL_RECORDS.filter((r) => r.ownerId === "user_001");
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<typeof records[0] | null>(null);

//   const filtered = records.filter((r) =>
//     r.petName.toLowerCase().includes(search.toLowerCase()) ||
//     r.type.toLowerCase().includes(search.toLowerCase()) ||
//     r.doctorName.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-6 lg:p-8 max-w-7xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
//         <p className="text-gray-500 mt-1">View your pets' consultation history and prescriptions</p>
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         {/* Search */}
//         <div className="relative mb-5 max-w-sm">
//           <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//           <input
//             placeholder="Search by pet, type, or doctor..."
//             className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
//                 <th className="pb-3 pr-4">Date</th>
//                 <th className="pb-3 pr-4">Clinic / Vaccine Name</th>
//                 <th className="pb-3 pr-4">Pet Name</th>
//                 <th className="pb-3 pr-4">Doctor</th>
//                 <th className="pb-3 pr-4">Diagnosis</th>
//                 <th className="pb-3">Prescription</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filtered.map((rec) => (
//                 <tr key={rec._id} className="hover:bg-gray-50 transition">
//                   <td className="py-4 pr-4 text-sm text-gray-600">{rec.date}</td>
//                   <td className="py-4 pr-4 text-sm font-medium text-gray-900">{rec.clinicName}</td>
//                   <td className="py-4 pr-4">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
//                         <FileText className="w-4 h-4 text-teal-600" />
//                       </div>
//                       <span className="text-sm font-medium text-gray-900">{rec.petName}</span>
//                     </div>
//                   </td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{rec.doctorName}</td>
//                   <td className="py-4 pr-4">
//                     <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{rec.diagnosis}</span>
//                   </td>
//                   <td className="py-4">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => setSelected(rec)}
//                         className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-800 cursor-pointer"
//                       >
//                         <Eye className="w-4 h-4" /> View
//                       </button>
//                       <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
//                         <Download className="w-4 h-4" /> Download
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {filtered.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="text-center py-12 text-gray-400">
//                     <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
//                     <p>No records found</p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Prescription Modal */}
//       {selected && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
//             <div className="flex items-center justify-between p-6 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 <div className="bg-teal-50 p-2.5 rounded-xl">
//                   <FileText className="w-5 h-5 text-teal-600" />
//                 </div>
//                 <div>
//                   <h2 className="font-bold text-gray-900">Prescription Details</h2>
//                   <p className="text-sm text-gray-500">{selected.date}</p>
//                 </div>
//               </div>
//               <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-gray-50 p-3 rounded-xl">
//                   <p className="text-xs text-gray-500 mb-1">Pet Name</p>
//                   <p className="font-semibold text-gray-900">{selected.petName}</p>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-xl">
//                   <p className="text-xs text-gray-500 mb-1">Doctor</p>
//                   <p className="font-semibold text-gray-900">{selected.doctorName}</p>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-xl">
//                   <p className="text-xs text-gray-500 mb-1">Clinic</p>
//                   <p className="font-semibold text-gray-900">{selected.clinicName}</p>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-xl">
//                   <p className="text-xs text-gray-500 mb-1">Visit Type</p>
//                   <p className="font-semibold text-gray-900">{selected.type}</p>
//                 </div>
//               </div>
//               <div className="bg-blue-50 p-4 rounded-xl">
//                 <p className="text-xs text-blue-600 font-medium mb-1">Diagnosis</p>
//                 <p className="text-gray-900">{selected.diagnosis}</p>
//               </div>
//               <div className="bg-emerald-50 p-4 rounded-xl">
//                 <p className="text-xs text-emerald-600 font-medium mb-1">Prescription</p>
//                 <p className="text-gray-900">{selected.prescription}</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-xl">
//                 <p className="text-xs text-gray-500 font-medium mb-1">Doctor's Notes</p>
//                 <p className="text-gray-700">{selected.notes}</p>
//               </div>
//             </div>
//             <div className="p-6 pt-0 flex gap-3">
//               <button
//                 onClick={() => setSelected(null)}
//                 className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition"
//               >
//                 Close
//               </button>
//               <button className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition flex items-center justify-center gap-2">
//                 <Download className="w-4 h-4" /> Download PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { FileText, Download, Search, Eye, X } from "lucide-react";

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

export default function OwnerMedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const API_URL = 'https://pet-care-server-one.vercel.app';

  // Fetch medical records from API
  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/medical-records`);
      if (!response.ok) throw new Error('Failed to fetch medical records');
      const data = await response.json();
      
      // Filter records for current owner
      const userRecords = data.filter((r: MedicalRecord) => r.ownerId === "user_001");
      setRecords(userRecords);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      alert('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const filtered = records.filter((r) =>
    r.petName?.toLowerCase().includes(search.toLowerCase()) ||
    r.type?.toLowerCase().includes(search.toLowerCase()) ||
    r.doctorName?.toLowerCase().includes(search.toLowerCase())
  );

  const downloadPrescription = (record: MedicalRecord) => {
    setDownloading(record._id);
    
    // Create prescription content
    const content = `
========================================
        MEDICAL PRESCRIPTION
========================================

Date: ${record.date}
Record ID: ${record._id}

----------------------------------------
PET INFORMATION
----------------------------------------
Pet Name: ${record.petName}
Pet ID: ${record.petId}

----------------------------------------
DOCTOR INFORMATION
----------------------------------------
Doctor Name: ${record.doctorName}
Doctor ID: ${record.doctorId}
Clinic: ${record.clinicName}

----------------------------------------
VISIT DETAILS
----------------------------------------
Visit Type: ${record.type}
Diagnosis: ${record.diagnosis}

----------------------------------------
PRESCRIPTION
----------------------------------------
${record.prescription}

----------------------------------------
DOCTOR'S NOTES
----------------------------------------
${record.notes || 'No additional notes'}

----------------------------------------
This is a computer-generated document.
For any queries, please contact the clinic.
========================================
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription_${record.petName}_${record.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloading(null);
  };

  const downloadPDF = (record: MedicalRecord) => {
    // For PDF download, you would typically use a library like jspdf
    // This is a simple version that creates a text file
    downloadPrescription(record);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading medical records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-500 mt-1">View your pets' consultation history and prescriptions</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Search */}
        <div className="relative mb-5 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search by pet, type, or doctor..."
            className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Clinic / Vaccine Name</th>
                <th className="pb-3 pr-4">Pet Name</th>
                <th className="pb-3 pr-4">Doctor</th>
                <th className="pb-3 pr-4">Diagnosis</th>
                <th className="pb-3">Prescription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((rec) => (
                <tr key={rec._id} className="hover:bg-gray-50 transition">
                  <td className="py-4 pr-4 text-sm text-gray-600">{rec.date}</td>
                  <td className="py-4 pr-4 text-sm font-medium text-gray-900">{rec.clinicName}</td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-teal-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{rec.petName}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-sm text-gray-600">{rec.doctorName}</td>
                  <td className="py-4 pr-4">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{rec.diagnosis}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(rec)}
                        className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-800 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button
                        onClick={() => downloadPrescription(rec)}
                        disabled={downloading === rec._id}
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" /> 
                        {downloading === rec._id ? 'Downloading...' : 'Download'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No records found</p>
                  </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-teal-50 p-2.5 rounded-xl">
                  <FileText className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Prescription Details</h2>
                  <p className="text-sm text-gray-500">{selected.date}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Pet Name</p>
                  <p className="font-semibold text-gray-900">{selected.petName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Doctor</p>
                  <p className="font-semibold text-gray-900">{selected.doctorName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Clinic</p>
                  <p className="font-semibold text-gray-900">{selected.clinicName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Visit Type</p>
                  <p className="font-semibold text-gray-900">{selected.type || 'Consultation'}</p>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-xs text-blue-600 font-medium mb-1">Diagnosis</p>
                <p className="text-gray-900">{selected.diagnosis}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl">
                <p className="text-xs text-emerald-600 font-medium mb-1">Prescription</p>
                <p className="text-gray-900">{selected.prescription}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-1">Doctor's Notes</p>
                <p className="text-gray-700">{selected.notes || 'No additional notes'}</p>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3 sticky bottom-0 bg-white border-t border-gray-100">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition"
              >
                Close
              </button>
              <button
                onClick={() => downloadPDF(selected)}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}