// import { useState } from "react";
// import { DOCTORS, MEDICAL_RECORDS, APPOINTMENTS } from "../../data/mockData";
// import {
//   Plus, Search, X, Eye, Download, Edit2, Trash2, Phone, Mail, Clock, DollarSign, Stethoscope
// } from "lucide-react";

// type Doctor = typeof DOCTORS[0];

// const emptyForm = {
//   name: "", image: "", email: "", password: "", phone: "",
//   timing: "", fee: 0, specialties: ""
// };

// export default function ClinicDoctors() {
//   const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS.filter((d) => d.clinicId === "clinic_001"));
//   const [showAdd, setShowAdd] = useState(false);
//   const [form, setForm] = useState(emptyForm);
//   const [searchDoctor, setSearchDoctor] = useState("");
//   const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null);

//   const filteredDoctors = doctors.filter((d) =>
//     d.name.toLowerCase().includes(searchDoctor.toLowerCase()) ||
//     d._id.includes(searchDoctor)
//   );

//   const doctorRecords = viewDoctor
//     ? MEDICAL_RECORDS.filter((r) => r.doctorId === viewDoctor._id)
//     : [];

//   const handleAdd = () => {
//     console.log(form)
//     if (!form.name || !form.email) return;
//     const newDoc: Doctor = {
//       _id: `doc_${Date.now()}`,
//       name: form.name,
//       image: form.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
//       email: form.email,
//       password: form.password,
//       phone: form.phone,
//       clinicId: "clinic_001",
//       clinicName: "PawsCity Veterinary Clinic",
//       specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
//       timing: form.timing,
//       fee: Number(form.fee),
//       bio: "",
//     };
//     setDoctors((prev) => [...prev, newDoc]);
//     setForm(emptyForm);
//     setShowAdd(false);
//   };

//   const handleDelete = (id: string) => {
//     setDoctors((prev) => prev.filter((d) => d._id !== id));
//   };

//   return (
//     <div className="p-6 lg:p-8 max-w-7xl mx-auto">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
//           <p className="text-gray-500 mt-1">View and manage clinic doctors</p>
//         </div>
//         <button
//           onClick={() => setShowAdd(true)}
//           className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition"
//         >
//           <Plus className="w-4 h-4" /> Add Doctor
//         </button>
//       </div>

//       {/* Search */}
//       <div className="relative mb-5 max-w-sm">
//         <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//         <input
//           placeholder="Search by name or ID..."
//           value={searchDoctor}
//           onChange={(e) => setSearchDoctor(e.target.value)}
//           className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//         />
//       </div>

//       {/* Doctors Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
//         <h2 className="font-bold text-gray-900 mb-4">Available Doctors</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
//                 <th className="pb-3 pr-4">Doctor</th>
//                 <th className="pb-3 pr-4">ID</th>
//                 <th className="pb-3 pr-4">Phone</th>
//                 <th className="pb-3 pr-4">Specialties</th>
//                 <th className="pb-3 pr-4">Timing</th>
//                 <th className="pb-3 pr-4">Fee</th>
//                 <th className="pb-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filteredDoctors.map((doc) => (
//                 <tr key={doc._id} className="hover:bg-gray-50 transition">
//                   <td className="py-4 pr-4">
//                     <div className="flex items-center gap-3">
//                       <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{doc.name}</p>
//                         <p className="text-xs text-gray-500">{doc.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 pr-4 text-xs font-mono text-gray-500">{doc._id}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{doc.phone}</td>
//                   <td className="py-4 pr-4">
//                     <div className="flex flex-wrap gap-1">
//                       {doc.specialties.map((s) => (
//                         <span key={s} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{s}</span>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="py-4 pr-4 text-xs text-gray-600">{doc.timing}</td>
//                   <td className="py-4 pr-4 text-sm font-semibold text-teal-600">${doc.fee}</td>
//                   <td className="py-4">
//                     <div className="flex items-center gap-1.5">
//                       <button
//                         onClick={() => setViewDoctor(doc)}
//                         className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg cursor-pointer transition"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(doc._id)}
//                         className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer transition"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Doctor Profile Viewer */}
//       {viewDoctor && (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex items-start justify-between mb-5">
//             <div className="flex items-center gap-4">
//               <img src={viewDoctor.image} alt={viewDoctor.name} className="w-16 h-16 rounded-2xl object-cover" />
//               <div>
//                 <h2 className="font-bold text-gray-900 text-lg">{viewDoctor.name}</h2>
//                 <p className="text-gray-500 text-sm">{viewDoctor.specialties.join(", ")}</p>
//                 <p className="text-xs text-teal-600 font-medium mt-1">ID: {viewDoctor._id}</p>
//               </div>
//             </div>
//             <button onClick={() => setViewDoctor(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
//               <X className="w-5 h-5 text-gray-400" />
//             </button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
//             <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
//               <Phone className="w-4 h-4 text-gray-400" />
//               <span className="text-sm text-gray-700">{viewDoctor.phone}</span>
//             </div>
//             <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
//               <Clock className="w-4 h-4 text-gray-400" />
//               <span className="text-sm text-gray-700">{viewDoctor.timing}</span>
//             </div>
//             <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
//               <DollarSign className="w-4 h-4 text-gray-400" />
//               <span className="text-sm text-gray-700">${viewDoctor.fee}/visit</span>
//             </div>
//           </div>

