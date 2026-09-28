import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  MessageSquare,
  CalendarCheck,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { Lead, LeadStage, LeadSource } from '../types';

interface LeadsManagerProps {
  onOpenNewLead: () => void;
  onEditLead: (lead: Lead) => void;
  onConvertToBooking: (lead: Lead) => void;
  onSelectLeadForWhatsApp: (leadId: string) => void;
  searchFilter?: string;
}

export const LeadsManager: React.FC<LeadsManagerProps> = ({
  onOpenNewLead,
  onEditLead,
  onConvertToBooking,
  onSelectLeadForWhatsApp,
  searchFilter = '',
}) => {
  const { leads, updateLead, deleteLead, users } = useAgency();

  const [search, setSearch] = useState(searchFilter);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [repFilter, setRepFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdDate' | 'budget' | 'travelStartDate'>('createdDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter leads
  const filtered = leads.filter((lead) => {
    const query = search.toLowerCase();
    const matchesSearch =
      lead.customerName.toLowerCase().includes(query) ||
      lead.mobileNumber.toLowerCase().includes(query) ||
      lead.destination.toLowerCase().includes(query) ||
      lead.id.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query);

    const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesRep = repFilter === 'all' || lead.assignedSalespersonName === repFilter;

    return matchesSearch && matchesStage && matchesSource && matchesRep;
  });

  // Sort leads
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'budget') {
      const bA = a.quotedAmount || a.budget;
      const bB = b.quotedAmount || b.budget;
      return sortOrder === 'asc' ? bA - bB : bB - bA;
    }
    if (sortBy === 'travelStartDate') {
      return sortOrder === 'asc'
        ? a.travelStartDate.localeCompare(b.travelStartDate)
        : b.travelStartDate.localeCompare(a.travelStartDate);
    }
    // Default createdDate
    return sortOrder === 'asc'
      ? a.createdDate.localeCompare(b.createdDate)
      : b.createdDate.localeCompare(a.createdDate);
  });

  const allStages: LeadStage[] = [
    'New Lead',
    'Contacted',
    'Requirement Collected',
    'Quote Sent',
    'Follow-up',
    'Confirmed',
    'Lost',
  ];

  const allSources: LeadSource[] = [
    'WhatsApp',
    'Social Media',
    'Phone Calls',
    'Website',
    'Referrals',
    'Manual Entry',
    'Walk-in',
    'Other',
  ];

  const salesReps = Array.from(new Set(leads.map((l) => l.assignedSalespersonName)));

  return (
    <div className="space-y-4">
      {/* Top Banner & Action */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">
              Kerala Lead & Enquiry Repository
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              {leads.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Capture, route, and track all incoming Kerala tourist enquiries with direct WhatsApp launch.
          </p>
        </div>

        <button
          onClick={onOpenNewLead}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Capture New Enquiry</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by guest name, phone, email, destination, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Stage Filter */}
          <div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="all">All Pipeline Stages</option>
              {allStages.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="all">All Lead Sources</option>
              {allSources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          {/* Rep Filter */}
          <div>
            <select
              value={repFilter}
              onChange={(e) => setRepFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="all">All Sales Reps</option>
              {salesReps.map((rep) => (
                <option key={rep} value={rep}>
                  {rep}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort & Results Count */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing <span className="font-bold text-slate-800">{sorted.length}</span> of{' '}
            <span className="font-bold text-slate-800">{leads.length}</span> enquiries
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Sort By:</span>
            <button
              onClick={() => {
                if (sortBy === 'createdDate') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else {
                  setSortBy('createdDate');
                  setSortOrder('desc');
                }
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs transition flex items-center gap-1 ${
                sortBy === 'createdDate'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Date</span>
              {sortBy === 'createdDate' && (
                <ArrowUpDown className="w-3 h-3 text-emerald-600" />
              )}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'budget') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else {
                  setSortBy('budget');
                  setSortOrder('desc');
                }
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs transition flex items-center gap-1 ${
                sortBy === 'budget'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Budget</span>
              {sortBy === 'budget' && (
                <ArrowUpDown className="w-3 h-3 text-emerald-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-4">Lead ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Kerala Destination & Dates</th>
                <th className="py-3 px-4">Pax & Stay Req</th>
                <th className="py-3 px-4">Budget / Quote</th>
                <th className="py-3 px-4">Assigned Rep</th>
                <th className="py-3 px-4">Pipeline Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No matching Kerala leads found. Adjust your filters or add a new enquiry!
                  </td>
                </tr>
              ) : (
                sorted.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition group">
                    {/* Lead ID & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-800">{lead.id}</div>
                      <div className="text-[10px] text-slate-400">{lead.createdDate}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{lead.customerName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{lead.mobileNumber}</span>
                      </div>
                      {lead.email && (
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {lead.email}
                        </div>
                      )}
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          lead.source === 'WhatsApp'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.source === 'Website'
                            ? 'bg-teal-100 text-teal-800'
                            : lead.source === 'Social Media'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {lead.source}
                      </span>
                    </td>

                    {/* Destination & Dates */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[160px]">{lead.destination}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {lead.travelStartDate
                          ? `${lead.travelStartDate} to ${lead.travelEndDate || 'TBD'}`
                          : 'Flexible Dates'}
                      </div>
                    </td>

                    {/* Pax & Hotel Req */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-700">
                        {lead.adults} Adults {lead.children > 0 ? `+ ${lead.children} Child` : ''}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {lead.hotelRequirement}
                      </div>
                    </td>

                    {/* Budget / Quoted */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-emerald-800">
                        ₹{(lead.quotedAmount || lead.budget).toLocaleString()}
                      </div>
                      {lead.quotedAmount ? (
                        <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded font-semibold">
                          Quoted
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400">Budget est.</span>
                      )}
                    </td>

                    {/* Salesperson */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-700">{lead.assignedSalespersonName}</div>
                      {lead.followUpDate && (
                        <div className="text-[10px] text-amber-700 font-medium flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{lead.followUpDate}</span>
                        </div>
                      )}
                    </td>

                    {/* Stage with fast dropdown */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={lead.stage}
                        onChange={(e) => updateLead(lead.id, { stage: e.target.value as LeadStage })}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                          lead.stage === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : lead.stage === 'Quote Sent'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : lead.stage === 'Lost'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}
                      >
                        {allStages.map((st) => (
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
                          onClick={() => onSelectLeadForWhatsApp(lead.id)}
                          title="Open WhatsApp Proposal"
                          className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onConvertToBooking(lead)}
                          title="Convert to Confirmed Booking"
                          className="p-1.5 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-lg transition"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditLead(lead)}
                          title="Edit Details"
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete lead ${lead.id} (${lead.customerName})?`)) {
                              deleteLead(lead.id);
                            }
                          }}
                          title="Delete Lead"
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
    </div>
  );
};
