import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  CalendarCheck,
  History,
  Briefcase,
  FileText,
  Clock,
  Send,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { Customer } from '../types';

interface CustomerManagerProps {
  onSelectCustomerForWhatsApp: (whatsappNumber: string, customerName: string) => void;
  onOpenNewLeadForCustomer: (customer: Customer) => void;
}

export const CustomerManager: React.FC<CustomerManagerProps> = ({
  onSelectCustomerForWhatsApp,
  onOpenNewLeadForCustomer,
}) => {
  const { customers, logCustomerCommunication, currentUser } = useAgency();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [search, setSearch] = useState('');
  const [newLogType, setNewLogType] = useState<'WhatsApp' | 'Phone Call' | 'Email' | 'Quotation'>('WhatsApp');
  const [newLogSummary, setNewLogSummary] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobileNumber.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogSummary.trim() || !selectedCustomer) return;

    logCustomerCommunication(selectedCustomer.id, {
      type: newLogType,
      summary: newLogSummary.trim(),
    });

    setNewLogSummary('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">
              Customer Profiles & Relationship History
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {customers.length} Guests
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Retain guest preferences, previous Kerala holiday itineraries, and touchpoint communications.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Directory List (5 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[75vh]">
          {/* Search Bar */}
          <div className="p-3 border-b border-slate-200 bg-slate-50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guests by name, city, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Directory Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredCustomers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No customers found.</div>
            ) : (
              filteredCustomers.map((cust) => {
                const isSelected = cust.id === selectedCustomer?.id;
                return (
                  <button
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className={`w-full p-3.5 text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-l-4 border-emerald-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-bold text-xs text-slate-900 truncate">{cust.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{cust.mobileNumber}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{cust.city}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {cust.previousBookingsCount} Trips
                      </span>
                      {cust.totalSpent > 0 && (
                        <div className="text-[10px] font-bold text-emerald-800 mt-1">
                          ₹{(cust.totalSpent / 1000).toFixed(0)}k
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Customer Profile & History (7 cols) */}
        {selectedCustomer ? (
          <div className="lg:col-span-8 space-y-4">
            {/* Guest Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 font-outfit">
                      {selectedCustomer.name}
                    </h3>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {selectedCustomer.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {selectedCustomer.mobileNumber}
                    </span>
                    {selectedCustomer.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {selectedCustomer.email}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {selectedCustomer.city}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onSelectCustomerForWhatsApp(
                        selectedCustomer.whatsappNumber || selectedCustomer.mobileNumber,
                        selectedCustomer.name
                      )
                    }
                    className="flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => onOpenNewLeadForCustomer(selectedCustomer)}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Enquiry</span>
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Enquiries</div>
                  <div className="text-base font-extrabold text-slate-800 mt-0.5">
                    {selectedCustomer.previousEnquiriesCount}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Confirmed Tours</div>
                  <div className="text-base font-extrabold text-emerald-700 mt-0.5">
                    {selectedCustomer.previousBookingsCount}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Lifetime Value</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    ₹{selectedCustomer.totalSpent.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              {selectedCustomer.notes && (
                <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-amber-900">
                  <span className="font-bold">Staff Notes: </span>
                  {selectedCustomer.notes}
                </div>
              )}
            </div>

            {/* Travel History */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>Kerala Travel History</span>
              </h4>

              {selectedCustomer.travelHistory.length === 0 ? (
                <div className="text-slate-400 text-xs italic py-3">
                  No completed trips on record yet. Active enquiry in progress.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedCustomer.travelHistory.map((trip, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800">{trip.tripName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Dates: {trip.dates}</div>
                      </div>
                      <span className="font-mono text-[10px] font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                        {trip.bookingId}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Communication History & Touchpoints */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <History className="w-4 h-4 text-emerald-600" />
                <span>Communication Log & Interactions</span>
              </h4>

              {/* Log new communication form */}
              <form onSubmit={handleAddLog} className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Record Touchpoint:</span>
                  <select
                    value={newLogType}
                    onChange={(e) => setNewLogType(e.target.value as any)}
                    className="text-xs border border-slate-300 rounded-lg px-2.5 py-1 bg-white focus:outline-none"
                  >
                    <option value="WhatsApp">WhatsApp Message</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Quotation">Quotation Sent</option>
                    <option value="Email">Email Sent</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Summary of discussion (e.g. Sent Munnar quotation, guest prefers veg food)..."
                    value={newLogSummary}
                    onChange={(e) => setNewLogSummary(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Log</span>
                  </button>
                </div>
              </form>

              {/* History Timeline */}
              <div className="space-y-2.5">
                {selectedCustomer.communicationHistory.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                          comm.type === 'WhatsApp'
                            ? 'bg-emerald-100 text-emerald-800'
                            : comm.type === 'Phone Call'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {comm.type}
                      </span>
                      <span className="text-[10px] text-slate-400">{comm.date}</span>
                    </div>
                    <p className="text-slate-700 font-medium text-xs">{comm.summary}</p>
                    <div className="text-[10px] text-slate-400">Agent: {comm.agentName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Select a guest profile to view details.
          </div>
        )}
      </div>
    </div>
  );
};
