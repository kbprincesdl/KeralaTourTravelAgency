import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Users,
  Check,
  X,
  Phone,
  Mail,
  Briefcase,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  UserPlus,
  Key,
  AlertTriangle,
  Building,
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { User, RoleDefinition, RolePermissions } from '../types';
import { GRAPHIC_AVATARS } from '../data/mockData';

const AVATAR_PRESETS = [
  { label: 'Jiby Emerald Monogram', url: GRAPHIC_AVATARS.jibyAdmin, isVector: true },
  { label: 'Voyager Compass', url: GRAPHIC_AVATARS.compass, isVector: true },
  { label: 'Kerala Coconut Palm', url: GRAPHIC_AVATARS.palmtree, isVector: true },
  { label: 'Executive Shield', url: GRAPHIC_AVATARS.shieldAdmin, isVector: true },
  {
    label: 'Modern Traveler Blue',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="bgB" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230284c7"/><stop offset="100%" stop-color="%230369a1"/></linearGradient></defs><rect width="128" height="128" rx="64" fill="url(%23bgB)"/><circle cx="64" cy="48" r="22" fill="%23e0f2fe"/><path d="M28 110 C28 88 44 76 64 76 C84 76 100 88 100 110 Z" fill="%23e0f2fe"/></svg>',
    isVector: true,
  },
  {
    label: 'Travel Specialist Teal',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="bgT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230d9488"/><stop offset="100%" stop-color="%23134e4a"/></linearGradient></defs><rect width="128" height="128" rx="64" fill="url(%23bgT)"/><circle cx="64" cy="48" r="22" fill="%23ccfbf1"/><path d="M28 110 C28 88 44 76 64 76 C84 76 100 88 100 110 Z" fill="%23ccfbf1"/></svg>',
    isVector: true,
  },
];

const MODULE_DEFINITIONS: { key: keyof RolePermissions; name: string; description: string }[] = [
  { key: 'dashboard', name: 'Central Dashboard', description: 'View high-level KPIs, booking revenue, and sales trends' },
  { key: 'pipeline', name: 'Sales Pipeline (Kanban)', description: 'Drag-and-drop lead stages from New Lead to Confirmed' },
  { key: 'leads', name: 'Leads & Enquiries', description: 'Central enquiry directory, lead filters, and assignments' },
  { key: 'followups', name: 'Follow-up Scheduler', description: 'Upcoming call alerts, overdue reminders, and activity logs' },
  { key: 'customers', name: 'Customer Profiles', description: 'Guest directory, travel histories, and past inquiries' },
  { key: 'whatsapp', name: 'WhatsApp Hub', description: 'Direct WhatsApp templates for quotes, receipts, & itineraries' },
  { key: 'bookings', name: 'Bookings & Payments', description: 'Confirmed trips, advance vs balance ledger, and vouchers' },
  { key: 'itineraries', name: 'Itinerary Builder', description: 'Day-by-day Kerala itinerary creation and chauffeur details' },
  { key: 'packages', name: 'Tour Package Management', description: 'Configure packages (Munnar, Alleppey, Thekkady, Wayanad)' },
  { key: 'hotels', name: 'Hotel & Houseboat Inventory', description: 'Contracted rates, room categories, and vendor contacts' },
  { key: 'reports', name: 'Sales & Revenue Reports', description: 'Lead source conversion, agent performance, and metrics' },
  { key: 'roles', name: 'Team & Role Access', description: 'Add/remove users, edit team roles, and system permissions' },
];

