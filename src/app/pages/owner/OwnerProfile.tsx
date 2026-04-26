import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera } from "lucide-react";

export default function OwnerProfile() {
  const { currentUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">View and manage your personal information</p>
      </div>

      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <Save className="w-4 h-4" /> Profile updated successfully!
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-teal-500 to-emerald-600 relative">
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden shadow-lg">
                <img
                  src={currentUser?.avatar || ""}
                  alt={currentUser?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-3xl">
                  {currentUser?.name?.charAt(0)}
                </div>
              </div>
              {editing && (
                <button className="absolute -bottom-1 -right-1 bg-teal-600 p-1.5 rounded-lg cursor-pointer">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 px-6 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{form.name}</h2>
              <span className="text-sm text-gray-500">Pet Owner</span>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Full Name", field: "name", icon: <User className="w-4 h-4 text-gray-400" />, type: "text" },
              { label: "Email Address", field: "email", icon: <Mail className="w-4 h-4 text-gray-400" />, type: "email" },
              { label: "Phone Number", field: "phone", icon: <Phone className="w-4 h-4 text-gray-400" />, type: "tel" },
            ].map(({ label, field, icon, type }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
                {editing ? (
                  <input
                    type={type}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                    {icon}
                    <span className="text-sm text-gray-900">{form[field as keyof typeof form]}</span>
                  </div>
                )}
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Address</label>
              {editing ? (
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              ) : (
                <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-900">West baridhara, plot : KA -16/B Inside Dhaka City, gulshan</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
