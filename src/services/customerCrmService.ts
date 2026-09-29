// Nexora SalonOS — Phase 5.1 Customer Management / CRM Service
// Pure Domain Logic, Multi-Tenant Isolation, Duplicate Detection, Search & Notes

import {
  CustomerProfile,
  CreateCustomerDTO,
  UpdateCustomerDTO,
  CustomerFilterParams,
  CustomerNote,
  DuplicateDetectionResult,
  CustomerSummaryMetrics,
  CustomerTimelineEvent,
  calculateCustomerStatus
} from '../types/customerCrm';
import { BookingEntity } from '../types/bookingEngine';
import { SEEDED_BOOKINGS } from '../data/seededBookings';

// ----------------------------------------------------------------------------
// SEEDED CUSTOMER PROFILES (Multi-Tenant)
// ----------------------------------------------------------------------------

export const SEEDED_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-barber-001',
    businessId: 'biz-barber-001',
    name: 'Aarav Sharma',
    phone: '+91 9876543210',
    email: 'aarav.sharma@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    dateOfBirth: '1992-05-14',
    gender: 'Male',
    tags: ['VIP', 'Regular', 'Beard Grooming'],
    marketingConsent: true,
    status: 'ACTIVE',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-09-25T14:30:00Z',
    lastVisitAt: '2026-09-25T11:00:00Z',
    totalBookings: 8,
    completedBookings: 7,
    cancelledBookings: 1,
    totalSpend: 4200,
    notes: [
      {
        id: 'note-001',
        customerId: 'cust-barber-001',
        businessId: 'biz-barber-001',
        content: 'Prefers senior master barber Vikram Rajput. Likes low taper fade and green tea.',
        authorName: 'Admin Desk',
        authorRole: 'ADMIN',
        createdAt: '2026-02-10T11:20:00Z'
      },
      {
        id: 'note-002',
        customerId: 'cust-barber-001',
        businessId: 'biz-barber-001',
        content: 'Allergic to Eucalyptus beard oil. Use organic tea tree oil only.',
        authorName: 'Vikram Rajput',
        authorRole: 'STAFF',
        createdAt: '2026-05-18T16:45:00Z'
      }
    ]
  },
  {
    id: 'cust-barber-002',
    businessId: 'biz-barber-001',
    name: 'Dev Patel',
    phone: '+91 9222333444',
    email: 'dev.patel@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    dateOfBirth: '1995-11-20',
    gender: 'Male',
    tags: ['Regular', 'Haircut'],
    marketingConsent: true,
    status: 'ACTIVE',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-09-20T12:00:00Z',
    lastVisitAt: '2026-09-20T14:00:00Z',
    totalBookings: 4,
    completedBookings: 4,
    cancelledBookings: 0,
    totalSpend: 2000,
    notes: [
      {
        id: 'note-003',
        customerId: 'cust-barber-002',
        businessId: 'biz-barber-001',
        content: 'Prefers Saturday morning appointments.',
        authorName: 'Front Desk',
        authorRole: 'MANAGER',
        createdAt: '2026-03-01T09:15:00Z'
      }
    ]
  },
  {
    id: 'cust-barber-003',
    businessId: 'biz-barber-001',
    name: 'Priya Verma',
    phone: '+91 9777766666',
    email: 'priya.v@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    dateOfBirth: '1998-08-05',
    gender: 'Female',
    tags: ['New', 'Styling'],
    marketingConsent: false,
    status: 'NEW',
    createdAt: '2026-09-28T08:00:00Z',
    updatedAt: '2026-09-28T08:00:00Z',
    lastVisitAt: undefined,
    totalBookings: 1,
    completedBookings: 0,
    cancelledBookings: 0,
    totalSpend: 0,
    notes: [
      {
        id: 'note-004',
        customerId: 'cust-barber-003',
        businessId: 'biz-barber-001',
        content: 'First time booking online. Requested consultation for hair makeover.',
        authorName: 'Online Portal',
        authorRole: 'SYSTEM',
        createdAt: '2026-09-28T08:00:00Z'
      }
    ]
  },
  {
    id: 'cust-barber-004',
    businessId: 'biz-barber-001',
    name: 'Rohan Joshi',
    phone: '+91 9333444555',
    email: 'rohan.j@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    dateOfBirth: '1988-03-12',
    gender: 'Male',
    tags: ['Inactive'],
    marketingConsent: false,
    status: 'INACTIVE',
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2026-02-14T11:00:00Z',
    lastVisitAt: '2026-02-14T11:00:00Z',
    totalBookings: 3,
    completedBookings: 2,
    cancelledBookings: 1,
    totalSpend: 1500,
    notes: []
  },
  {
    id: 'cust-spa-001',
    businessId: 'biz-spa-002',
    name: 'Ananya Deshmukh',
    phone: '+91 9111222333',
    email: 'ananya.spa@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    dateOfBirth: '1990-12-18',
    gender: 'Female',
    tags: ['VIP', 'Bridal', 'Spa'],
    marketingConsent: true,
    status: 'ACTIVE',
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-09-22T15:00:00Z',
    lastVisitAt: '2026-09-22T15:00:00Z',
    totalBookings: 6,
    completedBookings: 6,
    cancelledBookings: 0,
    totalSpend: 18500,
    notes: [
      {
        id: 'note-005',
        customerId: 'cust-spa-001',
        businessId: 'biz-spa-002',
        content: 'VIP Bridal package client. Prefers room with lavender aromatherapy and soft piano music.',
        authorName: 'Spa Manager',
        authorRole: 'MANAGER',
        createdAt: '2026-02-01T12:30:00Z'
      }
    ]
  }
];

