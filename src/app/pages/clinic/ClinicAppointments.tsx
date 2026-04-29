// import { useState, useEffect } from "react";
// import { APPOINTMENTS } from "../../data/mockData";
// import { CheckCircle2, Trash2, Calendar, Filter, Search } from "lucide-react";

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

// export default function ClinicAppointments() {
//   const [appts, setAppts] = useState<Appointment[]>([]);
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState<string | null>(null);

//   const API_URL = 'https://pet-care-server-one.vercel.app';
//   const CLINIC_ID = "clinic_001";

//   // Fetch appointments from API
//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/appointments`);
//       if (!response.ok) throw new Error('Failed to fetch appointments');
//       const data = await response.json();
//       const clinicAppointments = data.filter((a: Appointment) => a.clinicId === CLINIC_ID);
//       setAppts(clinicAppointments);
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       alert('Failed to load appointments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async (id: string) => {
//     setUpdating(id);
//     try {
//       const response = await fetch(`${API_URL}/appointments/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: "Accepted" })
//       });

//       if (!response.ok) throw new Error('Failed to accept appointment');

//       // Update local state
//       setAppts((prev) => prev.map((a) => 
//         a._id === id ? { ...a, status: "Accepted" } : a
//       ));
      
//       console.log('Appointment accepted successfully');
//     } catch (error) {
//       console.error('Error accepting appointment:', error);
//       alert('Failed to accept appointment');
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this appointment?')) return;
    
//     setUpdating(id);
//     try {
//       const response = await fetch(`${API_URL}/appointments/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) throw new Error('Failed to delete appointment');

//       // Remove from local state
//       setAppts((prev) => prev.filter((a) => a._id !== id));
      
//       console.log('Appointment deleted successfully');
//     } catch (error) {
//       console.error('Error deleting appointment:', error);
//       alert('Failed to delete appointment');
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const today = new Date().toISOString().split('T')[0];
  
//   // Today's appointments (Pending & Accepted)
//   const todayAppts = appts.filter((a) => 
//     a.status === "Pending" || a.status === "Accepted"
//   );

//   // History appointments with date filtering and search
//   const historyAppts = appts.filter((a) => {
//     // Only show visited appointments
//     if (a.status !== "Visited") return false;
    
//     // Apply date range filters
//     if (dateFrom && a.date < dateFrom) return false;
//     if (dateTo && a.date > dateTo) return false;
    
//     // Apply search filter
//     if (searchTerm) {
//       const q = searchTerm.toLowerCase();
//       return (
//         a.petName?.toLowerCase().includes(q) || 
//         a.ownerName?.toLowerCase().includes(q) || 
//         a.doctorName?.toLowerCase().includes(q)
//       );
//     }
    
//     return true;
//   });

//   const statusBadge = (status: string) => {
//     const map: Record<string, string> = {
//       Accepted: "bg-green-100 text-green-700",
//       Pending: "bg-yellow-100 text-yellow-700",
//       Visited: "bg-blue-100 text-blue-700",
//       Deleted: "bg-red-100 text-red-600",
//     };
//     return map[status] || "bg-gray-100 text-gray-600";
//   };

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
//         <h1 className="text-2xl font-bold text-gray-900">Manage Appointments</h1>
//         <p className="text-gray-500 mt-1">Today's requests and appointment history</p>
//       </div>

//       {/* Today's Requests */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="font-bold text-gray-900">Today's Appointment Requests</h2>
//           <span className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-medium">
//             {todayAppts.length} requests
//           </span>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
//                 <th className="pb-3 pr-4">Pet ID</th>
//                 <th className="pb-3 pr-4">Pet Name</th>
//                 <th className="pb-3 pr-4">Owner Contact</th>
//                 <th className="pb-3 pr-4">Doctor</th>
//                 <th className="pb-3 pr-4">Time</th>
//                 <th className="pb-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {todayAppts.map((appt) => (
//                 <tr key={appt._id} className="hover:bg-gray-50 transition">
//                   <td className="py-4 pr-4 text-xs font-mono text-gray-500">{appt.petId}</td>
//                   <td className="py-4 pr-4 text-sm font-medium text-gray-900">{appt.petName}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{appt.ownerContact || 'N/A'}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{appt.doctorName}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{appt.time}</td>
//                   <td className="py-4">
//                     {appt.status === "Pending" ? (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleAccept(appt._id)}
//                           disabled={updating === appt._id}
//                           className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <CheckCircle2 className="w-3.5 h-3.5" /> 
//                           {updating === appt._id ? 'Updating...' : 'Accept'}
//                         </button>
//                         <button
//                           onClick={() => handleDelete(appt._id)}
//                           disabled={updating === appt._id}
//                           className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <Trash2 className="w-3.5 h-3.5" /> 
//                           {updating === appt._id ? 'Deleting...' : 'Delete'}
//                         </button>
//                       </div>
//                     ) : (
//                       <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(appt.status)}`}>
//                         {appt.status}
//                       </span>
//                     )}
//                     </td>
//                    </tr>
//               ))}
              
//               {todayAppts.length === 0 && (
//                 <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-sm">No requests for today</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Appointment History */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
//           <h2 className="font-bold text-gray-900">Appointment History</h2>
//           <div className="flex flex-wrap gap-2 items-center">
//             <div className="relative">
//               <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
//               <input
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-40"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Filter className="w-4 h-4 text-gray-400" />
//               <input
//                 type="date"
//                 value={dateFrom}
//                 onChange={(e) => setDateFrom(e.target.value)}
//                 className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//               />
//               <span className="text-gray-400 text-sm">to</span>
//               <input
//                 type="date"
//                 value={dateTo}
//                 onChange={(e) => setDateTo(e.target.value)}
//                 className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
//                 <th className="pb-3 pr-4">Date</th>
//                 <th className="pb-3 pr-4">Pet</th>
//                 <th className="pb-3 pr-4">Owner</th>
//                 <th className="pb-3 pr-4">Doctor</th>
//                 <th className="pb-3 pr-4">Type</th>
//                 <th className="pb-3">Status</th>
//                </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {historyAppts.map((appt) => (
//                 <tr key={appt._id} className="hover:bg-gray-50 transition">
//                   <td className="py-4 pr-4 text-sm text-gray-600">{appt.date}</td>
//                   <td className="py-4 pr-4 text-sm font-medium text-gray-900">{appt.petName}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{appt.ownerName || 'N/A'}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{appt.doctorName}</td>
//                   <td className="py-4 pr-4">
//                     <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{appt.type}</span>
//                   </td>
//                   <td className="py-4">
//                     <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(appt.status)}`}>
//                       {appt.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//               {historyAppts.length === 0 && (
//                 <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-sm">No history records found</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { CheckCircle2, Trash2, Calendar, Filter, Search } from "lucide-react";

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
  ownerId: string;
  ownerName?: string;
  ownerContact?: string;
  status: string;
  createdAt?: string;
};

