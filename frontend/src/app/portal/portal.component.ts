import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PortalApp {
  name: string;
  description: string;
  status: 'Available' | 'Maintenance' | 'Planned';
}

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal.component.html',
})
export class PortalComponent {
  readonly productionApps: PortalApp[] = [
    { name: 'Web App', description: 'Open app-1 in a new tab with shared Keycloak SSO.', status: 'Available' },
    { name: 'Production Dashboard', description: 'Live output, takt time, and line status monitoring.', status: 'Available' },
    { name: 'Downtime Analytics', description: 'Loss analysis, Pareto breakdown, and recovery actions.', status: 'Maintenance' },
    { name: 'OEE Tracker', description: 'Monitor Overall Equipment Effectiveness in real-time.', status: 'Available' },
    { name: 'Energy Monitoring', description: 'Track power consumption across production lines.', status: 'Available' },
  ];
  readonly qualityApps: PortalApp[] = [
    { name: 'Quality Management', description: 'Defect records, inspection plans, and CAPA tracking.', status: 'Available' },
    { name: 'Maintenance CMMS', description: 'Work orders, preventive plans, and spare parts control.', status: 'Planned' },
  ];
  readonly peopleApps: PortalApp[] = [
    { name: 'Supply Chain Control', description: 'Inbound parts, inventory status, and vendor delivery tracking.', status: 'Available' },
    { name: 'People & Training', description: 'Shift roster, certifications, and safety learning modules.', status: 'Available' },
  ];

  openApp(appName: string): void {
    if (appName === 'Web App') {
      window.open('http://localhost:4201/?sso=1', '_blank', 'noopener,noreferrer');
      return;
    }
    window.alert(`Demo mode: "${appName}" is a placeholder.`);
  }
  badgeClass(status: PortalApp['status']): string {
    if (status === 'Maintenance') return 'bg-amber-50 text-amber-700';
    if (status === 'Planned') return 'bg-sky-50 text-sky-700';
    return 'bg-emerald-50 text-emerald-700';
  }
}
