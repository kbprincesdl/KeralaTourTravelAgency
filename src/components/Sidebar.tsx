import React, { useRef } from 'react';
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  CalendarClock,
  Briefcase,
  MapPin,
  Hotel,
  CalendarCheck,
  FileSpreadsheet,
  MessageCircle,
  BarChart3,
  ShieldCheck,
  Palmtree,
  Bot,
  ExternalLink,
  Camera,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { GRAPHIC_AVATARS } from '../data/mockData';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAI: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string | null;
  badgeColor?: string;
  roles: string[];
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAI,
}) => {
  const { currentUser, leads, followUps, bookings, hasPermission } = useAgency();

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingFollowUps = followUps.filter(
    (f) => f.status === 'Pending' && f.followUpDate <= todayStr
  );

  const navItems: NavGroup[] = [
    {
      group: 'Core Pipeline',
      items: [
        {
          id: 'dashboard',
          label: 'Central Dashboard',
          icon: LayoutDashboard,
          badge: null,
          roles: ['admin', 'sales', 'operations'],
        },
        {
          id: 'pipeline',
          label: 'Sales Pipeline (Kanban)',
          icon: KanbanSquare,
          badge: `${leads.length} Leads`,
          roles: ['admin', 'sales'],
        },
        {
          id: 'leads',
          label: 'Leads & Enquiries',
          icon: Briefcase,
          badge: leads.filter((l) => l.stage === 'New Lead').length > 0
            ? `${leads.filter((l) => l.stage === 'New Lead').length} New`
            : null,
          roles: ['admin', 'sales'],
        },
      ],
    },
    {
      group: 'Relationships & Follow-up',
      items: [
        {
          id: 'followups',
          label: 'Follow-up Scheduler',
          icon: CalendarClock,
          badge: pendingFollowUps.length > 0 ? `${pendingFollowUps.length} Due` : null,
          badgeColor: 'bg-amber-500 text-white',
          roles: ['admin', 'sales'],
        },
        {
          id: 'customers',
          label: 'Customer Profiles',
          icon: Users,
          badge: null,
          roles: ['admin', 'sales', 'operations'],
        },
        {
          id: 'whatsapp',
          label: 'WhatsApp Hub',
          icon: MessageCircle,
          badge: 'Templates',
          badgeColor: 'bg-emerald-600 text-white',
          roles: ['admin', 'sales', 'operations'],
        },
      ],
    },
    {
      group: 'Operations & Inventory',
      items: [
        {
          id: 'bookings',
          label: 'Bookings & Payments',
          icon: CalendarCheck,
          badge: `${bookings.length}`,
          roles: ['admin', 'operations', 'sales'],
        },
        {
          id: 'itineraries',
          label: 'Itinerary Builder',
          icon: FileSpreadsheet,
          badge: 'Day-by-Day',
          roles: ['admin', 'operations', 'sales'],
        },
        {
          id: 'packages',
          label: 'Tour Packages',
          icon: MapPin,
          badge: null,
          roles: ['admin', 'sales', 'operations'],
        },
        {
          id: 'hotels',
          label: 'Hotel Inventory',
          icon: Hotel,
          badge: null,
          roles: ['admin', 'operations'],
        },
      ],
    },
    {
      group: 'Management & Team',
      items: [
        {
          id: 'reports',
          label: 'Sales & Revenue Reports',
          icon: BarChart3,
          badge: null,
          roles: ['admin'],
        },
        {
          id: 'roles',
          label: 'Team & Role Access',
          icon: ShieldCheck,
          badge: null,
          roles: ['admin'],
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800 select-none">
      {/* Brand & Agency Logo */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
            <Palmtree className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5 font-outfit">
              <span>Kerala Voyage</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                V1 CRM
              </span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">
              God's Own Country Tours
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
        {navItems.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {group.group}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isAllowedForRole = hasPermission(item.id) || item.roles.includes(currentUser.role);

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : isAllowedForRole
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : isAllowedForRole
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                        item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Kerala AI Quick Box */}
      <div className="px-3 pb-3">
        <button
          onClick={onOpenAI}
          className="w-full bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border border-emerald-700/50 hover:border-emerald-500 rounded-xl p-3 text-left transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-emerald-300 font-bold text-xs mb-1">
            <div className="flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
              <span>Kerala AI Co-pilot</span>
            </div>
            <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1 py-0.2 rounded font-mono">
              Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-2">
            Instant Kerala travel itineraries, quotes, & WhatsApp messages.
          </p>
        </button>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate">
          <img
            src={currentUser.avatar || GRAPHIC_AVATARS.jibyAdmin}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full border border-emerald-500/50 object-cover shrink-0 bg-slate-900"
          />
          <div className="truncate">
            <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
            <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
              {currentUser.role}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
