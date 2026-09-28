import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Calendar,
  XCircle,
  Filter,
  User,
  ArrowRight,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { FollowUp, FollowUpStatus } from '../types';

interface FollowUpManagerProps {
  onSelectLeadForWhatsApp: (leadId: string) => void;
}

export const FollowUpManager: React.FC<FollowUpManagerProps> = ({
  onSelectLeadForWhatsApp,
}) => {
  const { followUps, addFollowUp, updateFollowUp, deleteFollowUp, leads, users } = useAgency();

  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'overdue' | 'upcoming' | 'completed'>('today');
  const [showAddModal, setShowAddModal] = useState(false);

  // New follow-up form state
  const [newLeadId, setNewLeadId] = useState(leads[0]?.id || '');
  const [newFollowUpDate, setNewFollowUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [newFollowUpTime, setNewFollowUpTime] = useState('11:00');
  const [newNotes, setNewNotes] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredFollowUps = followUps.filter((f) => {
    if (activeFilter === 'completed') return f.status === 'Completed';
    if (f.status === 'Completed' || f.status === 'Cancelled') return false;

    if (activeFilter === 'today') return f.followUpDate === todayStr;
    if (activeFilter === 'overdue') return f.followUpDate < todayStr;
    if (activeFilter === 'upcoming') return f.followUpDate > todayStr;
    return true; // all
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === newLeadId);
    if (!lead) return;

    addFollowUp({
      leadId: lead.id,
      customerName: lead.customerName,
      whatsappNumber: lead.whatsappNumber,
      assignedUserId: lead.assignedSalespersonId,
      assignedUserName: lead.assignedSalespersonName,
      followUpDate: newFollowUpDate,
      followUpTime: newFollowUpTime,
      followUpNotes: newNotes,
      status: 'Pending',
      priority: newPriority,
    });

    setNewNotes('');
    setShowAddModal(false);
  };

  const overdueCount = followUps.filter(
    (f) => f.status === 'Pending' && f.followUpDate < todayStr
  ).length;

  const todayCount = followUps.filter(
    (f) => f.status === 'Pending' && f.followUpDate === todayStr
  ).length;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">
              Kerala Follow-up & Touchpoint Scheduler
            </h2>
            {overdueCount > 0 && (
              <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-700" />
                {overdueCount} Overdue
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Never lose an enquiry to delays. Follow up with guests within 24 hours of quotation delivery.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveFilter('today')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'today'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Due Today ({todayCount})</span>
        </button>

        <button
          onClick={() => setActiveFilter('overdue')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'overdue'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Overdue ({overdueCount})</span>
        </button>

        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeFilter === 'upcoming'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Upcoming
        </button>

        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Active ({followUps.filter((f) => f.status === 'Pending').length})
        </button>

        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeFilter === 'completed'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Completed History
        </button>
      </div>

      {/* Follow-ups List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <span className="font-bold text-slate-800">{filteredFollowUps.length}</span> follow-ups
          </span>
          <span className="text-[11px] text-slate-400">Time zone: IST (India Standard Time)</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFollowUps.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No follow-ups match this filter. Everything is up to date!
            </div>
          ) : (
            filteredFollowUps.map((item) => {
              const isOverdue = item.status === 'Pending' && item.followUpDate < todayStr;
              const isToday = item.status === 'Pending' && item.followUpDate === todayStr;

              return (
                <div
                  key={item.id}
                  className={`p-4 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                    isOverdue ? 'bg-amber-50/40' : isToday ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  {/* Left: Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900">{item.customerName}</span>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {item.leadId}
                      </span>
                      {isOverdue && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                          Overdue ({item.followUpDate})
                        </span>
                      )}
                      {isToday && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Due Today at {item.followUpTime}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.priority === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : item.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.priority} Priority
                      </span>
                    </div>

                    <p className="text-slate-600 font-medium text-xs max-w-xl">
                      {item.followUpNotes}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Scheduled: {item.followUpDate} at {item.followUpTime}</span>
                      <span>•</span>
                      <span>Assigned: {item.assignedUserName}</span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => onSelectLeadForWhatsApp(item.leadId)}
                      className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl font-semibold transition"
                      title="Launch WhatsApp with follow-up template"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    {item.status === 'Pending' && (
                      <button
                        onClick={() => updateFollowUp(item.id, { status: 'Completed' })}
                        className="flex items-center gap-1 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl font-semibold transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mark Done</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const newDate = prompt('Enter new date (YYYY-MM-DD):', todayStr);
                        if (newDate) {
                          updateFollowUp(item.id, { followUpDate: newDate, status: 'Rescheduled' });
                        }
                      }}
                      className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg text-xs"
                      title="Reschedule"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-emerald-800 px-5 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Schedule Customer Follow-up</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Lead *</label>
                <select
                  value={newLeadId}
                  onChange={(e) => setNewLeadId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.customerName} ({l.destination} - ₹{l.budget})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newFollowUpDate}
                    onChange={(e) => setNewFollowUpDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time *</label>
                  <input
                    type="time"
                    required
                    value={newFollowUpTime}
                    onChange={(e) => setNewFollowUpTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="High">High (Hot Lead)</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Action / Notes *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Call to confirm houseboat booking advance, send updated tariff..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
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
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
