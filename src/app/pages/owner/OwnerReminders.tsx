// import { useState } from "react";
// import { REMINDERS } from "../../data/mockData";
// import { Bell, Calendar, Clock, Stethoscope, Building2, RotateCcw, X, AlertCircle } from "lucide-react";

// export default function OwnerReminders() {
//   const [reminders, setReminders] = useState(REMINDERS.filter((r) => r.ownerId === "user_001"));
//   const [rescheduleId, setRescheduleId] = useState<string | null>(null);
//   const [newDate, setNewDate] = useState("");
//   const [newTime, setNewTime] = useState("");

//   const handleCancel = (id: string) => {
//     setReminders((prev) => prev.filter((r) => r._id !== id));
//   };

//   const handleReschedule = (id: string) => {
//     if (!newDate) return;
//     setReminders((prev) =>
//       prev.map((r) =>
//         r._id === id ? { ...r, dueDate: newDate, time: newTime || r.time } : r
//       )
//     );
//     setRescheduleId(null);
//     setNewDate("");
//     setNewTime("");
//   };

//   const typeColors: Record<string, string> = {
//     Vaccination: "bg-emerald-100 text-emerald-700",
//     Checkup: "bg-blue-100 text-blue-700",
//   };

//   return (
//     <div className="p-6 lg:p-8 max-w-7xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
//         <p className="text-gray-500 mt-1">Manage upcoming vaccinations and checkup reminders</p>
//       </div>

//       {reminders.length === 0 ? (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
//           <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//           <h3 className="font-semibold text-gray-700">No reminders</h3>
//           <p className="text-gray-400 text-sm mt-1">All caught up! No upcoming reminders.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {reminders.map((rem) => (
//             <div key={rem._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition">
//               <div className="bg-orange-50 p-3 rounded-xl flex-shrink-0">
//                 <Bell className="w-6 h-6 text-orange-500" />
//               </div>
//               <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 <div>
//                   <p className="text-xs text-gray-400 mb-0.5">Type</p>
//                   <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${typeColors[rem.type] || "bg-gray-100 text-gray-700"}`}>
//                     {rem.type}
//                   </span>
//                   <p className="text-sm font-medium text-gray-900 mt-1">{rem.petName}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-400 mb-0.5">Date & Time</p>
//                   <div className="flex items-center gap-1.5">
//                     <Calendar className="w-4 h-4 text-gray-400" />
//                     <span className="text-sm font-medium text-gray-900">{rem.dueDate}</span>
//                   </div>
//                   <div className="flex items-center gap-1.5 mt-0.5">
//                     <Clock className="w-4 h-4 text-gray-400" />
//                     <span className="text-sm text-gray-600">{rem.time}</span>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-1.5 mb-1">
//                     <Stethoscope className="w-4 h-4 text-gray-400" />
//                     <span className="text-sm text-gray-700">{rem.doctorName}</span>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <Building2 className="w-4 h-4 text-gray-400" />
//                     <span className="text-xs text-gray-500">{rem.clinicName}</span>
//                   </div>
//                   <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
//                     {rem.appointmentType}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 <button
//                   onClick={() => { setRescheduleId(rem._id); setNewDate(rem.dueDate); setNewTime(rem.time); }}
//                   className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-sm font-medium cursor-pointer transition"
//                 >
//                   <RotateCcw className="w-4 h-4" /> Reschedule
//                 </button>
//                 <button
//                   onClick={() => handleCancel(rem._id)}
//                   className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-sm font-medium cursor-pointer transition"
//                 >
//                   <X className="w-4 h-4" /> Cancel
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Reschedule Modal */}
//       {rescheduleId && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
//             <h2 className="font-bold text-gray-900 text-lg mb-4">Reschedule Reminder</h2>
//             <div className="space-y-3 mb-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">New Date</label>
//                 <input
//                   type="date"
//                   value={newDate}
//                   onChange={(e) => setNewDate(e.target.value)}
//                   className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">New Time</label>
//                 <input
//                   type="time"
//                   value={newTime}
//                   onChange={(e) => setNewTime(e.target.value)}
//                   className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => setRescheduleId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer">Cancel</button>
//               <button onClick={() => handleReschedule(rescheduleId)} className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition">Reschedule</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Bell, Calendar, Clock, Stethoscope, Building2, RotateCcw, X, AlertCircle } from "lucide-react";

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
  status: string;
  createdAt?: string;
};

