import { useState, useEffect } from "react";
import {
  Search, Plus, Eye, Edit2, Trash2, X, Building2, MapPin, Mail, Phone, Clock, Save
} from "lucide-react";

type Clinic = {
  _id: string;
  name: string;
  location: string;
  email: string;
  phone: string;
  timing: string;
  services: string[];
  image: string;
  totalDoctors: number;
  ownerId?: string;
};

const emptyForm: Partial<Clinic> = {
  name: "", location: "", email: "", phone: "", timing: "", services: [], image: "", totalDoctors: 0
};

export default function AdminClinics() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [search, setSearch] = useState("");
  const [viewClinic, setViewClinic] = useState<Clinic | null>(null);
  const [editClinic, setEditClinic] = useState<Clinic | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_URL = 'https://pet-care-server-one.vercel.app';

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/clinics`);
      if (!response.ok) throw new Error('Failed to fetch clinics');
      const data = await response.json();
      setClinics(data);
    } catch (error) {
      console.error('Error fetching clinics:', error);
      alert('Failed to load clinics');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name) {
      alert("Clinic name is required");
      return;
    }

    setSaving(true);

    const clinicData: Clinic = {
      _id: editClinic?._id || `clinic_${Date.now()}`,
      ownerId: editClinic?.ownerId || "user_admin",
      name: form.name,
      location: form.location || "",
      email: form.email || "",
      phone: form.phone || "",
      timing: form.timing || "",
      services: typeof form.services === "string"
        ? form.services.split(",").map((s: string) => s.trim()).filter(Boolean)
        : form.services || [],
      image: form.image || "https://images.unsplash.com/photo-1629909613654-28e377c37b1a?w=100&h=100&fit=crop",
      totalDoctors: Number(form.totalDoctors) || 0,
    };

    try {
      let response;
      if (editClinic) {
        // Update existing clinic
        response = await fetch(`${API_URL}/clinics/${editClinic._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clinicData)
        });
      } else {
        // Create new clinic
        response = await fetch(`${API_URL}/clinics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clinicData)
        });
      }

      if (!response.ok) throw new Error('Failed to save clinic');

      const savedClinic = await response.json();
      console.log('Clinic saved:', savedClinic);
      
      // Refresh clinics list
      await fetchClinics();
      
      // Reset form and close modal
      setForm(emptyForm);
      setShowAdd(false);
      setEditClinic(null);
      alert(editClinic ? "Clinic updated successfully!" : "Clinic added successfully!");
      
    } catch (error) {
      console.error('Error saving clinic:', error);
      alert('Failed to save clinic. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const response = await fetch(`${API_URL}/clinics/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete clinic');

      console.log('Clinic deleted successfully');
      
      // Refresh clinics list
      await fetchClinics();
      setDeleteId(null);
      alert("Clinic deleted successfully!");
      
    } catch (error) {
      console.error('Error deleting clinic:', error);
      alert('Failed to delete clinic. Please try again.');
    }
  };

  const openEdit = (clinic: Clinic) => {
    setEditClinic(clinic);
    setForm({ 
      ...clinic, 
      services: clinic.services.join(", ") 
    });
  };

  const filtered = clinics.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c._id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading clinics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Clinics</h1>
          <p className="text-gray-500 mt-1">System-wide clinic management</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setForm(emptyForm); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-medium cursor-pointer transition"
        >
          <Plus className="w-4 h-4" /> Add Clinic
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Clinics Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="pb-3 pr-4">Clinic</th>
                <th className="pb-3 pr-4">Clinic ID</th>
                <th className="pb-3 pr-4">Contact</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Doctors</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((clinic) => (
                <tr key={clinic._id} className="hover:bg-gray-50 transition">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={clinic.image || "https://images.unsplash.com/photo-1629909613654-28e377c37b1a?w=100&h=100&fit=crop"} 
                        alt={clinic.name} 
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0" 
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{clinic.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-xs font-mono text-gray-500">{clinic._id}</td>
                  <td className="py-4 pr-4 text-sm text-gray-600">{clinic.phone}</td>
                  <td className="py-4 pr-4 text-sm text-gray-600 max-w-[200px] truncate">{clinic.location}</td>
                  <td className="py-4 pr-4">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                      {clinic.totalDoctors} docs
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => setViewClinic(clinic)} 
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg cursor-pointer transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openEdit(clinic)} 
                        className="p-1.5 hover:bg-yellow-50 text-yellow-600 rounded-lg cursor-pointer transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteId(clinic._id)} 
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                   </td>
                 </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                    No clinics found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewClinic && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-900">Clinic Details</h2>
              <button onClick={() => setViewClinic(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <img 
                src={viewClinic.image || "https://images.unsplash.com/photo-1629909613654-28e377c37b1a?w=100&h=100&fit=crop"} 
                alt={viewClinic.name} 
                className="w-full h-40 object-cover rounded-xl mb-5" 
              />
              <h3 className="text-xl font-bold text-gray-900 mb-4">{viewClinic.name}</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: <MapPin className="w-4 h-4 text-gray-400" />, label: "Location", value: viewClinic.location },
                  { icon: <Mail className="w-4 h-4 text-gray-400" />, label: "Email", value: viewClinic.email },
                  { icon: <Phone className="w-4 h-4 text-gray-400" />, label: "Phone", value: viewClinic.phone },
                  { icon: <Clock className="w-4 h-4 text-gray-400" />, label: "Timing", value: viewClinic.timing },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    {icon}
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm text-gray-900">{value || 'N/A'}</p>
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {viewClinic.services?.map((s) => (
                      <span key={s} className="bg-teal-50 text-teal-700 text-xs px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAdd || editClinic) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-900 text-lg">{editClinic ? "Edit Clinic" : "Add New Clinic"}</h2>
              <button onClick={() => { setShowAdd(false); setEditClinic(null); }} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Clinic Name *", field: "name", type: "text" },
                { label: "Email", field: "email", type: "email" },
                { label: "Phone", field: "phone", type: "tel" },
                { label: "Location", field: "location", type: "text" },
                { label: "Timing", field: "timing", type: "text" },
                { label: "Image URL", field: "image", type: "text" },
                { label: "Total Doctors", field: "totalDoctors", type: "number" },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={(form as any)[field] || ""}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Services (comma-separated)</label>
                <input
                  value={typeof form.services === "string" ? form.services : (form.services || []).join(", ")}
                  onChange={(e) => setForm({ ...form, services: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. Vaccination, Surgery, Dental Care"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button 
                onClick={() => { setShowAdd(false); setEditClinic(null); }} 
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium cursor-pointer transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> 
                {saving ? "Saving..." : (editClinic ? "Save Changes" : "Add Clinic")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Delete Clinic?</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteId(null)} 
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium cursor-pointer transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}