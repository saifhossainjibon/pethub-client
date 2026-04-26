import { useState, useEffect } from "react";
import { PETS } from "../../data/mockData";
import {
  Plus, Edit2, Trash2, X, Heart, CheckCircle2, AlertCircle, Search
} from "lucide-react";

type Pet = typeof PETS[0];

const emptyForm = {
  name: "", type: "Dog", breed: "", age: 0, weight: "",
  image: "", color: "", vaccinated: false
};

export default function OwnerMyPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editPet, setEditPet] = useState<Pet | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch pets from database when component mounts
  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://pet-care-server-one.vercel.app/pets');
      if (!response.ok) throw new Error('Failed to fetch pets');
      const data = await response.json();
      
      // Filter pets for current owner
      const userPets = data.filter((pet: Pet) => pet.ownerId === "user_001");
      setPets(userPets);
    } catch (error) {
      console.error('Error loading pets:', error);
      alert('Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const filtered = pets.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.breed.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditPet(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (pet: Pet) => {
    setEditPet(pet);
    setForm({
      name: pet.name, type: pet.type, breed: pet.breed,
      age: pet.age, weight: pet.weight, image: pet.image,
      color: pet.color, vaccinated: pet.vaccinated
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.breed) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSaving(true);

    try {
      if (editPet) {
        // UPDATE existing pet
        const response = await fetch(`https://pet-care-server-one.vercel.app/pets/${editPet._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form)
        });

        if (!response.ok) {
          throw new Error('Failed to update pet');
        }

        const updatedPet = await response.json();
        console.log('Pet updated successfully:', updatedPet);
        
        // Refresh pets list from database
        await fetchPets();
        
      } else {
        // ADD new pet
        const response = await fetch('https://pet-care-server-one.vercel.app/pets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...form,
            ownerId: "user_001",
            ownerName: "Ayesha Johnson",
            ownerContact: "01886451432",
            lastCheckup: new Date().toISOString().split("T")[0],
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save pet');
        }

        const newPet = await response.json();
        console.log('After saving pet:', newPet);
        
        // Refresh pets list from database
        await fetchPets();
      }

      // Close modal on success
      setShowModal(false);
      
    } catch (error) {
      console.error('Error saving pet:', error);
      alert('Failed to save pet. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`https://pet-care-server-one.vercel.app/pets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete pet');
      }

      console.log('Pet deleted successfully');
      
      // Refresh pets list from database
      await fetchPets();
      setDeleteConfirm(null);
      
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert('Failed to delete pet. Please try again.');
    }
  };

  const PET_TYPES = ["Dog", "Cat", "Rabbit", "Bird", "Fish", "Hamster", "Other"];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Pets</h1>
          <p className="text-gray-500 mt-1">Manage your registered pets</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Pet
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          placeholder="Search pets..."
          className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading your pets...</p>
        </div>
      ) : (
        /* Pet Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((pet) => (
            <div key={pet._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="h-40 relative overflow-hidden">
                <img
                  src={pet.image || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=200&fit=crop"}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="bg-white/90 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {pet.type}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    onClick={() => openEdit(pet)}
                    className="bg-white/90 hover:bg-white p-1.5 rounded-lg cursor-pointer transition"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(pet._id)}
                    className="bg-white/90 hover:bg-red-50 p-1.5 rounded-lg cursor-pointer transition"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{pet.name}</h3>
                    <p className="text-gray-500 text-sm">{pet.breed}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">ID</p>
                    <p className="text-xs font-mono text-gray-600">{pet._id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <p className="text-xs text-gray-500">Age</p>
                    <p className="font-semibold text-gray-900">{pet.age} years</p>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <p className="text-xs text-gray-500">Weight</p>
                    <p className="font-semibold text-gray-900">{pet.weight}</p>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <p className="text-xs text-gray-500">Color</p>
                    <p className="font-semibold text-gray-900">{pet.color}</p>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <p className="text-xs text-gray-500">Last Checkup</p>
                    <p className="font-semibold text-gray-900 text-xs">{pet.lastCheckup}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 text-sm font-medium ${pet.vaccinated ? "text-green-600" : "text-red-500"}`}>
                  {pet.vaccinated ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {pet.vaccinated ? "Vaccinated" : "Not Vaccinated"}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No pets found</p>
              <p className="text-sm mt-1">Add your first pet to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-900 text-lg">{editPet ? "Edit Pet" : "Add New Pet"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pet Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Buddy"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {PET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Breed *</label>
                  <input
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    placeholder="e.g. Golden Retriever"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Color</label>
                  <input
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder="e.g. Golden"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Age (years)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                  <input
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="e.g. 28 kg"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="vaccinated"
                  checked={form.vaccinated}
                  onChange={(e) => setForm({ ...form, vaccinated: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="vaccinated" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Vaccinated
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : (editPet ? "Save Changes" : "Add Pet")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center mb-5">
              <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Delete Pet?</h3>
              <p className="text-gray-500 text-sm mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium cursor-pointer transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}