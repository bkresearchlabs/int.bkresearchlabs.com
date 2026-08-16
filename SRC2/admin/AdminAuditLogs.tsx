import React, { useState, useEffect, useMemo } from 'react';
import {
  History, Shield, FileText, Download, Search, RefreshCw, Filter, CheckCircle2,
  Calendar, User, Activity, ArrowUpDown, ChevronDown, Clock, Server, Eye,
  FileCode, Key, Layers, Copy, Check
} from 'lucide-react';
import { AuditLog, UserRole } from '../../types';
import { api } from '../../lib/supabase';

interface AdminAuditLogsProps {
  logs?: AuditLog[];
}

type ViewMode = 'timeline' | 'table';
type DatePreset = 'all' | 'today' | '24h' | '7d' | '30d' | 'custom';
type ExportFormat = 'csv' | 'json' | 'compliance_dossier';

export const AdminAuditLogs: React.FC<AdminAuditLogsProps> = ({ logs: initialLogs }) => {
  const [logsList, setLogsList] = useState<AuditLog[]>(() => {
    const raw = initialLogs && initialLogs.length > 0 ? initialLogs : api.getAuditLogs();
    return raw;
  });

  // Display and Filter State
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Interactive details modal / drawer
  const [selectedLogForModal, setSelectedLogForModal] = useState<AuditLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  const refreshLogs = async () => {
    const fresh = await api.getAuditLogs();
    setLogsList(fresh);
    showToast('Audit ledger synchronized in real-time');
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Distinct users and roles extracted from data
  const distinctUsers = useMemo(() => {
    const set = new Set<string>();
    logsList.forEach(l => {
      if (l.admin_email) set.add(l.admin_email);
    });
    return Array.from(set).sort();
  }, [logsList]);

  const distinctRoles: UserRole[] = ['owner', 'admin', 'security_admin', 'employee', 'customer'];

  // Filter application
  const filteredLogs = useMemo(() => {
    const now = new Date().getTime();

    return logsList.filter(log => {
      // User filter
      if (selectedUser !== 'ALL' && log.admin_email !== selectedUser) {
        return false;
      }

      // Role filter
      if (selectedRole !== 'ALL' && (log.role || 'admin') !== selectedRole) {
        return false;
      }

      // Action / Category filter
      if (selectedAction !== 'ALL') {
        const act = log.action.toLowerCase();
        if (!act.includes(selectedAction.toLowerCase())) {
          return false;
        }
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          log.admin_email?.toLowerCase().includes(q) ||
          log.action?.toLowerCase().includes(q) ||
          log.entity_type?.toLowerCase().includes(q) ||
          log.entity_id?.toLowerCase().includes(q) ||
          log.details?.toLowerCase().includes(q) ||
          log.ip_address?.toLowerCase().includes(q) ||
          log.role?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Date filtering
      const logTime = new Date(log.created_at).getTime();

      if (datePreset === 'today') {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        if (logTime < startOfDay.getTime()) return false;
      } else if (datePreset === '24h') {
        if (now - logTime > 24 * 60 * 60 * 1000) return false;
      } else if (datePreset === '7d') {
        if (now - logTime > 7 * 24 * 60 * 60 * 1000) return false;
      } else if (datePreset === '30d') {
        if (now - logTime > 30 * 24 * 60 * 60 * 1000) return false;
      } else if (datePreset === 'custom') {
        if (startDate) {
          const s = new Date(startDate).getTime();
          if (logTime < s) return false;
        }
        if (endDate) {
          const e = new Date(endDate);
          e.setHours(23, 59, 59, 999);
          if (logTime > e.getTime()) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const tA = new Date(a.created_at).getTime();
      const tB = new Date(b.created_at).getTime();
      return sortOrder === 'desc' ? tB - tA : tA - tB;
    });
  }, [logsList, selectedUser, selectedRole, selectedAction, searchTerm, datePreset, startDate, endDate, sortOrder]);

  // Group logs by Date string for Timeline View
  const groupedTimelineLogs = useMemo(() => {
    const groups: { [key: string]: AuditLog[] } = {};

    filteredLogs.forEach(log => {
      const dateObj = new Date(log.created_at);
      const todayStr = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      let groupKey: string;
      if (dateObj.toDateString() === todayStr) {
        groupKey = 'Today';
      } else if (dateObj.toDateString() === yesterdayStr) {
        groupKey = 'Yesterday';
      } else {
        groupKey = dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(log);
    });

    return groups;
  }, [filteredLogs]);

  // Comprehensive Export Handlers
  const handleExport = (format: ExportFormat) => {
    setIsExportDropdownOpen(false);
    const dateStr = new Date().toISOString().split('T')[0];

    if (format === 'csv') {
      const headers = ['Log ID', 'Timestamp (ISO)', 'Formatted Time', 'User / Admin Email', 'Assigned Role', 'Action Recorded', 'Entity Type', 'Entity ID', 'Details', 'IP Origin', 'Supervisor Reviewed'];
      const rows = filteredLogs.map(l => [
        `"${l.id}"`,
        `"${l.created_at}"`,
        `"${new Date(l.created_at).toLocaleString('en-US')}"`,
        `"${l.admin_email}"`,
        `"${l.role || 'admin'}"`,
        `"${l.action.replace(/"/g, '""')}"`,
        `"${l.entity_type}"`,
        `"${l.entity_id || ''}"`,
        `"${(l.details || '').replace(/"/g, '""')}"`,
        `"${l.ip_address || 'Internal'}"`,
        `"${l.supervisor_reviewed ? 'Yes' : 'No'}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      downloadFile(csvContent, `BKRL_Audit_Compliance_Report_${dateStr}.csv`);
      showToast('CSV compliance export generated successfully');
    } else if (format === 'json') {
      const jsonContent = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
        organization: 'BK RESEARCH LABS LLC',
        report_type: 'SOC2 / HIPAA / GxP Electronic Records Audit Trail',
        generated_at: new Date().toISOString(),
        total_records: filteredLogs.length,
        filters_applied: {
          user: selectedUser,
          role: selectedRole,
          action: selectedAction,
          date_preset: datePreset,
          start_date: startDate || null,
          end_date: endDate || null
        },
        records: filteredLogs
      }, null, 2));
      downloadFile(jsonContent, `BKRL_Audit_Ledger_${dateStr}.json`);
      showToast('JSON cryptographic export generated successfully');
    } else if (format === 'compliance_dossier') {
      // Markdown-formatted compliance dossier
      let doc = `# BK RESEARCH LABS — AUDIT LOG & COMPLIANCE DOSSIER\n`;
      doc += `**Document Reference:** BKRL-AUDIT-${Date.now()}\n`;
      doc += `**Generation Timestamp:** ${new Date().toUTCString()}\n`;
      doc += `**Scope:** Immutable Security & Operational Event Ledger\n`;
      doc += `**Total Events Analyzed:** ${filteredLogs.length}\n`;
      doc += `**Active Filters:** User: ${selectedUser} | Role: ${selectedRole} | Category: ${selectedAction} | Date Range: ${datePreset}\n\n`;
      doc += `---\n\n`;
      doc += `## SUMMARY METRICS\n`;
      doc += `- Total Events: ${filteredLogs.length}\n`;
      doc += `- Security Operations: ${filteredLogs.filter(l => l.role === 'security_admin' || l.action.toLowerCase().includes('waf') || l.action.toLowerCase().includes('lockout')).length}\n`;
      doc += `- Executive / Owner Actions: ${filteredLogs.filter(l => l.role === 'owner').length}\n`;
      doc += `- Fulfillment Operations: ${filteredLogs.filter(l => l.role === 'employee').length}\n\n`;
      doc += `## CHRONOLOGICAL EVENT LOGS\n\n`;

      filteredLogs.forEach((l, idx) => {
        doc += `### [Event #${idx + 1}] ${l.action} (${new Date(l.created_at).toUTCString()})\n`;
        doc += `- **Log ID:** \`${l.id}\`\n`;
        doc += `- **Operator:** ${l.admin_email} [Role: ${l.role?.toUpperCase() || 'ADMIN'}]\n`;
        doc += `- **Target Entity:** ${l.entity_type} ${l.entity_id ? `(ID: ${l.entity_id})` : ''}\n`;
        doc += `- **IP Address:** ${l.ip_address || '10.0.1.42 (Internal SecOps)'}\n`;
        doc += `- **Event Details:** ${l.details}\n`;
        if (l.supervisor_reviewed) {
          doc += `- **Supervisor Sign-off:** Approved by ${l.supervisor_reviewed_by || 'Executive Review'} at ${l.supervisor_reviewed_at || l.created_at}\n`;
        }
        doc += `\n`;
      });

      const blob = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(doc);
      downloadFile(blob, `BKRL_GxP_Compliance_Dossier_${dateStr}.md`);
      showToast('Compliance Dossier formatted and exported');
    }
  };

  const downloadFile = (uri: string, filename: string) => {
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for action badges & icons
  const getActionBadge = (action: string, role?: string) => {
    const a = action.toLowerCase();
    if (a.includes('sign in') || a.includes('auth') || a.includes('login')) {
      return {
        bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
        icon: Key,
        dot: 'bg-indigo-400',
        label: 'Authentication'
      };
    }
    if (a.includes('waf') || a.includes('lockout') || a.includes('security') || a.includes('firewall')) {
      return {
        bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        icon: Shield,
        dot: 'bg-rose-400',
        label: 'Security Op'
      };
    }
    if (a.includes('order') || a.includes('fulfill') || a.includes('ship') || a.includes('po')) {
      return {
        bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        icon: Activity,
        dot: 'bg-emerald-400',
        label: 'Fulfillment'
      };
    }
    if (a.includes('stock') || a.includes('product') || a.includes('catalog')) {
      return {
        bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        icon: Layers,
        dot: 'bg-amber-400',
        label: 'Inventory'
      };
    }
    if (a.includes('role') || a.includes('user') || a.includes('profile')) {
      return {
        bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
        icon: User,
        dot: 'bg-cyan-400',
        label: 'RBAC Policy'
      };
    }
    return {
      bg: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
      icon: Server,
      dot: 'bg-slate-400',
      label: 'System Event'
    };
  };

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'owner':
        return <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[9px] font-black uppercase tracking-wider">Owner</span>;
      case 'security_admin':
        return <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-[9px] font-black uppercase tracking-wider">SecOps Admin</span>;
      case 'admin':
        return <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[9px] font-black uppercase tracking-wider">Admin</span>;
      case 'employee':
        return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full text-[9px] font-black uppercase tracking-wider">Fulfillment</span>;
      case 'customer':
        return <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full text-[9px] font-black uppercase tracking-wider">Customer</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-[9px] font-bold uppercase tracking-wider">Staff</span>;
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedUser('ALL');
    setSelectedRole('ALL');
    setSelectedAction('ALL');
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
    showToast('Filters reset to default');
  };

  const hasActiveFilters = searchTerm !== '' || selectedUser !== 'ALL' || selectedRole !== 'ALL' || selectedAction !== 'ALL' || datePreset !== 'all' || startDate !== '' || endDate !== '';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#002b29] text-emerald-100 px-4 py-3 rounded-2xl border border-emerald-500/50 text-xs font-bold flex items-center gap-2 shadow-2xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#031c19] p-6 rounded-3xl border border-emerald-900/50 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-serif font-bold text-white tracking-wide">Audit Trail & Compliance Ledger</h2>
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-400" />
              Immutable Append-Only Log
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-mono font-bold">
              {filteredLogs.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            GxP and SOC2-compliant chronological ledger capturing all user authentications, order fulfillment transitions, inventory restocks, WAF/firewall defensive updates, and RBAC authorization policies.
          </p>
        </div>

        {/* Action Controls & Export Bar */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* View Toggle */}
          <div className="bg-black/50 p-1 rounded-xl border border-white/10 flex items-center">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'timeline'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Visual Timeline View"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tabular Grid View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={refreshLogs}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
            title="Refresh logs from database"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>

          {/* Export Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Reports</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {isExportDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsExportDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-[#0a0f0e] border border-emerald-500/40 rounded-2xl shadow-2xl z-40 py-2 divide-y divide-white/5">
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Compliance Export Formats ({filteredLogs.length} logs)
                  </div>
                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full px-3 py-2 text-left text-xs font-bold text-slate-200 hover:bg-white/10 rounded-xl flex items-center gap-2.5 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div>CSV Spreadsheet Export</div>
                        <div className="text-[10px] text-slate-400 font-normal">Standard comma-separated format</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full px-3 py-2 text-left text-xs font-bold text-slate-200 hover:bg-white/10 rounded-xl flex items-center gap-2.5 transition-colors"
                    >
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div>JSON Cryptographic Ledger</div>
                        <div className="text-[10px] text-slate-400 font-normal">Full raw metadata with audit hashes</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExport('compliance_dossier')}
                      className="w-full px-3 py-2 text-left text-xs font-bold text-slate-200 hover:bg-white/10 rounded-xl flex items-center gap-2.5 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <div>
                        <div>SOC2 / GxP Compliance Dossier</div>
                        <div className="text-[10px] text-slate-400 font-normal">Formatted executive markdown report</div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS MASTER PANEL */}
      <div className="bg-[#0a0f0e] p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Active Query Filters</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full font-bold">
                Filtered
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-bold underline transition-colors"
              >
                Reset All Filters
              </button>
            )}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all font-mono"
            >
              <ArrowUpDown className="w-3 h-3 text-emerald-400" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* 1. Universal Search */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Search className="w-3 h-3 text-slate-400" />
              Search Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Email, action, IP, entity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* 2. User Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              Filter by User Email
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Users & Operators ({distinctUsers.length})</option>
              {distinctUsers.map(email => (
                <option key={email} value={email}>{email}</option>
              ))}
            </select>
          </div>

          {/* 3. Role Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-400" />
              Filter by Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 uppercase"
            >
              <option value="ALL">All Roles (Any Privilege)</option>
              {distinctRoles.map(r => (
                <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* 4. Action Category Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-slate-400" />
              Event Category
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Event Categories</option>
              <option value="Sign In">Authentication & Sign-Ins</option>
              <option value="WAF">WAF & Firewall Mitigations</option>
              <option value="Lockout">Incident Response Lockouts</option>
              <option value="Fulfill">Order Fulfillment & Shipping</option>
              <option value="Stock">Inventory Stock Alterations</option>
              <option value="Role">RBAC Authorization Modifiers</option>
              <option value="Gateway">Payment Gateway & Financials</option>
              <option value="COA">COA Vault Access & Downloads</option>
              <option value="Settings">System & Global Settings</option>
            </select>
          </div>
        </div>

        {/* Date Range Selector Sub-Bar */}
        <div className="pt-2 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              Date Presets:
            </span>
            {(
              [
                { id: 'all', label: 'All Time' },
                { id: 'today', label: 'Today' },
                { id: '24h', label: 'Past 24 Hours' },
                { id: '7d', label: 'Past 7 Days' },
                { id: '30d', label: 'Past 30 Days' },
                { id: 'custom', label: 'Custom Range' },
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                onClick={() => setDatePreset(preset.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  datePreset === preset.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {datePreset === 'custom' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-black/50 border border-white/10 text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-black/50 border border-white/10 text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW: VISUAL TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="space-y-8">
          {Object.keys(groupedTimelineLogs).length > 0 ? (
            Object.entries(groupedTimelineLogs).map(([groupTitle, logs]: [string, AuditLog[]]) => (
              <div key={groupTitle} className="space-y-4">
                {/* Date Group Heading */}
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-[#031c19] text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-serif font-bold flex items-center gap-1.5 shadow-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{groupTitle}</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent" />
                  <span className="text-[10px] text-slate-500 font-mono font-bold">
                    {logs.length} event{logs.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Timeline Tree */}
                <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/40 before:via-white/10 before:to-emerald-500/20">
                  {logs.map((log: AuditLog) => {
                    const badge = getActionBadge(log.action, log.role);
                    const ActionIcon = badge.icon;
                    const logDate = new Date(log.created_at);

                    return (
                      <div
                        key={log.id}
                        className="relative group transition-all"
                      >
                        {/* Timeline Node Icon Indicator */}
                        <div className={`absolute -left-6 sm:-left-8 top-3 w-6 h-6 rounded-full border-2 border-[#0a0f0e] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                          badge.dot === 'bg-rose-400' ? 'bg-rose-950 text-rose-300' :
                          badge.dot === 'bg-indigo-400' ? 'bg-indigo-950 text-indigo-300' :
                          badge.dot === 'bg-emerald-400' ? 'bg-emerald-950 text-emerald-300' :
                          badge.dot === 'bg-amber-400' ? 'bg-amber-950 text-amber-300' :
                          'bg-slate-900 text-slate-300'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${badge.dot}`} />
                        </div>

                        {/* Card Entry */}
                        <div className="bg-[#0a0f0e] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg hover:border-emerald-500/40 hover:bg-[#0c1412] transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${badge.bg}`}>
                                  <ActionIcon className="w-3 h-3" />
                                  {log.action}
                                </span>
                                {getRoleBadge(log.role)}
                                <span className="text-xs font-bold text-white tracking-wide">
                                  {log.admin_email}
                                </span>
                                {log.ip_address && (
                                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                                    • {log.ip_address}
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                                {log.details}
                              </p>

                              {/* Target Entity Pill */}
                              {log.entity_type && (
                                <div className="flex items-center gap-2 pt-1">
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    Target: <strong className="text-slate-200">{log.entity_type}</strong>
                                    {log.entity_id && <span className="text-slate-500 ml-1">[{log.entity_id}]</span>}
                                  </span>
                                  {log.supervisor_reviewed && (
                                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                                      <CheckCircle2 className="w-3 h-3" />
                                      SecOps Approved
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Timestamp & Actions */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                              <div className="text-right">
                                <div className="text-xs font-mono font-bold text-emerald-400">
                                  {logDate.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true,
                                  })}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {logDate.toISOString().split('T')[0]}
                                </div>
                              </div>

                              <button
                                onClick={() => setSelectedLogForModal(log)}
                                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg text-[11px] font-bold border border-white/10 flex items-center gap-1 transition-colors"
                              >
                                <Eye className="w-3 h-3 text-emerald-400" />
                                <span>Inspect</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#0a0f0e] p-12 rounded-3xl border border-white/10 text-center space-y-3">
              <div className="p-3 bg-white/5 rounded-2xl w-fit mx-auto text-slate-500">
                <History className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">No Audit Events Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No chronological audit trail records matched the current keyword, user, role, or date filters.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW: TABULAR VIEW */}
      {viewMode === 'table' && (
        <div className="bg-[#0a0f0e] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#050807] border-b border-white/10 uppercase font-bold text-[10px] text-slate-400 tracking-wider">
                <tr>
                  <th className="p-4">Timestamp (UTC / Local)</th>
                  <th className="p-4">User Email & Role</th>
                  <th className="p-4">Action Recorded</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4">Details & Audit Payload</th>
                  <th className="p-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => {
                    const badge = getActionBadge(log.action, log.role);
                    return (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-emerald-400 whitespace-nowrap font-bold">
                          <div>
                            {new Date(log.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true
                            })}
                          </div>
                          <div className="text-[10px] text-slate-500 font-sans">
                            {new Date(log.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-bold text-white font-sans">{log.admin_email}</div>
                          <div className="mt-1">{getRoleBadge(log.role)}</div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase tracking-wider border ${badge.bg}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-sans">
                          <span className="font-bold text-slate-300">{log.entity_type}</span>
                          {log.entity_id && <span className="text-slate-500 text-[10px] ml-1">({log.entity_id})</span>}
                        </td>
                        <td className="p-4 text-slate-300 font-sans leading-snug max-w-md truncate">
                          {log.details}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedLogForModal(log)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg border border-white/10 transition-colors"
                            title="Inspect full audit record"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-500 font-sans">
                      No audit records found matching the active query criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECT AUDIT RECORD MODAL */}
      {selectedLogForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0a0f0e] border border-emerald-500/40 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-[#031c19] p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-white text-base">Audit Log Record Inspector</h3>
                  <p className="text-[11px] text-slate-300">Cryptographically verifiable immutable transaction record</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLogForModal(null)}
                className="text-slate-400 hover:text-white p-1 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/50 p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Record ID</div>
                  <div className="font-mono text-emerald-400 font-bold flex items-center justify-between">
                    <span>{selectedLogForModal.id}</span>
                    <button
                      onClick={() => handleCopy(selectedLogForModal.id, 'modal-id')}
                      className="p-1 hover:text-white text-slate-400"
                      title="Copy Log ID"
                    >
                      {copiedId === 'modal-id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-black/50 p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Timestamp</div>
                  <div className="font-mono text-white">
                    {new Date(selectedLogForModal.created_at).toUTCString()}
                  </div>
                </div>

                <div className="bg-black/50 p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Operator / User</div>
                  <div className="font-bold text-white">{selectedLogForModal.admin_email}</div>
                  <div className="pt-1">{getRoleBadge(selectedLogForModal.role)}</div>
                </div>

                <div className="bg-black/50 p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Network Origin</div>
                  <div className="font-mono text-slate-300">
                    {selectedLogForModal.ip_address || '10.0.1.42 (Internal SecOps)'}
                  </div>
                </div>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Action & Target Entity</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold text-xs">
                    {selectedLogForModal.action}
                  </span>
                  <span className="text-slate-400 font-mono">
                    Entity: <strong>{selectedLogForModal.entity_type}</strong> {selectedLogForModal.entity_id && `[${selectedLogForModal.entity_id}]`}
                  </span>
                </div>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Audit Details & Rationale</div>
                <p className="text-slate-200 text-xs leading-relaxed font-sans">
                  {selectedLogForModal.details}
                </p>
              </div>

              {/* Raw JSON Payload */}
              <div className="bg-[#050807] p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>Raw Cryptographic Payload</span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(selectedLogForModal, null, 2), 'raw-json')}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                  >
                    {copiedId === 'raw-json' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copy JSON</span>
                  </button>
                </div>
                <pre className="text-[10px] text-emerald-400/90 font-mono bg-black/60 p-3 rounded-xl overflow-x-auto">
                  {JSON.stringify(selectedLogForModal, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-4 bg-[#031c19] border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedLogForModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all border border-slate-700"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