type Reminder = {
  _id: string;
  type: string;
  petName: string;
  dueDate: string;
  time: string;
  doctorName: string;
  clinicName: string;
  appointmentType: string;
  ownerId: string;
  status: string;
};

export default function OwnerReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const API_URL = 'https://pet-care-server-one.vercel.app';

  // Fetch appointments and convert to reminders
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      
      // Filter appointments for current owner and convert to reminders
      const userAppointments = data.filter((a: Appointment) => a.ownerId === "user_001");
      
      // Convert appointments to reminders
      // Only show upcoming appointments (Pending, Accepted) as reminders
      const reminderData: Reminder[] = userAppointments
        .filter((a: Appointment) => a.status === "Pending" || a.status === "Accepted")
        .map((a: Appointment) => ({
          _id: a._id,
          type: a.type === "Online Consultation" ? "Checkup" : "Checkup",
          petName: a.petName,
          dueDate: a.date,
          time: a.time,
          doctorName: a.doctorName,
          clinicName: a.clinicName,
          appointmentType: a.type,
          ownerId: a.ownerId,
          status: a.status
        }));
      
      setReminders(reminderData);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      alert('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    setUpdating(id);
    try {
      // Delete the appointment from database
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to cancel appointment');

      // Remove from local state
      setReminders((prev) => prev.filter((r) => r._id !== id));
      console.log('Appointment cancelled successfully');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment');
    } finally {
      setUpdating(null);
    }
  };

  const handleReschedule = async (id: string) => {
    if (!newDate) {
      alert("Please select a new date");
      return;
    }

    setUpdating(id);
    try {
      // Update the appointment in database
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          date: newDate,
          time: newTime || undefined
        })
      });

      if (!response.ok) throw new Error('Failed to reschedule appointment');

      const updatedAppointment = await response.json();
      
      // Update local state
      setReminders((prev) =>
        prev.map((r) =>
          r._id === id 
            ? { ...r, dueDate: updatedAppointment.date, time: updatedAppointment.time } 
            : r
        )
      );
      
      setRescheduleId(null);
      setNewDate("");
      setNewTime("");
      alert("Appointment rescheduled successfully!");
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      alert('Failed to reschedule appointment');
    } finally {
      setUpdating(null);
    }
  };

  const typeColors: Record<string, string> = {
    Vaccination: "bg-emerald-100 text-emerald-700",
    Checkup: "bg-blue-100 text-blue-700",
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading reminders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
        <p className="text-gray-500 mt-1">Manage upcoming vaccinations and checkup reminders</p>
      </div>

      {reminders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h3 className="font-semibold text-gray-700">No reminders</h3>
          <p className="text-gray-400 text-sm mt-1">All caught up! No upcoming reminders.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.map((rem) => (
            <div key={rem._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition">
              <div className="bg-orange-50 p-3 rounded-xl flex-shrink-0">
                <Bell className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Type</p>
                  <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${typeColors[rem.type] || "bg-gray-100 text-gray-700"}`}>
                    {rem.type}
                  </span>
                  <p className="text-sm font-medium text-gray-900 mt-1">{rem.petName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Date & Time</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{rem.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{rem.time}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Stethoscope className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{rem.doctorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">{rem.clinicName}</span>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {rem.appointmentType}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => { setRescheduleId(rem._id); setNewDate(rem.dueDate); setNewTime(rem.time); }}
                  disabled={updating === rem._id}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-sm font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4" /> Reschedule
                </button>
                <button
                  onClick={() => handleCancel(rem._id)}
                  disabled={updating === rem._id}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-sm font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Reschedule Appointment</h2>
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setRescheduleId(null)} 
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleReschedule(rescheduleId)} 
                disabled={updating === rescheduleId}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating === rescheduleId ? "Rescheduling..." : "Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}