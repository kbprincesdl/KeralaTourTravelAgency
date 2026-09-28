import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  IndianRupee,
  Phone,
  MessageSquare,
  FileText,
  Printer,
  CheckCircle2,
  AlertCircle,
  Car,
  MapPin,
  Hotel as HotelIcon,
  Search,
  Filter,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { Booking, BookingStatus } from '../types';

interface BookingManagerProps {
  onOpenNewBooking: () => void;
  onSelectBookingForWhatsApp: (bookingId: string) => void;
  onNavigateToItinerary: (bookingId: string) => void;
}

export const BookingManager: React.FC<BookingManagerProps> = ({
  onOpenNewBooking,
  onSelectBookingForWhatsApp,
  onNavigateToItinerary,
}) => {
  const { bookings, updateBooking, deleteBooking } = useAgency();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [activeVoucherBooking, setActiveVoucherBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    const matchesSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.packageName.toLowerCase().includes(search.toLowerCase()) ||
      b.destination.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const allStatuses: BookingStatus[] = [
    'Confirmed',
    'Partially Paid',
    'Fully Paid',
    'In Progress',
    'Completed',
    'Pending',
    'Cancelled',
  ];

  const handleRecordPayment = (booking: Booking) => {
    const amountStr = prompt(
      `Enter payment amount received for ${booking.customerName} (Current Balance: ₹${booking.balanceAmount.toLocaleString()}):`,
      String(booking.balanceAmount)
    );
    if (!amountStr) return;

    const added = parseFloat(amountStr);
    if (isNaN(added) || added <= 0) return;

    const newAdvance = (booking.advanceAmount || 0) + added;
    const newBalance = Math.max(0, booking.totalAmount - newAdvance);
    const newStatus: BookingStatus = newBalance === 0 ? 'Fully Paid' : 'Partially Paid';

    updateBooking(booking.id, {
      advanceAmount: newAdvance,
      balanceAmount: newBalance,
      bookingStatus: newStatus,
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">
              Kerala Bookings & Payment Ledger
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              {bookings.length} Bookings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmed guest reservations, advance deposits, remaining balance collections, and travel vouchers.
          </p>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Booking</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booking ID, guest, tour plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-semibold shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none w-full sm:w-auto font-medium"
          >
            <option value="all">All Booking Statuses</option>
            {allStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Guest Details</th>
                <th className="py-3 px-4">Tour Package & Dates</th>
                <th className="py-3 px-4">Hotels & Vehicle</th>
                <th className="py-3 px-4">Total Tariff</th>
                <th className="py-3 px-4">Advance Paid</th>
                <th className="py-3 px-4">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No bookings found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    {/* Booking ID */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-slate-900">
                      {b.id}
                      <div className="text-[10px] text-slate-400 font-sans font-normal">
                        {b.createdDate}
                      </div>
                    </td>

                    {/* Guest */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{b.customerName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{b.customerPhone}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {b.adults} Adults {b.children > 0 ? `+ ${b.children} Child` : ''}
                      </div>
                    </td>

                    {/* Package & Dates */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1">{b.packageName}</div>
                      <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5 font-medium">
                        <MapPin className="w-3 h-3" />
                        <span>{b.destination}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {b.travelStartDate} to {b.travelEndDate}
                      </div>
                    </td>

                    {/* Hotels & Transport */}
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] text-slate-700 line-clamp-1">
                        {b.hotelNames.join(', ')}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Car className="w-3 h-3" />
                        <span className="truncate max-w-[140px]">{b.transportation}</span>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                      ₹{b.totalAmount.toLocaleString()}
                    </td>

                    {/* Advance */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-emerald-700">
                      ₹{b.advanceAmount.toLocaleString()}
                    </td>

                    {/* Balance */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {b.balanceAmount === 0 ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Settled
                        </span>
                      ) : (
                        <div className="font-bold text-amber-900">
                          ₹{b.balanceAmount.toLocaleString()}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={b.bookingStatus}
                        onChange={(e) =>
                          updateBooking(b.id, { bookingStatus: e.target.value as BookingStatus })
                        }
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                          b.bookingStatus === 'Fully Paid'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : b.bookingStatus === 'Partially Paid'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : b.bookingStatus === 'In Progress'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : b.bookingStatus === 'Completed'
                            ? 'bg-slate-100 text-slate-800 border-slate-300'
                            : 'bg-teal-100 text-teal-800 border-teal-300'
                        }`}
                      >
                        {allStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRecordPayment(b)}
                          title="Record Payment / Add to Advance"
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 rounded-lg text-[10px] transition"
                        >
                          + Payment
                        </button>
                        <button
                          onClick={() => onSelectBookingForWhatsApp(b.id)}
                          title="Send Booking Voucher on WhatsApp"
                          className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveVoucherBooking(b)}
                          title="Print / View Confirmation Voucher"
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Confirmation Voucher Modal */}
      {activeVoucherBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-5 text-white flex items-center justify-between">
              <div>
                <div className="font-extrabold text-base font-outfit">Kerala Voyage Tours & Travels</div>
                <div className="text-xs text-emerald-200">Official Confirmation Voucher</div>
              </div>
              <button
                onClick={() => setActiveVoucherBooking(null)}
                className="text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400">Voucher Ref:</span>
                  <span className="font-mono font-bold text-slate-900 ml-2">
                    {activeVoucherBooking.id}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                  {activeVoucherBooking.bookingStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block mb-0.5">Guest Name</span>
                  <span className="font-bold text-sm text-slate-900">
                    {activeVoucherBooking.customerName}
                  </span>
                  <div className="text-[11px] text-slate-500">{activeVoucherBooking.customerPhone}</div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Holiday Dates</span>
                  <span className="font-bold text-slate-900">
                    {activeVoucherBooking.travelStartDate} to {activeVoucherBooking.travelEndDate}
                  </span>
                  <div className="text-[11px] text-slate-500">
                    {activeVoucherBooking.adults} Adults, {activeVoucherBooking.children} Children
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                <div>
                  <span className="font-semibold text-slate-700">Tour Plan: </span>
                  <span className="font-bold text-slate-900">{activeVoucherBooking.packageName}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Reserved Stays: </span>
                  <span className="text-slate-800">{activeVoucherBooking.hotelNames.join(' • ')}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Vehicle: </span>
                  <span className="text-slate-800">{activeVoucherBooking.transportation}</span>
                </div>
              </div>

              {/* Billing Summary */}
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-3.5 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Total Tour Tariff:</span>
                  <span>₹{activeVoucherBooking.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Advance Received:</span>
                  <span>₹{activeVoucherBooking.advanceAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-emerald-200">
                  <span>Balance Payable:</span>
                  <span>₹{activeVoucherBooking.balanceAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Voucher</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
