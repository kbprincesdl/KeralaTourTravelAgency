import React from 'react';
import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  Send,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Percent,
  CalendarCheck,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { LeadStage, LeadSource } from '../types';

interface DashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewLead: () => void;
  onSelectLeadForWhatsApp: (leadId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateTab,
  onOpenNewLead,
  onSelectLeadForWhatsApp,
}) => {
  const { leads, bookings, followUps, users, updateFollowUp } = useAgency();

  const todayStr = new Date().toISOString().split('T')[0];

  // KPIs calculations
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.stage === 'New Lead').length;
  const activeLeads = leads.filter(
    (l) => l.stage !== 'Confirmed' && l.stage !== 'Lost'
  ).length;
  const pendingFollowUps = followUps.filter((f) => f.status === 'Pending');
  const overdueFollowUps = pendingFollowUps.filter((f) => f.followUpDate < todayStr);
  const quotesSent = leads.filter((l) => l.stage === 'Quote Sent').length;
  const confirmedLeads = leads.filter((l) => l.stage === 'Confirmed').length;
  const lostLeads = leads.filter((l) => l.stage === 'Lost').length;

  const totalBookingValue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalAdvanceCollected = bookings.reduce((sum, b) => sum + (b.advanceAmount || 0), 0);
  const conversionRate = totalLeads > 0 ? ((confirmedLeads / totalLeads) * 100).toFixed(1) : '0';

  // Leads by Source
  const sources: LeadSource[] = [
    'WhatsApp',
    'Social Media',
    'Phone Calls',
    'Website',
    'Referrals',
    'Manual Entry',
  ];
  const sourceCounts = sources.map((s) => ({
    source: s,
    count: leads.filter((l) => l.source === s).length,
    percentage: totalLeads > 0 ? Math.round((leads.filter((l) => l.source === s).length / totalLeads) * 100) : 0,
  }));

  // Leads by Pipeline Stage
  const stages: LeadStage[] = [
    'New Lead',
    'Contacted',
    'Requirement Collected',
    'Quote Sent',
    'Follow-up',
    'Confirmed',
    'Lost',
  ];
  const stageCounts = stages.map((st) => ({
    stage: st,
    count: leads.filter((l) => l.stage === st).length,
  }));

  // Leads by Salesperson
  const salesUsers = users.filter((u) => u.role === 'sales' || u.role === 'admin');
  const salesRepPerformance = salesUsers.map((user) => {
    const assigned = leads.filter((l) => l.assignedSalespersonId === user.id);
    const converted = assigned.filter((l) => l.stage === 'Confirmed').length;
    const rate = assigned.length > 0 ? Math.round((converted / assigned.length) * 100) : 0;
    return {
      user,
      assignedCount: assigned.length,
      convertedCount: converted,
      rate,
    };
  });

  // Upcoming / Overdue Follow-ups (limit to 5)
  const sortedFollowUps = [...pendingFollowUps].sort((a, b) => {
    return a.followUpDate.localeCompare(b.followUpDate);
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10 text-9xl">
          🌴
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kerala Season 2026 Active • High Demand</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold font-outfit text-white">
              Kerala Agency Sales & Operations Command Center
            </h1>
            <p className="text-xs md:text-sm text-emerald-200 mt-1 max-w-xl">
              Track leads from first WhatsApp enquiry to quotation, backwater houseboat confirmation, and completed Kerala tour.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('pipeline')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <span>View Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenNewLead}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>+ Record Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* 9 KPI Cards as per PRD Section 6 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
        {/* Total Leads */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Total Leads</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit">{totalLeads}</div>
          <div className="text-[11px] text-slate-500 mt-1">Recorded across all channels</div>
        </div>

        {/* New Leads */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">New Leads</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 font-outfit">{newLeads}</div>
          <div className="text-[11px] text-emerald-800 mt-1">Awaiting first contact</div>
        </div>

        {/* Active Leads */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Active Leads</span>
            <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-teal-800 font-outfit">{activeLeads}</div>
          <div className="text-[11px] text-slate-500 mt-1">In discussion / pipeline</div>
        </div>

        {/* Pending Follow-ups */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Pending Follow-ups</span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                overdueFollowUps.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit">
            {pendingFollowUps.length}
          </div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">
            {overdueFollowUps.length > 0 ? `⚠️ ${overdueFollowUps.length} Overdue!` : 'All on schedule'}
          </div>
        </div>

        {/* Quotes Sent */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Quotes Sent</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-800">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-800 font-outfit">{quotesSent}</div>
          <div className="text-[11px] text-slate-500 mt-1">Proposals shared with guests</div>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Confirmed Bookings</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 font-outfit">{confirmedLeads}</div>
          <div className="text-[11px] text-emerald-800 mt-1">{bookings.length} Total vouchers</div>
        </div>

        {/* Lost Leads */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Lost Leads</span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-800">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-800 font-outfit">{lostLeads}</div>
          <div className="text-[11px] text-slate-500 mt-1">Price / peak date dropped</div>
        </div>

        {/* Booking Value */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Total Booking Value</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit">
            ₹{(totalBookingValue / 1000).toFixed(0)}k
          </div>
          <div className="text-[11px] text-emerald-800 mt-1">
            ₹{(totalAdvanceCollected / 1000).toFixed(0)}k advance collected
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Conversion Rate</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-800 font-outfit">{conversionRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Enquiry to confirmed booking</div>
        </div>
      </div>

      {/* Middle Row: Leads by Source + Pipeline Funnel + Sales Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads by Source */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900">Leads by Channel Source</h3>
            <span className="text-xs text-slate-500">{totalLeads} total</span>
          </div>

          <div className="space-y-3">
            {sourceCounts.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>{item.source}</span>
                  <span className="text-slate-500 font-semibold">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.source === 'WhatsApp'
                        ? 'bg-emerald-500'
                        : item.source === 'Website'
                        ? 'bg-teal-500'
                        : item.source === 'Social Media'
                        ? 'bg-rose-500'
                        : item.source === 'Phone Calls'
                        ? 'bg-amber-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>WhatsApp is generating the highest volume of high-intent queries.</span>
          </div>
        </div>

        {/* Pipeline Funnel Progression */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900">Sales Pipeline Stages</h3>
            <button
              onClick={() => onNavigateTab('pipeline')}
              className="text-xs text-emerald-800 hover:underline font-semibold"
            >
              Open Kanban →
            </button>
          </div>

          <div className="space-y-2">
            {stageCounts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                  <span className="font-medium text-slate-700">{item.stage}</span>
                </div>
                <span className="font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Consultant Performance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900">Sales Rep Performance</h3>
            <span className="text-xs text-slate-500">Active quotas</span>
          </div>

          <div className="space-y-3.5">
            {salesRepPerformance.map(({ user, assignedCount, convertedCount, rate }, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-semibold text-slate-800 truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {assignedCount} Leads • {convertedCount} Won
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-emerald-800">{rate}%</div>
                  <div className="text-[10px] text-slate-400">Conversion</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
            <div>
              <span className="font-bold">Team Target:</span> 50% Conversion
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-emerald-800 font-semibold hover:underline"
            >
              Full Reports →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Follow-ups & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Due & Upcoming Follow-ups */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-sm text-slate-900">Due & Upcoming Follow-ups</h3>
            </div>
            <button
              onClick={() => onNavigateTab('followups')}
              className="text-xs text-emerald-800 font-semibold hover:underline"
            >
              View All ({pendingFollowUps.length}) →
            </button>
          </div>

          {sortedFollowUps.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              All follow-ups completed! No pending customer touches.
            </div>
          ) : (
            <div className="space-y-2.5">
              {sortedFollowUps.slice(0, 4).map((f) => {
                const isOverdue = f.followUpDate < todayStr;
                const isToday = f.followUpDate === todayStr;

                return (
                  <div
                    key={f.id}
                    className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 text-xs ${
                      isOverdue
                        ? 'bg-amber-50/60 border-amber-200'
                        : isToday
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 truncate">{f.customerName}</span>
                        {isOverdue ? (
                          <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">
                            Overdue ({f.followUpDate})
                          </span>
                        ) : isToday ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            Today ({f.followUpTime})
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">
                            {f.followUpDate} at {f.followUpTime}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {f.followUpNotes} • Rep: {f.assignedUserName}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onSelectLeadForWhatsApp(f.leadId)}
                        className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateFollowUp(f.id, { status: 'Completed' })}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-semibold transition"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Confirmed Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-sm text-slate-900">Recent Bookings & Advance</h3>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs text-emerald-800 font-semibold hover:underline"
            >
              View All ({bookings.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 truncate">{b.customerName}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {b.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {b.packageName} • {b.travelStartDate}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-slate-900">₹{b.totalAmount.toLocaleString()}</div>
                  <span
                    className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      b.bookingStatus === 'Fully Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.bookingStatus === 'Partially Paid'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {b.bookingStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
