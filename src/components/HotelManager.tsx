import React, { useState } from 'react';
import {
  Hotel as HotelIcon,
  Plus,
  MapPin,
  Phone,
  Mail,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Shield,
  Utensils,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { Hotel } from '../types';

export const HotelManager: React.FC = () => {
  const { hotels, addHotel, updateHotel, deleteHotel } = useAgency();

  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New hotel form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState<Hotel['location']>('Munnar');
  const [category, setCategory] = useState<Hotel['category']>('4-Star Premium');
  const [roomType, setRoomType] = useState('Valley View Deluxe Room');
  const [ratePerNight, setRatePerNight] = useState(5500);
  const [mealPlan, setMealPlan] = useState<Hotel['mealPlan']>('CP (Breakfast)');
  const [checkInTime, setCheckInTime] = useState('13:00');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');

  const filteredHotels = hotels.filter((h) => {
    const matchesLoc = locationFilter === 'all' || h.location === locationFilter;
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.location.toLowerCase().includes(search.toLowerCase()) ||
      h.category.toLowerCase().includes(search.toLowerCase());
    return matchesLoc && matchesSearch;
  });

  const locations = Array.from(new Set(hotels.map((h) => h.location)));

  const handleAddHotel = (e: React.FormEvent) => {
    e.preventDefault();

    addHotel({
      name,
      location,
      category,
      roomType,
      ratePerNight,
      mealPlan,
      checkInTime,
      checkOutTime,
      amenities: ['Free Wi-Fi', 'Restaurant', 'Scenic View', 'Private Bathroom'],
      contactPerson,
      contactPhone,
      contactEmail,
      status: 'Active',
      notes,
    });

    setName('');
    setContactPerson('');
    setContactPhone('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HotelIcon className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">
              Kerala Partner Hotel & Houseboat Inventory
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              {hotels.length} Properties
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Contracted partner resorts in Munnar, Thekkady, Alleppey backwaters, Kovalam, and Wayanad.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Accommodation</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hotels, houseboats, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-semibold shrink-0">Location:</span>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none w-full sm:w-auto"
          >
            <option value="all">All Kerala Destinations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition p-4 flex flex-col justify-between space-y-3"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {hotel.id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{hotel.location}, Kerala</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    hotel.category.includes('Luxury')
                      ? 'bg-purple-100 text-purple-800'
                      : hotel.category.includes('Houseboat')
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {hotel.category}
                </span>
              </div>

              {/* Room & Tariff */}
              <div className="bg-slate-50 rounded-xl p-2.5 mt-3 space-y-1.5 text-xs border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Room:</span>
                  <span className="font-medium text-slate-800 text-right">{hotel.roomType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Meal Plan:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <Utensils className="w-3 h-3" />
                    {hotel.mealPlan}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400">B2B Contract Rate:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ₹{hotel.ratePerNight.toLocaleString()}{' '}
                    <span className="text-[10px] font-normal text-slate-400">/ night</span>
                  </span>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {hotel.amenities.slice(0, 3).map((am, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full"
                  >
                    {am}
                  </span>
                ))}
                {hotel.amenities.length > 3 && (
                  <span className="text-[10px] text-slate-400 self-center">
                    +{hotel.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Contact Person & Status Footer */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">{hotel.contactPerson}</span>
                <span className="flex items-center gap-1 font-mono text-emerald-700">
                  <Phone className="w-3 h-3" />
                  {hotel.contactPhone}
                </span>
              </div>
              {hotel.notes && (
                <div className="text-[10px] text-amber-800 italic line-clamp-1">{hotel.notes}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Accommodation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-emerald-800 px-5 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Add Partner Hotel / Houseboat</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddHotel} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amber Dale Luxury Resort"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination *</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Munnar">Munnar</option>
                    <option value="Alleppey">Alleppey</option>
                    <option value="Thekkady">Thekkady</option>
                    <option value="Kumarakom">Kumarakom</option>
                    <option value="Kovalam">Kovalam</option>
                    <option value="Wayanad">Wayanad</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Poovar">Poovar</option>
                    <option value="Varkala">Varkala</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="4-Star Premium">4-Star Premium</option>
                    <option value="5-Star Luxury">5-Star Luxury</option>
                    <option value="3-Star Deluxe">3-Star Deluxe</option>
                    <option value="Backwater Houseboat">Backwater Houseboat</option>
                    <option value="Heritage Resort">Heritage Resort</option>
                    <option value="Treehouse / Eco Lodge">Treehouse / Eco Lodge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room Type</label>
                  <input
                    type="text"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">B2B Rate / Night (₹)</label>
                  <input
                    type="number"
                    step="500"
                    value={ratePerNight}
                    onChange={(e) => setRatePerNight(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meal Plan</label>
                <select
                  value={mealPlan}
                  onChange={(e) => setMealPlan(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="CP (Breakfast)">CP (Breakfast Included)</option>
                  <option value="MAP (Breakfast + Dinner)">MAP (Breakfast + Dinner)</option>
                  <option value="AP (All Meals)">AP (All Meals - Houseboat)</option>
                  <option value="EP (Room Only)">EP (Room Only)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reservation Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">B2B Contract Notes</label>
                <input
                  type="text"
                  placeholder="e.g. AC timings 9PM-6AM, Pearl spot fish fry included..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
