import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Sparkles,
  Calendar,
  MapPin,
  Car,
  Hotel as HotelIcon,
  Utensils,
  Share2,
  Copy,
  Check,
  Printer,
  Trash2,
  Edit2,
  ArrowRight,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { Itinerary, DayPlan } from '../types';

interface ItineraryManagerProps {
  onSelectCustomerForWhatsApp: (whatsappNumber: string, customerName: string) => void;
}

export const ItineraryManager: React.FC<ItineraryManagerProps> = ({
  onSelectCustomerForWhatsApp,
}) => {
  const { itineraries, addItinerary, updateItinerary, deleteItinerary, bookings, hotels, currentUser } =
    useAgency();

  const [selectedItnId, setSelectedItnId] = useState<string>(itineraries[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // New Itinerary form state
  const [customerName, setCustomerName] = useState('Vikram & Sneha Sharma');
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98201 44552');
  const [destination, setDestination] = useState('Munnar - Thekkady - Alleppey');
  const [packageTitle, setPackageTitle] = useState('5D/4N Kerala Serenity Tour');
  const [travelStartDate, setTravelStartDate] = useState('2026-10-14');
  const [travelEndDate, setTravelEndDate] = useState('2026-10-18');
  const [totalDays, setTotalDays] = useState(5);
  const [specialInstructions, setSpecialInstructions] = useState(
    'Private AC Sedan with driver Mr. Biju. Houseboat reporting at 12:00 PM.'
  );

  const [daysList, setDaysList] = useState<DayPlan[]>([
    {
      dayNumber: 1,
      title: 'Arrival Cochin to Munnar Tea Hills',
      destination: 'Munnar',
      sightseeing: ['Cheeyappara & Valara Waterfalls', 'Karadippara Viewpoint'],
      hotelName: 'Misty Mountain Resort Munnar',
      mealPlan: 'CP (Breakfast)',
      transportation: 'Dedicated AC Sedan',
      specialInstructions: 'Stop for fresh tender coconut on the hill ascent.',
    },
    {
      dayNumber: 2,
      title: 'Munnar High Altitude Tea Trails',
      destination: 'Munnar',
      sightseeing: ['Eravikulam National Park (Nilgiri Tahr)', 'Mattupetty Dam', 'Echo Point', 'Tea Museum'],
      hotelName: 'Misty Mountain Resort Munnar',
      mealPlan: 'CP (Breakfast)',
      transportation: 'Dedicated AC Sedan',
    },
    {
      dayNumber: 3,
      title: 'Munnar to Thekkady Spice Highlands',
      destination: 'Thekkady',
      sightseeing: ['Periyar Wildlife Sanctuary Boating', 'Guided Spice Plantation Walk', 'Kathakali Dance Show'],
      hotelName: 'Spice Village Thekkady',
      mealPlan: 'CP (Breakfast)',
      transportation: 'Dedicated AC Sedan',
    },
    {
      dayNumber: 4,
      title: 'Thekkady to Alleppey Houseboat Serenity',
      destination: 'Alleppey',
      sightseeing: ['Vembanad Lake canal cruise', 'Sunset over backwaters'],
      hotelName: 'Punnamada Deluxe Houseboat',
      mealPlan: 'AP (All Meals)',
      transportation: 'AC Sedan + Houseboat',
      specialInstructions: 'Check-in 12:00 PM. Authentic Kerala Sadya served on board.',
    },
    {
      dayNumber: 5,
      title: 'Alleppey to Cochin & Departure',
      destination: 'Cochin',
      sightseeing: ['Fort Kochi Chinese Fishing Nets', 'Jew Town & Synagogue'],
      hotelName: 'Departure',
      mealPlan: 'CP (Breakfast)',
      transportation: 'Dedicated AC Sedan',
      specialInstructions: 'Airport drop by 4:00 PM.',
    },
  ]);

  const selectedItinerary = itineraries.find((itn) => itn.id === selectedItnId) || itineraries[0];

  // AI Generator Integration
  const handleAIGenerate = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          durationDays: totalDays,
          budget: 'Premium',
          travelerType: 'Couple / Honeymoon',
          pace: 'Balanced',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update instructions with generated recommendations
        setSpecialInstructions(`AI Verified Travel Plan:\n${data.itinerary.slice(0, 300)}...`);
      }
    } catch (e) {
      console.warn('AI generator error:', e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveItinerary = (e: React.FormEvent) => {
    e.preventDefault();

    const created = addItinerary({
      customerName,
      whatsappNumber,
      destination,
      packageTitle,
      travelStartDate,
      travelEndDate,
      totalDays,
      preparedBy: currentUser.name,
      specialInstructions,
      days: daysList,
    });

    setSelectedItnId(created.id);
    setShowCreateModal(false);
  };

  const handleCopyFormattedItinerary = () => {
    if (!selectedItinerary) return;

    let text = `*🗺️ ${selectedItinerary.packageTitle}*\n`;
    text += `*Guest:* ${selectedItinerary.customerName}\n`;
    text += `*Dates:* ${selectedItinerary.travelStartDate} to ${selectedItinerary.travelEndDate} (${selectedItinerary.totalDays} Days)\n\n`;

    selectedItinerary.days.forEach((d) => {
      text += `📅 *Day ${d.dayNumber}: ${d.title} (${d.destination})*\n`;
      text += `• Sightseeing: ${d.sightseeing.join(', ')}\n`;
      text += `• Stay: ${d.hotelName} (${d.mealPlan})\n`;
      text += `• Transport: ${d.transportation}\n`;
      if (d.specialInstructions) text += `• Note: ${d.specialInstructions}\n`;
      text += `\n`;
    });

    if (selectedItinerary.specialInstructions) {
      text += `💡 *Logistics & Assistance:*\n${selectedItinerary.specialInstructions}\n\n`;
    }

    text += `Warm regards,\n*Kerala Voyage Tours & Travels*\n📞 +91 98470 12345`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">
              Kerala Day-Wise Itinerary Builder
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              {itineraries.length} Saved Plans
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Construct day-by-day travel schedules with sightseeing points, meal plans, chauffeur assignments, and 1-click sharing.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Itinerary</span>
        </button>
      </div>

      {/* Main 2-Column: Saved Itineraries (4 cols) & Active Day-wise Viewer (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Itineraries Selector */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3 h-fit">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            Active Guest Itineraries
          </h3>
          <div className="space-y-2">
            {itineraries.map((itn) => {
              const isSelected = itn.id === selectedItinerary?.id;
              return (
                <button
                  key={itn.id}
                  onClick={() => setSelectedItnId(itn.id)}
                  className={`w-full p-3 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>{itn.id}</span>
                    <span className="text-emerald-700 font-bold">{itn.totalDays} Days</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 truncate">{itn.packageTitle}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Guest: {itn.customerName}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {itn.travelStartDate} - {itn.travelEndDate}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Day-by-Day Viewer */}
        {selectedItinerary ? (
          <div className="lg:col-span-8 space-y-4">
            {/* Header info card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 font-outfit">
                      {selectedItinerary.packageTitle}
                    </h3>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {selectedItinerary.id}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-slate-700">
                      Guest: {selectedItinerary.customerName}
                    </span>
                    <span>•</span>
                    <span>
                      {selectedItinerary.travelStartDate} to {selectedItinerary.travelEndDate}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">{selectedItinerary.totalDays} Days</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyFormattedItinerary}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                    title="Copy formatted WhatsApp text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy for WhatsApp'}</span>
                  </button>

                  <button
                    onClick={() =>
                      onSelectCustomerForWhatsApp(
                        selectedItinerary.whatsappNumber,
                        selectedItinerary.customerName
                      )
                    }
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-2xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Special Instructions / Driver Info */}
              {selectedItinerary.specialInstructions && (
                <div className="mt-3.5 p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <span className="font-bold shrink-0">Logistics & Chauffeur Notes:</span>
                  <span>{selectedItinerary.specialInstructions}</span>
                </div>
              )}
            </div>

            {/* Day by Day Plan Cards */}
            <div className="space-y-3">
              {selectedItinerary.days.map((day) => (
                <div
                  key={day.dayNumber}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 text-xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-800 text-white font-extrabold text-xs">
                        Day {day.dayNumber}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{day.title}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{day.destination}</span>
                    </div>
                  </div>

                  {/* Sightseeing points */}
                  <div>
                    <span className="font-semibold text-slate-500 block mb-1">
                      Sightseeing & Activities:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {day.sightseeing.map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hotel & Transport badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <HotelIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold">{day.hotelName}</span>
                      </div>
                      <span className="text-[10px] bg-white border border-slate-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        {day.mealPlan}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-1.5 text-slate-700">
                      <Car className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{day.transportation}</span>
                    </div>
                  </div>

                  {day.specialInstructions && (
                    <div className="text-[11px] text-slate-500 italic bg-emerald-50/50 p-2 rounded-lg">
                      {day.specialInstructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Create New Itinerary Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">New Kerala Day-Wise Itinerary</h3>
                <p className="text-xs text-emerald-200">Prepare custom proposal with Gemini assistance</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItinerary} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer / Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Package Title *</label>
                  <input
                    type="text"
                    required
                    value={packageTitle}
                    onChange={(e) => setPackageTitle(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Circuit / Destination *</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={travelStartDate}
                    onChange={(e) => setTravelStartDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={travelEndDate}
                    onChange={(e) => setTravelEndDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* AI Auto-Plan Bar */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold text-emerald-900">
                    Need AI suggestions for travel pacing?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={isGeneratingAI}
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  {isGeneratingAI ? 'Consulting Gemini...' : 'Consult Kerala AI'}
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Logistics & Instructions
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold"
                >
                  Save Itinerary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
