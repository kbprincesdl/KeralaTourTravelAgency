import React, { useState } from 'react';
import { AgencyProvider, useAgency } from './context/AgencyContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LeadPipeline } from './components/LeadPipeline';
import { LeadsManager } from './components/LeadsManager';
import { CustomerManager } from './components/CustomerManager';
import { FollowUpManager } from './components/FollowUpManager';
import { TourPackageManager } from './components/TourPackageManager';
import { HotelManager } from './components/HotelManager';
import { BookingManager } from './components/BookingManager';
import { ItineraryManager } from './components/ItineraryManager';
import { WhatsAppHub } from './components/WhatsAppHub';
import { ReportsManager } from './components/ReportsManager';
import { RoleManager } from './components/RoleManager';
import { QuickLeadModal } from './components/QuickLeadModal';
import { QuickBookingModal } from './components/QuickBookingModal';
import { KeralaAICoPilot } from './components/KeralaAICoPilot';
import { Lead, Customer } from './types';
import { Bot, Sparkles, Menu, X, Palmtree } from 'lucide-react';

function AgencyPlatformContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);

  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // WhatsApp communication target
  const [whatsAppLeadId, setWhatsAppLeadId] = useState<string | null>(null);

  const handleOpenNewLead = () => {
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleConvertToBooking = (lead: Lead) => {
    setLeadToConvert(lead);
    setIsBookingModalOpen(true);
  };

  const handleSelectLeadForWhatsApp = (leadId: string) => {
    setWhatsAppLeadId(leadId);
    setActiveTab('whatsapp');
  };

  const handleSelectCustomerForWhatsApp = (phone: string, name: string) => {
    setActiveTab('whatsapp');
  };

  const handleOpenNewLeadForCustomer = (customer: Customer) => {
    setEditingLead({
      id: '',
      customerName: customer.name,
      mobileNumber: customer.mobileNumber,
      whatsappNumber: customer.whatsappNumber,
      email: customer.email,
      source: 'Referrals',
      destination: 'Munnar & Alleppey',
      travelStartDate: '',
      travelEndDate: '',
      adults: 2,
      children: 0,
      budget: 40000,
      hotelRequirement: 'Deluxe 4★',
      transportationRequirement: 'Sedan (Etios/Dzire)',
      packageRequirement: '5D/4N Kerala Tour',
      assignedSalespersonId: 'USR-02',
      assignedSalespersonName: 'Anjali Menon',
      stage: 'New Lead',
      notes: `Repeat inquiry for past guest from ${customer.city}`,
      createdDate: new Date().toISOString().split('T')[0],
    });
    setIsLeadModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
          onOpenAI={() => setIsAIOpen(true)}
        />
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative z-10 w-72 h-full bg-slate-900 shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Palmtree className="w-5 h-5 text-emerald-400" />
                <span>Kerala Voyage</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                onOpenAI={() => {
                  setIsAIOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-3 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <Header
              onOpenAI={() => setIsAIOpen(true)}
              onOpenNewLead={handleOpenNewLead}
              onOpenNewBooking={() => {
                setLeadToConvert(null);
                setIsBookingModalOpen(true);
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100/70">
          <div className="max-w-7xl mx-auto pb-12">
            {activeTab === 'dashboard' && (
              <Dashboard
                onNavigateTab={setActiveTab}
                onOpenNewLead={handleOpenNewLead}
                onSelectLeadForWhatsApp={handleSelectLeadForWhatsApp}
              />
            )}

            {activeTab === 'pipeline' && (
              <LeadPipeline
                onOpenNewLead={handleOpenNewLead}
                onEditLead={handleEditLead}
                onConvertToBooking={handleConvertToBooking}
                onSelectLeadForWhatsApp={handleSelectLeadForWhatsApp}
              />
            )}

            {activeTab === 'leads' && (
              <LeadsManager
                onOpenNewLead={handleOpenNewLead}
                onEditLead={handleEditLead}
                onConvertToBooking={handleConvertToBooking}
                onSelectLeadForWhatsApp={handleSelectLeadForWhatsApp}
                searchFilter={searchQuery}
              />
            )}

            {activeTab === 'customers' && (
              <CustomerManager
                onSelectCustomerForWhatsApp={handleSelectCustomerForWhatsApp}
                onOpenNewLeadForCustomer={handleOpenNewLeadForCustomer}
              />
            )}

            {activeTab === 'followups' && (
              <FollowUpManager onSelectLeadForWhatsApp={handleSelectLeadForWhatsApp} />
            )}

            {activeTab === 'whatsapp' && (
              <WhatsAppHub initialLeadId={whatsAppLeadId} />
            )}

            {activeTab === 'bookings' && (
              <BookingManager
                onOpenNewBooking={() => {
                  setLeadToConvert(null);
                  setIsBookingModalOpen(true);
                }}
                onSelectBookingForWhatsApp={(bId) => {
                  setWhatsAppLeadId(bId);
                  setActiveTab('whatsapp');
                }}
                onNavigateToItinerary={(bId) => setActiveTab('itineraries')}
              />
            )}

            {activeTab === 'itineraries' && (
              <ItineraryManager
                onSelectCustomerForWhatsApp={handleSelectCustomerForWhatsApp}
              />
            )}

            {activeTab === 'packages' && <TourPackageManager />}

            {activeTab === 'hotels' && <HotelManager />}

            {activeTab === 'reports' && <ReportsManager />}

            {activeTab === 'roles' && <RoleManager />}
          </div>
        </main>
      </div>

      {/* Floating Kerala AI Button (when chat window is closed) */}
      {!isAIOpen && (
        <button
          onClick={() => setIsAIOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white p-3.5 rounded-2xl shadow-xl hover:shadow-2xl transition flex items-center gap-2.5 border border-emerald-600/60 cursor-pointer group animate-fade-in"
          title="Open Kerala AI Travel Co-pilot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-none flex items-center gap-1">
              <span>Kerala AI Co-pilot</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <div className="text-[10px] text-emerald-200 leading-tight mt-0.5">
              Quotes • Itineraries • Answers
            </div>
          </div>
        </button>
      )}

      {/* Kerala AI Chatbot Panel */}
      <KeralaAICoPilot
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onOpenLeadModal={handleOpenNewLead}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsAIOpen(false);
        }}
      />

      {/* Quick Lead Modal */}
      <QuickLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setEditingLead(null);
        }}
        initialLead={editingLead}
      />

      {/* Quick Booking Modal */}
      <QuickBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setLeadToConvert(null);
        }}
        leadToConvert={leadToConvert}
      />
    </div>
  );
}

export default function App() {
  return (
    <AgencyProvider>
      <AgencyPlatformContent />
    </AgencyProvider>
  );
}
