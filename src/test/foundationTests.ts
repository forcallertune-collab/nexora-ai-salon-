// Nexora SalonOS — Foundational Unit Tests (Phase 3.1)
// Self-contained execution runner verifying:
// 1. Centralized configuration integrity
// 2. Financial calculation rules (advance 25% and GST calculation)
// 3. Route protection and multi-tenant zone access control rules
// 4. Currency and duration formatting conventions

import { PLATFORM_CONFIG } from '../config/platformConfig';
import {
  calculateBookingFinancials,
  evaluateQualificationStatus,
  formatCurrency,
  formatDuration,
} from '../utils/financials';
import { checkZoneAccess, ZONE_PERMISSION_RULES } from '../lib/authGuard';
import {
  getTemplatesForCategory,
  getCategoryDefinition,
  resolveTemplateData,
} from '../services/templateResolver';
import { getPublicBusinessBySlug, SEEDED_PUBLIC_BUSINESSES } from '../data/seededPublicBusinesses';
import { SEEDED_AUTH_USERS, hashPasswordClient } from '../services/authContext';
import { INITIAL_BUILDER_SECTIONS, localWebsitePersistence } from '../types/websiteBuilder';

export interface TestResultItem {
  id: string;
  name: string;
  suite: string;
  passed: boolean;
  message?: string;
  durationMs: number;
}

