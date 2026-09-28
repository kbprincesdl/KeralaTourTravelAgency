import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  RoleDefinition,
  RolePermissions,
  Lead,
  FollowUp,
  TourPackage,
  Hotel,
  Booking,
  Customer,
  Itinerary,
  WhatsAppTemplate,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ROLES,
  GRAPHIC_AVATARS,
  INITIAL_PACKAGES,
  INITIAL_HOTELS,
  INITIAL_LEADS,
  INITIAL_FOLLOW_UPS,
  INITIAL_BOOKINGS,
  INITIAL_CUSTOMERS,
  INITIAL_ITINERARIES,
  INITIAL_WHATSAPP_TEMPLATES,
} from '../data/mockData';

interface AgencyContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  addUser: (userData: Omit<User, 'id'>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => { success: boolean; message?: string };
  roles: RoleDefinition[];
  addRole: (roleData: Omit<RoleDefinition, 'id'>) => RoleDefinition;
  updateRole: (id: string, updates: Partial<RoleDefinition>) => void;
  deleteRole: (id: string) => { success: boolean; message?: string };
  hasPermission: (moduleKey: keyof RolePermissions | string) => boolean;
  leads: Lead[];
  addLead: (leadData: Omit<Lead, 'id' | 'createdDate'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  convertLeadToBooking: (leadId: string, customBooking?: Partial<Booking>) => Booking;
  followUps: FollowUp[];
  addFollowUp: (data: Omit<FollowUp, 'id' | 'createdAt'>) => FollowUp;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;
  deleteFollowUp: (id: string) => void;
  packages: TourPackage[];
  addPackage: (data: Omit<TourPackage, 'id'>) => TourPackage;
  updatePackage: (id: string, updates: Partial<TourPackage>) => void;
  deletePackage: (id: string) => void;
  hotels: Hotel[];
  addHotel: (data: Omit<Hotel, 'id'>) => Hotel;
  updateHotel: (id: string, updates: Partial<Hotel>) => void;
  deleteHotel: (id: string) => void;
  bookings: Booking[];
  addBooking: (data: Omit<Booking, 'id' | 'createdDate'>) => Booking;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  customers: Customer[];
  addCustomer: (data: Omit<Customer, 'id'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  logCustomerCommunication: (
    phoneOrId: string,
    comm: { type: 'WhatsApp' | 'Phone Call' | 'Email' | 'Quotation' | 'Meeting'; summary: string }
  ) => void;
  itineraries: Itinerary[];
  addItinerary: (data: Omit<Itinerary, 'id' | 'createdDate'>) => Itinerary;
  updateItinerary: (id: string, updates: Partial<Itinerary>) => void;
  deleteItinerary: (id: string) => void;
  templates: WhatsAppTemplate[];
  resetToMockData: () => void;
}

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'kerala_agency_users_v2',
  ROLES: 'kerala_agency_roles_v2',
  CURRENT_USER: 'kerala_agency_current_user_v2',
  LEADS: 'kerala_agency_leads_v1',
  FOLLOW_UPS: 'kerala_agency_followups_v1',
  PACKAGES: 'kerala_agency_packages_v1',
  HOTELS: 'kerala_agency_hotels_v1',
  BOOKINGS: 'kerala_agency_bookings_v1',
  CUSTOMERS: 'kerala_agency_customers_v1',
  ITINERARIES: 'kerala_agency_itineraries_v1',
  TEMPLATES: 'kerala_agency_templates_v1',
};

export const AgencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS) || localStorage.getItem('kerala_agency_users_v1');
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        // Ensure Admin user USR-01 is named Jiby if previously loaded as Pradeep Kurup
        return parsed.map((u) => {
          if (u.id === 'USR-01' || (u.role === 'admin' && u.name.toLowerCase().includes('pradeep'))) {
            const isPersonPhoto = !u.avatar || u.avatar.includes('unsplash.com') || u.avatar.includes('photo-');
            return {
              ...u,
              name: 'Jiby',
              email: 'jiby@keralavoyage.com',
              role: 'admin',
              avatar: isPersonPhoto ? GRAPHIC_AVATARS.jibyAdmin : u.avatar,
              designation: u.designation || 'Managing Director & Tour Planner',
              department: u.department || 'Management',
            };
          }
          return u;
        });
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_USERS;
  });

  const [roles, setRoles] = useState<RoleDefinition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_ROLES;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || localStorage.getItem('kerala_agency_current_user_v1');
      if (saved) {
        const parsed: User = JSON.parse(saved);
        if (parsed.id === 'USR-01' || parsed.name.toLowerCase().includes('pradeep')) {
          const isPersonPhoto = !parsed.avatar || parsed.avatar.includes('unsplash.com') || parsed.avatar.includes('photo-');
          return {
            ...parsed,
            name: 'Jiby',
            email: 'jiby@keralavoyage.com',
            role: 'admin',
            avatar: isPersonPhoto ? GRAPHIC_AVATARS.jibyAdmin : parsed.avatar,
          };
        }
        return parsed;
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_USERS[0]; // Admin Jiby by default
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLLOW_UPS);
    return saved ? JSON.parse(saved) : INITIAL_FOLLOW_UPS;
  });

  const [packages, setPackages] = useState<TourPackage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [hotels, setHotels] = useState<Hotel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HOTELS);
    return saved ? JSON.parse(saved) : INITIAL_HOTELS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [itineraries, setItineraries] = useState<Itinerary[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ITINERARIES);
    return saved ? JSON.parse(saved) : INITIAL_ITINERARIES;
  });

  const [templates] = useState<WhatsAppTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return saved ? JSON.parse(saved) : INITIAL_WHATSAPP_TEMPLATES;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(followUps));
  }, [followUps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(hotels));
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ITINERARIES, JSON.stringify(itineraries));
  }, [itineraries]);

  // Lead actions
  const addLead = (leadData: Omit<Lead, 'id' | 'createdDate'>): Lead => {
    const nextNum = leads.length + 105;
    const newLead: Lead = {
      ...leadData,
      id: `KTR-LD-${nextNum}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);

    // Check if customer already exists or create new customer profile
    setCustomers((prev) => {
      const existing = prev.find(
        (c) => c.mobileNumber === newLead.mobileNumber || c.email === newLead.email
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? { ...c, previousEnquiriesCount: c.previousEnquiriesCount + 1 }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `CUST-${String(prev.length + 1).padStart(3, '0')}`,
          name: newLead.customerName,
          mobileNumber: newLead.mobileNumber,
          whatsappNumber: newLead.whatsappNumber,
          email: newLead.email,
          city: 'Kerala Travel Inquirer',
          previousEnquiriesCount: 1,
          previousBookingsCount: 0,
          totalSpent: 0,
          travelHistory: [],
          notes: `Enquiry generated for ${newLead.destination}`,
          communicationHistory: [
            {
              id: `COMM-${Date.now()}`,
              date: new Date().toLocaleString(),
              type: 'WhatsApp',
              summary: `Lead created from source: ${newLead.source}`,
              agentName: newLead.assignedSalespersonName,
            },
          ],
        };
        return [newCust, ...prev];
      }
    });

    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const convertLeadToBooking = (leadId: string, customBooking?: Partial<Booking>): Booking => {
    const lead = leads.find((l) => l.id === leadId);
    const bookingNum = String(bookings.length + 95).padStart(3, '0');
    const newBookingId = `KTR-BK-2026-${bookingNum}`;

    const totalAmt = customBooking?.totalAmount || lead?.quotedAmount || lead?.budget || 35000;
    const advAmt = customBooking?.advanceAmount || Math.round(totalAmt * 0.4);

    const newBooking: Booking = {
      id: newBookingId,
      leadId,
      customerName: lead ? lead.customerName : 'Valued Traveler',
      customerPhone: lead ? lead.mobileNumber : '+91 98470 00000',
      customerEmail: lead ? lead.email : 'traveler@keralavoyage.com',
      whatsappNumber: lead ? (lead.whatsappNumber || lead.mobileNumber) : '+91 98470 00000',
      packageName: lead ? lead.packageRequirement : 'Kerala Custom Tour',
      destination: lead ? lead.destination : 'Kerala Circuit',
      travelStartDate: lead ? lead.travelStartDate : new Date().toISOString().split('T')[0],
      travelEndDate: lead ? lead.travelEndDate : new Date().toISOString().split('T')[0],
      adults: lead ? lead.adults : 2,
      children: lead ? lead.children : 0,
      hotelNames: ['Handpicked Kerala Deluxe Resorts & Houseboat'],
      transportation: lead ? lead.transportationRequirement : 'Private AC Sedan with Chauffeur',
      activities: ['Sightseeing & Backwaters'],
      totalAmount: totalAmt,
      advanceAmount: advAmt,
      balanceAmount: totalAmt - advAmt,
      bookingStatus: 'Confirmed',
      notes: lead ? `Converted from lead ${lead.id}. ${lead.notes}` : 'Direct conversion',
      createdDate: new Date().toISOString().split('T')[0],
      ...customBooking,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update lead stage to 'Confirmed'
    if (leadId) {
      updateLead(leadId, { stage: 'Confirmed' });
    }

    // Update customer history
    if (lead) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.mobileNumber === lead.mobileNumber || c.name === lead.customerName) {
            return {
              ...c,
              previousBookingsCount: c.previousBookingsCount + 1,
              totalSpent: c.totalSpent + totalAmt,
              travelHistory: [
                ...c.travelHistory,
                {
                  tripName: newBooking.packageName,
                  dates: `${newBooking.travelStartDate} - ${newBooking.travelEndDate}`,
                  bookingId: newBooking.id,
                },
              ],
            };
          }
          return c;
        })
      );
    }

    return newBooking;
  };

  // Follow-up actions
  const addFollowUp = (data: Omit<FollowUp, 'id' | 'createdAt'>): FollowUp => {
    const newFollowUp: FollowUp = {
      ...data,
      id: `FLP-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setFollowUps((prev) => [newFollowUp, ...prev]);

    // Also update lead follow up date
    if (data.leadId) {
      updateLead(data.leadId, { followUpDate: data.followUpDate });
    }

    return newFollowUp;
  };

  const updateFollowUp = (id: string, updates: Partial<FollowUp>) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const deleteFollowUp = (id: string) => {
    setFollowUps((prev) => prev.filter((f) => f.id !== id));
  };

  // Tour package actions
  const addPackage = (data: Omit<TourPackage, 'id'>): TourPackage => {
    const newPkg: TourPackage = {
      ...data,
      id: `PKG-${String(packages.length + 1).padStart(2, '0')}`,
    };
    setPackages((prev) => [newPkg, ...prev]);
    return newPkg;
  };

  const updatePackage = (id: string, updates: Partial<TourPackage>) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  // Hotel actions
  const addHotel = (data: Omit<Hotel, 'id'>): Hotel => {
    const newHotel: Hotel = {
      ...data,
      id: `HTL-${String(hotels.length + 1).padStart(2, '0')}`,
    };
    setHotels((prev) => [newHotel, ...prev]);
    return newHotel;
  };

  const updateHotel = (id: string, updates: Partial<Hotel>) => {
    setHotels((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
  };

  const deleteHotel = (id: string) => {
    setHotels((prev) => prev.filter((h) => h.id !== id));
  };

  // Booking actions
  const addBooking = (data: Omit<Booking, 'id' | 'createdDate'>): Booking => {
    const newBooking: Booking = {
      ...data,
      id: `KTR-BK-2026-${String(bookings.length + 95).padStart(3, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  // Customer actions
  const addCustomer = (data: Omit<Customer, 'id'>): Customer => {
    const newCustomer: Customer = {
      ...data,
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const logCustomerCommunication = (
    phoneOrId: string,
    comm: { type: 'WhatsApp' | 'Phone Call' | 'Email' | 'Quotation' | 'Meeting'; summary: string }
  ) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === phoneOrId || c.mobileNumber === phoneOrId || c.whatsappNumber === phoneOrId) {
          const newHistory = {
            id: `COMM-${Date.now()}`,
            date: new Date().toLocaleString(),
            type: comm.type,
            summary: comm.summary,
            agentName: currentUser.name,
          };
          return {
            ...c,
            communicationHistory: [newHistory, ...c.communicationHistory],
          };
        }
        return c;
      })
    );
  };

  // Itinerary actions
  const addItinerary = (data: Omit<Itinerary, 'id' | 'createdDate'>): Itinerary => {
    const newItinerary: Itinerary = {
      ...data,
      id: `ITN-2026-${String(itineraries.length + 1).padStart(2, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setItineraries((prev) => [newItinerary, ...prev]);
    return newItinerary;
  };

  const updateItinerary = (id: string, updates: Partial<Itinerary>) => {
    setItineraries((prev) =>
      prev.map((itn) => (itn.id === id ? { ...itn, ...updates } : itn))
    );
  };

  const deleteItinerary = (id: string) => {
    setItineraries((prev) => prev.filter((itn) => itn.id !== id));
  };

  // User management actions
  const addUser = (userData: Omit<User, 'id'>): User => {
    const nextNum = users.length + 1;
    const newId = `USR-${String(nextNum).padStart(2, '0')}`;
    const newUser: User = {
      ...userData,
      id: newId,
      leadsAssignedCount: 0,
      bookingsClosedCount: 0,
      conversionRate: 0,
      avatar:
        userData.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
  };

  const deleteUser = (id: string): { success: boolean; message?: string } => {
    if (id === currentUser.id) {
      return {
        success: false,
        message: 'Cannot remove your current active user. Please switch to another account first.',
      };
    }
    const userToDelete = users.find((u) => u.id === id);
    if (userToDelete?.role === 'admin' && users.filter((u) => u.role === 'admin').length <= 1) {
      return {
        success: false,
        message: 'Cannot delete the only Admin account (Jiby). A system must retain at least one administrator.',
      };
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    return { success: true };
  };

  // Role management actions
  const addRole = (roleData: Omit<RoleDefinition, 'id'>): RoleDefinition => {
    const cleanSlug = roleData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    let roleId = cleanSlug || `role_${Date.now().toString().slice(-4)}`;
    if (roles.some((r) => r.id === roleId)) {
      roleId = `${roleId}_${Date.now().toString().slice(-3)}`;
    }

    const newRole: RoleDefinition = {
      ...roleData,
      id: roleId,
      isSystem: false,
    };
    setRoles((prev) => [...prev, newRole]);
    return newRole;
  };

  const updateRole = (id: string, updates: Partial<RoleDefinition>) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const deleteRole = (id: string): { success: boolean; message?: string } => {
    const roleToDelete = roles.find((r) => r.id === id);
    if (roleToDelete?.isSystem || id === 'admin') {
      return {
        success: false,
        message: 'System default core roles (Admin, Sales, Operations) cannot be removed.',
      };
    }
    const assignedStaff = users.filter((u) => u.role === id);
    if (assignedStaff.length > 0) {
      return {
        success: false,
        message: `Cannot delete role '${roleToDelete?.name}'. There are currently ${assignedStaff.length} staff member(s) assigned to this role (${assignedStaff.map((u) => u.name).join(', ')}). Please reassign them first.`,
      };
    }
    setRoles((prev) => prev.filter((r) => r.id !== id));
    return { success: true };
  };

  const hasPermission = (moduleKey: keyof RolePermissions | string): boolean => {
    // If user is admin, allow all by default
    if (currentUser.role === 'admin') return true;

    const roleDef = roles.find((r) => r.id === currentUser.role);
    if (!roleDef) return false;

    const perms = roleDef.permissions as Record<string, boolean>;
    return Boolean(perms[moduleKey]);
  };

  const resetToMockData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setRoles(INITIAL_ROLES);
    setCurrentUser(INITIAL_USERS[0]);
    setLeads(INITIAL_LEADS);
    setFollowUps(INITIAL_FOLLOW_UPS);
    setPackages(INITIAL_PACKAGES);
    setHotels(INITIAL_HOTELS);
    setBookings(INITIAL_BOOKINGS);
    setCustomers(INITIAL_CUSTOMERS);
    setItineraries(INITIAL_ITINERARIES);
  };

  return (
    <AgencyContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        addUser,
        updateUser,
        deleteUser,
        roles,
        addRole,
        updateRole,
        deleteRole,
        hasPermission,
        leads,
        addLead,
        updateLead,
        deleteLead,
        convertLeadToBooking,
        followUps,
        addFollowUp,
        updateFollowUp,
        deleteFollowUp,
        packages,
        addPackage,
        updatePackage,
        deletePackage,
        hotels,
        addHotel,
        updateHotel,
        deleteHotel,
        bookings,
        addBooking,
        updateBooking,
        deleteBooking,
        customers,
        addCustomer,
        updateCustomer,
        logCustomerCommunication,
        itineraries,
        addItinerary,
        updateItinerary,
        deleteItinerary,
        templates,
        resetToMockData,
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
};

export const useAgency = () => {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error('useAgency must be used within an AgencyProvider');
  }
  return context;
};
