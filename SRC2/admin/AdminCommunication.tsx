import React, { useState, useEffect } from 'react';
import {
  Mail, Send, CheckCircle2, AlertCircle, RefreshCw, Settings, Shield,
  Server, Key, Lock, FileText, MessageSquare, Inbox, Eye, EyeOff, Save,
  Plus, Clock, ArrowUpRight, Filter, ChevronRight, User, Tag, Sparkles, Check, HelpCircle,
  Trash2, Edit3, Star, Radio, Globe, Building, CheckSquare, Layers, Smartphone,
  Phone, Zap, ShieldCheck, Copy
} from 'lucide-react';
import {
  CommunicationSystemState,
  EmailProfile,
  EmailProviderConfig,
  EmailNotificationRule,
  InboundEmailMessage,
  EmailLog,
  NotificationTemplateType,
  EmailProviderType,
  SmtpSecurity,
  UserRole,
  SmsProfile,
  SmsProviderType,
  SmsNotificationRule,
  SmsNotificationTemplateType,
  SmsLog
} from '../../types';
import { api } from '../../lib/supabase';

interface AdminCommunicationProps {
  userRole?: UserRole;
  currentStaffEmail?: string;
  currentStaffName?: string;
}

export const AdminCommunication: React.FC<AdminCommunicationProps> = ({
  userRole = 'admin',
  currentStaffEmail = 'admin@bkresearchlabs.com',
  currentStaffName = 'BKRL Executive Admin',
}) => {
  const [commState, setCommState] = useState<CommunicationSystemState | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'email_profiles' | 'sms_profiles' | 'email_rules' | 'sms_rules' | 'inbound' | 'logs'>('email_profiles');

  // Multi-Profile States (Email)
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<EmailProfile | null>(null);
  const [profileForm, setProfileForm] = useState<{
    name: string;
    company_email: string;
    sender_name: string;
    reply_to_email: string;
    provider_type: EmailProviderType;
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_pass: string;
    smtp_security: SmtpSecurity;
    api_key: string;
    webhook_url: string;
    is_default: boolean;
  }>({
    name: '',
    company_email: '',
    sender_name: 'BK Research Labs',
    reply_to_email: '',
    provider_type: 'gmail',
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: '',
    smtp_pass: '',
    smtp_security: 'tls',
    api_key: '',
    webhook_url: '',
    is_default: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [testingHandshakeProfileId, setTestingHandshakeProfileId] = useState<string | null>(null);
  const [handshakeResult, setHandshakeResult] = useState<{ success: boolean; message: string; details: string } | null>(null);

  // Form states for Email Notification Rules
  const [selectedRuleType, setSelectedRuleType] = useState<NotificationTemplateType>('order_confirmation');
  const [editingRule, setEditingRule] = useState<EmailNotificationRule | null>(null);
  const [testingRuleModal, setTestingRuleModal] = useState<EmailNotificationRule | null>(null);
  const [testRuleRecipient, setTestRuleRecipient] = useState('customer@example.com');
  const [testRuleVariables, setTestRuleVariables] = useState<Record<string, string>>({
    customer_name: 'Dr. Evelyn Vance',
    order_number: 'BKRL-2026-88291',
    order_total: '$429.50 USD',
    items_list: '2x BPC-157 (10mg), 1x TB-500 (5mg)',
    carrier: 'FedEx Priority Express',
    tracking_number: 'TRK-9821049281',
    ticket_number: 'TICK-8012',
    reply_body: 'Your HPLC analysis certificate has been verified and attached.',
    assigned_staff: 'Alex Rivera (Chief Chemist)'
  });
  const [ruleTestSending, setRuleTestSending] = useState(false);

  // SMS Management States
  const [showSmsProfileModal, setShowSmsProfileModal] = useState(false);
  const [editingSmsProfile, setEditingSmsProfile] = useState<SmsProfile | null>(null);
  const [smsProfileForm, setSmsProfileForm] = useState<{
    name: string;
    provider_type: SmsProviderType;
    account_sid: string;
    auth_token: string;
    from_phone_number: string;
    messaging_service_sid: string;
    api_key: string;
    webhook_url: string;
    is_default: boolean;
  }>({
    name: '',
    provider_type: 'twilio',
    account_sid: '',
    auth_token: '',
    from_phone_number: '+1 (800) 555-0199',
    messaging_service_sid: '',
    api_key: '',
    webhook_url: '',
    is_default: false
  });

  const [testingHandshakeSmsProfileId, setTestingHandshakeSmsProfileId] = useState<string | null>(null);
  const [testSmsPhone, setTestSmsPhone] = useState<string>('+1 (617) 555-0192');
  const [smsHandshakeResult, setSmsHandshakeResult] = useState<{ success: boolean; message: string; details: string } | null>(null);

  // SMS Notification Rules State
  const [selectedSmsRuleType, setSelectedSmsRuleType] = useState<SmsNotificationTemplateType>('order_confirmation_sms');
  const [editingSmsRule, setEditingSmsRule] = useState<SmsNotificationRule | null>(null);
  const [testingSmsRuleModal, setTestingSmsRuleModal] = useState<SmsNotificationRule | null>(null);
  const [testSmsRulePhone, setTestSmsRulePhone] = useState<string>('+1 (617) 555-0192');
  const [testSmsRuleVariables, setTestSmsRuleVariables] = useState<Record<string, string>>({
    customer_name: 'Dr. Jane Vance',
    order_number: 'BKRL-98412',
    order_total: '$499.00 USD',
    carrier: 'FedEx Priority Express',
    tracking_number: 'TRK-9821049281',
    tracking_link: 'https://fedex.com/track',
    order_link: 'https://bkresearchlabs.com/orders/98412',
    code: '894201',
    download_url: 'https://bkresearchlabs.com/downloads/asset-101'
  });
  const [smsRuleSending, setSmsRuleSending] = useState(false);

  // Form states for Inbound Messages / Tickets
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReplyBody, setTicketReplyBody] = useState('');
  const [replyProfileId, setReplyProfileId] = useState<string>('default');
  const [sendingReply, setSendingReply] = useState(false);
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('all');
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState<string>('all');
  const [showSimulateInboundModal, setShowSimulateInboundModal] = useState(false);
  const [simInboundForm, setSimInboundForm] = useState({
    sender_name: 'Dr. Marcus Vance',
    sender_email: 'm.vance@mit-biochem.edu',
    subject: 'Urgent: Technical Inquiry & Batch #992 Compound Stability',
    category: 'tech_support' as InboundEmailMessage['category'],
    body: 'Hello BK Research Labs team,\n\nWe recently ordered BPC-157 batch #992 for our research protocol. Could you please send the high-resolution COA and mass spectrometry validation files?\n\nThank you,\nDr. Marcus Vance',
    priority: 'high' as InboundEmailMessage['priority']
  });

  // Log filter
  const [logFilterChannel, setLogFilterChannel] = useState<'all' | 'email' | 'sms'>('all');
  const [logFilterDirection, setLogFilterDirection] = useState<'all' | 'outgoing' | 'incoming'>('all');
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // Save feedback
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  // Load initial data and set up real-time listener
  const loadData = async () => {
    try {
      const data = await api.getCommunicationState();
      setCommState(data);

      // Email Rule Initial
      const initialRule = data.notification_rules?.find(r => r.template_type === 'order_confirmation') || data.notification_rules?.[0];
      if (initialRule) setEditingRule({ ...initialRule });

      // SMS Rule Initial
      const initialSmsRule = data.sms_notification_rules?.find(r => r.template_type === 'order_confirmation_sms') || data.sms_notification_rules?.[0];
      if (initialSmsRule) setEditingSmsRule({ ...initialSmsRule });

      const activeProf = data.profiles?.find(p => p.id === data.active_profile_id) || data.profiles?.[0];
      if (!testEmailRecipient && activeProf) {
        setTestEmailRecipient(activeProf.company_email);
      }
    } catch (err) {
      console.error('Failed to load communication state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to cross-tab / real-time updates
    const unsubscribe = api.subscribeToChanges(() => {
      loadData();
    });

    return () => unsubscribe();
  }, []);

  if (loading || !commState) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading Communication & SMS Notification Gateway Center...</span>
      </div>
    );
  }

  const activeProfile = commState.profiles.find(p => p.id === commState.active_profile_id) || commState.profiles[0];
  const activeSmsProfile = commState.sms_profiles?.find(p => p.id === commState.active_sms_profile_id) || commState.sms_profiles?.[0];

  // --- HANDLERS FOR EMAIL PROFILES ---
  const handleOpenCreateModal = () => {
    setEditingProfile(null);
    setProfileForm({
      name: '',
      company_email: '',
      sender_name: 'BK Research Labs',
      reply_to_email: '',
      provider_type: 'gmail',
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_user: '',
      smtp_pass: '',
      smtp_security: 'tls',
      api_key: '',
      webhook_url: '',
      is_default: commState.profiles.length === 0
    });
    setShowProfileModal(true);
  };

  const handleOpenEditModal = (prof: EmailProfile) => {
    setEditingProfile(prof);
    setProfileForm({
      name: prof.name,
      company_email: prof.company_email,
      sender_name: prof.sender_name,
      reply_to_email: prof.reply_to_email || prof.company_email,
      provider_type: prof.provider_type,
      smtp_host: prof.smtp_host || 'smtp.gmail.com',
      smtp_port: prof.smtp_port || 587,
      smtp_user: prof.smtp_user || prof.company_email,
      smtp_pass: prof.smtp_pass || '',
      smtp_security: prof.smtp_security || 'tls',
      api_key: prof.api_key || '',
      webhook_url: prof.webhook_url || '',
      is_default: prof.is_default || prof.id === commState.active_profile_id
    });
    setShowProfileModal(true);
  };

  const handleSaveProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.company_email.trim()) {
      alert('Profile name and company email address are required.');
      return;
    }

    try {
      if (editingProfile) {
        await api.updateEmailProfile(editingProfile.id, profileForm);
        showNotification(`✓ Email profile "${profileForm.name}" updated successfully!`);
      } else {
        await api.createEmailProfile({
          ...profileForm,
          status: 'connected'
        });
        showNotification(`✓ New email profile "${profileForm.name}" created!`);
      }
      setShowProfileModal(false);
      await loadData();
    } catch (err: any) {
      alert('Error saving profile: ' + err.message);
    }
  };

  const handleSetActiveProfile = async (profId: string) => {
    try {
      await api.setActiveEmailProfile(profId);
      await loadData();
      showNotification('✓ Default active company email profile switched!');
    } catch (err: any) {
      alert('Error switching default profile: ' + err.message);
    }
  };

  const handleDeleteProfile = async (profId: string) => {
    const prof = commState.profiles.find(p => p.id === profId);
    if (!confirm(`Are you sure you want to delete the email profile "${prof?.name || profId}"?`)) return;

    try {
      await api.deleteEmailProfile(profId);
      await loadData();
      showNotification('✓ Email profile removed.');
    } catch (err: any) {
      alert('Error deleting profile: ' + err.message);
    }
  };

  const handleRunProfileHandshake = async (profId: string) => {
    setTestingHandshakeProfileId(profId);
    setHandshakeResult(null);
    const targetProf = commState.profiles.find(p => p.id === profId) || activeProfile;
    const recipient = testEmailRecipient || targetProf.company_email;

    try {
      const result = await api.testEmailHandshake(recipient, profId);
      setHandshakeResult(result);
      await loadData();
    } catch (err: any) {
      setHandshakeResult({
        success: false,
        message: 'Handshake Failed',
        details: err.message || 'Unable to establish connection with specified mailserver.'
      });
    } finally {
      setTestingHandshakeProfileId(null);
    }
  };

  const handleSelectRuleToEdit = (templateType: NotificationTemplateType) => {
    setSelectedRuleType(templateType);
    const rule = commState.notification_rules.find(r => r.template_type === templateType);
    if (rule) setEditingRule({ ...rule });
  };

  const handleSaveCurrentRule = async () => {
    if (!editingRule) return;
    try {
      const updatedRules = commState.notification_rules.map(r =>
        r.id === editingRule.id ? { ...editingRule, updated_at: new Date().toISOString() } : r
      );
      await api.updateNotificationRules(updatedRules);
      await loadData();
      showNotification(`✓ Notification template "${editingRule.title}" saved!`);
    } catch (err: any) {
      alert('Error saving notification rule: ' + err.message);
    }
  };

  const handleToggleRuleEnabled = async (ruleId: string, enabled: boolean) => {
    try {
      const updatedRules = commState.notification_rules.map(r =>
        r.id === ruleId ? { ...r, enabled, updated_at: new Date().toISOString() } : r
      );
      await api.updateNotificationRules(updatedRules);
      if (editingRule && editingRule.id === ruleId) {
        setEditingRule({ ...editingRule, enabled });
      }
      await loadData();
    } catch (err: any) {
      alert('Error toggling rule: ' + err.message);
    }
  };

  const handleSendTestRuleDispatch = async () => {
    if (!testingRuleModal) return;
    setRuleTestSending(true);
    try {
      const res = await api.sendNotificationEmail(
        testingRuleModal.template_type,
        testRuleRecipient,
        testRuleVariables,
        testingRuleModal.assigned_profile_id
      );
      if (res.success) {
        showNotification(`✓ Test dispatch for "${testingRuleModal.title}" delivered to ${testRuleRecipient}!`);
        setTestingRuleModal(null);
        await loadData();
      } else {
        alert('Test Dispatch Notice: ' + res.log.details);
      }
    } catch (err: any) {
      alert('Error sending test dispatch: ' + err.message);
    } finally {
      setRuleTestSending(false);
    }
  };

  // --- HANDLERS FOR SMS PROFILES & GATEWAY ---
  const handleOpenCreateSmsModal = () => {
    setEditingSmsProfile(null);
    setSmsProfileForm({
      name: '',
      provider_type: 'twilio',
      account_sid: '',
      auth_token: '',
      from_phone_number: '+1 (800) 555-0199',
      messaging_service_sid: '',
      api_key: '',
      webhook_url: '',
      is_default: (commState?.sms_profiles?.length === 0)
    });
    setShowSmsProfileModal(true);
  };

  const handleOpenEditSmsModal = (prof: SmsProfile) => {
    setEditingSmsProfile(prof);
    setSmsProfileForm({
      name: prof.name,
      provider_type: prof.provider_type,
      account_sid: prof.account_sid || '',
      auth_token: prof.auth_token || '',
      from_phone_number: prof.from_phone_number,
      messaging_service_sid: prof.messaging_service_sid || '',
      api_key: prof.api_key || '',
      webhook_url: prof.webhook_url || '',
      is_default: prof.is_default || prof.id === commState?.active_sms_profile_id
    });
    setShowSmsProfileModal(true);
  };

  const handleSaveSmsProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsProfileForm.name.trim() || !smsProfileForm.from_phone_number.trim()) {
      alert('Gateway profile name and From Phone Number / Sender ID are required.');
      return;
    }

    try {
      if (editingSmsProfile) {
        await api.updateSmsProfile(editingSmsProfile.id, smsProfileForm);
        showNotification(`✓ SMS Profile "${smsProfileForm.name}" updated!`);
      } else {
        await api.createSmsProfile({
          ...smsProfileForm,
          status: 'connected'
        });
        showNotification(`✓ New SMS Gateway Profile "${smsProfileForm.name}" created!`);
      }
      setShowSmsProfileModal(false);
      await loadData();
    } catch (err: any) {
      alert('Error saving SMS profile: ' + err.message);
    }
  };

  const handleSetActiveSmsProfile = async (id: string) => {
    try {
      await api.setActiveSmsProfile(id);
      await loadData();
      showNotification('✓ Default active SMS gateway profile switched!');
    } catch (err: any) {
      alert('Error switching default SMS profile: ' + err.message);
    }
  };

  const handleDeleteSmsProfile = async (id: string) => {
    const prof = commState?.sms_profiles?.find(p => p.id === id);
    if (!confirm(`Are you sure you want to delete the SMS profile "${prof?.name || id}"?`)) return;

    try {
      await api.deleteSmsProfile(id);
      await loadData();
      showNotification('✓ SMS Gateway Profile deleted.');
    } catch (err: any) {
      alert('Error deleting SMS profile: ' + err.message);
    }
  };

  const handleRunSmsHandshake = async (profId: string) => {
    setTestingHandshakeSmsProfileId(profId);
    setSmsHandshakeResult(null);
    try {
      const res = await api.testSmsHandshake(testSmsPhone, profId);
      setSmsHandshakeResult(res);
      await loadData();
    } catch (err: any) {
      setSmsHandshakeResult({
        success: false,
        message: 'SMS Handshake Failed',
        details: err.message || 'Carrier gateway unresponsive.'
      });
    } finally {
      setTestingHandshakeSmsProfileId(null);
    }
  };

  const handleSelectSmsRuleToEdit = (templateType: SmsNotificationTemplateType) => {
    setSelectedSmsRuleType(templateType);
    const rules = commState?.sms_notification_rules || [];
    const rule = rules.find(r => r.template_type === templateType);
    if (rule) setEditingSmsRule({ ...rule });
  };

  const handleSaveCurrentSmsRule = async () => {
    if (!editingSmsRule) return;
    try {
      await api.saveSmsNotificationRule(editingSmsRule);
      await loadData();
      showNotification(`✓ SMS template "${editingSmsRule.title}" saved!`);
    } catch (err: any) {
      alert('Error saving SMS rule: ' + err.message);
    }
  };

  const handleToggleSmsRuleEnabled = async (ruleId: string, enabled: boolean) => {
    try {
      const rules = commState?.sms_notification_rules || [];
      const rule = rules.find(r => r.id === ruleId);
      if (rule) {
        await api.saveSmsNotificationRule({ ...rule, enabled });
        if (editingSmsRule && editingSmsRule.id === ruleId) {
          setEditingSmsRule({ ...editingSmsRule, enabled });
        }
        await loadData();
      }
    } catch (err: any) {
      alert('Error toggling SMS rule: ' + err.message);
    }
  };

  const handleSendTestSmsRuleDispatch = async () => {
    if (!testingSmsRuleModal) return;
    setSmsRuleSending(true);
    try {
      const res = await api.sendSmsNotification(
        testingSmsRuleModal.template_type,
        testSmsRulePhone,
        testSmsRuleVariables,
        testingSmsRuleModal.assigned_sms_profile_id
      );
      if (res.success) {
        showNotification(`✓ Test SMS for "${testingSmsRuleModal.title}" delivered to ${testSmsRulePhone}!`);
        setTestingSmsRuleModal(null);
        await loadData();
      } else {
        alert('Test SMS Notice: ' + res.log.details);
      }
    } catch (err: any) {
      alert('Error sending test SMS dispatch: ' + err.message);
    } finally {
      setSmsRuleSending(false);
    }
  };

  const handleToggleGlobalSmsNotifications = async () => {
    if (!commState) return;
    const current = commState.sms_notifications_enabled !== false;
    const updatedState = { ...commState, sms_notifications_enabled: !current };
    await api.updateCommunicationState(updatedState);
    await loadData();
    showNotification(`✓ SMS Gateway is now ${!current ? 'ENABLED' : 'DISABLED'} globally across the store.`);
  };

  const handleDispatchTicketReply = async () => {
    if (!selectedTicketId || !ticketReplyBody.trim()) return;
    setSendingReply(true);
    try {
      await api.replyToInboundMessage(
        selectedTicketId,
        ticketReplyBody,
        currentStaffEmail,
        currentStaffName
      );
      setTicketReplyBody('');
      await loadData();
      showNotification('✓ External reply dispatched to customer! Ticket status updated to REPLIED.');
    } catch (err: any) {
      alert('Error sending ticket reply: ' + err.message);
    } finally {
      setSendingReply(false);
    }
  };

  const handleCreateSimulatedInbound = async () => {
    try {
      const newMsg = await api.addInboundEmailMessage(simInboundForm);
      setShowSimulateInboundModal(false);
      setSelectedTicketId(newMsg.id);
      await loadData();
      showNotification(`✓ New inbound customer email received! Ticket #${newMsg.ticket_number} created.`);
    } catch (err: any) {
      alert('Error simulating inbound email: ' + err.message);
    }
  };

  // Render SMS Message Body with substituted variables for live phone preview
  const renderSmsBodyPreview = (templateBody: string, vars: Record<string, string>) => {
    let rendered = templateBody;
    Object.entries(vars).forEach(([k, v]) => {
      const pattern = new RegExp(`\\{${k}\\}`, 'g');
      rendered = rendered.replace(pattern, v || '');
    });
    return rendered;
  };

  // Filtered tickets
  const filteredTickets = commState.inbound_messages.filter(msg => {
    if (ticketStatusFilter !== 'all' && msg.status !== ticketStatusFilter) return false;
    if (ticketCategoryFilter !== 'all' && msg.category !== ticketCategoryFilter) return false;
    return true;
  });

  const activeTicket = commState.inbound_messages.find(m => m.id === selectedTicketId) || filteredTickets[0];

  // Combined / Filtered logs (Email & SMS)
  const emailLogsMapped = (commState.email_logs || []).map(l => ({ ...l, channel: 'email' as const }));
  const smsLogsMapped = (commState.sms_logs || []).map(l => ({ ...l, channel: 'sms' as const }));

  const allLogs = [...emailLogsMapped, ...smsLogsMapped].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredLogs = allLogs.filter(log => {
    if (logFilterChannel !== 'all' && log.channel !== logFilterChannel) return false;
    if (logFilterDirection !== 'all' && log.direction !== logFilterDirection) return false;
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      if (log.channel === 'email') {
        const el = log as EmailLog & { channel: 'email' };
        return (
          el.to_email.toLowerCase().includes(q) ||
          el.from_email.toLowerCase().includes(q) ||
          el.subject.toLowerCase().includes(q) ||
          (el.details && el.details.toLowerCase().includes(q))
        );
      } else {
        const sl = log as SmsLog & { channel: 'sms' };
        return (
          sl.to_phone.toLowerCase().includes(q) ||
          sl.from_phone.toLowerCase().includes(q) ||
          sl.message_body.toLowerCase().includes(q) ||
          (sl.details && sl.details.toLowerCase().includes(q))
        );
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveSuccessMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-extrabold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Header Title Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Full Access Communication, Email & SMS Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Email & SMS Notification Studio
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Configure multi-profile company email addresses (SMTP/Resend/Gmail) and SMS notification gateways (Twilio, Telnyx, Plivo), assign profiles to automated triggers, and monitor live dispatch logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 bg-emerald-950/90 text-emerald-300 border border-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Email: <strong>{activeProfile?.company_email}</strong></span>
            </div>

            <div className="px-3.5 py-2 bg-indigo-950/90 text-indigo-300 border border-indigo-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Active SMS: <strong>{activeSmsProfile?.from_phone_number || '+1 (800) 555-0199'}</strong></span>
            </div>

            <button
              onClick={handleToggleGlobalSmsNotifications}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                commState.sms_notifications_enabled !== false
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>SMS: {commState.sms_notifications_enabled !== false ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('email_profiles')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'email_profiles'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>1. Email Profiles ({commState.profiles?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('sms_profiles')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'sms_profiles'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>2. SMS Gateways & Twilio ({commState.sms_profiles?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('email_rules')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'email_rules'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. Email Rules & Templates ({commState.notification_rules?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('sms_rules')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'sms_rules'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>4. SMS Rules & Mobile Templates ({commState.sms_notification_rules?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('inbound')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'inbound'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>5. Support Desk ({commState.inbound_messages?.filter(m => m.status === 'unread' || m.status === 'open').length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>6. Dispatch Vault Logs ({allLogs.length})</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: EMAIL PROFILES CONTROL --- */}
      {activeTab === 'email_profiles' && (
        <div className="space-y-6">
          {/* Active Profile Quick Summary Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                <Star className="w-6 h-6 fill-emerald-600 text-emerald-600" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-600">Active Default Company Profile</span>
                <h2 className="text-lg font-black text-slate-900">{activeProfile.name}</h2>
                <p className="text-xs text-slate-500">
                  Default Email: <strong className="text-slate-800">{activeProfile.company_email}</strong> • Provider: <span className="uppercase font-bold text-slate-700">{activeProfile.provider_type}</span> • Sender Name: "{activeProfile.sender_name}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-600">Switch Default Profile:</span>
                <select
                  value={commState.active_profile_id}
                  onChange={(e) => handleSetActiveProfile(e.target.value)}
                  className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {commState.profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.company_email})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Email Profile</span>
              </button>
            </div>
          </div>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commState.profiles.map((prof) => {
              const isActive = prof.id === commState.active_profile_id || prof.is_default;
              const isTesting = testingHandshakeProfileId === prof.id;

              return (
                <div
                  key={prof.id}
                  className={`bg-white rounded-3xl border p-6 shadow-sm transition-all relative flex flex-col justify-between space-y-4 ${
                    isActive
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-gradient-to-b from-emerald-50/30 to-white'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider mb-1">
                            <Star className="w-3 h-3 fill-white" />
                            <span>Active Default Profile</span>
                          </span>
                        )}
                        <h3 className="text-base font-black text-slate-900">{prof.name}</h3>
                        <p className="text-xs font-bold text-emerald-700 font-mono mt-0.5">{prof.company_email}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        prof.provider_type === 'gmail' ? 'bg-red-100 text-red-800' :
                        prof.provider_type === 'resend' ? 'bg-slate-900 text-white' :
                        prof.provider_type === 'smtp' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {prof.provider_type}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>Sender Display:</span>
                        <strong className="text-slate-900">{prof.sender_name}</strong>
                      </div>
                      {prof.reply_to_email && (
                        <div className="flex justify-between text-[11px]">
                          <span>Reply-To:</span>
                          <span className="font-mono text-slate-700">{prof.reply_to_email}</span>
                        </div>
                      )}
                      {prof.smtp_host && (
                        <div className="flex justify-between text-[11px]">
                          <span>SMTP Server:</span>
                          <span className="font-mono text-slate-700">{prof.smtp_host}:{prof.smtp_port || 587}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => handleSetActiveProfile(prof.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 rounded-xl text-[11px] font-extrabold transition-all"
                        >
                          Make Default
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(prof)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                        title="Edit Profile Settings"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {commState.profiles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteProfile(prof.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRunProfileHandshake(prof.id)}
                      disabled={isTesting}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                    >
                      {isTesting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Test Handshake</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add Profile CTA Card */}
            <button
              onClick={handleOpenCreateModal}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 text-center transition-all flex flex-col items-center justify-center space-y-3 bg-slate-50/50 hover:bg-emerald-50/20 group cursor-pointer min-h-[220px]"
            >
              <div className="p-4 bg-white rounded-full shadow-md text-emerald-600 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900">Add New Email Profile</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Create a dedicated company email profile (e.g., support@, tech@, orders@, billing@).
                </p>
              </div>
            </button>
          </div>

          {/* Handshake Result Box */}
          {handshakeResult && (
            <div className={`p-5 rounded-3xl border text-xs space-y-2 ${
              handshakeResult.success
                ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
                : 'bg-rose-950/90 border-rose-800 text-rose-200'
            }`}>
              <div className="font-black flex items-center gap-2 text-sm">
                {handshakeResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
                <span>{handshakeResult.message}</span>
              </div>
              <p className="text-xs opacity-90 font-mono leading-relaxed">{handshakeResult.details}</p>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: SMS GATEWAYS & TWILIO CONFIGURATION --- */}
      {activeTab === 'sms_profiles' && (
        <div className="space-y-6">
          {/* Active SMS Gateway Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 text-indigo-800 rounded-2xl">
                <Smartphone className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600">Active Default SMS Gateway</span>
                <h2 className="text-lg font-black text-slate-900">{activeSmsProfile?.name || 'Twilio Primary Toll-Free'}</h2>
                <p className="text-xs text-slate-500">
                  From Phone / Sender ID: <strong className="text-slate-900 font-mono">{activeSmsProfile?.from_phone_number || '+1 (800) 555-0199'}</strong> • Provider: <span className="uppercase font-bold text-slate-700">{activeSmsProfile?.provider_type || 'TWILIO'}</span> • Carrier Handshake Status: <span className="text-emerald-700 font-bold uppercase">{activeSmsProfile?.status || 'connected'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-600">Switch Gateway:</span>
                <select
                  value={commState.active_sms_profile_id}
                  onChange={(e) => handleSetActiveSmsProfile(e.target.value)}
                  className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {(commState.sms_profiles || []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.from_phone_number})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOpenCreateSmsModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add SMS Profile</span>
              </button>
            </div>
          </div>

          {/* SMS Profiles Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(commState.sms_profiles || []).map((prof) => {
              const isActive = prof.id === commState.active_sms_profile_id || prof.is_default;
              const isTesting = testingHandshakeSmsProfileId === prof.id;

              return (
                <div
                  key={prof.id}
                  className={`bg-white rounded-3xl border p-6 shadow-sm transition-all relative flex flex-col justify-between space-y-4 ${
                    isActive
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-gradient-to-b from-indigo-50/30 to-white'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider mb-1">
                            <Star className="w-3 h-3 fill-white" />
                            <span>Active Gateway</span>
                          </span>
                        )}
                        <h3 className="text-base font-black text-slate-900">{prof.name}</h3>
                        <p className="text-xs font-bold text-indigo-700 font-mono mt-0.5">{prof.from_phone_number}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        prof.provider_type === 'twilio' ? 'bg-rose-100 text-rose-800' :
                        prof.provider_type === 'telnyx' ? 'bg-blue-100 text-blue-800' :
                        prof.provider_type === 'plivo' ? 'bg-amber-100 text-amber-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {prof.provider_type}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5 text-slate-600 font-mono">
                      {prof.account_sid && (
                        <div className="flex justify-between text-[11px]">
                          <span>Account SID / Key:</span>
                          <span className="text-slate-900 font-bold">{prof.account_sid.substring(0, 10)}...</span>
                        </div>
                      )}
                      {prof.messaging_service_sid && (
                        <div className="flex justify-between text-[11px]">
                          <span>Messaging Service:</span>
                          <span className="text-slate-700">{prof.messaging_service_sid}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[11px]">
                        <span>Carrier Connection:</span>
                        <span className="text-emerald-700 font-bold uppercase">{prof.status || 'Connected'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => handleSetActiveSmsProfile(prof.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-800 text-slate-700 rounded-xl text-[11px] font-extrabold transition-all"
                        >
                          Make Default
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenEditSmsModal(prof)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                        title="Edit Gateway Settings"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {(commState.sms_profiles || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSmsProfile(prof.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all"
                          title="Delete SMS Gateway"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRunSmsHandshake(prof.id)}
                      disabled={isTesting}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                    >
                      {isTesting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>SMS Test Ping</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add SMS Profile Card CTA */}
            <button
              onClick={handleOpenCreateSmsModal}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl p-8 text-center transition-all flex flex-col items-center justify-center space-y-3 bg-slate-50/50 hover:bg-indigo-50/20 group cursor-pointer min-h-[220px]"
            >
              <div className="p-4 bg-white rounded-full shadow-md text-indigo-600 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900">Add SMS Gateway Profile</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Connect Twilio, Telnyx, Plivo, AWS SNS, or Custom SMS Webhooks.
                </p>
              </div>
            </button>
          </div>

          {/* SMS Handshake Result Box */}
          {smsHandshakeResult && (
            <div className={`p-5 rounded-3xl border text-xs space-y-2 ${
              smsHandshakeResult.success
                ? 'bg-indigo-950/90 border-indigo-800 text-indigo-200'
                : 'bg-rose-950/90 border-rose-800 text-rose-200'
            }`}>
              <div className="font-black flex items-center gap-2 text-sm">
                {smsHandshakeResult.success ? <CheckCircle2 className="w-5 h-5 text-indigo-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
                <span>{smsHandshakeResult.message}</span>
              </div>
              <p className="text-xs opacity-90 font-mono leading-relaxed">{smsHandshakeResult.details}</p>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: EMAIL NOTIFICATION RULES --- */}
      {activeTab === 'email_rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rules List Sidebar */}
          <div className="space-y-3">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center justify-between">
                <span>Notification Triggers</span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full font-bold">{commState.notification_rules.length} Rules</span>
              </h3>

              <div className="space-y-2">
                {commState.notification_rules.map((rule) => {
                  const isSelected = selectedRuleType === rule.template_type;
                  const assignedProf = commState.profiles.find(p => p.id === rule.assigned_profile_id);

                  return (
                    <div
                      key={rule.id}
                      onClick={() => handleSelectRuleToEdit(rule.template_type)}
                      className={`p-3.5 rounded-2xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-sm font-bold text-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className="font-black">{rule.title}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{rule.description}</p>
                        {assignedProf && (
                          <div className="text-[10px] text-emerald-800 font-mono">
                            Route: {assignedProf.name}
                          </div>
                        )}
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-slate-300'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rule Editor Main Area */}
          <div className="lg:col-span-2 space-y-6">
            {editingRule ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-600">Custom Template & Dispatch Control</span>
                    <h2 className="text-xl font-black text-slate-900">{editingRule.title}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{editingRule.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-2xl text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={editingRule.enabled}
                        onChange={(e) => handleToggleRuleEnabled(editingRule.id, e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span>Active</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setTestingRuleModal(editingRule)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Test Dispatch</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Route Profile Assignment */}
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2">
                    <label className="block text-[11px] font-black uppercase text-emerald-900">
                      Assign Dedicated Company Email Profile
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <select
                        value={editingRule.assigned_profile_id || 'default'}
                        onChange={(e) => setEditingRule({
                          ...editingRule,
                          assigned_profile_id: e.target.value === 'default' ? undefined : e.target.value
                        })}
                        className="w-full sm:w-auto px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option value="default">Active Default Profile ({activeProfile.company_email})</option>
                        {commState.profiles.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.company_email})
                          </option>
                        ))}
                      </select>
                      <span className="text-[11px] text-slate-500 font-medium">
                        All notifications for this event will be dispatched from this selected profile address.
                      </span>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Subject Line</label>
                    <input
                      type="text"
                      value={editingRule.subject_template}
                      onChange={(e) => setEditingRule({ ...editingRule, subject_template: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  {/* Available Dynamic Variables */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Available Template Variables</label>
                    <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      {editingRule.available_variables.map((varName) => (
                        <button
                          key={varName}
                          type="button"
                          onClick={() => {
                            setEditingRule({
                              ...editingRule,
                              body_text: editingRule.body_text + ` {{${varName}}}`
                            });
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-mono text-[10px] font-bold rounded-lg border border-slate-200 transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3 text-emerald-600" />
                          <span>{`{{${varName}}}`}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body Text */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Plain Text Body Template</label>
                    <textarea
                      rows={6}
                      value={editingRule.body_text}
                      onChange={(e) => setEditingRule({ ...editingRule, body_text: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-mono text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                    />
                  </div>

                  {/* HTML Body */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">HTML Body Code</label>
                    <textarea
                      rows={6}
                      value={editingRule.body_html}
                      onChange={(e) => setEditingRule({ ...editingRule, body_html: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 text-emerald-400 border border-slate-800 rounded-2xl font-mono text-[11px] focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveCurrentRule}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Notification Template</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
                Select a rule from the left sidebar to edit its email subject and body template.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 4: SMS NOTIFICATION RULES & SMARTPHONE LIVE PREVIEW --- */}
      {activeTab === 'sms_rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SMS Rules List Sidebar */}
          <div className="space-y-3">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center justify-between">
                <span>SMS Triggers & Alerts</span>
                <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded-full font-bold">{(commState.sms_notification_rules || []).length} Templates</span>
              </h3>

              <div className="space-y-2">
                {(commState.sms_notification_rules || []).map((rule) => {
                  const isSelected = selectedSmsRuleType === rule.template_type;
                  const assignedSmsProf = (commState.sms_profiles || []).find(p => p.id === rule.assigned_sms_profile_id);

                  return (
                    <div
                      key={rule.id}
                      onClick={() => handleSelectSmsRuleToEdit(rule.template_type)}
                      className={`p-3.5 rounded-2xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-sm font-bold text-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                          <span className="font-black">{rule.title}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{rule.description}</p>
                        {assignedSmsProf && (
                          <div className="text-[10px] text-indigo-800 font-mono">
                            Gateway: {assignedSmsProf.name}
                          </div>
                        )}
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SMS Rule Editor & Live Phone Mockup */}
          <div className="lg:col-span-2 space-y-6">
            {editingSmsRule ? (
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* Form Controls (3 cols) */}
                <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600">SMS Notification Rule</span>
                      <h2 className="text-lg font-black text-slate-900">{editingSmsRule.title}</h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-2xl text-xs font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={editingSmsRule.enabled}
                          onChange={(e) => handleToggleSmsRuleEnabled(editingSmsRule.id, e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span>Active</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setTestingSmsRuleModal(editingSmsRule)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Test Send</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Gateway Profile Override */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Assign SMS Gateway Profile</label>
                      <select
                        value={editingSmsRule.assigned_sms_profile_id || 'default'}
                        onChange={(e) => setEditingSmsRule({
                          ...editingSmsRule,
                          assigned_sms_profile_id: e.target.value === 'default' ? undefined : e.target.value
                        })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="default">Active Default ({activeSmsProfile?.name || 'Twilio Primary'})</option>
                        {(commState.sms_profiles || []).map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.from_phone_number})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Variable Chips */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Insert Dynamic Field Chips</label>
                      <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        {editingSmsRule.available_variables.map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => {
                              setEditingSmsRule({
                                ...editingSmsRule,
                                message_body: editingSmsRule.message_body + ` {${v}}`
                              });
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-indigo-100 hover:text-indigo-900 text-slate-700 font-mono text-[10px] font-bold rounded-lg border border-slate-200 transition-all flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3 text-indigo-600" />
                            <span>{`{${v}}`}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message Body Textarea with Chars Counter & Segment Calculator */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700">SMS Message Body</label>
                        <span className="text-[11px] font-mono font-bold text-slate-500">
                          {editingSmsRule.message_body.length} / 160 chars ({Math.max(1, Math.ceil(editingSmsRule.message_body.length / 160))} SMS segment/s)
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        value={editingSmsRule.message_body}
                        onChange={(e) => setEditingSmsRule({ ...editingSmsRule, message_body: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-mono text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
                      />
                      {editingSmsRule.message_body.length > 160 && (
                        <p className="text-[10px] text-amber-700 font-bold mt-1">
                          ⚠️ Messages over 160 characters are automatically split into multiple SMS segments by mobile carriers.
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveCurrentSmsRule}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save SMS Template</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Smartphone Live Bubble Preview (2 cols) */}
                <div className="xl:col-span-2 bg-slate-950 rounded-3xl p-6 border border-slate-800 text-white flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                        <Smartphone className="w-4 h-4" />
                        <span>Live Smartphone Preview</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-[9px] font-bold uppercase">
                        Real-time Render
                      </span>
                    </div>

                    {/* Smartphone Screen Frame */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 relative">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800/60 pb-2">
                        <span className="font-mono">{activeSmsProfile?.from_phone_number || '+1 (800) 555-0199'}</span>
                        <span>Now</span>
                      </div>

                      <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tl-xs text-xs font-mono leading-relaxed shadow-lg">
                        {renderSmsBodyPreview(editingSmsRule.message_body, testSmsRuleVariables)}
                      </div>

                      <div className="text-[10px] text-slate-500 text-right font-mono">
                        Delivered via {activeSmsProfile?.provider_type.toUpperCase() || 'TWILIO'}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div className="font-bold text-slate-300">Target Audience:</div>
                    <div className="capitalize text-slate-200">{editingSmsRule.recipient_target}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
                Select an SMS rule from the left sidebar to edit its mobile message body and test live dispatch.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 5: INBOUND SUPPORT DESK --- */}
      {activeTab === 'inbound' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inbox Tickets List Sidebar */}
          <div className="space-y-3">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Inbound Support Desk</h3>
                <button
                  onClick={() => setShowSimulateInboundModal(true)}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[10px] font-black transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Simulate Ticket</span>
                </button>
              </div>

              {/* Status & Category Filters */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <select
                  value={ticketStatusFilter}
                  onChange={(e) => setTicketStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="unread">Unread</option>
                  <option value="open">Open</option>
                  <option value="replied">Replied</option>
                  <option value="resolved">Resolved</option>
                </select>

                <select
                  value={ticketCategoryFilter}
                  onChange={(e) => setTicketCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                >
                  <option value="all">All Categories</option>
                  <option value="tech_support">Tech Support</option>
                  <option value="order_issue">Order Inquiry</option>
                  <option value="coa_request">COA Request</option>
                  <option value="billing">Billing</option>
                  <option value="general">General</option>
                </select>
              </div>

              {/* Tickets List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredTickets.map((msg) => {
                  const isSelected = activeTicket?.id === msg.id;

                  return (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedTicketId(msg.id)}
                      className={`p-3.5 rounded-2xl border text-xs transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-sm font-bold text-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[10px] text-emerald-800 font-bold">{msg.ticket_number}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          msg.status === 'unread' ? 'bg-rose-100 text-rose-800' :
                          msg.status === 'replied' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {msg.status}
                        </span>
                      </div>

                      <div className="font-black text-slate-900 line-clamp-1">{msg.subject}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{msg.sender_name} ({msg.sender_email})</div>
                    </div>
                  );
                })}

                {filteredTickets.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs">No tickets match specified filters.</div>
                )}
              </div>
            </div>
          </div>

          {/* Ticket Viewer & Reply Box */}
          <div className="lg:col-span-2 space-y-6">
            {activeTicket ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-700">{activeTicket.ticket_number}</span>
                    <span className="text-xs text-slate-400">{new Date(activeTicket.created_at).toLocaleString()}</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">{activeTicket.subject}</h2>
                  <div className="text-xs text-slate-600 font-medium">
                    From: <strong className="text-slate-900">{activeTicket.sender_name}</strong> &lt;{activeTicket.sender_email}&gt;
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                  {activeTicket.body}
                </div>

                {/* Thread Replies if any */}
                {activeTicket.replies && activeTicket.replies.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black uppercase text-slate-700">Staff Replies</h4>
                    {activeTicket.replies.map((reply) => (
                      <div key={reply.id} className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-emerald-900 font-bold">
                          <span>{reply.staff_name} ({reply.staff_email})</span>
                          <span>{new Date(reply.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-800 font-mono whitespace-pre-wrap">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dispatch Reply Box */}
                <div className="p-5 bg-slate-900 text-white rounded-3xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-black uppercase text-emerald-400">Dispatch Outbound Reply</h3>
                    <select
                      value={replyProfileId}
                      onChange={(e) => setReplyProfileId(e.target.value)}
                      className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white"
                    >
                      <option value="default">Active Default ({activeProfile.company_email})</option>
                      {commState.profiles.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.company_email})</option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    rows={4}
                    value={ticketReplyBody}
                    onChange={(e) => setTicketReplyBody(e.target.value)}
                    placeholder="Type official research lab response..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleDispatchTicketReply}
                      disabled={sendingReply || !ticketReplyBody.trim()}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {sendingReply ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>Dispatch External Response</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
                Select a support ticket to review message content and dispatch a reply.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 6: DISPATCH VAULT LOGS --- */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Communication & Dispatch Audit Trail</h2>
              <p className="text-xs text-slate-500">Real-time log of all outbound & inbound email messages and SMS notifications.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Channel Filter */}
              <select
                value={logFilterChannel}
                onChange={(e) => setLogFilterChannel(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="all">All Channels</option>
                <option value="email">Email Only</option>
                <option value="sms">SMS Only</option>
              </select>

              {/* Direction Filter */}
              <select
                value={logFilterDirection}
                onChange={(e) => setLogFilterDirection(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="all">All Directions</option>
                <option value="outgoing">Outgoing</option>
                <option value="incoming">Incoming</option>
              </select>

              {/* Search */}
              <input
                type="text"
                placeholder="Search recipient, phone or subject..."
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">From / To</th>
                  <th className="py-3 px-4">Subject / Message</th>
                  <th className="py-3 px-4">Provider / Details</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold">
                      {log.channel === 'email' ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md text-[10px] font-black uppercase">
                          ✉️ EMAIL
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded-md text-[10px] font-black uppercase">
                          📱 SMS
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-900 font-bold">
                      {log.channel === 'email' ? (
                        <div>
                          <div>To: {log.to_email}</div>
                          <div className="text-slate-400 font-normal">From: {log.from_email}</div>
                        </div>
                      ) : (
                        <div>
                          <div>To: {log.to_phone}</div>
                          <div className="text-slate-400 font-normal">From: {log.from_phone}</div>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium max-w-xs truncate">
                      {log.channel === 'email' ? log.subject : log.message_body}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[10px] max-w-xs truncate">
                      {log.channel === 'email' ? log.details : `${log.provider_used} • ${log.details}`}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        log.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No logs found matching current search filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- CREATE / EDIT EMAIL PROFILE MODAL --- */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-600" />
                <span>{editingProfile ? 'Edit Email Profile' : 'Create New Email Profile'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfileSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Profile Name / Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Support Desk, Orders Dispatch, COA Verification"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="support@bkresearchlabs.com"
                    value={profileForm.company_email}
                    onChange={(e) => setProfileForm({ ...profileForm, company_email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender Name Display *</label>
                  <input
                    type="text"
                    required
                    placeholder="BK Research Labs Support"
                    value={profileForm.sender_name}
                    onChange={(e) => setProfileForm({ ...profileForm, sender_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Provider Type</label>
                <select
                  value={profileForm.provider_type}
                  onChange={(e) => setProfileForm({ ...profileForm, provider_type: e.target.value as EmailProviderType })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl font-bold"
                >
                  <option value="gmail">Gmail / Google Workspace OAuth & App Password</option>
                  <option value="resend">Resend API</option>
                  <option value="sendgrid">Sendgrid API</option>
                  <option value="smtp">Custom SMTP Server</option>
                  <option value="webhook">Custom Dispatch Webhook</option>
                </select>
              </div>

              {/* SMTP Settings if SMTP or Gmail */}
              {(profileForm.provider_type === 'smtp' || profileForm.provider_type === 'gmail') && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SMTP Host</label>
                      <input
                        type="text"
                        value={profileForm.smtp_host}
                        onChange={(e) => setProfileForm({ ...profileForm, smtp_host: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SMTP Port</label>
                      <input
                        type="number"
                        value={profileForm.smtp_port}
                        onChange={(e) => setProfileForm({ ...profileForm, smtp_port: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SMTP Username</label>
                      <input
                        type="text"
                        value={profileForm.smtp_user}
                        onChange={(e) => setProfileForm({ ...profileForm, smtp_user: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">App Password / Pass</label>
                      <input
                        type="password"
                        value={profileForm.smtp_pass}
                        onChange={(e) => setProfileForm({ ...profileForm, smtp_pass: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* API Key if Resend or Sendgrid */}
              {(profileForm.provider_type === 'resend' || profileForm.provider_type === 'sendgrid') && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">API Secret Key</label>
                  <input
                    type="password"
                    placeholder="re_123456789..."
                    value={profileForm.api_key}
                    onChange={(e) => setProfileForm({ ...profileForm, api_key: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl font-mono"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={profileForm.is_default}
                  onChange={(e) => setProfileForm({ ...profileForm, is_default: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-bold text-slate-800">Set as Primary Default Company Email Profile</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CREATE / EDIT SMS GATEWAY PROFILE MODAL --- */}
      {showSmsProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <span>{editingSmsProfile ? 'Edit SMS Gateway Profile' : 'Add SMS Gateway Profile'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowSmsProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSmsProfileSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gateway Profile Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Primary Twilio Toll-Free, Telnyx Backup Route"
                  value={smsProfileForm.name}
                  onChange={(e) => setSmsProfileForm({ ...smsProfileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SMS Provider</label>
                  <select
                    value={smsProfileForm.provider_type}
                    onChange={(e) => setSmsProfileForm({ ...smsProfileForm, provider_type: e.target.value as SmsProviderType })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl font-bold"
                  >
                    <option value="twilio">Twilio Programmable SMS</option>
                    <option value="telnyx">Telnyx Messaging API</option>
                    <option value="plivo">Plivo SMS Gateway</option>
                    <option value="aws_sns">AWS SNS SMS Service</option>
                    <option value="messagebird">MessageBird / Bird</option>
                    <option value="custom_webhook">Custom SMS Gateway Webhook</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">From Phone Number / Sender ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (800) 555-0199"
                    value={smsProfileForm.from_phone_number}
                    onChange={(e) => setSmsProfileForm({ ...smsProfileForm, from_phone_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl font-bold font-mono"
                  />
                </div>
              </div>

              {/* Twilio SID & Token */}
              {smsProfileForm.provider_type === 'twilio' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Twilio Account SID</label>
                    <input
                      type="text"
                      placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={smsProfileForm.account_sid}
                      onChange={(e) => setSmsProfileForm({ ...smsProfileForm, account_sid: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Auth Token</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••••••••••"
                      value={smsProfileForm.auth_token}
                      onChange={(e) => setSmsProfileForm({ ...smsProfileForm, auth_token: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Messaging Service SID (Optional)</label>
                    <input
                      type="text"
                      placeholder="MGxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={smsProfileForm.messaging_service_sid}
                      onChange={(e) => setSmsProfileForm({ ...smsProfileForm, messaging_service_sid: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Other API Keys */}
              {smsProfileForm.provider_type !== 'twilio' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">API Key / Auth Token</label>
                  <input
                    type="password"
                    placeholder="KEY_xxxxxxxx..."
                    value={smsProfileForm.api_key}
                    onChange={(e) => setSmsProfileForm({ ...smsProfileForm, api_key: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl font-mono"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={smsProfileForm.is_default}
                  onChange={(e) => setSmsProfileForm({ ...smsProfileForm, is_default: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="font-bold text-slate-800">Set as Primary Default Active SMS Gateway</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSmsProfileModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg shadow-indigo-600/20"
                >
                  Save Gateway Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SIMULATE INBOUND EMAIL MODAL --- */}
      {showSimulateInboundModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-indigo-600" />
                <span>Simulate Customer Inbound Email</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowSimulateInboundModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender Name</label>
                  <input
                    type="text"
                    value={simInboundForm.sender_name}
                    onChange={(e) => setSimInboundForm({ ...simInboundForm, sender_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender Email</label>
                  <input
                    type="email"
                    value={simInboundForm.sender_email}
                    onChange={(e) => setSimInboundForm({ ...simInboundForm, sender_email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={simInboundForm.subject}
                  onChange={(e) => setSimInboundForm({ ...simInboundForm, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Body</label>
                <textarea
                  rows={4}
                  value={simInboundForm.body}
                  onChange={(e) => setSimInboundForm({ ...simInboundForm, body: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setShowSimulateInboundModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSimulatedInbound}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black shadow-lg shadow-indigo-600/20"
              >
                Simulate Inbound Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TEST EMAIL RULE DISPATCH MODAL --- */}
      {testingRuleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-500" />
                <span>Test Email Dispatch: {testingRuleModal.title}</span>
              </h2>
              <button
                type="button"
                onClick={() => setTestingRuleModal(null)}
                className="text-slate-400 hover:text-slate-600 font-black text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Recipient Email Address</label>
                <input
                  type="email"
                  value={testRuleRecipient}
                  onChange={(e) => setTestRuleRecipient(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px]">
                <span className="font-extrabold text-slate-700">Dispatch Profile Route:</span>{' '}
                <span className="font-mono text-emerald-800 font-bold">
                  {testingRuleModal.assigned_profile_id
                    ? commState.profiles.find(p => p.id === testingRuleModal.assigned_profile_id)?.company_email || 'Active Default'
                    : `Active Default (${activeProfile.company_email})`}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setTestingRuleModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendTestRuleDispatch}
                disabled={ruleTestSending}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl font-black shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {ruleTestSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Execute Test Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TEST SMS RULE DISPATCH MODAL --- */}
      {testingSmsRuleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <span>Test SMS Dispatch: {testingSmsRuleModal.title}</span>
              </h2>
              <button
                type="button"
                onClick={() => setTestingSmsRuleModal(null)}
                className="text-slate-400 hover:text-slate-600 font-black text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Test Mobile Phone Number</label>
                <input
                  type="text"
                  value={testSmsRulePhone}
                  onChange={(e) => setTestSmsRulePhone(e.target.value)}
                  placeholder="+1 (617) 555-0192"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px]">
                <span className="font-extrabold text-slate-700">Dispatch Gateway Route:</span>{' '}
                <span className="font-mono text-indigo-800 font-bold">
                  {testingSmsRuleModal.assigned_sms_profile_id
                    ? (commState.sms_profiles || []).find(p => p.id === testingSmsRuleModal.assigned_sms_profile_id)?.name || 'Active Default'
                    : `Active Default (${activeSmsProfile?.name || 'Twilio Primary'})`}
                </span>
              </div>

              <div className="p-3 bg-slate-900 text-indigo-300 rounded-2xl font-mono text-[11px] leading-relaxed">
                <span className="text-slate-400 block text-[9px] font-sans font-bold uppercase mb-1">Rendered Payload Preview:</span>
                {renderSmsBodyPreview(testingSmsRuleModal.message_body, testSmsRuleVariables)}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setTestingSmsRuleModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendTestSmsRuleDispatch}
                disabled={smsRuleSending}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
              >
                {smsRuleSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                <span>Send SMS Test Message</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
