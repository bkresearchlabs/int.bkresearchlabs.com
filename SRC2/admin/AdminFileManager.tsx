import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Folder,
  FolderOpen,
  FolderPlus,
  Upload,
  Search,
  Grid,
  List,
  ShieldCheck,
  Globe,
  Users,
  EyeOff,
  Star,
  Trash2,
  RefreshCw,
  HardDrive,
  PieChart,
  History,
  Database,
  CheckSquare,
  Square,
  ChevronRight,
  Filter,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Archive,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Download,
  FolderInput,
  Lock,
  Plus
} from 'lucide-react';
import {
  StorageBucket,
  FileFolder,
  ManagedFile,
  FileCategory,
  RLSAccessLevel,
  FileRLSPolicy
} from '../../types/fileManager';
import { fileManagerApi } from '../../lib/fileManagerApi';
import { FolderTree } from './filemanager/FolderTree';
import { FileCard } from './filemanager/FileCard';
import { FileListItem } from './filemanager/FileListItem';
import { FilePreviewModal } from './filemanager/FilePreviewModal';
import { FileRLSModal } from './filemanager/FileRLSModal';
import { FileUploadModal } from './filemanager/FileUploadModal';
import { FolderModal } from './filemanager/FolderModal';
import { BatchRLSModal } from './filemanager/BatchRLSModal';
import { StorageStatsModal } from './filemanager/StorageStatsModal';
import { FileAccessLogsModal } from './filemanager/FileAccessLogsModal';
import { FileSQLModal } from './filemanager/FileSQLModal';

