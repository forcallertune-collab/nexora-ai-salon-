// Nexora SalonOS — Phase 5.1 Customer Management / CRM Types & Domain Logic
// Multi-Tenant Isolated Customer Profiles, Authoritative Metrics, Notes & Tags

export type CustomerStatus = 'NEW' | 'ACTIVE' | 'INACTIVE';

export type CustomerTimelineEventType =
  | 'CUSTOMER_CREATED'
  | 'BOOKING_CREATED'
  | 'BOOKING_CONFIRMED'
  | 'VISIT_COMPLETED'
  | 'BOOKING_CANCELLED'
  | 'REVIEW_SUBMITTED';

export interface CustomerTimelineEvent {
  id: string;
  customerId: string;
  businessId: string;
  type: CustomerTimelineEventType;
  title: string;
  description: string;
  timestamp: string; // ISO string
  bookingId?: string;
  metadata?: Record<string, any>;
}

export interface CustomerSummaryMetrics {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  totalSpend: number; // INR
  lastVisitAt?: string;
  upcomingBooking?: {
    id: string;
    date: string;
    time: string;
    serviceName: string;
    staffName: string;
  };
}

export interface CustomerNote {
  id: string;
  customerId: string;
  businessId: string;
  content: string;
  authorName: string;
  authorRole: string; // e.g., 'ADMIN', 'MANAGER', 'STAFF'
  createdAt: string; // ISO string
}

export interface CustomerProfile {
  id: string;
  userId?: string; // Optional linkage to auth account
  businessId: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  gender?: string;
  notes: CustomerNote[];
  tags: string[]; // e.g. ['VIP', 'Regular', 'Hair', 'Bridal']
  marketingConsent: boolean;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
  lastVisitAt?: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpend: number; // in standard currency units (e.g. INR 3500)
}

export interface CreateCustomerDTO {
  businessId: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  tags?: string[];
  marketingConsent?: boolean;
  initialNote?: string;
  userId?: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  marketingConsent?: boolean;
}

export interface CustomerFilterParams {
  searchQuery?: string; // Search name, phone, email, or booking ID
  status?: 'ALL' | CustomerStatus;
  customerType?: 'ALL' | 'NEW' | 'RETURNING';
  tag?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface DuplicateDetectionResult {
  isPotentialDuplicate: boolean;
  existingCustomerId?: string;
  existingCustomerName?: string;
  matchReason?: string; // e.g. 'Matching phone number in business records'
}

/**
 * Centrally documented business rules for calculating Customer Status:
 * - NEW: Created within the last 30 days OR has <= 1 booking
 * - ACTIVE: Has at least 1 completed booking within the last 90 days
 * - INACTIVE: Last visit was > 90 days ago OR 0 completed bookings
 */
export function calculateCustomerStatus(
  customer: Pick<CustomerProfile, 'createdAt' | 'lastVisitAt' | 'totalBookings' | 'completedBookings'>,
  nowIso: string = new Date().toISOString()
): CustomerStatus {
  const now = new Date(nowIso).getTime();
  const createdDate = new Date(customer.createdAt).getTime();
  const daysSinceCreation = (now - createdDate) / (1000 * 60 * 60 * 24);

  // 1. Check NEW condition
  if (daysSinceCreation <= 30 && customer.totalBookings <= 1) {
    return 'NEW';
  }

  // 2. Check ACTIVE condition based on last visit date
  if (customer.lastVisitAt) {
    const lastVisitDate = new Date(customer.lastVisitAt).getTime();
    const daysSinceLastVisit = (now - lastVisitDate) / (1000 * 60 * 60 * 24);
    if (daysSinceLastVisit <= 90 && customer.completedBookings > 0) {
      return 'ACTIVE';
    }
  }

  // If created recently but has completed bookings
  if (daysSinceCreation <= 90 && customer.completedBookings > 0) {
    return 'ACTIVE';
  }

  // 3. Fallback to INACTIVE
  return 'INACTIVE';
}
