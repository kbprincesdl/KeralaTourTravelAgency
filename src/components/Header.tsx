import React, { useRef } from 'react';
import {
  Sparkles,
  Plus,
  Bell,
  Search,
  UserCheck,
  Palmtree,
  ShieldAlert,
  Camera,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { UserRole } from '../types';
import { GRAPHIC_AVATARS } from '../data/mockData';

interface HeaderProps {
  onOpenAI: () => void;
  onOpenNewLead: () => void;
  onOpenNewBooking: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAI,
  onOpenNewLead,
  onOpenNewBooking,
  searchQuery,
  onSearchChange,
}) => {
  const { currentUser, setCurrentUser, users, updateUser, followUps } = useAgency();
  const headerFileInputRef = useRef<HTMLInputElement>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueFollowUps = followUps.filter(
    (f) => f.status === 'Pending' && f.followUpDate < todayStr
  );

  const handleHeaderPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateUser(currentUser.id, { avatar: dataUrl });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRoleChange = (role: UserRole) => {
    const matchingUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(matchingUser);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-6 py-3 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Mobile Title / Search bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads, guests, phones, bookings, or hotels..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>
        </div>

        {/* Right: Actions, Role Switcher, AI Co-pilot */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap">
          {/* User & Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 pl-2 pr-1.5 py-1 rounded-xl border border-slate-200 text-xs">
            <input
              type="file"
              ref={headerFileInputRef}
              accept="image/*"
              onChange={handleHeaderPhotoUpload}
              className="hidden"
            />
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <div
                className="relative group cursor-pointer"
                onClick={() => headerFileInputRef.current?.click()}
                title="Click to upload profile picture from your device"
              >
                <img
                  src={currentUser.avatar || GRAPHIC_AVATARS.jibyAdmin}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-300 shrink-0 bg-white"
                />
                <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                  <Camera className="w-3 h-3" />
                </div>
              </div>
              <span className="font-bold text-slate-800 hidden sm:inline max-w-[90px] truncate" title={currentUser.name}>
                {currentUser.name}
              </span>
            </div>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const selected = users.find((u) => u.id === e.target.value);
                if (selected) setCurrentUser(selected);
              }}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              title="Switch user perspective to test roles and operational boundaries"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Overdue alert indicator */}
          {overdueFollowUps.length > 0 && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-medium"
              title={`${overdueFollowUps.length} follow-up(s) overdue`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span className="hidden md:inline">{overdueFollowUps.length} Overdue</span>
              <span className="md:hidden font-bold">{overdueFollowUps.length}</span>
            </div>
          )}

          {/* Action: Quick Lead */}
          <button
            onClick={onOpenNewLead}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Lead</span>
          </button>

          {/* AI Co-pilot Launcher */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition border border-emerald-600/50 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="font-bold">Kerala AI</span>
            <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1 py-0.2 rounded font-mono">
              3.8
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
