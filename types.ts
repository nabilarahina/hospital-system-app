export enum AgentType {
  COORDINATOR = 'Hospital System Coordinator',
  MEDICAL_INFO = 'Medical Information Agent',
  APPOINTMENT = 'Appointment Scheduler Agent',
  PATIENT_MGMT = 'Patient Management Agent',
  REPORT_GEN = 'Hospital Report Generator Agent',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent?: AgentType;
  timestamp: number;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}

export interface CoordinatorResponse {
  targetAgent: AgentType;
  reasoning: string;
  refinedQuery: string;
}