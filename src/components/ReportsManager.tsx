import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  IndianRupee,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Download,
  Calendar,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const ReportsManager: React.FC = () => {
  const { leads, bookings, users, followUps, packages } = useAgency();

  const totalLeads = leads.length;
  const confirmedCount = leads.filter((l) => l.stage === 'Confirmed').length;
  const lostCount = leads.filter((l) => l.stage === 'Lost').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalAdvance = bookings.reduce((sum, b) => sum + (b.advanceAmount || 0), 0);
  const conversionRate = totalLeads > 0 ? ((confirmedCount / totalLeads) * 100).toFixed(1) : '0';

  // Sales rep performance
  const salesUsers = users.filter((u) => u.role === 'sales' || u.role === 'admin');
  const salesStats = salesUsers.map((user) => {
    const assigned = leads.filter((l) => l.assignedSalespersonId === user.id);
    const converted = assigned.filter((l) => l.stage === 'Confirmed').length;
    const completedFollowUps = followUps.filter(
      (f) => f.assignedUserId === user.id && f.status === 'Completed'
    ).length;
    const repRevenue = bookings
      .filter((b) => assigned.some((l) => l.id === b.leadId))
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const rate = assigned.length > 0 ? ((converted / assigned.length) * 100).toFixed(1) : '0';

    return {
      user,
      assignedCount: assigned.length,
      convertedCount: converted,
      completedFollowUps,
      repRevenue,
      rate,
    };
  });

  // Source breakdown
  const sources = ['WhatsApp', 'Website', 'Social Media', 'Phone Calls', 'Referrals', 'Manual Entry'];
  const sourceStats = sources.map((s) => {
    const count = leads.filter((l) => l.source === s).length;
    const converted = leads.filter((l) => l.source === s && l.stage === 'Confirmed').length;
    const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
    return { source: s, count, converted, pct };
  });

  // Export report to CSV
  const handleExportCSV = () => {
    let csv = 'Lead ID,Customer Name,Mobile,Source,Destination,Budget,Stage,Assigned Rep,Created Date\n';
    leads.forEach((l) => {
      csv += `"${l.id}","${l.customerName}","${l.mobileNumber}","${l.source}","${l.destination}","${l.budget}","${l.stage}","${l.assignedSalespersonName}","${l.createdDate}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kerala_agency_leads_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">
              Kerala Agency Business & Sales Analytics
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Season 2026 Insights
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate lead source acquisition, sales consultant conversion efficiency, and package booking metrics.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Leads CSV</span>
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase">Total Bookings Revenue</div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            ₹{totalAdvance.toLocaleString()} advance collected
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase">Conversion Rate</div>
          <div className="text-2xl font-extrabold text-emerald-800 font-outfit mt-1">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {confirmedCount} confirmed out of {totalLeads} enquiries
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase">Lost Leads Ratio</div>
          <div className="text-2xl font-extrabold text-rose-800 font-outfit mt-1">
            {totalLeads > 0 ? ((lostCount / totalLeads) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lostCount} lost (budget/peak season rates)
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase">Average Booking Value</div>
          <div className="text-2xl font-extrabold text-teal-800 font-outfit mt-1">
            ₹
            {bookings.length > 0
              ? Math.round(totalRevenue / bookings.length).toLocaleString()
              : 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across {bookings.length} confirmed bookings</div>
        </div>
      </div>

      {/* Sales Consultant Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Sales Consultant Performance</h3>
          <span className="text-xs text-slate-400">Target: 50% Conversion</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Sales Consultant</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Leads Assigned</th>
                <th className="py-3 px-4">Bookings Converted</th>
                <th className="py-3 px-4">Conversion Rate</th>
                <th className="py-3 px-4">Follow-ups Done</th>
                <th className="py-3 px-4 text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salesStats.map(({ user, assignedCount, convertedCount, completedFollowUps, repRevenue, rate }, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 flex items-center gap-2.5 font-bold text-slate-800">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <span>{user.name}</span>
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[10px] font-semibold text-slate-400">
                    {user.role}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{assignedCount}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-800">{convertedCount}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                      {rate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{completedFollowUps}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    ₹{repRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Enquiries by Lead Channel</h3>
          <div className="space-y-3">
            {sourceStats.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{item.source}</span>
                  <span>
                    {item.count} Leads ({item.pct}%) • {item.converted} Confirmed
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Lost Leads Analysis</h3>
          <p className="text-xs text-slate-500">
            Primary reasons cited by clients when declining Kerala quotation:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl">
              <div className="font-bold text-rose-900">
                Peak Season Surcharges (Christmas / New Year)
              </div>
              <p className="text-rose-700 text-[11px] mt-0.5">
                Guests with under ₹35k budget expecting private houseboat stay during peak December week when houseboat tariffs double.
              </p>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
              <div className="font-bold text-amber-900">Delayed First Response (&gt;2 Hours)</div>
              <p className="text-amber-700 text-[11px] mt-0.5">
                Guest booked with competing agency after enquiry received outside standard office hours.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="font-bold text-slate-800">Flight Ticket Price Spikes</div>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Postponed trip due to expensive airfares into Cochin Airport (COK).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