// ----------------------------------------------------------------------------
// MULTI-TENANT CUSTOMER REPOSITORY & CRM SERVICE
// ----------------------------------------------------------------------------

export class CustomerCrmService {
  private customers: Map<string, CustomerProfile> = new Map();

  constructor(initialCustomers = SEEDED_CUSTOMERS) {
    initialCustomers.forEach((c) => {
      this.customers.set(c.id, JSON.parse(JSON.stringify(c)));
    });
  }

  /**
   * Hard Tenant Ownership Check
   */
  private verifyTenantAccess(customer: CustomerProfile, tenantBusinessId: string): boolean {
    return Boolean(customer && customer.businessId === tenantBusinessId);
  }

  /**
   * Find Customer by ID with Hard Multi-Tenant Isolation
   */
  public getCustomerById(customerId: string, tenantBusinessId: string): CustomerProfile | null {
    const customer = this.customers.get(customerId);
    if (!customer) return null;
    if (!this.verifyTenantAccess(customer, tenantBusinessId)) {
      return null; // Return null to prevent tenant enumeration
    }
    return customer;
  }

  /**
   * List and filter customers strictly scoped to a tenant
   */
  public getCustomersByTenant(
    tenantBusinessId: string,
    filter?: CustomerFilterParams,
    allBookings: BookingEntity[] = SEEDED_BOOKINGS
  ): CustomerProfile[] {
    let tenantList = Array.from(this.customers.values()).filter(
      (c) => c.businessId === tenantBusinessId
    );

    // Apply search filter (Name, Phone, Email, or Booking ID)
    if (filter?.searchQuery && filter.searchQuery.trim().length > 0) {
      const q = filter.searchQuery.trim().toLowerCase();

      // Check if query matches a Booking ID
      const matchingBooking = allBookings.find(
        (b) => b.businessId === tenantBusinessId && b.id.toLowerCase().includes(q)
      );
      const bookingCustomerId = matchingBooking?.customerId;

      tenantList = tenantList.filter((c) => {
        const nameMatch = c.name.toLowerCase().includes(q);
        const phoneMatch = c.phone.toLowerCase().includes(q);
        const emailMatch = c.email.toLowerCase().includes(q);
        const bookingMatch = bookingCustomerId ? c.id === bookingCustomerId || c.phone.includes(matchingBooking.customerPhone) : false;

        return nameMatch || phoneMatch || emailMatch || bookingMatch;
      });
    }

    // Apply Status Filter
    if (filter?.status && filter.status !== 'ALL') {
      tenantList = tenantList.filter((c) => c.status === filter.status);
    }

    // Apply Customer Type Filter (New vs Returning)
    if (filter?.customerType && filter.customerType !== 'ALL') {
      if (filter.customerType === 'NEW') {
        tenantList = tenantList.filter((c) => c.status === 'NEW' || c.totalBookings <= 1);
      } else if (filter.customerType === 'RETURNING') {
        tenantList = tenantList.filter((c) => c.totalBookings > 1);
      }
    }

    // Apply Tag Filter
    if (filter?.tag && filter.tag !== 'ALL') {
      tenantList = tenantList.filter((c) => c.tags.includes(filter.tag!));
    }

    // Apply Date Range Filter (Created Date)
    if (filter?.startDate) {
      tenantList = tenantList.filter((c) => c.createdAt >= filter.startDate!);
    }
    if (filter?.endDate) {
      tenantList = tenantList.filter((c) => c.createdAt <= `${filter.endDate!}T23:59:59Z`);
    }

    // Re-evaluate customer status dynamically to keep status fresh
    return tenantList.map((c) => ({
      ...c,
      status: calculateCustomerStatus(c)
    }));
  }