//           <h3 className="font-semibold text-gray-900 mb-3">Consultation History</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
//                   <th className="pb-3 pr-4">Date</th>
//                   <th className="pb-3 pr-4">Pet ID</th>
//                   <th className="pb-3 pr-4">Pet Name</th>
//                   <th className="pb-3 pr-4">Owner Contact</th>
//                   <th className="pb-3">Prescription</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {doctorRecords.map((rec) => (
//                   <tr key={rec._id} className="hover:bg-gray-50 transition">
//                     <td className="py-3 pr-4 text-sm text-gray-600">{rec.date}</td>
//                     <td className="py-3 pr-4 text-xs font-mono text-gray-500">{rec.petId}</td>
//                     <td className="py-3 pr-4 text-sm font-medium text-gray-900">{rec.petName}</td>
//                     <td className="py-3 pr-4 text-sm text-gray-600">{rec.ownerContact}</td>
//                     <td className="py-3">
//                       <button className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:underline cursor-pointer">
//                         <Download className="w-3.5 h-3.5" /> Download
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {doctorRecords.length === 0 && (
//                   <tr><td colSpan={5} className="text-center py-6 text-gray-400 text-sm">No consultation history</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Add Doctor Modal */}
//       {showAdd && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
//               <h2 className="font-bold text-gray-900 text-lg">Add New Doctor</h2>
//               <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 {[
//                   { label: "Full Name *", field: "name", type: "text", placeholder: "Dr. John Smith" },
//                   { label: "Email *", field: "email", type: "email", placeholder: "doctor@email.com" },
//                   { label: "Password *", field: "password", type: "password", placeholder: "••••••••" },
//                   { label: "Phone", field: "phone", type: "tel", placeholder: "+1-555-0000" },
//                   { label: "Timing", field: "timing", type: "text", placeholder: "Mon-Fri: 9AM-5PM" },
//                   { label: "Consultation Fee ($)", field: "fee", type: "number", placeholder: "80" },
//                 ].map(({ label, field, type, placeholder }) => (
//                   <div key={field}>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
//                     <input
//                       type={type}
//                       placeholder={placeholder}
//                       value={(form as any)[field]}
//                       onChange={(e) => setForm({ ...form, [field]: e.target.value })}
//                       className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialties (comma-separated)</label>
//                 <input
//                   placeholder="e.g. Surgery, Dermatology"
//                   value={form.specialties}
//                   onChange={(e) => setForm({ ...form, specialties: e.target.value })}
//                   className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Image URL</label>
//                 <input
//                   placeholder="https://..."
//                   value={form.image}
//                   onChange={(e) => setForm({ ...form, image: e.target.value })}
//                   className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-3 p-6 pt-0">
//               <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer">Cancel</button>
//               <button onClick={handleAdd} className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition">Add Doctor</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





















// import { useState, useEffect } from "react";
// import { DOCTORS, MEDICAL_RECORDS, APPOINTMENTS } from "../../data/mockData";
// import {
//   Plus, Search, X, Eye, Download, Edit2, Trash2, Phone, Mail, Clock, DollarSign, Stethoscope
// } from "lucide-react";

// type Doctor = typeof DOCTORS[0];

// const emptyForm = {
//   name: "", image: "", email: "", password: "", phone: "",
//   timing: "", fee: 0, specialties: ""
// };

// export default function ClinicDoctors() {
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [showAdd, setShowAdd] = useState(false);
//   const [form, setForm] = useState(emptyForm);
//   const [searchDoctor, setSearchDoctor] = useState("");
//   const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const API_URL = 'https://pet-care-server-one.vercel.app';

//   // Fetch doctors from database
//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/doctors`);
//       if (!response.ok) throw new Error('Failed to fetch doctors');
//       const data = await response.json();
//       // Filter doctors for this clinic
//       const clinicDoctors = data.filter((d: Doctor) => d.clinicId === "clinic_001");
//       setDoctors(clinicDoctors);
//     } catch (error) {
//       console.error('Error fetching doctors:', error);
//       alert('Failed to load doctors');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredDoctors = doctors.filter((d) =>
//     d.name.toLowerCase().includes(searchDoctor.toLowerCase()) ||
//     d._id.includes(searchDoctor)
//   );

//   const doctorRecords = viewDoctor
//     ? MEDICAL_RECORDS.filter((r) => r.doctorId === viewDoctor._id)
//     : [];

//   const handleAdd = async () => {
//     // Validate required fields
//     if (!form.name || !form.email || !form.password) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     setIsSaving(true);

//     const newDoctor = {
//       name: form.name,
//       image: form.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
//       email: form.email,
//       password: form.password,
//       phone: form.phone,
//       clinicId: "clinic_001",
//       clinicName: "PawsCity Veterinary Clinic",
//       specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
//       timing: form.timing,
//       fee: Number(form.fee),
//       bio: "",
//       createdAt: new Date().toISOString()
//     };

//     console.log("Adding doctor:", newDoctor);

//     try {
//       const response = await fetch(`${API_URL}/doctors`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newDoctor)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add doctor');
//       }

//       const savedDoctor = await response.json();
//       console.log("Doctor saved successfully:", savedDoctor);
      
//       // Refresh doctors list
//       await fetchDoctors();
      
//       // Reset form and close modal
//       setForm(emptyForm);
//       setShowAdd(false);
//       alert("Doctor added successfully!");
      
//     } catch (error) {
//       console.error('Error adding doctor:', error);
//       alert('Failed to add doctor. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this doctor?")) return;
    
//     try {
//       const response = await fetch(`${API_URL}/doctors/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete doctor');
//       }

//       console.log("Doctor deleted successfully");
      
//       // Refresh doctors list
//       await fetchDoctors();
//       alert("Doctor deleted successfully!");
      
//     } catch (error) {
//       console.error('Error deleting doctor:', error);
//       alert('Failed to delete doctor. Please try again.');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 lg:p-8 max-w-7xl mx-auto">
//         <div className="text-center py-16">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
//           <p className="text-gray-500 mt-4">Loading doctors...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 lg:p-8 max-w-7xl mx-auto">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
//           <p className="text-gray-500 mt-1">View and manage clinic doctors</p>
//         </div>
//         <button
//           onClick={() => setShowAdd(true)}
//           className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition"
//         >
//           <Plus className="w-4 h-4" /> Add Doctor
//         </button>
//       </div>

//       {/* Search */}
//       <div className="relative mb-5 max-w-sm">
//         <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//         <input
//           placeholder="Search by name or ID..."
//           value={searchDoctor}
//           onChange={(e) => setSearchDoctor(e.target.value)}
//           className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//         />
//       </div>

//       {/* Doctors Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
//         <h2 className="font-bold text-gray-900 mb-4">Available Doctors</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
//                 <th className="pb-3 pr-4">Doctor</th>
//                 <th className="pb-3 pr-4">ID</th>
//                 <th className="pb-3 pr-4">Phone</th>
//                 <th className="pb-3 pr-4">Specialties</th>
//                 <th className="pb-3 pr-4">Timing</th>
//                 <th className="pb-3 pr-4">Fee</th>
//                 <th className="pb-3">Actions</th>
//                </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filteredDoctors.map((doc) => (
//                 <tr key={doc._id} className="hover:bg-gray-50 transition">
//                   <td className="py-4 pr-4">
//                     <div className="flex items-center gap-3">
//                       <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{doc.name}</p>
//                         <p className="text-xs text-gray-500">{doc.email}</p>
//                       </div>
//                     </div>
//                    </td>
//                   <td className="py-4 pr-4 text-xs font-mono text-gray-500">{doc._id}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{doc.phone}</td>
//                   <td className="py-4 pr-4">
//                     <div className="flex flex-wrap gap-1">
//                       {doc.specialties.map((s) => (
//                         <span key={s} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{s}</span>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="py-4 pr-4 text-xs text-gray-600">{doc.timing}</td>
//                   <td className="py-4 pr-4 text-sm font-semibold text-teal-600">{doc.fee}/-</td>
//                   <td className="py-4">
//                     <div className="flex items-center gap-1.5">
//                       <button
//                         onClick={() => setViewDoctor(doc)}
//                         className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg cursor-pointer transition"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(doc._id)}
//                         className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer transition"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {filteredDoctors.length === 0 && (
//                 <tr>
//                   <td colSpan={7} className="text-center py-8 text-gray-400 text-sm">
//                     No doctors found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Doctor Profile Viewer */}
//       {viewDoctor && (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex items-start justify-between mb-5">
//             <div className="flex items-center gap-4">
//               <img src={viewDoctor.image} alt={viewDoctor.name} className="w-16 h-16 rounded-2xl object-cover" />
//               <div>
//                 <h2 className="font-bold text-gray-900 text-lg">{viewDoctor.name}</h2>
//                 <p className="text-gray-500 text-sm">{viewDoctor.specialties.join(", ")}</p>
//                 <p className="text-xs text-teal-600 font-medium mt-1">ID: {viewDoctor._id}</p>
//               </div>
//             </div>
//             <button onClick={() => setViewDoctor(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
//               <X className="w-5 h-5 text-gray-400" />
//             </button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
//             <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
//               <Phone className="w-4 h-4 text-gray-400" />
//               <span className="text-sm text-gray-700">{viewDoctor.phone}</span>
//             </div>
//             <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
//               <Clock className="w-4 h-4 text-gray-400" />
//               <span className="text-sm text-gray-700">{viewDoctor.timing}</span>
//             </div>
//             <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
//               <DollarSign className="w-4 h-4 text-gray-400" />
//               <span className="text-sm text-gray-700">${viewDoctor.fee}/visit</span>
//             </div>
//           </div>

//           <h3 className="font-semibold text-gray-900 mb-3">Consultation History</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
//                   <th className="pb-3 pr-4">Date</th>
//                   <th className="pb-3 pr-4">Pet ID</th>
//                   <th className="pb-3 pr-4">Pet Name</th>
//                   <th className="pb-3 pr-4">Owner Contact</th>
//                   <th className="pb-3">Prescription</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {doctorRecords.map((rec) => (
//                   <tr key={rec._id} className="hover:bg-gray-50 transition">
//                     <td className="py-3 pr-4 text-sm text-gray-600">{rec.date}</td>
//                     <td className="py-3 pr-4 text-xs font-mono text-gray-500">{rec.petId}</td>
//                     <td className="py-3 pr-4 text-sm font-medium text-gray-900">{rec.petName}</td>
//                     <td className="py-3 pr-4 text-sm text-gray-600">{rec.ownerContact}</td>
//                     <td className="py-3">
//                       <button className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:underline cursor-pointer">
//                         <Download className="w-3.5 h-3.5" /> Download
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {doctorRecords.length === 0 && (
//                   <tr>
//                     <td colSpan={5} className="text-center py-6 text-gray-400 text-sm">No consultation history</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Add Doctor Modal */}
//       {showAdd && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
//               <h2 className="font-bold text-gray-900 text-lg">Add New Doctor</h2>
//               <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 {[
//                   { label: "Full Name *", field: "name", type: "text", placeholder: "Dr. John Smith" },
//                   { label: "Email *", field: "email", type: "email", placeholder: "doctor@email.com" },
//                   { label: "Password *", field: "password", type: "password", placeholder: "••••••••" },
//                   { label: "Phone", field: "phone", type: "tel", placeholder: "+1-555-0000" },
//                   { label: "Timing", field: "timing", type: "text", placeholder: "Mon-Fri: 9AM-5PM" },
//                   { label: "Consultation Fee ($)", field: "fee", type: "number", placeholder: "80" },
//                 ].map(({ label, field, type, placeholder }) => (
//                   <div key={field}>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
//                     <input
//                       type={type}
//                       placeholder={placeholder}
//                       value={(form as any)[field]}
//                       onChange={(e) => setForm({ ...form, [field]: e.target.value })}
//                       className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialties (comma-separated)</label>
//                 <input
//                   placeholder="e.g. Surgery, Dermatology"
//                   value={form.specialties}
//                   onChange={(e) => setForm({ ...form, specialties: e.target.value })}
//                   className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Image URL</label>
//                 <input
//                   placeholder="https://..."
//                   value={form.image}
//                   onChange={(e) => setForm({ ...form, image: e.target.value })}
//                   className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-3 p-6 pt-0">
//               <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer">Cancel</button>
//               <button 
//                 onClick={handleAdd} 
//                 disabled={isSaving}
//                 className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSaving ? "Adding..." : "Add Doctor"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { DOCTORS, MEDICAL_RECORDS, APPOINTMENTS } from "../../data/mockData";
import {
  Plus, Search, X, Eye, Download, Edit2, Trash2, Phone, Mail, Clock, DollarSign, Stethoscope
} from "lucide-react";

type Doctor = {
  _id: string;
  name: string;
  image: string;
  email: string;
  password?: string;
  phone: string;
  clinicId: string;
  clinicName: string;
  specialties: string[];
  timing: string;
  fee: number;
  bio: string;
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
};

const emptyForm = {
  name: "", image: "", email: "", password: "", phone: "",
  timing: "", fee: 0, specialties: ""
};

export default function ClinicDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [searchDoctor, setSearchDoctor] = useState("");
  const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const API_URL = 'https://pet-care-server-one.vercel.app';

  // Fetch doctors and medical records from database
  useEffect(() => {
    fetchDoctors();
    fetchMedicalRecords();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/doctors`);
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      // Filter doctors for this clinic
      const clinicDoctors = data.filter((d: Doctor) => d.clinicId === "clinic_001");
      setDoctors(clinicDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch(`${API_URL}/medical-records`);
      if (!response.ok) throw new Error('Failed to fetch medical records');
      const data = await response.json();
      setMedicalRecords(data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(searchDoctor.toLowerCase()) ||
    d._id.includes(searchDoctor)
  );

  // Filter medical records for the selected doctor
  const doctorRecords = viewDoctor
    ? medicalRecords.filter((r) => r.doctorId === viewDoctor._id)
    : [];

  const handleAdd = async () => {
    // Validate required fields
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSaving(true);

    const newDoctor = {
      name: form.name,
      image: form.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
      email: form.email,
      password: form.password,
      phone: form.phone,
      clinicId: "clinic_001",
      clinicName: "PawsCity Veterinary Clinic",
      specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
      timing: form.timing,
      fee: Number(form.fee),
      bio: "",
      createdAt: new Date().toISOString()
    };

    console.log("Adding doctor:", newDoctor);

    try {
      const response = await fetch(`${API_URL}/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDoctor)
      });

      if (!response.ok) {
        throw new Error('Failed to add doctor');
      }

      const savedDoctor = await response.json();
      console.log("Doctor saved successfully:", savedDoctor);
      
      // Refresh doctors list
      await fetchDoctors();
      
      // Reset form and close modal
      setForm(emptyForm);
      setShowAdd(false);
      alert("Doctor added successfully!");
      
    } catch (error) {
      console.error('Error adding doctor:', error);
      alert('Failed to add doctor. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    
    try {
      const response = await fetch(`${API_URL}/doctors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete doctor');
      }

      console.log("Doctor deleted successfully");
      
      // Refresh doctors list
      await fetchDoctors();
      alert("Doctor deleted successfully!");
      
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor. Please try again.');
    }
  };

  const downloadPrescription = (record: MedicalRecord) => {
    setDownloading(record._id);
    
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

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
          <p className="text-gray-500 mt-1">View and manage clinic doctors</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition"
        >
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          placeholder="Search by name or ID..."
          value={searchDoctor}
          onChange={(e) => setSearchDoctor(e.target.value)}
          className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Available Doctors</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="pb-3 pr-4">Doctor</th>
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Phone</th>
                <th className="pb-3 pr-4">Specialties</th>
                <th className="pb-3 pr-4">Timing</th>
                <th className="pb-3 pr-4">Fee</th>
                <th className="pb-3">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDoctors.map((doc) => (
                <tr key={doc._id} className="hover:bg-gray-50 transition">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.email}</p>
                      </div>
                    </div>
                   </td>
                  <td className="py-4 pr-4 text-xs font-mono text-gray-500">{doc._id}</td>
                  <td className="py-4 pr-4 text-sm text-gray-600">{doc.phone}</td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {doc.specialties.map((s) => (
                        <span key={s} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                   </td>
                  <td className="py-4 pr-4 text-xs text-gray-600">{doc.timing}</td>
                  <td className="py-4 pr-4 text-sm font-semibold text-teal-600">{doc.fee}/-</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewDoctor(doc)}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg cursor-pointer transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                   </td>
                </tr>
              ))}
              {filteredDoctors.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400 text-sm">
                    No doctors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Profile Viewer */}
      {viewDoctor && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <img src={viewDoctor.image} alt={viewDoctor.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{viewDoctor.name}</h2>
                <p className="text-gray-500 text-sm">{viewDoctor.specialties.join(", ")}</p>
                <p className="text-xs text-teal-600 font-medium mt-1">ID: {viewDoctor._id}</p>
              </div>
            </div>
            <button onClick={() => setViewDoctor(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{viewDoctor.phone}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{viewDoctor.timing}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{viewDoctor.fee}/- per visit</span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">Consultation History ({doctorRecords.length} records)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Pet ID</th>
                  <th className="pb-3 pr-4">Pet Name</th>
                  <th className="pb-3 pr-4">Owner Contact</th>
                  <th className="pb-3">Prescription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {doctorRecords.map((rec) => (
                  <tr key={rec._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 pr-4 text-sm text-gray-600">{rec.date}</td>
                    <td className="py-3 pr-4 text-xs font-mono text-gray-500">{rec.petId}</td>
                    <td className="py-3 pr-4 text-sm font-medium text-gray-900">{rec.petName}</td>
                    <td className="py-3 pr-4 text-sm text-gray-600">{rec.ownerContact || 'N/A'}</td>
                    <td className="py-3">
                      <button 
                        onClick={() => downloadPrescription(rec)}
                        disabled={downloading === rec._id}
                        className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:underline cursor-pointer disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" /> 
                        {downloading === rec._id ? 'Downloading...' : 'Download'}
                      </button>
                    </td>
                  </tr>
                ))}
                {doctorRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400 text-sm">
                      No consultation history for this doctor
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-900 text-lg">Add New Doctor</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Full Name *", field: "name", type: "text", placeholder: "Dr. John Smith" },
                  { label: "Email *", field: "email", type: "email", placeholder: "doctor@email.com" },
                  { label: "Password *", field: "password", type: "password", placeholder: "••••••••" },
                  { label: "Phone", field: "phone", type: "tel", placeholder: "+1-555-0000" },
                  { label: "Timing", field: "timing", type: "text", placeholder: "Mon-Fri: 9AM-5PM" },
                  { label: "Consultation Fee", field: "fee", type: "number", placeholder: "80" },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={(form as any)[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialties (comma-separated)</label>
                <input
                  placeholder="e.g. Surgery, Dermatology"
                  value={form.specialties}
                  onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Image URL</label>
                <input
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer">Cancel</button>
              <button 
                onClick={handleAdd} 
                disabled={isSaving}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Adding..." : "Add Doctor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}