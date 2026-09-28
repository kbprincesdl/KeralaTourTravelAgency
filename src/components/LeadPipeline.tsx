import React, { useState } from 'react';
import {
  KanbanSquare,
  Plus,
  ArrowRight,
  MessageSquare,
  CalendarCheck,
  Clock,
  User,
  IndianRupee,
  MapPin,
  ChevronRight,
  Edit2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { Lead, LeadStage } from '../types';

interface LeadPipelineProps {
  onOpenNewLead: () => void;
  onEditLead: (lead: Lead) => void;
  onConvertToBooking: (lead: Lead) => void;
  onSelectLeadForWhatsApp: (leadId: string) => void;
}

export const LeadPipeline: React.FC<LeadPipelineProps> = ({
  onOpenNewLead,
  onEditLead,
  onConvertToBooking,
  onSelectLeadForWhatsApp,
}) => {
  const { leads, updateLead } = useAgency();
  const [filterRep, setFilterRep] = useState<string>('all');

  const STAGES: { stage: LeadStage; label: string; color: string; bgHeader: string }[] = [
    { stage: 'New Lead', label: '1. New Lead', color: 'border-blue-400', bgHeader: 'bg-blue-50 text-blue-800' },
    { stage: 'Contacted', label: '2. Contacted', color: 'border-teal-400', bgHeader: 'bg-teal-50 text-teal-800' },
    { stage: 'Requirement Collected', label: '3. Requirement Collected', color: 'border-indigo-400', bgHeader: 'bg-indigo-50 text-indigo-800' },
    { stage: 'Quote Sent', label: '4. Quote Sent', color: 'border-purple-400', bgHeader: 'bg-purple-50 text-purple-800' },
    { stage: 'Follow-up', label: '5. Follow-up', color: 'border-amber-400', bgHeader: 'bg-amber-50 text-amber-800' },
    { stage: 'Confirmed', label: '6. Confirmed 🎉', color: 'border-emerald-500', bgHeader: 'bg-emerald-50 text-emerald-800' },
    { stage: 'Lost', label: '7. Lost', color: 'border-rose-400', bgHeader: 'bg-rose-50 text-rose-800' },
  ];

  const filteredLeads = filterRep === 'all'
    ? leads
    : leads.filter((l) => l.assignedSalespersonName === filterRep);

  const getNextStage = (current: LeadStage): LeadStage | null => {
    switch (current) {
      case 'New Lead':
        return 'Contacted';
      case 'Contacted':
        return 'Requirement Collected';
      case 'Requirement Collected':
        return 'Quote Sent';
      case 'Quote Sent':
        return 'Follow-up';
      case 'Follow-up':
        return 'Confirmed';
      default:
        return null;
    }
  };

  const handleAdvanceStage = (lead: Lead) => {
    const next = getNextStage(lead.stage);
    if (next) {
      updateLead(lead.id, { stage: next });
    }
  };

  const salesReps = Array.from(new Set(leads.map((l) => l.assignedSalespersonName)));

  return (
    <div className="space-y-4">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <KanbanSquare className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">
              Kerala Sales Conversion Pipeline
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {filteredLeads.length} Leads Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Progress leads systematically through each stage to eliminate missed enquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">Filter Rep:</span>
            <select
              value={filterRep}
              onChange={(e) => setFilterRep(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="all">All Sales Consultants</option>
              {salesReps.map((rep) => (
                <option key={rep} value={rep}>
                  {rep}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenNewLead}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1400px]">
          {STAGES.map(({ stage, label, color, bgHeader }) => {
            const columnLeads = filteredLeads.filter((l) => l.stage === stage);
            const totalStageValue = columnLeads.reduce(
              (sum, l) => sum + (l.quotedAmount || l.budget || 0),
              0
            );

            return (
              <div
                key={stage}
                className="w-72 shrink-0 bg-slate-100/80 rounded-2xl border border-slate-200/90 flex flex-col max-h-[78vh] overflow-hidden shadow-2xs"
              >
                {/* Column Header */}
                <div className={`p-3.5 border-b border-slate-200 ${bgHeader} flex items-center justify-between`}>
                  <div>
                    <h3 className="font-bold text-xs">{label}</h3>
                    <div className="text-[10px] opacity-75 font-medium">
                      ₹{(totalStageValue / 1000).toFixed(0)}k pipeline
                    </div>
                  </div>
                  <span className="font-extrabold text-xs px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-800 shadow-2xs">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                  {columnLeads.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs italic">
                      No leads in this stage
                    </div>
                  ) : (
                    columnLeads.map((lead) => {
                      const nextStage = getNextStage(lead.stage);

                      return (
                        <div
                          key={lead.id}
                          className="bg-white rounded-xl p-3 border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-sm transition space-y-2.5"
                        >
                          {/* Top Row: Lead ID & Source */}
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                              {lead.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
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
                          </div>

                          {/* Customer & Destination */}
                          <div>
                            <div className="font-bold text-xs text-slate-900 leading-tight">
                              {lead.customerName}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{lead.destination}</span>
                            </div>
                          </div>

                          {/* Requirements & Budget */}
                          <div className="bg-slate-50 rounded-lg p-2 text-[11px] space-y-1 text-slate-600 border border-slate-100">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Travellers:</span>
                              <span className="font-medium text-slate-700">
                                {lead.adults}A {lead.children > 0 ? `+ ${lead.children}C` : ''}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Budget / Quote:</span>
                              <span className="font-bold text-emerald-700">
                                ₹{(lead.quotedAmount || lead.budget).toLocaleString()}
                              </span>
                            </div>
                            {lead.followUpDate && (
                              <div className="flex justify-between items-center text-[10px] pt-0.5 border-t border-slate-200/60">
                                <span className="text-amber-700 flex items-center gap-1 font-semibold">
                                  <Clock className="w-3 h-3 text-amber-600" /> Follow-up:
                                </span>
                                <span className="font-semibold text-slate-700">{lead.followUpDate}</span>
                              </div>
                            )}
                          </div>

                          {/* Consultant & Actions */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate max-w-[120px]">
                              <User className="w-3 h-3 shrink-0" />
                              <span className="truncate">{lead.assignedSalespersonName}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => onSelectLeadForWhatsApp(lead.id)}
                                title="Chat on WhatsApp"
                                className="p-1 text-emerald-700 hover:bg-emerald-50 rounded transition"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onEditLead(lead)}
                                title="Edit Lead"
                                className="p-1 text-slate-500 hover:bg-slate-100 rounded transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {lead.stage !== 'Confirmed' && lead.stage !== 'Lost' && (
                                <button
                                  onClick={() => onConvertToBooking(lead)}
                                  title="Convert to Confirmed Booking"
                                  className="p-1 text-teal-700 hover:bg-teal-50 rounded transition"
                                >
                                  <CalendarCheck className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {nextStage && (
                                <button
                                  onClick={() => handleAdvanceStage(lead)}
                                  title={`Advance to ${nextStage}`}
                                  className="p-1 text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded transition flex items-center gap-0.5"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
