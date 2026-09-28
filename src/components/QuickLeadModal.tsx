import React, { useState } from 'react';
import { X, Sparkles, UserPlus } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { Lead, LeadSource } from '../types';

interface QuickLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLead?: Lead | null;
}

export const QuickLeadModal: React.FC<QuickLeadModalProps> = ({
  isOpen,
  onClose,
  initialLead,
}) => {
  const { addLead, updateLead, users, packages } = useAgency();

  const salesUsers = users.filter((u) => u.role === 'sales' || u.role === 'admin');

  const [formData, setFormData] = useState({
    customerName: initialLead?.customerName || '',
    mobileNumber: initialLead?.mobileNumber || '',
    whatsappNumber: initialLead?.whatsappNumber || '',
    email: initialLead?.email || '',
    source: (initialLead?.source || 'WhatsApp') as LeadSource,
    destination: initialLead?.destination || 'Munnar & Alleppey Backwaters',
    travelStartDate: initialLead?.travelStartDate || '',
    travelEndDate: initialLead?.travelEndDate || '',
    adults: initialLead?.adults || 2,
    children: initialLead?.children || 0,
    budget: initialLead?.budget || 35000,
    hotelRequirement: initialLead?.hotelRequirement || 'Deluxe 4★',
    transportationRequirement: initialLead?.transportationRequirement || 'Sedan (Etios/Dzire)',
    packageRequirement: initialLead?.packageRequirement || '5D/4N Munnar & Backwaters Tour',
    assignedSalespersonId: initialLead?.assignedSalespersonId || salesUsers[0]?.id || 'USR-02',
    stage: initialLead?.stage || 'New Lead',
    followUpDate: initialLead?.followUpDate || '',
    notes: initialLead?.notes || '',
    quotedAmount: initialLead?.quotedAmount || 0,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedRep = users.find((u) => u.id === formData.assignedSalespersonId);
    const assignedSalespersonName = selectedRep ? selectedRep.name : 'Anjali Menon';

    const payload = {
      ...formData,
      whatsappNumber: formData.whatsappNumber || formData.mobileNumber,
      assignedSalespersonName,
    };

    if (initialLead) {
      updateLead(initialLead.id, payload);
    } else {
      addLead(payload);
    }

    onClose();
  };

  const handleSyncWhatsApp = () => {
    setFormData((prev) => ({ ...prev, whatsappNumber: prev.mobileNumber }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialLead ? `Edit Lead (${initialLead.id})` : 'Capture New Kerala Tour Enquiry'}
              </h2>
              <p className="text-xs text-emerald-200">
                Centralized lead management & sales assignment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Customer Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2.5 flex items-center gap-1.5">
              <span>Customer Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lead Source *
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Social Media">Social Media (Instagram/FB)</option>
                  <option value="Phone Calls">Phone Call</option>
                  <option value="Website">Website Form</option>
                  <option value="Referrals">Customer Referral</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98470 12345"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">WhatsApp Number</label>
                  <button
                    type="button"
                    onClick={handleSyncWhatsApp}
                    className="text-[10px] text-emerald-700 hover:underline font-medium"
                  >
                    Same as mobile
                  </button>
                </div>
                <input
                  type="tel"
                  placeholder="+91 98470 12345"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="guest@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Travel Requirements */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2.5">
              Tour & Requirement Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Kerala Destination / Circuit *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Munnar - Thekkady - Alleppey - Cochin"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Travel Start Date
                </label>
                <input
                  type="date"
                  value={formData.travelStartDate}
                  onChange={(e) => setFormData({ ...formData, travelStartDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Travel End Date
                </label>
                <input
                  type="date"
                  value={formData.travelEndDate}
                  onChange={(e) => setFormData({ ...formData, travelEndDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Adults</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Children</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Budget (₹ INR)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hotel Category Requirement
                </label>
                <select
                  value={formData.hotelRequirement}
                  onChange={(e) => setFormData({ ...formData, hotelRequirement: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="Deluxe 4★">Deluxe 4★</option>
                  <option value="Luxury 5★">Luxury 5★</option>
                  <option value="Budget 3★">Budget 3★</option>
                  <option value="Houseboat Only">Houseboat Only</option>
                  <option value="Resort & Spa">Resort & Spa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transportation Requirement
                </label>
                <select
                  value={formData.transportationRequirement}
                  onChange={(e) => setFormData({ ...formData, transportationRequirement: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="Sedan (Etios/Dzire)">Sedan (Etios/Dzire) (1-3 Pax)</option>
                  <option value="SUV (Innova Crysta)">SUV (Innova Crysta) (4-6 Pax)</option>
                  <option value="Tempo Traveller">Tempo Traveller (7+ Pax)</option>
                  <option value="None (Self Drive)">None (Self Drive / Pickup only)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Matching Agency Package
                </label>
                <select
                  value={formData.packageRequirement}
                  onChange={(e) => setFormData({ ...formData, packageRequirement: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.name}>
                      {pkg.name} ({pkg.durationDays}D/{pkg.durationNights}N) - Starts ₹{pkg.startingPrice.toLocaleString()}
                    </option>
                  ))}
                  <option value="Custom Tailored Tour">Custom Tailored Tour</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Sales Assignment & Pipeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2.5">
              Sales Assignment & Pipeline Stage
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign Salesperson *
                </label>
                <select
                  value={formData.assignedSalespersonId}
                  onChange={(e) => setFormData({ ...formData, assignedSalespersonId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {salesUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Pipeline Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                >
                  <option value="New Lead">1. New Lead</option>
                  <option value="Contacted">2. Contacted</option>
                  <option value="Requirement Collected">3. Requirement Collected</option>
                  <option value="Quote Sent">4. Quote Sent</option>
                  <option value="Follow-up">5. Follow-up</option>
                  <option value="Confirmed">6. Confirmed</option>
                  <option value="Lost">7. Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Next Follow-up Date
                </label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Consultant Notes / Guest Preferences
              </label>
              <textarea
                rows={2}
                placeholder="Specific preferences, honeymoon bed decoration, vegetarian food, flight timings..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              ></textarea>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              {initialLead ? 'Update Lead' : 'Save & Assign Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