  /**
   * Detect Potential Duplicate Customer Records in Tenant Context
   */
  public detectDuplicate(
    phone: string,
    email: string,
    tenantBusinessId: string
  ): DuplicateDetectionResult {
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanEmail = email.trim().toLowerCase();

    for (const c of this.customers.values()) {
      if (c.businessId === tenantBusinessId) {
        const existingPhone = c.phone.replace(/\D/g, '');
        const existingEmail = c.email.trim().toLowerCase();

        if (cleanPhone.length > 5 && existingPhone === cleanPhone) {
          return {
            isPotentialDuplicate: true,
            existingCustomerId: c.id,
            existingCustomerName: c.name,
            matchReason: `Matching phone number (${c.phone}) already registered for ${c.name}`
          };
        }

        if (cleanEmail.length > 3 && existingEmail === cleanEmail) {
          return {
            isPotentialDuplicate: true,
            existingCustomerId: c.id,
            existingCustomerName: c.name,
            matchReason: `Matching email address (${c.email}) already registered for ${c.name}`
          };
        }
      }
    }

    return { isPotentialDuplicate: false };
  }

  /**
   * Create New Customer Record with Duplicate Prevention Check
   */
  public createCustomer(dto: CreateCustomerDTO, tenantBusinessId: string): CustomerProfile {
    if (dto.businessId !== tenantBusinessId) {
      throw new Error(`Tenant mismatch: Cannot create customer for ${dto.businessId} using ${tenantBusinessId} context`);
    }

    const nowIso = new Date().toISOString();
    const customerId = `cust-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const notes: CustomerNote[] = [];
    if (dto.initialNote && dto.initialNote.trim().length > 0) {
      notes.push({
        id: `note-${Date.now()}-1`,
        customerId,
        businessId: tenantBusinessId,
        content: dto.initialNote.trim(),
        authorName: 'Admin Desk',
        authorRole: 'ADMIN',
        createdAt: nowIso
      });
    }

    const newCustomer: CustomerProfile = {
      id: customerId,
      userId: dto.userId,
      businessId: tenantBusinessId,
      name: dto.name.trim(),
      phone: dto.phone.trim(),
      email: dto.email.trim().toLowerCase(),
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      tags: dto.tags || ['New'],
      marketingConsent: dto.marketingConsent ?? true,
      status: 'NEW',
      createdAt: nowIso,
      updatedAt: nowIso,
      lastVisitAt: undefined,
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalSpend: 0,
      notes
    };

    this.customers.set(customerId, newCustomer);
    return newCustomer;
  }

  /**
   * Update Customer Profile
   */
  public updateCustomer(
    customerId: string,
    dto: UpdateCustomerDTO,
    tenantBusinessId: string
  ): CustomerProfile {
    const customer = this.getCustomerById(customerId, tenantBusinessId);
    if (!customer) {
      throw new Error(`Customer ${customerId} not found or tenant access denied`);
    }

    const nowIso = new Date().toISOString();
    const updated: CustomerProfile = {
      ...customer,
      name: dto.name !== undefined ? dto.name.trim() : customer.name,
      phone: dto.phone !== undefined ? dto.phone.trim() : customer.phone,
      email: dto.email !== undefined ? dto.email.trim().toLowerCase() : customer.email,
      dateOfBirth: dto.dateOfBirth !== undefined ? dto.dateOfBirth : customer.dateOfBirth,
      gender: dto.gender !== undefined ? dto.gender : customer.gender,
      marketingConsent: dto.marketingConsent !== undefined ? dto.marketingConsent : customer.marketingConsent,
      updatedAt: nowIso
    };

    this.customers.set(customerId, updated);
    return updated;
  }

  /**
   * Add Audited Note to Customer Profile
   */
  public addCustomerNote(
    customerId: string,
    content: string,
    authorName: string,
    authorRole: string,
    tenantBusinessId: string
  ): CustomerNote {
    const customer = this.getCustomerById(customerId, tenantBusinessId);
    if (!customer) {
      throw new Error(`Customer ${customerId} not found or tenant access denied`);
    }

    const nowIso = new Date().toISOString();
    const newNote: CustomerNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      customerId,
      businessId: tenantBusinessId,
      content: content.trim(),
      authorName: authorName.trim(),
      authorRole,
      createdAt: nowIso
    };

    const updated: CustomerProfile = {
      ...customer,
      notes: [newNote, ...customer.notes],
      updatedAt: nowIso
    };

    this.customers.set(customerId, updated);
    return newNote;
  }

  /**
   * Add Tag to Customer
   */
  public addTag(customerId: string, tag: string, tenantBusinessId: string): CustomerProfile {
    const customer = this.getCustomerById(customerId, tenantBusinessId);
    if (!customer) {
      throw new Error(`Customer ${customerId} not found or tenant access denied`);
    }

    const trimmed = tag.trim();
    if (!customer.tags.includes(trimmed)) {
      const updated: CustomerProfile = {
        ...customer,
        tags: [...customer.tags, trimmed],
        updatedAt: new Date().toISOString()
      };
      this.customers.set(customerId, updated);
      return updated;
    }
    return customer;
  }

  /**
   * Remove Tag from Customer
   */
  public removeTag(customerId: string, tag: string, tenantBusinessId: string): CustomerProfile {
    const customer = this.getCustomerById(customerId, tenantBusinessId);
    if (!customer) {
      throw new Error(`Customer ${customerId} not found or tenant access denied`);
    }

    const updated: CustomerProfile = {
      ...customer,
      tags: customer.tags.filter((t) => t !== tag),
      updatedAt: new Date().toISOString()
    };
    this.customers.set(customerId, updated);
    return updated;
  }

  /**
   * Recalculate Metrics for Customer based on Booking History
   */
  public recalculateCustomerMetrics(
    customerId: string,
    tenantBusinessId: string,
    bookings: BookingEntity[]
  ): CustomerProfile | null {
    const customer = this.getCustomerById(customerId, tenantBusinessId);
    if (!customer) return null;

    const customerBookings = bookings.filter(
      (b) => b.businessId === tenantBusinessId && (b.customerId === customerId || b.customerPhone === customer.phone)
    );

    const totalBookings = customerBookings.length;
    const completedBookings = customerBookings.filter((b) => b.status === 'COMPLETED').length;
    const cancelledBookings = customerBookings.filter((b) => b.status === 'CANCELLED').length;

    // Total spend from completed bookings
    const totalSpend = customerBookings
      .filter((b) => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Calculate last visit date
    const completedList = customerBookings
      .filter((b) => b.status === 'COMPLETED')
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());

    const lastVisitAt = completedList[0]?.bookingDate;

    const updated: CustomerProfile = {
      ...customer,
      totalBookings,
      completedBookings,
      cancelledBookings,
      totalSpend,
      lastVisitAt,
      status: calculateCustomerStatus({
        createdAt: customer.createdAt,
        lastVisitAt,
        totalBookings,
        completedBookings
      }),
      updatedAt: new Date().toISOString()
    };

    this.customers.set(customerId, updated);
    return updated;
  }

  /**
   * Calculate Authoritative Summary Metrics for Customer
   */
  public getCustomerSummaryMetrics(
    customerId: string,
    tenantBusinessId: string,
    bookings: BookingEntity[] = SEEDED_BOOKINGS
  ): CustomerSummaryMetrics {
    const customer = this.getCustomerById(customerId, tenantBusinessId);

    const customerBookings = bookings.filter(
      (b) => b.businessId === tenantBusinessId && (b.customerId === customerId || (customer && b.customerPhone === customer.phone))
    );

    const totalBookings = customerBookings.length;
    const completedBookings = customerBookings.filter((b) => b.status === 'COMPLETED').length;
    const cancelledBookings = customerBookings.filter((b) => b.status === 'CANCELLED').length;
    const noShowBookings = customerBookings.filter((b) => b.status === 'NO_SHOW').length;

    const totalSpend = customerBookings
      .filter((b) => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const completedList = customerBookings
      .filter((b) => b.status === 'COMPLETED')
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());

    const lastVisitAt = completedList[0]?.bookingDate;

    // Find next upcoming active booking
    const activeList = customerBookings
      .filter((b) => ['CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'ADVANCE_PAID', 'PAYMENT_PENDING'].includes(b.status))
      .sort((a, b) => new Date(`${a.bookingDate}T${a.startTime}`).getTime() - new Date(`${b.bookingDate}T${b.startTime}`).getTime());

    const nextBooking = activeList[0];
    const upcomingBooking = nextBooking
      ? {
          id: nextBooking.id,
          date: nextBooking.bookingDate,
          time: nextBooking.startTime,
          serviceName: nextBooking.items[0]?.nameSnapshot || 'Salon Service',
          staffName: nextBooking.staffNameSnapshot || 'Team Specialist'
        }
      : undefined;

    return {
      totalBookings,
      completedBookings,
      cancelledBookings,
      noShowBookings,
      totalSpend,
      lastVisitAt,
      upcomingBooking
    };
  }

  /**
   * Construct Real Chronological Activity Timeline from Customer + Booking Audit Logs
   */
  public getCustomerTimeline(
    customerId: string,
    tenantBusinessId: string,
    bookings: BookingEntity[] = SEEDED_BOOKINGS
  ): CustomerTimelineEvent[] {
    const customer = this.getCustomerById(customerId, tenantBusinessId);
    if (!customer) return [];

    const timeline: CustomerTimelineEvent[] = [];

    // Event 1: Customer Creation
    timeline.push({
      id: `evt-created-${customer.id}`,
      customerId: customer.id,
      businessId: tenantBusinessId,
      type: 'CUSTOMER_CREATED',
      title: 'Customer Profile Created',
      description: `Registered with ${customer.phone} (${customer.marketingConsent ? 'Marketing Consent Granted' : 'Opted Out'})`,
      timestamp: customer.createdAt
    });

    // Events from Bookings & Status History
    const customerBookings = bookings.filter(
      (b) => b.businessId === tenantBusinessId && (b.customerId === customer.id || b.customerPhone === customer.phone)
    );

    customerBookings.forEach((b) => {
      // Booking Created Event
      timeline.push({
        id: `evt-bkg-created-${b.id}`,
        customerId: customer.id,
        businessId: tenantBusinessId,
        type: 'BOOKING_CREATED',
        title: `Appointment ${b.id} Booked`,
        description: `Scheduled for ${b.bookingDate} at ${b.startTime} (${b.items[0]?.nameSnapshot || 'Service'})`,
        timestamp: b.createdAt,
        bookingId: b.id
      });

      // Audit logs from status history
      (b.statusHistory || []).forEach((hist) => {
        if (hist.newStatus === 'CONFIRMED' || hist.newStatus === 'ADVANCE_PAID') {
          timeline.push({
            id: `evt-bkg-conf-${hist.id}`,
            customerId: customer.id,
            businessId: tenantBusinessId,
            type: 'BOOKING_CONFIRMED',
            title: `Booking ${b.id} Confirmed`,
            description: hist.reason || `Advance payment verified for ₹${b.totalAmount}`,
            timestamp: hist.timestamp,
            bookingId: b.id
          });
        } else if (hist.newStatus === 'COMPLETED') {
          timeline.push({
            id: `evt-visit-comp-${hist.id}`,
            customerId: customer.id,
            businessId: tenantBusinessId,
            type: 'VISIT_COMPLETED',
            title: `Visit Completed for ${b.id}`,
            description: `Completed with ${b.staffNameSnapshot || 'Stylist'}. Total paid ₹${b.totalAmount}`,
            timestamp: hist.timestamp,
            bookingId: b.id
          });
        } else if (hist.newStatus === 'CANCELLED') {
          timeline.push({
            id: `evt-bkg-canc-${hist.id}`,
            customerId: customer.id,
            businessId: tenantBusinessId,
            type: 'BOOKING_CANCELLED',
            title: `Booking ${b.id} Cancelled`,
            description: hist.reason || 'Appointment cancelled',
            timestamp: hist.timestamp,
            bookingId: b.id
          });
        }
      });
    });

    // Sort chronologically descending (newest first)
    return timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

// Export singleton instance
export const customerCrmService = new CustomerCrmService();
