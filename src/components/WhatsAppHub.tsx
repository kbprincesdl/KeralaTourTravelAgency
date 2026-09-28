import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Copy,
  Check,
  Sparkles,
  Users,
  Briefcase,
  FileText,
  Calendar,
  ExternalLink,
  Phone,
  Bookmark,
  RefreshCw,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { WhatsAppTemplate } from '../types';

interface WhatsAppHubProps {
  initialLeadId?: string | null;
  initialCustomerPhone?: string | null;
}

export const WhatsAppHub: React.FC<WhatsAppHubProps> = ({
  initialLeadId,
  initialCustomerPhone,
}) => {
  const { leads, bookings, templates, logCustomerCommunication, currentUser } = useAgency();

  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    initialLeadId || leads[0]?.id || ''
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [customText, setCustomText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isAIEnhancing, setIsAIEnhancing] = useState(false);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  // Helper to compile template variables
  const compileTemplate = (template: WhatsAppTemplate, lead: typeof selectedLead) => {
    if (!lead || !template) return '';

    let text = template.templateText;
    const dates = lead.travelStartDate
      ? `${lead.travelStartDate} to ${lead.travelEndDate || 'Flexible'}`
      : 'Upcoming 2026 Season';

    text = text.replace(/{customerName}/g, lead.customerName);
    text = text.replace(/{destination}/g, lead.destination);
    text = text.replace(/{dates}/g, dates);
    text = text.replace(/{duration}/g, `${lead.travelEndDate ? '5 Days' : 'Custom Days'}`);
    text = text.replace(/{adults}/g, String(lead.adults));
    text = text.replace(/{children}/g, String(lead.children));
    text = text.replace(/{agentName}/g, lead.assignedSalespersonName || currentUser.name);
    text = text.replace(/{packageName}/g, lead.packageRequirement);
    text = text.replace(/{amount}/g, (lead.quotedAmount || lead.budget).toLocaleString());
    text = text.replace(/{vehicle}/g, lead.transportationRequirement);
    text = text.replace(/{bookingId}/g, `KTR-BK-2026-089`);
    text = text.replace(/{totalAmount}/g, (lead.quotedAmount || lead.budget).toLocaleString());
    text = text.replace(/{advanceAmount}/g, Math.round((lead.quotedAmount || lead.budget) * 0.4).toLocaleString());
    text = text.replace(/{balanceAmount}/g, Math.round((lead.quotedAmount || lead.budget) * 0.6).toLocaleString());
    text = text.replace(/{hotels}/g, `• Misty Mountain Resort Munnar (${lead.hotelRequirement})\n• Punnamada Deluxe Houseboat (Alleppey)`);
    text = text.replace(
      /{itineraryText}/g,
      `Day 1: Arrival Cochin to Munnar Tea Hills\nDay 2: Eravikulam National Park & Mattupetty\nDay 3: Munnar to Thekkady Spice Hills\nDay 4: Alleppey Houseboat Backwater Cruise\nDay 5: Fort Kochi & Airport Drop`
    );

    return text;
  };

  useEffect(() => {
    if (selectedTemplate && selectedLead) {
      setCustomText(compileTemplate(selectedTemplate, selectedLead));
    }
  }, [selectedTemplateId, selectedLeadId]);

  const cleanPhone = (phoneStr: string) => {
    return phoneStr.replace(/[^0-9]/g, '');
  };

  const handleOpenWhatsApp = () => {
    if (!selectedLead) return;

    const phone = cleanPhone(selectedLead.whatsappNumber || selectedLead.mobileNumber);
    const encoded = encodeURIComponent(customText);
    const url = `https://wa.me/${phone}?text=${encoded}`;

    // Log to customer communication
    logCustomerCommunication(selectedLead.whatsappNumber || selectedLead.mobileNumber, {
      type: 'WhatsApp',
      summary: `Sent template "${selectedTemplate.name}" via WhatsApp`,
    });

    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    if (selectedLead) {
      logCustomerCommunication(selectedLead.whatsappNumber || selectedLead.mobileNumber, {
        type: 'WhatsApp',
        summary: `Copied message for WhatsApp: "${selectedTemplate.name}"`,
      });
    }
  };

  // AI draft customized message via Gemini endpoint
  const handleAIDraft = async () => {
    if (!selectedLead) return;
    setIsAIEnhancing(true);

    try {
      const res = await fetch('/api/ai/draft-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedTemplate.name,
          customerName: selectedLead.customerName,
          destination: selectedLead.destination,
          days: 5,
          amount: (selectedLead.quotedAmount || selectedLead.budget).toLocaleString(),
          hotel: selectedLead.hotelRequirement,
          details: `Travelers: ${selectedLead.adults}A + ${selectedLead.children}C. Chauffeur vehicle: ${selectedLead.transportationRequirement}.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCustomText(data.message);
      }
    } catch (e) {
      console.warn('AI WhatsApp draft failed:', e);
    } finally {
      setIsAIEnhancing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">
              Kerala WhatsApp Communication Center
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Direct wa.me
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            1-click communication for enquiry acknowledgement, quote proposals, vouchers, and Kerala travel advisories.
          </p>
        </div>

        <button
          onClick={handleAIDraft}
          disabled={isAIEnhancing}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{isAIEnhancing ? 'Gemini Drafting...' : 'AI Enhance with Gemini'}</span>
        </button>
      </div>

      {/* Main 2-Column Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Selectors & Templates (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Target Lead / Guest Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>1. Select Recipient Lead / Guest</span>
            </label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.customerName} ({l.whatsappNumber || l.mobileNumber}) — {l.destination}
                </option>
              ))}
            </select>

            {selectedLead && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">WhatsApp:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {selectedLead.whatsappNumber || selectedLead.mobileNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Stage:</span>
                  <span className="font-semibold text-emerald-800">{selectedLead.stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quoted / Budget:</span>
                  <span className="font-bold text-slate-900">
                    ₹{(selectedLead.quotedAmount || selectedLead.budget).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Template Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-emerald-600" />
              <span>2. Choose Pre-Approved Message Template</span>
            </label>

            <div className="space-y-2">
              {templates.map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`w-full p-3 text-left rounded-xl border text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{tmpl.name}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                        {tmpl.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                      {tmpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Message Preview & 1-Click Launch (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[75vh]">
          {/* Header */}
          <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-300" />
              <div>
                <h3 className="text-xs font-bold text-white">Live WhatsApp Preview</h3>
                <p className="text-[10px] text-emerald-200">
                  Ready to send to {selectedLead?.customerName} ({selectedLead?.whatsappNumber})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleOpenWhatsApp}
                className="flex items-center gap-1.5 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg transition shadow-sm cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Editable text area mimicking WhatsApp screen */}
          <div className="flex-1 p-4 bg-slate-100 flex flex-col">
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-inner p-4 flex flex-col">
              <div className="text-[11px] text-slate-400 font-medium mb-1.5 flex justify-between">
                <span>You can edit or personalize this message before sending:</span>
                <span>{customText.length} characters</span>
              </div>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="flex-1 w-full text-xs font-mono text-slate-800 leading-relaxed resize-none focus:outline-none"
                placeholder="Message preview..."
              ></textarea>
            </div>
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>
              ℹ️ Direct web link opens <span className="font-semibold text-emerald-700">wa.me</span> with message pre-filled.
            </span>
            <span className="text-emerald-700 font-medium">Logged to CRM history</span>
          </div>
        </div>
      </div>
    </div>
  );
};
