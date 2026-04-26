import { useState, useEffect } from "react";
import { Building2, MapPin, Mail, Phone, Clock, Edit2, Save, X, Plus, Trash2, Camera } from "lucide-react";

type Clinic = {
  _id: string;
  name: string;
  location: string;
  email: string;
  phone: string;
  timing: string;
  services: string[];
  image: string;
  rating: number;
  totalDoctors: number;
  ownerId?: string;
};

export default function ClinicDetails() {
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Clinic | null>(null);
  const [newService, setNewService] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_URL = 'https://pet-care-server-one.vercel.app';
  const CLINIC_ID = "clinic_001";

  useEffect(() => {
    fetchClinic();
  }, []);

  const fetchClinic = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/clinics`);
      if (!response.ok) throw new Error('Failed to fetch clinic');
      const data = await response.json();
      const currentClinic = data.find((c: Clinic) => c._id === CLINIC_ID);
      
      if (currentClinic) {
        setClinic(currentClinic);
        setForm({ ...currentClinic, services: [...currentClinic.services] });
      } else if (data.length > 0) {
        // Fallback to first clinic
        setClinic(data[0]);
        setForm({ ...data[0], services: [...data[0].services] });
      }
    } catch (error) {
      console.error('Error fetching clinic:', error);
      alert('Failed to load clinic data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form) return;
    
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/clinics/${form._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error('Failed to update clinic');

      const updatedClinic = await response.json();
      setClinic(updatedClinic);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating clinic:', error);
      alert('Failed to update clinic. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (clinic) {
      setForm({ ...clinic, services: [...clinic.services] });
    }
    setEditing(false);
  };

  const addService = () => {
    if (newService.trim() && form) {
      setForm({ ...form, services: [...form.services, newService.trim()] });
      setNewService("");
    }
  };

  const removeService = (idx: number) => {
    if (form) {
      setForm({ ...form, services: form.services.filter((_, i) => i !== idx) });
    }
  };

  if (loading || !clinic || !form) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading clinic details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinic Details</h1>
          <p className="text-gray-500 mt-1">Manage your clinic information</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition"
          >
            <Edit2 className="w-4 h-4" /> Edit Details
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleCancel} 
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium cursor-pointer transition"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          ✓ Clinic details updated successfully!
        </div>
      )}

      {/* Clinic Image */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
        <div className="relative h-56">
          <img
            src={editing ? form.image : clinic.image}
            alt={clinic.name}
            className="w-full h-full object-cover"
          />
          {editing && (
            <>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button className="bg-white/90 hover:bg-white px-4 py-2 rounded-xl text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer transition">
                  <Camera className="w-4 h-4" /> Change Image
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Image URL"
                  className="w-full px-3 py-2 bg-white/90 border border-white/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Details Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
        <h2 className="font-bold text-gray-900 mb-5">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "Clinic Name", field: "name", icon: <Building2 className="w-4 h-4 text-gray-400" /> },
            { label: "Email", field: "email", icon: <Mail className="w-4 h-4 text-gray-400" /> },
            { label: "Phone", field: "phone", icon: <Phone className="w-4 h-4 text-gray-400" /> },
            { label: "Timing", field: "timing", icon: <Clock className="w-4 h-4 text-gray-400" /> },
          ].map(({ label, field, icon }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
              {editing ? (
                <input
                  value={(form as any)[field] || ""}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                  {icon}
                  <span className="text-sm text-gray-900">{(clinic as any)[field] || "N/A"}</span>
                </div>
              )}
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Location</label>
            {editing ? (
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">{clinic.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Services Offered</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {(editing ? form.services : clinic.services).map((service, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                editing ? "bg-teal-100 text-teal-700" : "bg-teal-50 text-teal-700"
              }`}
            >
              {service}
              {editing && (
                <button 
                  onClick={() => removeService(idx)} 
                  className="cursor-pointer hover:text-red-500 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          {(!editing && clinic.services.length === 0) && (
            <div className="text-gray-400 text-sm">No services listed</div>
          )}
        </div>
        
        {editing && (
          <div className="flex gap-2">
            <input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addService()}
              placeholder="Add new service..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={addService}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}