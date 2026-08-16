import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, Table as TableIcon, Presentation, Plus, Search,
  Filter, Download, Upload, Trash2, Edit3, Eye, Copy,
  ArrowRightLeft, Sparkles, Folder, Check, Star, ShieldCheck,
  Calendar, User, Clock, ArrowRight, LayoutGrid, List as ListIcon,
  RefreshCw, FileSpreadsheet, HardDrive, Award, FileCode, CheckCircle2,
  CreditCard, Printer
} from 'lucide-react';
import { OfficeDocument, OfficeTemplate, OfficeDocType, DocumentCategory } from '../../types/office';
import { DEFAULT_OFFICE_DOCUMENTS, OFFICE_TEMPLATES } from '../../lib/officeTemplates';
import { DocumentWordProcessor } from './office/DocumentWordProcessor';
import { DocumentSpreadsheet } from './office/DocumentSpreadsheet';
import { DocumentSlideDeck } from './office/DocumentSlideDeck';
import { DocumentBusinessCard } from './office/DocumentBusinessCard';
import { DocumentFileConverter } from './office/DocumentFileConverter';
import { DocumentPrintPreviewModal } from './office/DocumentPrintPreviewModal';

const LOCAL_STORAGE_KEY = 'bkr_office_documents_v2';

export const AdminDocumentCenter: React.FC = () => {
  const [documents, setDocuments] = useState<OfficeDocument[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved documents from localStorage', e);
      }
    }
    return DEFAULT_OFFICE_DOCUMENTS;
  });

  const [activeTab, setActiveTab] = useState<'documents' | 'templates' | 'converter'>('documents');
  const [activeEditingDoc, setActiveEditingDoc] = useState<OfficeDocument | null>(null);
  const [printPreviewDoc, setPrintPreviewDoc] = useState<OfficeDocument | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | OfficeDocType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [vaultBackupNotice, setVaultBackupNotice] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents));
  }, [documents]);

  // Filtered documents
  const filteredDocuments = documents.filter(doc => {
    if (selectedTypeFilter !== 'all' && doc.type !== selectedTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchAuthor = doc.author.toLowerCase().includes(q);
      const matchTags = doc.tags?.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchAuthor && !matchTags) return false;
    }
    return true;
  });

  // Save document from active editor
  const handleSaveDocument = (updatedDoc: OfficeDocument) => {
    setDocuments(prev => {
      const index = prev.findIndex(d => d.id === updatedDoc.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = updatedDoc;
        return next;
      } else {
        return [updatedDoc, ...prev];
      }
    });
    setActiveEditingDoc(updatedDoc);
  };

  // Create new blank document
  const handleCreateNew = (type: OfficeDocType) => {
    const newDoc: OfficeDocument = {
      id: `doc-${Date.now()}`,
      title: type === 'document' ? 'Untitled Laboratory Document' :
             type === 'spreadsheet' ? 'Untitled Calculation Sheet' :
             type === 'presentation' ? 'Untitled Slide Deck' :
             'Untitled Business Card',
      type,
      category: type === 'business_card' ? 'branding' : 'general',
      status: 'draft',
      author: 'Admin',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      tags: [type === 'document' ? 'Doc' : type === 'spreadsheet' ? 'Sheet' : type === 'presentation' ? 'Deck' : 'Business Card'],
      docContent: type === 'document' ? {
        pageSize: 'letter',
        orientation: 'portrait',
        margins: 'normal',
        showLetterhead: true,
        showPageNumbers: true,
        headerTitle: 'BK RESEARCH LABS — DOCUMENT',
        footerNote: 'Confidential Internal Business Document',
        htmlContent: '<h2>Document Title</h2><p>Start writing your content here...</p>'
      } : undefined,
      spreadsheetContent: type === 'spreadsheet' ? {
        activeSheetIndex: 0,
        sheets: [
          {
            id: 'sheet-1',
            name: 'Sheet 1',
            rowCount: 25,
            colCount: 10,
            cells: {
              'A1': { value: 'Item', bold: true, bg: '#0f172a', textColor: '#ffffff' },
              'B1': { value: 'Quantity', bold: true, bg: '#0f172a', textColor: '#ffffff' },
              'C1': { value: 'Unit Price ($)', bold: true, bg: '#0f172a', textColor: '#ffffff' },
              'D1': { value: 'Total ($)', bold: true, bg: '#0f172a', textColor: '#ffffff' },
              'A2': { value: 'Sample Compound A' },
              'B2': { value: '10', format: 'number' },
              'C2': { value: '45.00', format: 'currency' },
              'D2': { value: '=B2*C2', format: 'currency', bold: true }
            }
          }
        ]
      } : undefined,
      presentationContent: type === 'presentation' ? {
        theme: 'emerald',
        slides: [
          {
            id: 'slide-1',
            layout: 'title',
            badge: 'BK RESEARCH LABS',
            title: 'New Scientific Presentation',
            subtitle: 'Overview of synthesis procedures and compliance benchmarks.'
          }
        ]
      } : undefined,
      businessCardContent: type === 'business_card' ? {
        size: 'us_standard',
        orientation: 'landscape',
        corner: 'rounded_md',
        finish: 'gold_foil',
        theme: 'obsidian_gold',
        fontFamily: 'sans',
        contact: {
          fullName: 'Dr. Michael Sterling',
          credentials: 'Ph.D., Lead Chemist',
          jobTitle: 'Chief Scientific Officer',
          department: 'Analytical & Synthesis Division',
          companyName: 'BK RESEARCH LABS',
          tagline: 'High-Purity Analytical Formulations',
          phone: '+1 (800) 555-0199',
          mobile: '+1 (415) 882-9104',
          email: 'm.sterling@bkresearchlabs.com',
          website: 'www.bkresearchlabs.com',
          address: '100 Research Parkway, Cambridge, MA',
          licenseNumber: 'ISO/IEC 17025 Certified'
        },
        qrConfig: {
          enabled: true,
          side: 'back',
          type: 'vcard',
          label: 'SCAN TO SAVE CONTACT',
          size: 90,
          fgColor: '#000000',
          bgColor: '#ffffff',
          includeFrame: true
        },
        front: {
          bgColor: '#090d16',
          bgPattern: 'hex',
          textColor: '#f8fafc',
          secondaryTextColor: '#94a3b8',
          accentColor: '#eab308',
          borderStyle: 'metallic_gold',
          showLogo: true,
          logoIcon: 'flask',
          logoSize: 28,
          showWatermark: true,
          watermarkText: 'BK RESEARCH',
          watermarkOpacity: 0.05,
          layoutStyle: 'standard_split'
        },
        back: {
          bgColor: '#020617',
          bgPattern: 'circuit',
          textColor: '#f8fafc',
          secondaryTextColor: '#94a3b8',
          accentColor: '#eab308',
          borderStyle: 'metallic_gold',
          showLogo: true,
          logoIcon: 'bkr_emblem',
          logoSize: 36,
          showWatermark: true,
          watermarkText: 'VERIFIED LABORATORY GRADE',
          watermarkOpacity: 0.06,
          layoutStyle: 'qr_hero'
        }
      } : undefined
    };

    setDocuments([newDoc, ...documents]);
    setActiveEditingDoc(newDoc);
  };

  // Create from template
  const handleUseTemplate = (template: OfficeTemplate) => {
    const newDoc: OfficeDocument = {
      ...template.documentData,
      id: `doc-${Date.now()}`,
      title: `${template.title} (Draft)`,
      type: template.type,
      category: template.category,
      status: 'draft',
      author: 'Admin Staff',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      tags: template.documentData.tags ? [...template.documentData.tags] : [template.category],
    } as OfficeDocument;

    setDocuments([newDoc, ...documents]);
    setActiveEditingDoc(newDoc);
  };

  // Duplicate document
  const handleDuplicate = (doc: OfficeDocument) => {
    const copy: OfficeDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      title: `${doc.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDocuments([copy, ...documents]);
  };

  // Delete document
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document from your internal office suite?')) {
      setDocuments(documents.filter(d => d.id !== id));
      if (activeEditingDoc?.id === id) {
        setActiveEditingDoc(null);
      }
    }
  };

  // Toggle star
  const handleToggleStar = (id: string) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));
  };

  // Export full backup vault
  const handleExportVaultBackup = () => {
    const payload = JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      totalDocuments: documents.length,
      documents
    }, null, 2);

    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bkr_office_vault_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setVaultBackupNotice(true);
    setTimeout(() => setVaultBackupNotice(false), 3000);
  };

  // Import backup vault
  const handleImportVaultBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.documents && Array.isArray(parsed.documents)) {
          setDocuments(parsed.documents);
          alert(`Successfully imported ${parsed.documents.length} documents into your office suite!`);
        } else {
          alert('Invalid backup file format. Expected a documents array.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Render Full Screen Editor if active
  if (activeEditingDoc) {
    if (activeEditingDoc.type === 'document') {
      return (
        <DocumentWordProcessor
          document={activeEditingDoc}
          onSave={handleSaveDocument}
          onBack={() => setActiveEditingDoc(null)}
        />
      );
    }
    if (activeEditingDoc.type === 'spreadsheet') {
      return (
        <DocumentSpreadsheet
          document={activeEditingDoc}
          onSave={handleSaveDocument}
          onBack={() => setActiveEditingDoc(null)}
        />
      );
    }
    if (activeEditingDoc.type === 'presentation') {
      return (
        <DocumentSlideDeck
          document={activeEditingDoc}
          onSave={handleSaveDocument}
          onBack={() => setActiveEditingDoc(null)}
        />
      );
    }
    if (activeEditingDoc.type === 'business_card') {
      return (
        <DocumentBusinessCard
          document={activeEditingDoc}
          onSave={handleSaveDocument}
          onBack={() => setActiveEditingDoc(null)}
        />
      );
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Top Banner Header */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Internal Business Office Suite</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {documents.length} Files in Vault
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Document Design Center & Office Suite
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
              Create, edit, calculate, present, and convert all enterprise documents, COAs, formulation spreadsheets, slides, business cards, and legal compliance reports.
            </p>
          </div>

          {/* Quick Create Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleCreateNew('document')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-950 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>+ Document</span>
            </button>

            <button
              onClick={() => handleCreateNew('spreadsheet')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-950 transition-all cursor-pointer"
            >
              <TableIcon className="w-4 h-4" />
              <span>+ Spreadsheet</span>
            </button>

            <button
              onClick={() => handleCreateNew('presentation')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-lg shadow-purple-950 transition-all cursor-pointer"
            >
              <Presentation className="w-4 h-4" />
              <span>+ Slide Deck</span>
            </button>

            <button
              onClick={() => handleCreateNew('business_card')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold shadow-lg shadow-amber-950 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>+ Business Card</span>
            </button>

            {/* Global Print-Friendly Preview Mode Button */}
            <button
              onClick={() => {
                if (filteredDocuments.length > 0) {
                  setPrintPreviewDoc(filteredDocuments[0]);
                } else if (documents.length > 0) {
                  setPrintPreviewDoc(documents[0]);
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 text-xs font-extrabold shadow-lg transition-all cursor-pointer"
              title="Enter Print-Friendly Preview Mode (Strips navigation, applies CSS print layout)"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print Preview Mode</span>
            </button>

            {/* Backup & Vault Actions */}
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={handleExportVaultBackup}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                title="Backup Entire Office Vault to JSON"
              >
                <Download className="w-4 h-4 text-amber-400" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                title="Restore Office Vault from Backup File"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportVaultBackup}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs Bar */}
      <div className="border-b border-slate-800 bg-slate-950 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 text-xs font-extrabold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'documents'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>My Documents ({documents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 text-xs font-extrabold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'templates'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Standard Template Library ({OFFICE_TEMPLATES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('converter')}
              className={`py-4 text-xs font-extrabold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'converter'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Universal File Converter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
        {/* TAB 1: ALL DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-md">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or keyword tags (e.g. COA, Yield, BPC-157, Business Card)..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Type Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setSelectedTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedTypeFilter === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  All ({documents.length})
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('document')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    selectedTypeFilter === 'document' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Docs ({documents.filter(d => d.type === 'document').length})</span>
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('spreadsheet')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    selectedTypeFilter === 'spreadsheet' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Sheets ({documents.filter(d => d.type === 'spreadsheet').length})</span>
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('presentation')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    selectedTypeFilter === 'presentation' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Presentation className="w-3.5 h-3.5" />
                  <span>Decks ({documents.filter(d => d.type === 'presentation').length})</span>
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('business_card')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    selectedTypeFilter === 'business_card' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards ({documents.filter(d => d.type === 'business_card').length})</span>
                </button>
              </div>

              {/* View Layout Switcher */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewLayout('grid')}
                  className={`p-1.5 rounded-lg ${viewLayout === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewLayout('list')}
                  className={`p-1.5 rounded-lg ${viewLayout === 'list' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Grid / List */}
            {filteredDocuments.length === 0 ? (
              <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400">
                <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-white">No documents match your query</h3>
                <p className="text-xs text-slate-500 mt-1">Try changing your search terms or create a new document above.</p>
              </div>
            ) : viewLayout === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDocuments.map(doc => {
                  const typeBg = doc.type === 'document'
                    ? 'bg-blue-950 text-blue-400 border-blue-800'
                    : doc.type === 'spreadsheet'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : doc.type === 'presentation'
                    ? 'bg-purple-950 text-purple-400 border-purple-800'
                    : 'bg-amber-950 text-amber-400 border-amber-800';

                  const typeIcon = doc.type === 'document'
                    ? <FileText className="w-4 h-4" />
                    : doc.type === 'spreadsheet'
                    ? <TableIcon className="w-4 h-4" />
                    : doc.type === 'presentation'
                    ? <Presentation className="w-4 h-4" />
                    : <CreditCard className="w-4 h-4" />;

                  return (
                    <div
                      key={doc.id}
                      onClick={() => setActiveEditingDoc(doc)}
                      className="group p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-cyan-500/50 shadow-xl hover:shadow-cyan-950/30 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* Card Header: Type Badge & Star */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${typeBg}`}>
                            {typeIcon}
                            <span>{doc.type.replace('_', ' ')}</span>
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStar(doc.id);
                              }}
                              className="p-1 text-slate-500 hover:text-amber-400"
                            >
                              <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug mb-2">
                          {doc.title}
                        </h3>

                        {/* Tags */}
                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {doc.tags.slice(0, 3).map((t, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Metadata & Actions */}
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                        <div>
                          <span>v{doc.version}</span> • <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrintPreviewDoc(doc);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                            title="Print-Friendly Preview / Physical PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(doc);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400"
                            title="Duplicate Document"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(doc.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="bg-slate-950 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden shadow-xl">
                {filteredDocuments.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setActiveEditingDoc(doc)}
                    className="p-4 flex items-center justify-between hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${
                        doc.type === 'document' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                        doc.type === 'spreadsheet' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                        doc.type === 'presentation' ? 'bg-purple-950 text-purple-400 border-purple-800' :
                        'bg-amber-950 text-amber-400 border-amber-800'
                      }`}>
                        {doc.type === 'document' ? <FileText className="w-4 h-4" /> :
                         doc.type === 'spreadsheet' ? <TableIcon className="w-4 h-4" /> :
                         doc.type === 'presentation' ? <Presentation className="w-4 h-4" /> :
                         <CreditCard className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white hover:text-cyan-400">{doc.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>Author: {doc.author}</span>
                          <span>•</span>
                          <span>Version: v{doc.version}</span>
                          <span>•</span>
                          <span>Updated: {new Date(doc.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrintPreviewDoc(doc);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                        title="Print-Friendly Preview / PDF"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(doc);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(doc.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TEMPLATE LIBRARY */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <h2 className="text-sm font-bold text-white">Pre-Configured Enterprise & Scientific Templates</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Launch compliant documents, formulation spreadsheets, executive slide decks, and luxury business cards with 1-click.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {OFFICE_TEMPLATES.map(tmpl => {
                const typeIcon = tmpl.type === 'document' ? <FileText className="w-4 h-4 text-blue-400" /> :
                                 tmpl.type === 'spreadsheet' ? <TableIcon className="w-4 h-4 text-emerald-400" /> :
                                 tmpl.type === 'presentation' ? <Presentation className="w-4 h-4 text-purple-400" /> :
                                 <CreditCard className="w-4 h-4 text-amber-400" />;

                return (
                  <div
                    key={tmpl.id}
                    className="p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-cyan-500/50 shadow-xl flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                          {typeIcon}
                          <span>{tmpl.type.replace('_', ' ')}</span>
                        </span>
                        <span className="text-[10px] font-bold text-cyan-400">{tmpl.category.toUpperCase()}</span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1.5">{tmpl.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{tmpl.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="text-[10px] text-slate-500">
                        {tmpl.badge}
                      </div>
                      <button
                        onClick={() => handleUseTemplate(tmpl)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: FILE CONVERTER */}
        {activeTab === 'converter' && (
          <div className="h-[650px]">
            <DocumentFileConverter />
          </div>
        )}
      </div>

      {/* PRINT-FRIENDLY PREVIEW MODAL */}
      {printPreviewDoc && (
        <DocumentPrintPreviewModal
          document={printPreviewDoc}
          onClose={() => setPrintPreviewDoc(null)}
        />
      )}
    </div>
  );
};
