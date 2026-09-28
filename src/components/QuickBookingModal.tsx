import React, { useState } from 'react';
import { X, CalendarCheck, ShieldCheck } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { BookingStatus, Lead } from '../types';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToConvert?: Lead | null;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  isOpen,
  onClose,
  leadToConvert,
}) => {
  const { addBooking, packages, hotels, convertLeadToBooking } = useAgency();

  const [customerName, setCustomerName] = useState(leadToConvert?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(leadToConvert?.mobileNumber || '');
  const [whatsappNumber, setWhatsappNumber] = useState(leadToConvert?.whatsappNumber || '');
  const [customerEmail, setCustomerEmail] = useState(leadToConvert?.email || '');
  const [packageName, setPackageName] = useState(
    leadToConvert?.packageRequirement || packages[0]?.name || 'Classic Kerala Tour'
  );
  const [destination, setDestination] = useState(leadToConvert?.destination || 'Munnar - Alleppey');
  const [travelStartDate, setTravelStartDate] = useState(leadToConvert?.travelStartDate || '');
  const [travelEndDate, setTravelEndDate] = useState(leadToConvert?.travelEndDate || '');
  const [adults, setAdults] = useState(leadToConvert?.adults || 2);
  const [children, setChildren] = useState(leadToConvert?.children || 0);
  const [transportation, setTransportation] = useState(
    leadToConvert?.transportationRequirement || 'AC Sedan (Swift Dzire)'
  );
  const [selectedHotels, setSelectedHotels] = useState<string[]>([
    'Misty Mountain Resort Munnar',
    'Punnamada Deluxe Houseboat',
  ]);
  const [totalAmount, setTotalAmount] = useState(leadToConvert?.quotedAmount || leadToConvert?.budget || 36000);
  const [advanceAmount, setAdvanceAmount] = useState(
    Math.round((leadToConvert?.quotedAmount || leadToConvert?.budget || 36000) * 0.4)
  );
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('Confirmed');
  const [notes, setNotes] = useState(leadToConvert?.notes || '');

  if (!isOpen) return null;

  const balanceAmount = Math.max(0, totalAmount - advanceAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (leadToConvert) {
      convertLeadToBooking(leadToConvert.id, {
        customerName,
        customerPhone,
        whatsappNumber: whatsappNumber || customerPhone,
        customerEmail,
        packageName,
        destination,
        travelStartDate,
        travelEndDate,
        adults,
        children,
        hotelNames: selectedHotels,
        transportation,
        totalAmount,
        advanceAmount,
        balanceAmount,
        bookingStatus,
        notes,
      });
    } else {
      addBooking({
        customerName,
        customerPhone,
        whatsappNumber: whatsappNumber || customerPhone,
        customerEmail,
        packageName,
        destination,
        travelStartDate,
        travelEndDate,
        adults,
        children,
        hotelNames: selectedHotels,
        transportation,
        activities: ['Sightseeing', 'Houseboat Cruise'],
        totalAmount,
        advanceAmount,
        balanceAmount,
        bookingStatus,
        notes,
      });
    }

    onClose();
  };

  const handleToggleHotel = (hotelName: string) => {
    if (selectedHotels.includes(hotelName)) {
      setSelectedHotels(selectedHotels.filter((h) => h !== hotelName));
    } else {
      setSelectedHotels([...selectedHotels, hotelName]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <CalendarCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {leadToConvert ? `Convert Lead (${leadToConvert.id}) to Confirmed Booking` : 'Create New Booking'}
              </h2>
              <p className="text-xs text-emerald-200">
                Lock itinerary, assign hotel partners, and track payment receipts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Customer & Package */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Guest Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Phone *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  if (!whatsappNumber) setWhatsappNumber(e.target.value);
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Selected Package</label>
              <select
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                {packages.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
                <option value="Custom Kerala Circuit">Custom Kerala Circuit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Start Date</label>
              <input
                type="date"
                required
                value={travelStartDate}
                onChange={(e) => setTravelStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Travel End Date</label>
              <input
                type="date"
                required
                value={travelEndDate}
                onChange={(e) => setTravelEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adults</label>
                <input
                  type="number"
                  min="1"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Children</label>
                <input
                  type="number"
                  min="0"
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Transportation</label>
              <input
                type="text"
                value={transportation}
                onChange={(e) => setTransportation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Assigned Partner Hotels */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Assigned Accommodations & Houseboats
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hotels.map((h) => {
                const isSelected = selectedHotels.includes(h.name);
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => handleToggleHotel(h.name)}
                    className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="truncate">{h.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {h.location} • ₹{h.ratePerNight}/n
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Financials & Status */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Billing & Advance Payment Calculation</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Package Amount (₹)
                </label>
                <input
                  type="number"
                  step="500"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Advance Collected (₹)
                </label>
                <input
                  type="number"
                  step="500"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-semibold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Balance Remaining (₹)
                </label>
                <div className="px-3 py-2 text-xs bg-slate-200/70 border border-slate-300 rounded-lg font-bold text-slate-800">
                  ₹{balanceAmount.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Status</label>
                <select
                  value={bookingStatus}
                  onChange={(e) => setBookingStatus(e.target.value as BookingStatus)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-semibold"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Fully Paid">Fully Paid</option>
                  <option value="In Progress">In Progress (Trip Ongoing)</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operations Notes</label>
                <input
                  type="text"
                  placeholder="Chauffeur name, special requests, meal plan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              Confirm Booking & Generate Voucher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
