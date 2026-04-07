//My-app-admin-dashboard-22\frontend\types\index.ts
export interface Event {
  id: string;
  title: string;
  host: string;
  hostVerified: boolean;
  image: string;
  category: string;
  dateSubmitted: string;
  eventDate: string;
  location: string;
  ticketPrice: string;
  capacity: number;
  description: string;
  status: 'pending' | 'flagged' | 'under_review' | 'approved' | 'rejected';
  aiAnalysis?: AIAnalysis;
}

export interface AIAnalysis {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: AIFlag[];
  semanticIntegrity: number;
  hostLegitimacy: number;
  engagementPattern: number;
  summary: string;
  recommendation: string;
  scannedAt: string;
  isLoading?: boolean;
}

export interface AIFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface ModerationAction {
  eventId: string;
  action: 'approve' | 'reject' | 'send_for_edits';
  moderatorNote?: string;
  timestamp: string;
}