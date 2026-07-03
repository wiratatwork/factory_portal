import { Component } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';

interface PortalApp {
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './portal.component.html',
})
export class PortalComponent {
  readonly productionApps: PortalApp[] = [
    { name: 'Web App', description: 'Open app-1 in a new tab with shared Keycloak SSO.', icon: 'globe' },
    { name: 'Production Dashboard', description: 'Live output, takt time, and line status monitoring.', icon: 'chart' },
    { name: 'Downtime Analytics', description: 'Loss analysis, Pareto breakdown, and recovery actions.', icon: 'clock' },
    { name: 'OEE Tracker', description: 'Monitor Overall Equipment Effectiveness in real-time.', icon: 'gauge' },
    { name: 'Energy Monitoring', description: 'Track power consumption across production lines.', icon: 'bolt' },
  ];
  readonly qualityApps: PortalApp[] = [
    { name: 'Quality Management', description: 'Defect records, inspection plans, and CAPA tracking.', icon: 'shield' },
    { name: 'Maintenance CMMS', description: 'Work orders, preventive plans, and spare parts control.', icon: 'wrench' },
  ];
  readonly peopleApps: PortalApp[] = [
    { name: 'Supply Chain Control', description: 'Inbound parts, inventory status, and vendor delivery tracking.', icon: 'truck' },
    { name: 'People & Training', description: 'Shift roster, certifications, and safety learning modules.', icon: 'users' },
  ];

  private readonly iconPaths: Record<string, string> = {
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5-2.5 4-5.5 4-9s-1.5-6.5-4-9m0 18c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9M3.6 9h16.8M3.6 15h16.8',
    chart: 'M3 3v18h18M7 16l3-3 3 2 5-6',
    clock: 'M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    gauge: 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0v2m0-10V6m8.5 3.5L18 8m-12 3.5L6 8m12.5 8.5L18 16M6 16l1.5-1.5',
    bolt: 'M13 2 3 14h8l-1 8 10-12h-8l1-8Z',
    shield: 'M12 3 4 7v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4Zm5 8-5 5-3-3',
    wrench: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-1.4-1.4 2.1-2.1Z',
    truck: 'M3 7h11v8H3V7Zm11 3h3l2 3v2h-5v-5ZM7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
    users: 'M16 19a4 4 0 0 0-8 0M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 19a3 3 0 0 0-2.8-2M4 19a3 3 0 0 1 2.8-2',
  };

  openApp(appName: string): void {
    if (appName === 'Web App') {
      window.open('http://localhost:4201/?sso=1', '_blank', 'noopener,noreferrer');
      return;
    }
    window.alert(`Demo mode: "${appName}" is a placeholder.`);
  }

  iconPath(icon: string): string {
    return this.iconPaths[icon] ?? this.iconPaths['globe'];
  }
}
