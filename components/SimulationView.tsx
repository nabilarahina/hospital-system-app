import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, ArrowRight, Activity, Calendar, FileText, ClipboardList, ExternalLink } from 'lucide-react';
import { AgentType, ChatMessage } from '../types';
import { classifyRequest, getMedicalInfo, mockAgentResponse } from '../services/geminiService';

// Styles map for agents to ensure Tailwind classes are detected (dynamic strings like `bg-${color}` often fail)
const AGENT_STYLES: Record<string, { border: string, bg: string, text: string, ring: string, badge: string }> = {
  blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200', badge: 'bg-blue-100' },
  teal: { border: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-700', ring: 'ring-teal-200', badge: 'bg-teal-100' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-200', badge: 'bg-purple-100' },
  orange: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-200', badge: 'bg-orange-100' },
  indigo: { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-200', badge: 'bg-indigo-100' },
};

const SimulationView: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Halo, saya Hospital System Coordinator. Ada yang bisa saya bantu terkait layanan rumah sakit, jadwal, atau informasi medis?',
      timestamp: Date.now(),
      agent: AgentType.COORDINATOR
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentType>(AgentType.COORDINATOR);
  const [logs, setLogs] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addLog = (log: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    addLog(`User Input: "${userMsg.content}"`);

    try {
      // Step 1: Coordinator classifies the request
      setActiveAgent(AgentType.COORDINATOR);
      addLog("Coordinator: Analyzing request...");
      
      const classification = await classifyRequest(userMsg.content);
      
      addLog(`Coordinator: Routing to ${classification.targetAgent}`);
      addLog(`Reasoning: ${classification.reasoning}`);
      
      // Step 2: Simulate Handoff UI
      setActiveAgent(classification.targetAgent);
      
      let responseText = '';
      let sources: {title: string, uri: string}[] = [];

      // Step 3: Specific Agent execution
      if (classification.targetAgent === AgentType.MEDICAL_INFO) {
        addLog("Medical Agent: Searching and synthesizing info...");
        const result = await getMedicalInfo(classification.refinedQuery);
        responseText = result.text;
        sources = result.sources;
      } else {
        addLog(`${classification.targetAgent}: Processing administrative task...`);
        responseText = await mockAgentResponse(classification.targetAgent, classification.refinedQuery);
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        agent: classification.targetAgent,
        timestamp: Date.now(),
        sources: sources
      };

      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error(error);
      addLog("System Error: Failed to process request.");
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan sistem. Mohon coba lagi.',
        agent: AgentType.COORDINATOR,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
      // Reset to coordinator after task typically, but keeping visual state for effect
      setTimeout(() => setActiveAgent(AgentType.COORDINATOR), 5000);
    }
  };

  const getAgentColorKey = (agent?: AgentType): string => {
    switch (agent) {
      case AgentType.MEDICAL_INFO: return 'teal';
      case AgentType.APPOINTMENT: return 'purple';
      case AgentType.PATIENT_MGMT: return 'orange';
      case AgentType.REPORT_GEN: return 'indigo';
      default: return 'blue';
    }
  };

  const getAgentIcon = (agent?: AgentType) => {
    switch (agent) {
      case AgentType.MEDICAL_INFO: return <Activity className="w-4 h-4" />;
      case AgentType.APPOINTMENT: return <Calendar className="w-4 h-4" />;
      case AgentType.PATIENT_MGMT: return <User className="w-4 h-4" />;
      case AgentType.REPORT_GEN: return <ClipboardList className="w-4 h-4" />;
      default: return <NetworkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      
      {/* Left Panel: Chat Interface */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm font-medium text-slate-600">
              {isLoading ? 'Processing...' : 'System Ready'}
            </span>
          </div>
          <div className="text-xs text-slate-400">v1.0.0</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
          {messages.map((msg) => {
            const agentStyle = AGENT_STYLES[getAgentColorKey(msg.agent)];
            return (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-slate-200' : `${agentStyle.bg} ${agentStyle.text}`
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'assistant' && msg.agent && (
                   <span className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                      {getAgentIcon(msg.agent)}
                      {msg.agent}
                   </span>
                )}
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 text-xs flex flex-wrap gap-2">
                    {msg.sources.map((src, idx) => (
                      <a key={idx} href={src.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-md text-blue-600 hover:underline">
                        <ExternalLink className="w-3 h-3" />
                        {src.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanyakan sesuatu (mis: 'Apa obat sakit kepala?' atau 'Jadwalkan temu dokter')..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: System Visualization */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Active Agent Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Active Agent Loop</h3>
          <div className="flex flex-col gap-4">
            
            <AgentStatus 
              name={AgentType.COORDINATOR} 
              isActive={activeAgent === AgentType.COORDINATOR} 
              icon={<NetworkIcon className="w-5 h-5" />}
              color="blue"
            />
            
            <div className="flex justify-center">
              <ArrowRight className={`w-5 h-5 rotate-90 ${activeAgent !== AgentType.COORDINATOR ? 'text-blue-500' : 'text-slate-200'}`} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <AgentStatus 
                name="Medical Info" 
                isActive={activeAgent === AgentType.MEDICAL_INFO} 
                compact
                color="teal"
              />
              <AgentStatus 
                name="Appointment" 
                isActive={activeAgent === AgentType.APPOINTMENT} 
                compact
                color="purple"
              />
              <AgentStatus 
                name="Patient Mgmt" 
                isActive={activeAgent === AgentType.PATIENT_MGMT} 
                compact
                color="orange"
              />
              <AgentStatus 
                name="Report Gen" 
                isActive={activeAgent === AgentType.REPORT_GEN} 
                compact
                color="indigo"
              />
            </div>

          </div>
        </div>

        {/* System Logs */}
        <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 flex-1 overflow-hidden flex flex-col">
          <div className="bg-slate-800 p-3 px-4 flex justify-between items-center">
            <span className="text-xs font-mono text-slate-400">System Logs</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
          </div>
          <div className="p-4 font-mono text-xs overflow-y-auto flex-1 space-y-2">
             {logs.length === 0 && <span className="text-slate-600 italic">Waiting for input...</span>}
             {logs.map((log, i) => (
               <div key={i} className="text-green-400 border-l-2 border-slate-700 pl-2">
                 {log}
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Components for Visuals

const NetworkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const AgentStatus = ({ name, isActive, icon, compact, color = 'blue' }: any) => {
  const styles = AGENT_STYLES[color] || AGENT_STYLES['blue'];
  
  const activeClass = isActive 
    ? `${styles.border} ${styles.bg} ${styles.text} ring-2 ${styles.ring}` 
    : 'border-slate-200 bg-white text-slate-500 grayscale opacity-70';

  return (
    <div className={`border rounded-lg transition-all duration-300 ${activeClass} ${compact ? 'p-2 text-center text-xs' : 'p-3 flex items-center gap-3'}`}>
      {!compact && (
        <div className={`p-2 rounded-md ${isActive ? styles.badge : 'bg-slate-100'}`}>
          {icon}
        </div>
      )}
      <span className="font-semibold">{name}</span>
      {isActive && !compact && <span className="ml-auto flex h-2 w-2 rounded-full bg-green-500 animate-ping"></span>}
    </div>
  );
};

export default SimulationView;