const COLOR_OPTIONS = [
  { id: 'purple', label: 'Royal Purple (Admin)', class: 'bg-purple-100 text-purple-800 border border-purple-200' },
  { id: 'emerald', label: 'Kerala Emerald (Sales)', class: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
  { id: 'blue', label: 'Arabian Blue (Operations)', class: 'bg-blue-100 text-blue-800 border border-blue-200' },
  { id: 'amber', label: 'Sunset Amber (Accounts)', class: 'bg-amber-100 text-amber-800 border border-amber-200' },
  { id: 'rose', label: 'Spice Rose (VIP Support)', class: 'bg-rose-100 text-rose-800 border border-rose-200' },
  { id: 'indigo', label: 'Deep Indigo (Fleet)', class: 'bg-indigo-100 text-indigo-800 border border-indigo-200' },
];

export const RoleManager: React.FC = () => {
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    roles,
    addRole,
    updateRole,
    deleteRole,
    currentUser,
    setCurrentUser,
    resetToMockData,
  } = useAgency();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'roles' | 'matrix'>('users');
  const [searchUser, setSearchUser] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');

  // User Modals state
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'sales',
    designation: '',
    department: 'Sales & Leisure',
    avatar: AVATAR_PRESETS[0].url,
  });

  // Role Modals state
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleFormData, setRoleFormData] = useState<{
    name: string;
    description: string;
    badgeColor: string;
    permissions: RolePermissions;
  }>({
    name: '',
    description: '',
    badgeColor: COLOR_OPTIONS[1].class,
    permissions: {
      dashboard: true,
      pipeline: true,
      leads: true,
      followups: true,
      customers: true,
      whatsapp: true,
      bookings: false,
      itineraries: false,
      packages: false,
      hotels: false,
      reports: false,
      roles: false,
    },
  });

  const [actionError, setActionError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // File upload input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  // Quick avatar modal state
  const [quickAvatarUser, setQuickAvatarUser] = useState<User | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setActionError('Please select a valid image file (PNG, JPG, SVG, WEBP, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setActionError('Image size exceeds 5MB limit. Please upload an image under 5MB.');
      return;
    }

    setActionError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUserFormData((prev) => ({ ...prev, avatar: dataUrl }));
        setUploadSuccess(`Profile image "${file.name}" uploaded successfully!`);
        setTimeout(() => setUploadSuccess(null), 4000);
      }
    };
    reader.onerror = () => {
      setActionError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleQuickAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !quickAvatarUser) return;

    if (!file.type.startsWith('image/')) {
      setActionError('Please select a valid image file (PNG, JPG, SVG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setActionError('Image size exceeds 5MB limit. Please upload an image under 5MB.');
      return;
    }

    setActionError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateUser(quickAvatarUser.id, { avatar: dataUrl });
        setUploadSuccess(`Profile picture for ${quickAvatarUser.name} updated successfully!`);
        setQuickAvatarUser(null);
        setTimeout(() => setUploadSuccess(null), 4000);
      }
    };
    reader.onerror = () => {
      setActionError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handlers for User CRUD
  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setUserFormData({
      name: '',
      email: '',
      phone: '+91 ',
      role: roles[0]?.id || 'sales',
      designation: 'Holiday Travel Consultant',
      department: 'Sales',
      avatar: AVATAR_PRESETS[0].url,
    });
    setActionError(null);
    setUploadSuccess(null);
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUserId(user.id);
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      designation: user.designation || '',
      department: user.department || '',
      avatar: user.avatar || AVATAR_PRESETS[0].url,
    });
    setActionError(null);
    setUploadSuccess(null);
    setUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    if (!userFormData.name.trim() || !userFormData.email.trim()) {
      setActionError('User name and email are required.');
      return;
    }

    if (editingUserId) {
      updateUser(editingUserId, {
        name: userFormData.name.trim(),
        email: userFormData.email.trim(),
        phone: userFormData.phone.trim(),
        role: userFormData.role,
        designation: userFormData.designation.trim(),
        department: userFormData.department.trim(),
        avatar: userFormData.avatar,
      });
    } else {
      addUser({
        name: userFormData.name.trim(),
        email: userFormData.email.trim(),
        phone: userFormData.phone.trim(),
        role: userFormData.role,
        designation: userFormData.designation.trim() || 'Holiday Consultant',
        department: userFormData.department.trim() || 'General Operations',
        avatar: userFormData.avatar,
      });
    }
    setUserModalOpen(false);
  };

  const handleDeleteUser = (user: User) => {
    setActionError(null);
    if (window.confirm(`Are you sure you want to remove user "${user.name}" (${user.role.toUpperCase()}) from the platform?`)) {
      const res = deleteUser(user.id);
      if (!res.success) {
        setActionError(res.message || 'Failed to remove user.');
      }
    }
  };

  // Handlers for Role CRUD
  const handleOpenAddRole = () => {
    setEditingRoleId(null);
    setRoleFormData({
      name: '',
      description: '',
      badgeColor: COLOR_OPTIONS[3].class,
      permissions: {
        dashboard: true,
        pipeline: false,
        leads: false,
        followups: false,
        customers: true,
        whatsapp: true,
        bookings: true,
        itineraries: true,
        packages: false,
        hotels: false,
        reports: false,
        roles: false,
      },
    });
    setActionError(null);
    setRoleModalOpen(true);
  };

  const handleOpenEditRole = (role: RoleDefinition) => {
    setEditingRoleId(role.id);
    setRoleFormData({
      name: role.name,
      description: role.description,
      badgeColor: role.badgeColor,
      permissions: { ...role.permissions },
    });
    setActionError(null);
    setRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    if (!roleFormData.name.trim()) {
      setActionError('Role title is required.');
      return;
    }

    if (editingRoleId) {
      updateRole(editingRoleId, {
        name: roleFormData.name.trim(),
        description: roleFormData.description.trim(),
        badgeColor: roleFormData.badgeColor,
        permissions: roleFormData.permissions,
      });
    } else {
      addRole({
        name: roleFormData.name.trim(),
        description: roleFormData.description.trim() || 'Custom department role with designated platform access.',
        badgeColor: roleFormData.badgeColor,
        permissions: roleFormData.permissions,
      });
    }
    setRoleModalOpen(false);
  };

  const handleDeleteRole = (role: RoleDefinition) => {
    setActionError(null);
    if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      const res = deleteRole(role.id);
      if (!res.success) {
        setActionError(res.message || 'Cannot delete role.');
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchUser.toLowerCase()) ||
      (u.designation && u.designation.toLowerCase().includes(searchUser.toLowerCase()));
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Hidden file input for quick avatar upload from user cards */}
      <input
        type="file"
        ref={quickFileInputRef}
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        onChange={handleQuickAvatarUpload}
        className="hidden"
      />

      {uploadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{uploadSuccess}</span>
          </div>
          <button
            onClick={() => setUploadSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">
              Kerala Voyage Team & Access Control
            </h2>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
              Admin: {users.find((u) => u.role === 'admin')?.name || 'Jiby'}
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              Logged In: {currentUser.name} ({currentUser.role.toUpperCase()})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your Kerala tours agency staff members, assign roles, create custom departmental permissions, and regulate module visibility.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          <button
            onClick={handleOpenAddUser}
            className="flex items-center gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Staff User</span>
          </button>

          <button
            onClick={handleOpenAddRole}
            className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Role</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all demo users, roles, leads, and bookings to default Kerala data? (Admin will remain Jiby)')) {
                resetToMockData();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition cursor-pointer"
            title="Reset to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Error / Alert notice if any */}
      {actionError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError(null)}
            className="text-rose-500 hover:text-rose-800 text-xs font-bold px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'users'
              ? 'border-emerald-600 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Directory ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('roles')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'roles'
              ? 'border-emerald-600 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Defined Roles ({roles.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'matrix'
              ? 'border-emerald-600 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Module Permission Matrix</span>
        </button>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search staff by name, email, phone, or title..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Filter by Role:</span>
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Roles ({users.length})</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({users.filter((u) => u.role === r.id).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => {
              const isActive = currentUser.id === user.id;
              const roleDef = roles.find((r) => r.id === user.role);

              return (
                <div
                  key={user.id}
                  className={`bg-white rounded-2xl border transition p-4 flex flex-col justify-between space-y-4 shadow-2xs ${
                    isActive
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="relative group">
                          <img
                            src={user.avatar || AVATAR_PRESETS[0].url}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setQuickAvatarUser(user);
                              quickFileInputRef.current?.click();
                            }}
                            className="absolute inset-0 bg-slate-900/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer p-1 text-[9px] text-center font-medium"
                            title={`Upload new photo for ${user.name}`}
                          >
                            <Camera className="w-3.5 h-3.5 mb-0.5" />
                            <span>Upload</span>
                          </button>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-sm text-slate-900">{user.name}</h3>
                            {user.role === 'admin' && (
                              <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-1.5 py-0.2 rounded border border-purple-200">
                                OWNER
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            {user.designation || 'Staff Member'}
                          </div>
                          {user.department && (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building className="w-3 h-3 text-slate-400" />
                              <span>{user.department}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 ${
                          roleDef?.badgeColor || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {roleDef?.name || user.role}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{user.phone}</span>
                      </div>
                    </div>

                    {/* Operational metrics */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-xl text-center text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Leads</div>
                        <div className="font-bold text-slate-800">{user.leadsAssignedCount || 0}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Bookings</div>
                        <div className="font-bold text-slate-800">{user.bookingsClosedCount || 0}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Conversion</div>
                        <div className="font-bold text-emerald-700">
                          {user.conversionRate ? `${user.conversionRate}%` : '0%'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setCurrentUser(user)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex-1 ${
                        isActive
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isActive ? '✓ Active Session' : 'Switch Perspective'}
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditUser(user)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                        title="Edit User Information"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {user.id !== 'USR-01' && user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Remove User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ROLES MANAGEMENT */}
      {activeSubTab === 'roles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => {
              const assignedCount = users.filter((u) => u.role === role.id).length;
              const allowedModulesCount = Object.values(role.permissions).filter(Boolean).length;

              return (
                <div
                  key={role.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">{role.name}</h3>
                          {role.isSystem && (
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                              System
                            </span>
                          )}
                        </div>
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${role.badgeColor}`}>
                          {role.id.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded-lg">
                          {assignedCount} Staff Member{assignedCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                      {role.description}
                    </p>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Module Access:</span>
                        <span className="font-bold text-slate-800">
                          {allowedModulesCount} of {MODULE_DEFINITIONS.length} Modules
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{ width: `${(allowedModulesCount / MODULE_DEFINITIONS.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Member preview avatars */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[11px] text-slate-400 font-medium mb-1.5">Assigned Staff:</div>
                      {assignedCount === 0 ? (
                        <div className="text-xs text-slate-400 italic">No users currently assigned</div>
                      ) : (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {users
                            .filter((u) => u.role === role.id)
                            .map((u) => (
                              <div
                                key={u.id}
                                className="flex items-center gap-1 bg-slate-100 pl-1 pr-2 py-0.5 rounded-full text-xs"
                                title={`${u.name} (${u.email})`}
                              >
                                <img
                                  src={u.avatar || AVATAR_PRESETS[0].url}
                                  alt={u.name}
                                  className="w-4 h-4 rounded-full object-cover"
                                />
                                <span className="text-[11px] font-semibold text-slate-700">{u.name}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEditRole(role)}
                      className="flex items-center justify-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-1.5 px-3 rounded-xl transition flex-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Configure Permissions</span>
                    </button>

                    {!role.isSystem && role.id !== 'admin' && (
                      <button
                        onClick={() => handleDeleteRole(role)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete Role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PERMISSION MATRIX */}
      {activeSubTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Live Role Permission Matrix</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle module permissions directly to adapt access rules across your operations and sales departments.
              </p>
            </div>
            <button
              onClick={handleOpenAddRole}
              className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-xl cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Role</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 min-w-[220px]">System Module</th>
                  {roles.map((r) => (
                    <th key={r.id} className="py-3 px-4 text-center min-w-[130px]">
                      <div>{r.name}</div>
                      <span className={`inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded-full font-bold ${r.badgeColor}`}>
                        {r.id}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MODULE_DEFINITIONS.map((mod) => (
                  <tr key={mod.key} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{mod.name}</div>
                      <div className="text-[11px] text-slate-400">{mod.description}</div>
                    </td>
                    {roles.map((r) => {
                      const isAllowed = r.permissions[mod.key];
                      const isProtectedAdmin = r.id === 'admin';

                      return (
                        <td key={r.id} className="py-3 px-4 text-center">
                          {isProtectedAdmin ? (
                            <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700">
                              <Check className="w-4 h-4 font-bold" />
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                const updatedPerms = {
                                  ...r.permissions,
                                  [mod.key]: !isAllowed,
                                };
                                updateRole(r.id, { permissions: updatedPerms });
                              }}
                              className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition cursor-pointer ${
                                isAllowed
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              }`}
                              title={`Click to ${isAllowed ? 'revoke' : 'grant'} ${mod.name} access for ${r.name}`}
                            >
                              {isAllowed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USER MODAL (ADD / EDIT) */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingUserId ? 'Edit Staff Member Profile' : 'Add New Staff Member'}
                </h3>
              </div>
              <button
                onClick={() => setUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Staff Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    placeholder="e.g. Jiby, Manu Kurian"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Role *
                  </label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="e.g. staff@keralavoyage.com"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                    placeholder="+91 94471 20000"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Title / Designation
                  </label>
                  <input
                    type="text"
                    value={userFormData.designation}
                    onChange={(e) => setUserFormData({ ...userFormData, designation: e.target.value })}
                    placeholder="e.g. Kerala Holiday Specialist"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={userFormData.department}
                    onChange={(e) => setUserFormData({ ...userFormData, department: e.target.value })}
                    placeholder="e.g. Sales, Fleet Logistics, Management"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Avatar & Profile Picture Section */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Profile Picture / Graphic Avatar
                  </label>
                  {userFormData.avatar?.startsWith('data:image/') && !userFormData.avatar.includes('svg+xml') && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Uploaded Photo Active
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Avatar Preview */}
                  <div className="relative shrink-0">
                    <img
                      src={userFormData.avatar || AVATAR_PRESETS[0].url}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shadow-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-emerald-700 hover:bg-emerald-800 text-white p-1.5 rounded-full shadow-xs transition cursor-pointer"
                      title="Upload new image"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2 w-full text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image from Device</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUserFormData({ ...userFormData, avatar: GRAPHIC_AVATARS.jibyAdmin })}
                        className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-medium transition cursor-pointer"
                        title="Set to Jiby Monogram graphic avatar"
                      >
                        Use Jiby Graphic Avatar
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Supports JPG, PNG, WEBP, or SVG files up to 5MB from your computer or phone.
                    </p>
                  </div>
                </div>

                {uploadSuccess && (
                  <div className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                {/* Graphic Vector Presets */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">
                    Choose Graphic Vector Avatar:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {AVATAR_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setUserFormData({ ...userFormData, avatar: p.url })}
                        className={`flex items-center gap-1.5 p-1 rounded-xl border text-xs transition cursor-pointer ${
                          userFormData.avatar === p.url
                            ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 font-bold'
                            : 'border-slate-200 bg-white/70 hover:bg-white'
                        }`}
                        title={p.label}
                      >
                        <img src={p.url} alt={p.label} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <span className="text-[11px] text-slate-700 pr-1">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Custom Image URL */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-[11px] text-slate-500 font-medium mb-1">
                    Or paste external Image URL (Optional):
                  </label>
                  <input
                    type="url"
                    value={userFormData.avatar.startsWith('data:') ? '' : userFormData.avatar}
                    onChange={(e) => {
                      if (e.target.value.trim()) {
                        setUserFormData({ ...userFormData, avatar: e.target.value.trim() });
                      }
                    }}
                    placeholder="https://example.com/profile.png"
                    className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white rounded-xl bg-emerald-700 hover:bg-emerald-800 transition cursor-pointer shadow-xs"
                >
                  {editingUserId ? 'Save Changes' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ROLE MODAL (ADD / EDIT) */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingRoleId ? 'Configure Role & Module Permissions' : 'Create Custom Agency Role'}
                </h3>
              </div>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={roleFormData.name}
                  onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                  placeholder="e.g. Accounts & Billing, Chauffeur Coordinator"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Description & Scope
                </label>
                <textarea
                  rows={2}
                  value={roleFormData.description}
                  onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                  placeholder="Describe operational responsibilities and access scope..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Badge Color Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COLOR_OPTIONS.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setRoleFormData({ ...roleFormData, badgeColor: col.class })}
                      className={`text-left p-2 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer ${
                        roleFormData.badgeColor === col.class
                          ? 'border-emerald-600 bg-emerald-50/50 font-bold'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.class}`}>
                        {col.id.toUpperCase()}
                      </span>
                      {roleFormData.badgeColor === col.class && (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions Checkbox Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Accessible Modules & Permissions
                  </label>
                  <div className="space-x-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        const allTrue: any = {};
                        MODULE_DEFINITIONS.forEach((m) => (allTrue[m.key] = true));
                        setRoleFormData({ ...roleFormData, permissions: allTrue });
                      }}
                      className="text-emerald-700 hover:underline font-semibold"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        const allFalse: any = {};
                        MODULE_DEFINITIONS.forEach((m) => (allFalse[m.key] = false));
                        setRoleFormData({ ...roleFormData, permissions: allFalse });
                      }}
                      className="text-slate-500 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50">
                  {MODULE_DEFINITIONS.map((m) => {
                    const isChecked = roleFormData.permissions[m.key];

                    return (
                      <label
                        key={m.key}
                        className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition select-none ${
                          isChecked
                            ? 'bg-white border-emerald-500 shadow-2xs'
                            : 'bg-white/60 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            setRoleFormData({
                              ...roleFormData,
                              permissions: {
                                ...roleFormData.permissions,
                                [m.key]: e.target.checked,
                              },
                            });
                          }}
                          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                        />
                        <div>
                          <div className={`font-semibold ${isChecked ? 'text-emerald-900' : 'text-slate-700'}`}>
                            {m.name}
                          </div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">
                            {m.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRoleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white rounded-xl bg-emerald-700 hover:bg-emerald-800 transition cursor-pointer shadow-xs"
                >
                  {editingRoleId ? 'Save Role Changes' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
