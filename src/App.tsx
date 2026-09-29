import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { AuthProvider } from './services/authContext';
import { Phase510SecurityDeliverablesShowcase } from './components/Phase510SecurityDeliverablesShowcase';
import { Phase59OperationalDashboardShowcase } from './components/Phase59OperationalDashboardShowcase';
import { Phase58CommunicationShowcase } from './components/Phase58CommunicationShowcase';
import { Phase57ReviewsShowcase } from './components/Phase57ReviewsShowcase';
import { Phase56DailyOperationsShowcase } from './components/Phase56DailyOperationsShowcase';
import { Phase55StaffDashboardShowcase } from './components/Phase55StaffDashboardShowcase';
import { Phase54StaffAvailabilityShowcase } from './components/Phase54StaffAvailabilityShowcase';
import { Phase53StaffManagementShowcase } from './components/Phase53StaffManagementShowcase';
import { Phase52CustomerProfileHistoryShowcase } from './components/Phase52CustomerProfileHistoryShowcase';
import { Phase51CustomerCrmShowcase } from './components/Phase51CustomerCrmShowcase';
import { Phase49BookingHardeningShowcase } from './components/Phase49BookingHardeningShowcase';
import { Phase48BusinessBookingShowcase } from './components/Phase48BusinessBookingShowcase';
import { Phase47BookingNotificationShowcase } from './components/Phase47BookingNotificationShowcase';
import { Phase46AdvancePaymentShowcase } from './components/Phase46AdvancePaymentShowcase';
import { Phase45CustomerBookingShowcase } from './components/Phase45CustomerBookingShowcase';
import { Phase44AvailabilitySlotEngineShowcase } from './components/Phase44AvailabilitySlotEngineShowcase';
import { Phase43StaffScheduleShowcase } from './components/Phase43StaffScheduleShowcase';
import { Phase42ServicesPackagesShowcase } from './components/Phase42ServicesPackagesShowcase';
import { Phase41BookingStateMachineShowcase } from './components/Phase41BookingStateMachineShowcase';
import { Phase38WebsiteBuilderShowcase } from './components/Phase38WebsiteBuilderShowcase';
import { Phase37OnboardingShowcase } from './components/Phase37OnboardingShowcase';
import { Phase36AuthFoundationShowcase } from './components/Phase36AuthFoundationShowcase';
import { Phase35PublicWebsiteShowcase } from './components/Phase35PublicWebsiteShowcase';
import { Phase34CategoryEngineShowcase } from './components/Phase34CategoryEngineShowcase';
import { Phase33RouterShellShowcase } from './routing/Phase33RouterShellShowcase';
import { Phase32DesignSystemShowcase } from './components/Phase32DesignSystemShowcase';
import { Phase31FoundationView } from './components/Phase31FoundationView';
import { Phase28SuperAdminView } from './components/Phase28SuperAdminView';
import { Phase27WebsiteBuilderView } from './components/Phase27WebsiteBuilderView';
import { Phase26AdminDashboardView } from './components/Phase26AdminDashboardView';
import { Phase25CustomerExperienceView } from './components/Phase25CustomerExperienceView';
import { Phase24BookingExperienceView } from './components/Phase24BookingExperienceView';
import { Phase23PublicPageDesignView } from './components/Phase23PublicPageDesignView';
import { Phase22PublicComponentView } from './components/Phase22PublicComponentView';
import { Phase21DesignFoundationView } from './components/Phase21DesignFoundationView';
import { Phase2DesignSystemView } from './components/Phase2DesignSystemView';
import { Phase1DeliverablesReport } from './components/Phase1DeliverablesReport';
import { WireframeCatalogViewer } from './components/WireframeCatalogViewer';
import { PublicWebsiteIAView } from './components/PublicWebsiteIAView';
import { OnboardingWireframeFlow } from './components/OnboardingWireframeFlow';
import { WireframeWorkbench } from './components/WireframeWorkbench';
import { ArchitectureView } from './components/ArchitectureView';
import { RoleMatrixView } from './components/RoleMatrixView';
import { CategoryEngineView } from './components/CategoryEngineView';
import { UserFlowsView } from './components/UserFlowsView';
import { ArchitectureDocumentSummary } from './components/ArchitectureDocumentSummary';
import { LayoutGrid, Layers, ShieldCheck, Compass, FileText, BookOpen, Sparkles, Layout, Clock, UserCheck, LayoutDashboard, SlidersHorizontal, ShieldAlert, Cpu, Palette, Route, Boxes, Globe, Lock, Sliders, CalendarCheck2, Scissors, CalendarRange, Clock3 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('phase510-security');
  const [wireframeCategory, setWireframeCategory] = useState<string>('barber');

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
        {/* Top Bar following 1-row 3-zone contract */}
        <TopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          wireframeCategory={wireframeCategory}
          setWireframeCategory={setWireframeCategory}
        />

        {/* Phase 5.10 Status Banner */}
        <div className="bg-slate-950 text-white text-xs border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold tracking-wide uppercase text-[11px] text-emerald-300">
                Strict Execution Mode: Phase 5.10 — Operations Security & Hardening
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">
                Role Matrix · Backend RBAC Authorization · Tenant Isolation · Audit Logs · Comprehensive Test Suites (1-27)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono font-bold">
              <span>PHASE 5 COMPLETE</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'phase510-security' && <Phase510SecurityDeliverablesShowcase />}
          {activeTab === 'phase59-operational-dashboard' && <Phase59OperationalDashboardShowcase />}
          {activeTab === 'phase58-communication' && <Phase58CommunicationShowcase />}
          {activeTab === 'phase57-reviews' && <Phase57ReviewsShowcase />}
          {activeTab === 'phase56-daily-operations' && <Phase56DailyOperationsShowcase />}
          {activeTab === 'phase55-staff-dashboard' && <Phase55StaffDashboardShowcase />}
          {activeTab === 'phase54-staff-availability' && <Phase54StaffAvailabilityShowcase />}
          {activeTab === 'phase53-staff-management' && <Phase53StaffManagementShowcase />}
          {activeTab === 'phase52-customer-profile' && <Phase52CustomerProfileHistoryShowcase />}
          {activeTab === 'phase51-customer-crm' && <Phase51CustomerCrmShowcase />}
          {activeTab === 'phase49-booking-hardening' && <Phase49BookingHardeningShowcase />}
          {activeTab === 'phase48-business-management' && <Phase48BusinessBookingShowcase />}
          {activeTab === 'phase47-booking-notifications' && <Phase47BookingNotificationShowcase />}
          {activeTab === 'phase46-advance-payment' && <Phase46AdvancePaymentShowcase />}
          {activeTab === 'phase45-customer-booking' && <Phase45CustomerBookingShowcase />}
          {activeTab === 'phase44-slot-engine' && <Phase44AvailabilitySlotEngineShowcase />}
          {activeTab === 'phase43-staff-schedule' && <Phase43StaffScheduleShowcase />}
          {activeTab === 'phase42-services-packages' && <Phase42ServicesPackagesShowcase />}
          {activeTab === 'phase41-booking-state-machine' && <Phase41BookingStateMachineShowcase />}
          {activeTab === 'phase38-website-builder' && <Phase38WebsiteBuilderShowcase />}
          {activeTab === 'phase37-onboarding' && <Phase37OnboardingShowcase />}
          {activeTab === 'phase36-auth-foundation' && <Phase36AuthFoundationShowcase />}
          {activeTab === 'phase35-public-website' && <Phase35PublicWebsiteShowcase />}
          {activeTab === 'phase34-category-engine' && <Phase34CategoryEngineShowcase />}
          {activeTab === 'phase33-shells' && <Phase33RouterShellShowcase />}
          {activeTab === 'phase32-design-system' && <Phase32DesignSystemShowcase />}
          {activeTab === 'phase31-foundation' && <Phase31FoundationView />}
          {activeTab === 'phase28-superadmin' && <Phase28SuperAdminView />}
          {activeTab === 'phase27-builder' && <Phase27WebsiteBuilderView />}
          {activeTab === 'phase26-admin' && <Phase26AdminDashboardView />}
          {activeTab === 'phase25-customer' && <Phase25CustomerExperienceView />}
          {activeTab === 'phase24-booking' && <Phase24BookingExperienceView />}
          {activeTab === 'phase23-pages' && <Phase23PublicPageDesignView />}
          {activeTab === 'phase22-public' && <Phase22PublicComponentView />}
          {activeTab === 'phase21-foundation' && <Phase21DesignFoundationView />}
          {activeTab === 'phase2-design-system' && <Phase2DesignSystemView />}
          {activeTab === 'deliverables' && <Phase1DeliverablesReport />}
          {activeTab === 'wireframe-catalog' && <WireframeCatalogViewer />}
          {activeTab === 'public-ia' && <PublicWebsiteIAView />}
          {activeTab === 'onboarding-flow' && <OnboardingWireframeFlow />}
          {activeTab === 'flows' && <UserFlowsView />}
          {activeTab === 'architecture' && <ArchitectureView />}
          {activeTab === 'roles' && <RoleMatrixView />}
          {activeTab === 'wireframes' && <WireframeWorkbench />}
          {activeTab === 'spec-doc' && <ArchitectureDocumentSummary />}
        </main>

        {/* Quiet, Professional Footer (anti-slop rule) */}
        <footer className="bg-white border-t border-slate-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              <span className="font-semibold text-slate-800">Nexora SalonOS</span> · SaaS Architecture & Execution Blueprint
            </div>
            <div className="text-[11px]">
              Strict Execution Mode Active
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
