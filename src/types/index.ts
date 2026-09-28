export type UserRole = 'admin' | 'sales' | 'operations' | (string & {});

export interface RolePermissions {
  [key: string]: boolean;
  dashboard: boolean;
  pipeline: boolean;
  leads: boolean;
  followups: boolean;
  customers: boolean;
  whatsapp: boolean;
  bookings: boolean;
  itineraries: boolean;
  packages: boolean;
  hotels: boolean;
  reports: boolean;
  roles: boolean;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  isSystem?: boolean;
  permissions: RolePermissions;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  avatar?: string;
  designation?: string;
  department?: string;
  leadsAssignedCount?: number;
  bookingsClosedCount?: number;
  conversionRate?: number;
}

export type LeadSource =
  | 'WhatsApp'
  | 'Social Media'
  | 'Phone Calls'
  | 'Website'
  | 'Referrals'
  | 'Manual Entry'
  | 'Walk-in'
  | 'Other';

export type LeadStage =
  | 'New Lead'
  | 'Contacted'
  | 'Requirement Collected'
  | 'Quote Sent'
  | 'Follow-up'
  | 'Confirmed'
  | 'Lost';

export interface Lead {
  id: string; // e.g. "KTR-LD-101"
  customerName: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  source: LeadSource;
  destination: string;
  travelStartDate: string;
  travelEndDate: string;
  adults: number;
  children: number;
  budget: number;
  hotelRequirement: 'Budget 3★' | 'Deluxe 4★' | 'Luxury 5★' | 'Houseboat Only' | 'Resort & Spa' | 'Treehouse / Eco Lodge';
  transportationRequirement: 'Sedan (Etios/Dzire)' | 'SUV (Innova Crysta)' | 'Tempo Traveller' | 'None (Self Drive)';
  packageRequirement: string; // e.g. "5D/4N Munnar & Alleppey"
  assignedSalespersonId: string;
  assignedSalespersonName: string;
  stage: LeadStage;
  followUpDate?: string;
  notes: string;
  createdDate: string;
  lostReason?: string;
  quotedAmount?: number;
}

export type FollowUpStatus = 'Pending' | 'Completed' | 'Rescheduled' | 'Cancelled';

export interface FollowUp {
  id: string;
  leadId: string;
  customerName: string;
  whatsappNumber: string;
  assignedUserId: string;
  assignedUserName: string;
  followUpDate: string; // YYYY-MM-DD
  followUpTime: string; // HH:MM
  followUpNotes: string;
  status: FollowUpStatus;
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

export interface DayPlan {
  dayNumber: number;
  date?: string;
  title: string;
  destination: string;
  sightseeing: string[];
  hotelName: string;
  mealPlan: 'EP (Room Only)' | 'CP (Breakfast)' | 'MAP (Breakfast + Dinner)' | 'AP (All Meals)';
  transportation: string;
  specialInstructions?: string;
}

export interface TourPackage {
  id: string;
  name: string;
  destination: string;
  durationNights: number;
  durationDays: number;
  startingPrice: number;
  description: string;
  dayWisePlan: DayPlan[];
  includedHotels: string[];
  transportation: string;
  activities: string[];
  inclusions: string[];
  exclusions: string[];
  termsAndConditions: string[];
  status: 'Active' | 'Inactive';
  coverImage?: string;
  tag?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: 'Munnar' | 'Thekkady' | 'Alleppey' | 'Kumarakom' | 'Kovalam' | 'Wayanad' | 'Kochi' | 'Poovar' | 'Varkala';
  category: '3-Star Deluxe' | '4-Star Premium' | '5-Star Luxury' | 'Heritage Resort' | 'Backwater Houseboat' | 'Treehouse / Eco Lodge';
  roomType: string;
  ratePerNight: number;
  mealPlan: 'EP (Room Only)' | 'CP (Breakfast)' | 'MAP (Breakfast + Dinner)' | 'AP (All Meals)';
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  status: 'Active' | 'Inactive';
  notes?: string;
}

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Partially Paid'
  | 'Fully Paid'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface Booking {
  id: string; // e.g. "KTR-BK-2026-089"
  leadId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  whatsappNumber: string;
  packageName: string;
  destination: string;
  travelStartDate: string;
  travelEndDate: string;
  adults: number;
  children: number;
  hotelNames: string[];
  transportation: string;
  activities: string[];
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  bookingStatus: BookingStatus;
  notes?: string;
  createdDate: string;
  itineraryId?: string;
}

export interface Customer {
  id: string;
  name: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  city: string;
  address?: string;
  previousEnquiriesCount: number;
  previousBookingsCount: number;
  totalSpent: number;
  travelHistory: {
    tripName: string;
    dates: string;
    bookingId: string;
  }[];
  notes: string;
  communicationHistory: {
    id: string;
    date: string;
    type: 'WhatsApp' | 'Phone Call' | 'Email' | 'Quotation' | 'Meeting';
    summary: string;
    agentName: string;
  }[];
}

export interface Itinerary {
  id: string;
  bookingId?: string;
  leadId?: string;
  customerName: string;
  whatsappNumber: string;
  travelStartDate: string;
  travelEndDate: string;
  destination: string;
  packageTitle: string;
  totalDays: number;
  days: DayPlan[];
  specialInstructions?: string;
  preparedBy: string;
  createdDate: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'Enquiry' | 'Quotation' | 'Booking' | 'Payment' | 'Itinerary' | 'Reminder' | 'Kerala Advisory';
  description: string;
  templateText: string;
}