export default function ClinicAppointments() {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const API_URL = 'https://pet-care-server-one.vercel.app';
  // CHANGE THIS: Use the correct clinic ID for "Dhaka Pet Clinic"
  const CLINIC_ID = "clinic_1777198034685";  // Changed from "clinic_001"

  // Fetch appointments from API
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      // Filter appointments for Dhaka Pet Clinic
      const clinicAppointments = data.filter((a: Appointment) => a.clinicId === CLINIC_ID);
      setAppts(clinicAppointments);
      console.log("Dhaka Pet Clinic appointments:", clinicAppointments); // Debug log
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    setUpdating(id);
    try {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: "Accepted" })
      });

      if (!response.ok) throw new Error('Failed to accept appointment');

      // Update local state
      setAppts((prev) => prev.map((a) => 
        a._id === id ? { ...a, status: "Accepted" } : a
      ));
      
      console.log('Appointment accepted successfully');
    } catch (error) {
      console.error('Error accepting appointment:', error);
      alert('Failed to accept appointment');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    setUpdating(id);
    try {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete appointment');

      // Remove from local state
      setAppts((prev) => prev.filter((a) => a._id !== id));
      
      console.log('Appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
    } finally {
      setUpdating(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  
  // Today's appointments (Pending & Accepted)
  const todayAppts = appts.filter((a) => 
    a.status === "Pending" || a.status === "Accepted"
  );

  // History appointments with date filtering and search
  const historyAppts = appts.filter((a) => {
    // Only show visited appointments
    if (a.status !== "Visited") return false;
    
    // Apply date range filters
    if (dateFrom && a.date < dateFrom) return false;
    if (dateTo && a.date > dateTo) return false;
    
    // Apply search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        a.petName?.toLowerCase().includes(q) || 
        a.ownerName?.toLowerCase().includes(q) || 
        a.doctorName?.toLowerCase().includes(q)
      );
    }
    
    return true;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Accepted: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Visited: "bg-blue-100 text-blue-700",
      Deleted: "bg-red-100 text-red-600",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Manage Appointments - Dhaka Pet Clinic</h1>
        <p className="text-gray-500 mt-1">Today's requests and appointment history</p>
      </div>

      {/* Today's Requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">Today's Appointment Requests</h2>
          <span className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-medium">
            {todayAppts.length} requests
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="pb-3 pr-4">Pet ID</th>
                <th className="pb-3 pr-4">Pet Name</th>
                {/* <th className="pb-3 pr-4">Owner Contact</th>  */}
                <th className="pb-3 pr-4">Doctor</th>
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {todayAppts.map((appt) => (
                <tr key={appt._id} className="hover:bg-gray-50 transition">
                  <td className="py-4 pr-4 text-xs font-mono text-gray-500">{appt.petId}</td>
                  <td className="py-4 pr-4 text-sm font-medium text-gray-900">{appt.petName}</td>
                  {/* <td className="py-4 pr-4 text-sm text-gray-600">{appt.ownerContact || 'N/A'}</td> */}
                  <td className="py-4 pr-4 text-sm text-gray-600">Dr. {appt.doctorName}</td>
                  <td className="py-4 pr-4 text-sm text-gray-600">{appt.time}</td>
                  <td className="py-4">
                    {appt.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(appt._id)}
                          disabled={updating === appt._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> 
                          {updating === appt._id ? 'Updating...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleDelete(appt._id)}
                          disabled={updating === appt._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> 
                          {updating === appt._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    ) : (
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(appt.status)}`}>
                        {appt.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              
              {todayAppts.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-sm">No requests for today</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="font-bold text-gray-900">Appointment History</h2>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-gray-400 text-sm">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Pet</th>
                {/* <th className="pb-3 pr-4">Owner</th> */}
                <th className="pb-3 pr-4">Doctor</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {historyAppts.map((appt) => (
                <tr key={appt._id} className="hover:bg-gray-50 transition">
                  <td className="py-4 pr-4 text-sm text-gray-600">{appt.date}</td>
                  <td className="py-4 pr-4 text-sm font-medium text-gray-900">{appt.petName}</td>
                  {/* <td className="py-4 pr-4 text-sm text-gray-600">{appt.ownerName || 'N/A'}</td> */}
                  <td className="py-4 pr-4 text-sm text-gray-600">Dr. {appt.doctorName}</td>
                  <td className="py-4 pr-4">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{appt.type}</span>
                  </td>
                  <td className="py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
              {historyAppts.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-sm">No history records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}