export const AdminFileManager: React.FC = () => {
  // State
  const [buckets, setBuckets] = useState<StorageBucket[]>([]);
  const [folders, setFolders] = useState<FileFolder[]>([]);
  const [files, setFiles] = useState<ManagedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation & Filtering
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedBucketFilter, setSelectedBucketFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<FileCategory | 'all'>('all');
  const [rlsFilter, setRlsFilter] = useState<RLSAccessLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date' | 'downloads'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showTrashOnly, setShowTrashOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Multi-Selection
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  // Modals
  const [previewFile, setPreviewFile] = useState<ManagedFile | null>(null);
  const [rlsTarget, setRlsTarget] = useState<{ target: ManagedFile | FileFolder; type: 'file' | 'folder' } | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [folderModalState, setFolderModalState] = useState<{ mode: 'create' | 'rename'; folder?: FileFolder } | null>(null);
  const [isBatchRLSOpen, setIsBatchRLSOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isSQLOpen, setIsSQLOpen] = useState(false);
  const [moveTargetModal, setMoveTargetModal] = useState<{ fileIds: string[] } | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drag & Drop external file listener ref
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [b, fld, fl] = await Promise.all([
        fileManagerApi.getBuckets(),
        fileManagerApi.getFolders(),
        fileManagerApi.getFiles()
      ]);
      setBuckets(b);
      setFolders(fld);
      setFiles(fl);
    } catch (err) {
      console.error('Error loading file manager data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageUpdate = () => loadData();
    window.addEventListener('bkrl_filemanager_updated', handleStorageUpdate);
    return () => window.removeEventListener('bkrl_filemanager_updated', handleStorageUpdate);
  }, []);

  // Global Drag and Drop event listeners for external files
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types?.includes('Files')) {
        setIsGlobalDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.clientX === 0 || e.clientY === 0) {
        setIsGlobalDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsGlobalDragging(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        setIsUploadOpen(true);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleGlobalDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleGlobalDrop);
    };
  }, []);

  // Current folder object & breadcrumb trail
  const currentFolder = useMemo(() => {
    return folders.find(f => f.id === currentFolderId) || null;
  }, [folders, currentFolderId]);

  const breadcrumbs = useMemo(() => {
    const crumbs: { id: string | null; name: string }[] = [{ id: null, name: 'Root Storage' }];
    if (!currentFolderId) return crumbs;

    let curr = folders.find(f => f.id === currentFolderId);
    const trail: { id: string; name: string }[] = [];
    while (curr) {
      trail.unshift({ id: curr.id, name: curr.name });
      curr = curr.parent_id ? folders.find(f => f.id === curr!.parent_id) : undefined;
    }

    return [...crumbs, ...trail];
  }, [folders, currentFolderId]);

  // Current visible subfolders
  const visibleSubfolders = useMemo(() => {
    if (showTrashOnly) {
      return folders.filter(f => f.is_in_trash);
    }
    return folders.filter(f => {
      if (f.is_in_trash) return false;
      if (currentFolderId === null) {
        return f.parent_id === null;
      }
      return f.parent_id === currentFolderId;
    });
  }, [folders, currentFolderId, showTrashOnly]);

  // Filtered & Sorted files
  const visibleFiles = useMemo(() => {
    let result = files.filter(f => {
      // Trash filter
      if (showTrashOnly) {
        return f.is_in_trash;
      }
      if (f.is_in_trash) return false;

      // Favorites filter
      if (showFavoritesOnly && !f.is_favorite) return false;

      // Folder location filter (if not searching)
      if (!searchQuery && !showFavoritesOnly) {
        if (currentFolderId === null) {
          if (f.folder_id !== null) return false;
        } else {
          if (f.folder_id !== currentFolderId) return false;
        }
      }

      // Bucket filter
      if (selectedBucketFilter !== 'all' && f.bucket_id !== selectedBucketFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && f.file_type_category !== categoryFilter) {
        return false;
      }

      // RLS filter
      if (rlsFilter !== 'all' && f.rls_policy.access_level !== rlsFilter) {
        return false;
      }

      // Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesExt = f.extension.toLowerCase().includes(q);
        const matchesTag = f.tags.some(t => t.toLowerCase().includes(q));
        const matchesPath = f.storage_path.toLowerCase().includes(q);
        const matchesDesc = f.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesExt && !matchesTag && !matchesPath && !matchesDesc) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'size') {
        comparison = a.size_bytes - b.size_bytes;
      } else if (sortBy === 'downloads') {
        comparison = a.download_count - b.download_count;
      } else {
        // Date
        comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [
    files,
    currentFolderId,
    selectedBucketFilter,
    categoryFilter,
    rlsFilter,
    searchQuery,
    sortBy,
    sortOrder,
    showTrashOnly,
    showFavoritesOnly
  ]);

  // Selection Handlers
  const handleToggleSelect = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileIds(prev =>
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFileIds.length === visibleFiles.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(visibleFiles.map(f => f.id));
    }
  };

  // Drag and Drop files onto folder handler
  const handleDropFilesOnFolder = async (fileIds: string[], targetFolderId: string) => {
    try {
      const destination = targetFolderId === 'root' ? null : targetFolderId;
      await fileManagerApi.moveFiles(fileIds, destination);
      await loadData();
      setSelectedFileIds([]);
      showToast(`Moved ${fileIds.length} file(s) into folder.`);
    } catch (err: any) {
      alert(`Move error: ${err.message}`);
    }
  };

  // File Operations
  const handleDownload = async (file: ManagedFile) => {
    await fileManagerApi.triggerDownload(file.id);
    await loadData();
    showToast(`Initiating download for "${file.name}"`);
  };

  const handleToggleFavorite = async (file: ManagedFile) => {
    await fileManagerApi.toggleFileFavorite(file.id);
    await loadData();
    showToast(file.is_favorite ? `Removed from Favorites` : `Added to Favorites`);
  };

  const handleRenameFile = async (file: ManagedFile) => {
    const newName = prompt('Enter new file name:', file.name);
    if (newName && newName.trim() && newName.trim() !== file.name) {
      await fileManagerApi.renameFile(file.id, newName.trim());
      await loadData();
      showToast(`Renamed file to "${newName.trim()}"`);
    }
  };

  const handleDuplicateFile = async (file: ManagedFile) => {
    await fileManagerApi.duplicateFile(file.id);
    await loadData();
    showToast(`Duplicated "${file.name}"`);
  };

  const handleTrashFile = async (file: ManagedFile) => {
    await fileManagerApi.trashFiles([file.id]);
    await loadData();
    showToast(`Moved "${file.name}" to Recycle Bin`);
  };

  const handleBatchTrash = async () => {
    if (selectedFileIds.length === 0) return;
    if (confirm(`Move ${selectedFileIds.length} selected files to Trash?`)) {
      await fileManagerApi.trashFiles(selectedFileIds);
      setSelectedFileIds([]);
      await loadData();
      showToast(`Moved ${selectedFileIds.length} files to Recycle Bin.`);
    }
  };

  const handleBatchRestore = async () => {
    if (selectedFileIds.length === 0) return;
    await fileManagerApi.restoreFiles(selectedFileIds);
    setSelectedFileIds([]);
    await loadData();
    showToast(`Restored ${selectedFileIds.length} files.`);
  };

  const handleBatchDeletePermanent = async () => {
    if (selectedFileIds.length === 0) return;
    if (confirm(`Permanently delete ${selectedFileIds.length} files from storage? This cannot be undone.`)) {
      await fileManagerApi.deleteFilesPermanent(selectedFileIds);
      setSelectedFileIds([]);
      await loadData();
      showToast(`Permanently purged ${selectedFileIds.length} files.`);
    }
  };

  const handleBatchDownload = async () => {
    for (const id of selectedFileIds) {
      await fileManagerApi.triggerDownload(id);
    }
    showToast(`Triggered download for ${selectedFileIds.length} files.`);
  };

  // Folder Operations
  const handleRenameFolder = (folder: FileFolder) => {
    setFolderModalState({ mode: 'rename', folder });
  };

  const handleTrashFolder = async (folderId: string) => {
    await fileManagerApi.trashFolder(folderId);
    await loadData();
    showToast(`Moved folder to Recycle Bin`);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col bg-slate-950 text-slate-100 relative select-none">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-slide-up border border-emerald-400/40">
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global External Drag Overlay */}
      {isGlobalDragging && (
        <div className="fixed inset-0 z-50 bg-emerald-950/80 backdrop-blur-sm border-4 border-dashed border-emerald-400 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
          <Upload className="w-16 h-16 text-emerald-300 animate-bounce mb-3" />
          <h2 className="text-2xl font-bold text-white">Drop files to upload into BKR Labs Storage</h2>
          <p className="text-sm text-emerald-200 mt-1">
            Files will be uploaded to {currentFolder ? currentFolder.name : 'Root Storage'}
          </p>
        </div>
      )}

      {/* Top Header & Storage Management Bar */}
      <div className="p-4 sm:p-6 pb-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-950/50">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Lab Storage & File Explorer
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  RLS ENGINE ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage certificates, HPLC reports, imagery, and compound matrices with granular Row-Level Security policies.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsStatsOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <PieChart className="w-3.5 h-3.5 text-emerald-400" />
              <span>Storage Stats</span>
            </button>

            <button
              type="button"
              onClick={() => setIsLogsOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>Audit Logs</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSQLOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Supabase SQL</span>
            </button>

            <button
              type="button"
              onClick={() => setFolderModalState({ mode: 'create' })}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <FolderPlus className="w-4 h-4 text-emerald-400" />
              <span>New Folder</span>
            </button>

            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/50"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Files</span>
            </button>
          </div>
        </div>

        {/* Secondary Filter & Search Control Ribbon */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by file name, tag, extension, path..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-slate-200 text-xs focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Filters: Category, RLS Policy, Bucket */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs"
            >
              <option value="all">All File Types</option>
              <option value="pdf">PDF Documents</option>
              <option value="image">Images & Media</option>
              <option value="spreadsheet">Spreadsheets (CSV/XLS)</option>
              <option value="document">Text & Docs</option>
              <option value="archive">Archives (ZIP/TAR)</option>
              <option value="code">Code & JSON</option>
            </select>

            {/* RLS Policy Filter */}
            <select
              value={rlsFilter}
              onChange={(e) => setRlsFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs"
            >
              <option value="all">All RLS Policies</option>
              <option value="public">Public (CDN)</option>
              <option value="authenticated">Authenticated Only</option>
              <option value="role_restricted">Role Restricted (RBAC)</option>
              <option value="private_admin">Private Admin Only</option>
            </select>

            {/* Storage Bucket Filter */}
            <select
              value={selectedBucketFilter}
              onChange={(e) => setSelectedBucketFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs"
            >
              <option value="all">All Buckets</option>
              {buckets.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-200 text-xs py-1 border-none focus:ring-0"
              >
                <option value="date">Sort: Date</option>
                <option value="name">Sort: Name</option>
                <option value="size">Sort: Size</option>
                <option value="downloads">Sort: Downloads</option>
              </select>
              <button
                type="button"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Body (Left Folder Tree Sidebar + Right File Canvas) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Folder Tree & Quick Filters Sidebar */}
        <div className="w-64 bg-slate-900/40 border-r border-slate-800 flex flex-col p-4 space-y-4 overflow-y-auto custom-scrollbar shrink-0">
          {/* Quick Access Filters */}
          <div className="space-y-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setShowTrashOnly(false);
                setShowFavoritesOnly(false);
                setCurrentFolderId(null);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-medium transition-colors ${
                !showTrashOnly && !showFavoritesOnly && currentFolderId === null
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>All Storage</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {files.filter(f => !f.is_in_trash).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowTrashOnly(false);
                setShowFavoritesOnly(true);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-medium transition-colors ${
                showFavoritesOnly
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Favorites</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {files.filter(f => f.is_favorite && !f.is_in_trash).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowTrashOnly(true);
                setShowFavoritesOnly(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-medium transition-colors ${
                showTrashOnly
                  ? 'bg-red-500/20 text-red-300 font-semibold border border-red-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Recycle Bin</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {files.filter(f => f.is_in_trash).length}
              </span>
            </button>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <div className="flex items-center justify-between px-1 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Folder Hierarchy</span>
              <button
                type="button"
                onClick={() => setFolderModalState({ mode: 'create' })}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400"
                title="Create Folder"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <FolderTree
              folders={folders}
              currentFolderId={currentFolderId}
              onSelectFolder={(id) => {
                setShowTrashOnly(false);
                setShowFavoritesOnly(false);
                setCurrentFolderId(id);
              }}
              onCreateSubfolder={(parentId) => {
                setCurrentFolderId(parentId);
                setFolderModalState({ mode: 'create' });
              }}
              onRenameFolder={handleRenameFolder}
              onEditRLS={(fld) => setRlsTarget({ target: fld, type: 'folder' })}
              onTrashFolder={handleTrashFolder}
              onDropFilesOnFolder={handleDropFilesOnFolder}
            />
          </div>

          {/* Quick RLS Key Reference */}
          <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 space-y-1.5">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block mb-1">
              RLS Policy Legend
            </span>
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-blue-400" />
              <span>Public CDN</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Auth Only</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-amber-400" />
              <span>Role Restricted</span>
            </div>
            <div className="flex items-center gap-2">
              <EyeOff className="w-3 h-3 text-red-400" />
              <span>Private Admin</span>
            </div>
          </div>
        </div>

        {/* Right Main Stage / File Grid Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-4 sm:p-6">
          {/* Breadcrumb Navigation & Batch Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1 text-slate-400 flex-wrap">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.id || 'root'}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTrashOnly(false);
                        setShowFavoritesOnly(false);
                        setCurrentFolderId(crumb.id);
                      }}
                      className={`hover:text-emerald-400 transition-colors ${
                        isLast ? 'font-bold text-white' : ''
                      }`}
                    >
                      {crumb.name}
                    </button>
                    {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Multi-Select Action Bar (Shows when files are checked) */}
            {selectedFileIds.length > 0 ? (
              <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-lg animate-fade-in">
                <span className="font-bold text-emerald-300">
                  {selectedFileIds.length} Selected
                </span>

                {!showTrashOnly ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsBatchRLSOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Set RLS</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBatchDownload}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBatchTrash}
                      className="px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Trash</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleBatchRestore}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBatchDeletePermanent}
                      className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Forever</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedFileIds([])}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Deselect All"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="hover:text-slate-200 flex items-center gap-1"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Select All ({visibleFiles.length})</span>
                </button>
              </div>
            )}
          </div>

          {/* Subfolders Grid (if any in current view) */}
          {visibleSubfolders.length > 0 && !searchQuery && (
            <div className="py-4 border-b border-slate-800/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Folders ({visibleSubfolders.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {visibleSubfolders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => setCurrentFolderId(folder.id)}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 cursor-pointer transition-all flex items-center gap-2.5 group"
                  >
                    <Folder
                      className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform"
                      style={{ color: folder.color || '#10B981' }}
                    />
                    <span className="truncate font-semibold text-xs text-slate-200 group-hover:text-emerald-400 transition-colors">
                      {folder.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files Container (Grid or List) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pt-4">
            {isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                <span>Loading lab storage objects...</span>
              </div>
            ) : visibleFiles.length === 0 ? (
              <div className="h-64 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <FolderOpen className="w-12 h-12 text-slate-600 mb-2" />
                <h4 className="text-sm font-bold text-slate-300">No files found in this view</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  {searchQuery
                    ? `No files matched query "${searchQuery}".`
                    : 'Drag & drop files from your desktop directly into this window, or click "Upload Files".'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Now</span>
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-12">
                {visibleFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    isSelected={selectedFileIds.includes(file.id)}
                    onToggleSelect={handleToggleSelect}
                    onOpenPreview={setPreviewFile}
                    onOpenRLS={(f) => setRlsTarget({ target: f, type: 'file' })}
                    onGetSignedUrl={(f) => setPreviewFile(f)}
                    onDownload={handleDownload}
                    onToggleFavorite={handleToggleFavorite}
                    onRename={handleRenameFile}
                    onDuplicate={handleDuplicateFile}
                    onMove={(f) => setMoveTargetModal({ fileIds: [f.id] })}
                    onTrash={handleTrashFile}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 pb-12">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedFileIds.length > 0 && selectedFileIds.length === visibleFiles.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">RLS Policy</th>
                      <th className="py-3 px-3">Size</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Modified</th>
                      <th className="py-3 px-3 text-center">DLs</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {visibleFiles.map((file) => (
                      <FileListItem
                        key={file.id}
                        file={file}
                        isSelected={selectedFileIds.includes(file.id)}
                        onToggleSelect={handleToggleSelect}
                        onOpenPreview={setPreviewFile}
                        onOpenRLS={(f) => setRlsTarget({ target: f, type: 'file' })}
                        onGetSignedUrl={(f) => setPreviewFile(f)}
                        onDownload={handleDownload}
                        onToggleFavorite={handleToggleFavorite}
                        onRename={handleRenameFile}
                        onDuplicate={handleDuplicateFile}
                        onMove={(f) => setMoveTargetModal({ fileIds: [f.id] })}
                        onTrash={handleTrashFile}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onOpenRLS={(f) => {
            setPreviewFile(null);
            setRlsTarget({ target: f, type: 'file' });
          }}
          onGetSignedUrl={() => {}}
          onDownload={handleDownload}
          onToggleFavorite={handleToggleFavorite}
          onTrash={(f) => {
            setPreviewFile(null);
            handleTrashFile(f);
          }}
          onUpdateDetails={async (id, updates) => {
            await fileManagerApi.updateFileDetails(id, updates);
            await loadData();
          }}
        />
      )}

      {/* 2. RLS Settings Modal */}
      {rlsTarget && (
        <FileRLSModal
          target={rlsTarget.target}
          targetType={rlsTarget.type}
          onClose={() => setRlsTarget(null)}
          onSaveSuccess={async (updatedPolicy) => {
            await loadData();
            showToast(`Applied RLS policy [${updatedPolicy.access_level.toUpperCase()}]`);
          }}
        />
      )}

      {/* 3. Upload Modal */}
      {isUploadOpen && (
        <FileUploadModal
          currentFolderId={currentFolderId}
          folders={folders}
          buckets={buckets}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={async () => {
            await loadData();
            showToast('Files uploaded successfully with RLS security policies.');
          }}
        />
      )}

      {/* 4. Create / Rename Folder Modal */}
      {folderModalState && (
        <FolderModal
          mode={folderModalState.mode}
          folder={folderModalState.folder}
          parentFolderId={currentFolderId}
          buckets={buckets}
          onClose={() => setFolderModalState(null)}
          onSuccess={async () => {
            await loadData();
            showToast(folderModalState.mode === 'create' ? 'Created folder' : 'Renamed folder');
          }}
        />
      )}

      {/* 5. Batch RLS Modal */}
      {isBatchRLSOpen && (
        <BatchRLSModal
          selectedFileIds={selectedFileIds}
          onClose={() => setIsBatchRLSOpen(false)}
          onSuccess={async () => {
            await loadData();
            setSelectedFileIds([]);
            showToast(`Updated RLS policies for ${selectedFileIds.length} files.`);
          }}
        />
      )}

      {/* 6. Storage Stats Modal */}
      {isStatsOpen && (
        <StorageStatsModal onClose={() => setIsStatsOpen(false)} />
      )}

      {/* 7. Access Logs Modal */}
      {isLogsOpen && (
        <FileAccessLogsModal onClose={() => setIsLogsOpen(false)} />
      )}

      {/* 8. Supabase SQL Export Modal */}
      {isSQLOpen && (
        <FileSQLModal onClose={() => setIsSQLOpen(false)} />
      )}
    </div>
  );
};