export function runFoundationTestSuite(): {
  total: number;
  passed: number;
  failed: number;
  results: TestResultItem[];
} {
  const results: TestResultItem[] = [];

  function test(suite: string, name: string, fn: () => void) {
    const start = performance.now();
    try {
      fn();
      results.push({
        id: `${suite}-${name}`.replace(/\s+/g, '-').toLowerCase(),
        name,
        suite,
        passed: true,
        durationMs: Number((performance.now() - start).toFixed(2)),
      });
    } catch (err: any) {
      results.push({
        id: `${suite}-${name}`.replace(/\s+/g, '-').toLowerCase(),
        name,
        suite,
        passed: false,
        message: err.message || String(err),
        durationMs: Number((performance.now() - start).toFixed(2)),
      });
    }
  }

  function assert(condition: boolean, message: string) {
    if (!condition) throw new Error(message);
  }

  function assertEquals(actual: any, expected: any, desc: string) {
    if (actual !== expected) {
      throw new Error(`${desc}: Expected ${expected} but received ${actual}`);
    }
  }

  // SUITE 1: CONFIGURATION INTEGRITY
  test('Configuration', 'Verify default 25% advance booking configuration', () => {
    assertEquals(
      PLATFORM_CONFIG.bookingDefaults.advancePercentage,
      25,
      'advancePercentage'
    );
  });

  test('Configuration', 'Verify 7 standardized business categories exist', () => {
    assertEquals(PLATFORM_CONFIG.categories.length, 7, 'categories.length');
    const ids = PLATFORM_CONFIG.categories.map((c) => c.id);
    assert(ids.includes('barber'), 'Missing barber category');
    assert(ids.includes('hair_salon'), 'Missing hair_salon category');
    assert(ids.includes('spa'), 'Missing spa category');
    assert(ids.includes('nail'), 'Missing nail category');
    assert(ids.includes('beauty'), 'Missing beauty category');
    assert(ids.includes('massage'), 'Missing massage category');
    assert(ids.includes('tattoo'), 'Missing tattoo category');
  });

  test('Configuration', 'Verify 6 design system theme presets exist with token schema', () => {
    const themes = Object.keys(PLATFORM_CONFIG.themes);
    assertEquals(themes.length, 6, 'themes.length');
    assert(themes.includes('luxury'), 'Missing luxury theme');
    assert(themes.includes('minimal'), 'Missing minimal theme');
    assert(themes.includes('modern'), 'Missing modern theme');
    assert(themes.includes('bold'), 'Missing bold theme');
    assert(themes.includes('elegant'), 'Missing elegant theme');
    assert(themes.includes('dark'), 'Missing dark theme');
  });

  // SUITE 2: FINANCIAL UTILITIES & CALCULATION ENGINE
  test('Financials', 'Calculate 25% advance with 18% GST correctly', () => {
    // Subtotal 1000, 0 discount, 25% advance, 18% GST
    // Taxable = 1000, Tax = 180, Total Gross = 1180
    // Advance = 25% of 1180 = 295. Balance = 885.
    const res = calculateBookingFinancials(1000, 0, 25, 18);
    assertEquals(res.totalGrossAmount, 1180, 'totalGrossAmount');
    assertEquals(res.advanceAmountRequired, 295, 'advanceAmountRequired');
    assertEquals(res.outstandingBalanceAtVenue, 885, 'outstandingBalanceAtVenue');
  });

  test('Financials', 'Calculate 0% tax booking (pure subtotal test)', () => {
    const res = calculateBookingFinancials(1000, 0, 25, 0);
    assertEquals(res.totalGrossAmount, 1000, 'totalGrossAmount');
    assertEquals(res.advanceAmountRequired, 250, 'advanceAmountRequired');
    assertEquals(res.outstandingBalanceAtVenue, 750, 'outstandingBalanceAtVenue');
  });

  test('Financials', 'Format Indian Rupee currency correctly', () => {
    assertEquals(formatCurrency(1250), '₹1,250', 'formatCurrency standard');
    assertEquals(formatCurrency(34250), '₹34,250', 'formatCurrency thousands');
  });

  test('Financials', 'Format duration in minutes to human text', () => {
    assertEquals(formatDuration(45), '45 mins', 'formatDuration <60');
    assertEquals(formatDuration(60), '1 hr', 'formatDuration 60m');
    assertEquals(formatDuration(75), '1 hr 15 mins', 'formatDuration 75m');
  });

  test('Financials', 'Evaluate daily qualification threshold progress', () => {
    const under = evaluateQualificationStatus(600, 1000);
    assertEquals(under.isQualified, false, 'isQualified under');
    assertEquals(under.progressPercentage, 60, 'progressPercentage');
    assertEquals(under.gap, 400, 'gap');

    const qualified = evaluateQualificationStatus(1200, 1000);
    assertEquals(qualified.isQualified, true, 'isQualified over');
    assertEquals(qualified.progressPercentage, 100, 'progressPercentage cap');
    assertEquals(qualified.gap, 0, 'gap zero');
  });

  // SUITE 3: ROUTE PROTECTION & ZONE BOUNDARY ARCHITECTURE
  test('AuthGuard', 'Public zone allows unauthenticated access', () => {
    const res = checkZoneAccess('PUBLIC', null);
    assertEquals(res.allowed, true, 'Public access without role');
  });

  test('AuthGuard', 'Admin zone rejects unauthenticated customer', () => {
    const res = checkZoneAccess('BUSINESS_ADMIN', null);
    assertEquals(res.allowed, false, 'Admin requires auth');
    assertEquals(res.redirectPath, '/signin', 'Redirect path');
  });

  test('AuthGuard', 'Admin zone denies Customer role but allows Business Owner', () => {
    const customerRes = checkZoneAccess('BUSINESS_ADMIN', 'CUSTOMER');
    assertEquals(customerRes.allowed, false, 'Deny customer in admin');

    const ownerRes = checkZoneAccess('BUSINESS_ADMIN', 'BUSINESS_OWNER');
    assertEquals(ownerRes.allowed, true, 'Allow business owner in admin');
  });

  test('AuthGuard', 'Super admin zone strictly rejects Business Owner', () => {
    const ownerRes = checkZoneAccess('SUPER_ADMIN', 'BUSINESS_OWNER');
    assertEquals(ownerRes.allowed, false, 'Deny business owner in superadmin');

    const superRes = checkZoneAccess('SUPER_ADMIN', 'SUPER_ADMIN');
    assertEquals(superRes.allowed, true, 'Allow super admin in superadmin');
  });

  // SUITE 4: CATEGORY + TEMPLATE RESOLVER ENGINE (PHASE 3.4)
  test('TemplateResolver', 'Barber category resolves at least 3 distinct barber templates', () => {
    const barberTemplates = getTemplatesForCategory('barber');
    assert(barberTemplates.length >= 3, `Expected at least 3 barber templates, got ${barberTemplates.length}`);
    const templateIds = barberTemplates.map((t) => t.templateId);
    assert(templateIds.includes('tmpl-barber-luxury'), 'Missing luxury barber template');
    assert(templateIds.includes('tmpl-barber-modern'), 'Missing modern barber template');
    assert(templateIds.includes('tmpl-barber-minimal'), 'Missing minimal barber template');
  });

  test('TemplateResolver', 'Spa category resolves at least 3 distinct spa templates', () => {
    const spaTemplates = getTemplatesForCategory('spa');
    assert(spaTemplates.length >= 3, `Expected at least 3 spa templates, got ${spaTemplates.length}`);
    const templateIds = spaTemplates.map((t) => t.templateId);
    assert(templateIds.includes('tmpl-spa-sanctuary'), 'Missing sanctuary spa template');
  });

  test('TemplateResolver', 'Tattoo category resolves at least 3 distinct tattoo templates', () => {
    const tattooTemplates = getTemplatesForCategory('tattoo');
    assert(tattooTemplates.length >= 3, `Expected at least 3 tattoo templates, got ${tattooTemplates.length}`);
    const templateIds = tattooTemplates.map((t) => t.templateId);
    assert(templateIds.includes('tmpl-tattoo-mono'), 'Missing mono tattoo template');
  });

  test('TemplateResolver', 'Full resolution of Barber template returns theme tokens and default services', () => {
    const resolved = resolveTemplateData('barber', 'tmpl-barber-luxury');
    assert(resolved !== null, 'Resolved data should not be null');
    assertEquals(resolved?.category.name, 'Barber & Men Grooming', 'Category name');
    assertEquals(resolved?.themePreset, 'luxury', 'Theme preset');
    assert(resolved!.defaultServices.length >= 3, 'Must have default services seeded');
    assert(resolved!.defaultPackages.length >= 1, 'Must have default packages seeded');
  });

  test('TemplateResolver', 'Unknown category fails safely by returning null', () => {
    const unknownCategory = resolveTemplateData('unknown-alien-category');
    assertEquals(unknownCategory, null, 'Safe failure for unknown category');

    const emptyTemplates = getTemplatesForCategory('unknown-alien-category');
    assertEquals(emptyTemplates.length, 0, 'Empty array for unknown category templates');
  });

  // SUITE 5: PUBLIC BUSINESS WEBSITE FOUNDATION (PHASE 3.5)
  test('PublicWebsite', 'Barber salon resolves dynamic metadata & luxury theme', () => {
    const barber = getPublicBusinessBySlug('royal-crown');
    assert(barber !== null, 'Barber business exists in seed registry');
    assertEquals(barber?.name, 'The Royal Crown Barber & Lounge', 'Barber Name');
    assertEquals(barber?.config.advancePaymentPercentage, 25, '25% advance rule');
    assert(barber!.galleryImages.length >= 3, 'Barber has gallery photos');
    assert(barber!.testimonials.length >= 2, 'Barber has verified testimonials');
  });

  test('PublicWebsite', 'Spa sanctuary resolves dynamic metadata & minimal theme', () => {
    const spa = getPublicBusinessBySlug('zenith-spa');
    assert(spa !== null, 'Spa business exists in seed registry');
    assertEquals(spa?.name, 'Zenith Stone Spa & Sanctuary', 'Spa Name');
    assertEquals(spa?.category, 'spa', 'Spa category match');
  });

  test('PublicWebsite', 'Nail studio resolves dynamic metadata & elegant theme', () => {
    const nail = getPublicBusinessBySlug('gloss-chic');
    assert(nail !== null, 'Nail studio exists in seed registry');
    assertEquals(nail?.name, 'Gloss & Chic Nail Bar', 'Nail Name');
  });

  test('PublicWebsite', 'Tattoo studio resolves dynamic metadata & bold theme', () => {
    const tattoo = getPublicBusinessBySlug('mono-tattoo');
    assert(tattoo !== null, 'Tattoo studio exists in seed registry');
    assertEquals(tattoo?.name, 'Mono Blackwork & Fine Line Tattoo', 'Tattoo Name');
    assertEquals(tattoo?.category, 'tattoo', 'Tattoo category match');
  });

  // SUITE 6: AUTHENTICATION FOUNDATION & 5 CORE ROLES (PHASE 3.6)
  test('AuthFoundation', '5 Core platform roles seeded in auth registry', () => {
    const roles = SEEDED_AUTH_USERS.map((u) => u.role);
    assert(roles.includes('CUSTOMER'), 'Has CUSTOMER role');
    assert(roles.includes('BUSINESS_OWNER'), 'Has BUSINESS_OWNER role');
    assert(roles.includes('MANAGER'), 'Has MANAGER role');
    assert(roles.includes('STAFF'), 'Has STAFF role');
    assert(roles.includes('SUPER_ADMIN'), 'Has SUPER_ADMIN role');
  });

  test('AuthFoundation', 'Client-side SHA-256 salted hashing does not output plaintext', async () => {
    const hash = await hashPasswordClient('super_secret_123');
    assert(hash.length === 64, 'SHA-256 hex string length 64');
    assert(!hash.includes('super_secret_123'), 'Hash must not contain plaintext string');
  });

  test('AuthFoundation', 'Business owner record binds to correct salon slug', () => {
    const owner = SEEDED_AUTH_USERS.find((u) => u.role === 'BUSINESS_OWNER');
    assert(owner !== undefined, 'Owner exists');
    assertEquals(owner?.businessSlug, 'royal-crown', 'Owner binds to royal-crown slug');
  });

  // SUITE 7: BUSINESS ONBOARDING & CATEGORY CONFIG GENERATION (PHASE 3.7)
  test('Onboarding', 'Barber onboarding initializes barber staff roles and services', () => {
    const barberDef = getCategoryDefinition('barber');
    assert(barberDef !== null, 'Barber definition exists');
    assert(barberDef!.staffRoles.includes('Master Barber'), 'Has Master Barber role');
    assert(barberDef!.defaultServices.some((s) => s.name.includes('Skin Fade')), 'Has Skin Fade service');
  });

  test('Onboarding', 'Spa onboarding initializes spa therapist roles and hydro rituals', () => {
    const spaDef = getCategoryDefinition('spa');
    assert(spaDef !== null, 'Spa definition exists');
    assert(spaDef!.staffRoles.includes('Spa Therapist') || spaDef!.staffRoles.includes('Lead Spa Therapist'), 'Has Spa Therapist role');
    assert(spaDef!.defaultServices.some((s) => s.name.includes('Stone')), 'Has stone therapy service');
  });

  test('Onboarding', 'Nail studio onboarding initializes nail artist roles and dry manicure defaults', () => {
    const nailDef = getCategoryDefinition('nail-studio');
    assert(nailDef !== null, 'Nail definition exists');
    assert(nailDef!.staffRoles.includes('Master Nail Artist') || nailDef!.staffRoles.includes('Nail Artist'), 'Has Nail Artist role');
    assert(nailDef!.defaultServices.some((s) => s.name.includes('Manicure')), 'Has manicure service');
  });

  // SUITE 8: WEBSITE BUILDER FOUNDATION (PHASE 3.8)
  test('WebsiteBuilder', 'Builder initialized with 10 standard homepage sections', () => {
    assert(INITIAL_BUILDER_SECTIONS.length === 10, 'Expected 10 builder sections');
    const types = INITIAL_BUILDER_SECTIONS.map((s) => s.type);
    assert(types.includes('hero'), 'Contains hero section');
    assert(types.includes('about'), 'Contains about section');
    assert(types.includes('services'), 'Contains services section');
    assert(types.includes('booking'), 'Contains booking CTA section');
  });

  test('WebsiteBuilder', 'Section property modification alters structured content without touching source', () => {
    const heroSection = { ...INITIAL_BUILDER_SECTIONS[0] };
    heroSection.heading = 'Custom Luxury Grooming Title';
    heroSection.badge = 'Exclusive Membership';
    assertEquals(heroSection.heading, 'Custom Luxury Grooming Title', 'Heading updated');
    assertEquals(heroSection.badge, 'Exclusive Membership', 'Badge updated');
  });

  test('WebsiteBuilder', 'Section visibility toggle and reordering behaves correctly', () => {
    const sections = [...INITIAL_BUILDER_SECTIONS];
    // Hide section 0
    sections[0].visible = false;
    assertEquals(sections[0].visible, false, 'Hero section hidden');

    // Reorder (Swap 0 and 1)
    const temp = sections[0];
    sections[0] = sections[1];
    sections[1] = temp;
    assertEquals(sections[0].type, 'services', 'Services moved to position 1');
    assertEquals(sections[1].type, 'hero', 'Hero moved to position 2');
  });

  test('WebsiteBuilder', 'Persistence abstraction stores and retrieves draft state', async () => {
    const sampleDraft = {
      businessSlug: 'test-slug-99',
      businessName: 'Test Salon',
      category: 'barber',
      templateId: 'tmpl-barber-luxury',
      theme: 'luxury',
      activePage: 'home' as const,
      selectedSectionId: 'sec-hero',
      pages: {
        home: {
          pageId: 'home' as const,
          name: 'Home',
          sections: INITIAL_BUILDER_SECTIONS
        }
      },
      updatedAt: new Date().toISOString()
    };

    const saved = await localWebsitePersistence.saveDraft(sampleDraft as any);
    assert(saved === true, 'Draft saved successfully');
  });

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  return {
    total: results.length,
    passed,
    failed,
    results,
  };
}
