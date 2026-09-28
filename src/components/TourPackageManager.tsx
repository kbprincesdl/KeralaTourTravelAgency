import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Clock,
  IndianRupee,
  CheckCircle,
  XCircle,
  Car,
  Hotel as HotelIcon,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { TourPackage } from '../types';

export const TourPackageManager: React.FC = () => {
  const { packages, addPackage, updatePackage, deletePackage, hotels } = useAgency();

  const [expandedPkgId, setExpandedPkgId] = useState<string | null>(packages[0]?.id || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New package form state
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('Munnar - Thekkady - Alleppey');
  const [days, setDays] = useState(5);
  const [nights, setNights] = useState(4);
  const [price, setPrice] = useState(32000);
  const [description, setDescription] = useState('');
  const [transportation, setTransportation] = useState('Dedicated AC Sedan with Chauffeur');

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();

    addPackage({
      name,
      destination,
      durationDays: days,
      durationNights: nights,
      startingPrice: price,
      description,
      status: 'Active',
      tag: 'New Package',
      transportation,
      coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
      includedHotels: ['Misty Mountain Resort', 'Punnamada Deluxe Houseboat'],
      activities: ['Sightseeing', 'Houseboat Cruise', 'Spice Plantation Walk'],
      inclusions: [
        'Accommodation for mentioned nights',
        'Daily breakfast & all houseboat meals',
        'Private AC vehicle with fuel, tolls and driver bata',
      ],
      exclusions: ['Airfare / Train tickets', 'Personal expenses', 'Monument entry fees'],
      termsAndConditions: ['Advance 40% to lock reservation.'],
      dayWisePlan: [
        {
          dayNumber: 1,
          title: 'Arrival Cochin to Munnar',
          destination: 'Munnar',
          sightseeing: ['Cheeyappara Waterfalls', 'Valara Waterfalls'],
          hotelName: 'Misty Mountain Resort',
          mealPlan: 'CP (Breakfast)',
          transportation: 'Dedicated AC Sedan',
        },
        {
          dayNumber: 2,
          title: 'Munnar Sightseeing Tour',
          destination: 'Munnar',
          sightseeing: ['Eravikulam National Park', 'Mattupetty Dam', 'Echo Point'],
          hotelName: 'Misty Mountain Resort',
          mealPlan: 'CP (Breakfast)',
          transportation: 'Dedicated AC Sedan',
        },
      ],
    });

    setName('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">
              Kerala Tour Package Portfolio
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {packages.length} Itineraries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Administered tour packages with day-wise schedules, contracted partner stays, and standard inclusions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Tour Package</span>
        </button>
      </div>

      {/* Package Cards List */}
      <div className="space-y-4">
        {packages.map((pkg) => {
          const isExpanded = expandedPkgId === pkg.id;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition"
            >
              {/* Package Summary Row */}
              <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {pkg.coverImage && (
                    <img
                      src={pkg.coverImage}
                      alt={pkg.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200 hidden sm:block"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {pkg.id}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 font-outfit">
                        {pkg.name}
                      </h3>
                      {pkg.tag && (
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {pkg.tag}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pkg.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {pkg.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {pkg.destination}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {pkg.durationDays} Days / {pkg.durationNights} Nights
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-bold text-emerald-800">
                        <IndianRupee className="w-3.5 h-3.5" />
                        Starts ₹{pkg.startingPrice.toLocaleString()} / person
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 max-w-2xl">
                      {pkg.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <button
                    onClick={() =>
                      updatePackage(pkg.id, {
                        status: pkg.status === 'Active' ? 'Inactive' : 'Active',
                      })
                    }
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 transition"
                  >
                    {pkg.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => setExpandedPkgId(isExpanded ? null : pkg.id)}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'Day-wise Plan'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Day-Wise Details */}
              {isExpanded && (
                <div className="bg-slate-50 border-t border-slate-200 p-5 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Inclusions & Highlights */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Included in Package</span>
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {pkg.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exclusions */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-xs text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Exclusions</span>
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {pkg.exclusions.map((exc, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hotels & Transport */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Logistics & Stays</span>
                      </h4>
                      <div className="text-xs space-y-1.5">
                        <div>
                          <span className="font-semibold text-slate-700">Vehicle: </span>
                          <span className="text-slate-600">{pkg.transportation}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">Hotels: </span>
                          <div className="text-slate-600">
                            {pkg.includedHotels.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Day-by-Day Timeline */}
                  {pkg.dayWisePlan && pkg.dayWisePlan.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                        Day-by-Day Travel Schedule ({pkg.dayWisePlan.length} Days)
                      </h4>
                      <div className="space-y-3">
                        {pkg.dayWisePlan.map((day) => (
                          <div
                            key={day.dayNumber}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold text-[10px]">
                                  Day {day.dayNumber}
                                </span>
                                <span className="font-bold text-slate-900 text-xs">
                                  {day.title}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-600">
                                <span className="font-medium text-slate-700">Sightseeing: </span>
                                {day.sightseeing.join(' • ')}
                              </div>
                              {day.specialInstructions && (
                                <div className="text-[10px] text-amber-800 italic">
                                  Tip: {day.specialInstructions}
                                </div>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              <div className="font-semibold text-slate-800">{day.hotelName}</div>
                              <div className="text-[10px] text-emerald-700 font-medium">
                                {day.mealPlan}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Package Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-emerald-800 px-5 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Add Kerala Tour Package</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Backwaters & Tea Trails Experience"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination Circuit *</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Days</label>
                  <input
                    type="number"
                    min="1"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nights</label>
                  <input
                    type="number"
                    min="1"
                    value={nights}
                    onChange={(e) => setNights(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tariff (₹)</label>
                  <input
                    type="number"
                    step="500"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transportation</label>
                <input
                  type="text"
                  value={transportation}
                  onChange={(e) => setTransportation(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Key selling points of this package..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                ></textarea>
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
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
