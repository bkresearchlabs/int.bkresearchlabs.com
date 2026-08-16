import {
  StorageBucket,
  FileFolder,
  ManagedFile,
  FileRLSPolicy,
  FileAccessLog,
  FileCategory,
  RLSAccessLevel,
  StorageStats,
  FileActionType
} from '../types/fileManager';
import { UserRole } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import {
  INITIAL_STORAGE_BUCKETS,
  INITIAL_FOLDERS,
  INITIAL_FILES,
  INITIAL_ACCESS_LOGS,
  DEFAULT_AUTH_RLS,
  DEFAULT_PUBLIC_RLS
} from '../data/initialFileManagerData';

const STORAGE_KEYS = {
  BUCKETS: 'bkrl_storage_buckets_v1',
  FOLDERS: 'bkrl_storage_folders_v1',
  FILES: 'bkrl_storage_files_v1',
  ACCESS_LOGS: 'bkrl_storage_logs_v1'
};

function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(`Error reading localStorage for ${key}:`, err);
  }
  return defaultValue;
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bkrl_filemanager_updated', { detail: { key } }));
    }
  } catch (err) {
    console.warn(`Error setting localStorage for ${key}:`, err);
  }
}

// Helper to determine category from extension / mime
export function getCategoryFromMime(mime: string, ext: string): FileCategory {
  const e = ext.toLowerCase();
  if (mime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'ico'].includes(e)) {
    return 'image';
  }
  if (mime === 'application/pdf' || e === 'pdf') {
    return 'pdf';
  }
  if (
    mime.includes('word') ||
    mime.includes('officedocument.wordprocessingml') ||
    ['doc', 'docx', 'txt', 'rtf', 'odt', 'md', 'markdown'].includes(e)
  ) {
    return 'document';
  }
  if (
    mime.includes('excel') ||
    mime.includes('spreadsheetml') ||
    mime.includes('csv') ||
    ['csv', 'xlsx', 'xls', 'tsv', 'ods'].includes(e)
  ) {
    return 'spreadsheet';
  }
  if (
    mime.includes('zip') ||
    mime.includes('compressed') ||
    mime.includes('tar') ||
    mime.includes('gzip') ||
    ['zip', 'tar', 'gz', '7z', 'rar', 'bz2'].includes(e)
  ) {
    return 'archive';
  }
  if (mime.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(e)) {
    return 'audio';
  }
  if (mime.startsWith('video/') || ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(e)) {
    return 'video';
  }
  if (
    ['json', 'js', 'ts', 'tsx', 'jsx', 'html', 'css', 'py', 'sql', 'yaml', 'yml', 'xml'].includes(e)
  ) {
    return 'code';
  }
  return 'other';
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Compute mock / pseudo SHA-256 for browser files
export async function computeFileHash(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

// ==========================================
// FILE MANAGER API
// ==========================================

export const fileManagerApi = {
  // --- BUCKETS ---
  getBuckets: async (): Promise<StorageBucket[]> => {
    return getLocal<StorageBucket[]>(STORAGE_KEYS.BUCKETS, INITIAL_STORAGE_BUCKETS);
  },

  createBucket: async (bucket: Partial<StorageBucket> & { id: string; name: string }): Promise<StorageBucket> => {
    const buckets = await fileManagerApi.getBuckets();
    const newBucket: StorageBucket = {
      id: bucket.id.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      name: bucket.name,
      description: bucket.description || '',
      is_public: bucket.is_public ?? false,
      file_size_limit_mb: bucket.file_size_limit_mb || 50,
      allowed_mime_types: bucket.allowed_mime_types || ['*/*'],
      icon: bucket.icon || 'Folder',
      color: bucket.color || '#3B82F6'
    };
    buckets.push(newBucket);
    setLocal(STORAGE_KEYS.BUCKETS, buckets);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.storage.createBucket(newBucket.id, {
          public: newBucket.is_public,
          fileSizeLimit: newBucket.file_size_limit_mb * 1024 * 1024
        });
      } catch (err) {
        console.warn('Supabase createBucket notice:', err);
      }
    }

    return newBucket;
  },

  // --- FOLDERS ---
  getFolders: async (): Promise<FileFolder[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('storage_folders').select('*');
        if (!error && data && data.length > 0) {
          setLocal(STORAGE_KEYS.FOLDERS, data);
          return data as FileFolder[];
        }
      } catch (e) {
        console.warn('Supabase fetch storage_folders notice:', e);
      }
    }
    const current = getLocal<FileFolder[]>(STORAGE_KEYS.FOLDERS, INITIAL_FOLDERS);
    // Ensure all default initial folders are present
    const existingIds = new Set(current.map(f => f.id));
    let mutated = false;
    for (const initFld of INITIAL_FOLDERS) {
      if (!existingIds.has(initFld.id)) {
        current.push(initFld);
        mutated = true;
      }
    }
    if (mutated) {
      setLocal(STORAGE_KEYS.FOLDERS, current);
    }
    return current;
  },

  getFolderById: async (id: string): Promise<FileFolder | null> => {
    const folders = await fileManagerApi.getFolders();
    return folders.find(f => f.id === id) || null;
  },

  createFolder: async (
    name: string,
    parentId: string | null,
    bucketId: string,
    color = '#10B981',
    userEmail = 'admin@bkresearchlabs.com'
  ): Promise<FileFolder> => {
    const folders = await fileManagerApi.getFolders();
    let parentPath = '';
    if (parentId) {
      const parent = folders.find(f => f.id === parentId);
      if (parent) parentPath = parent.path;
    }
    const cleanName = name.trim();
    const folderPath = parentPath ? `${parentPath}/${cleanName}` : `/${cleanName}`;
    const now = new Date().toISOString();

    const newFolder: FileFolder = {
      id: 'fld-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: cleanName,
      parent_id: parentId,
      bucket_id: bucketId,
      path: folderPath,
      color,
      icon: 'Folder',
      is_favorite: false,
      is_in_trash: false,
      rls_policy: {
        ...DEFAULT_AUTH_RLS,
        id: 'rls-fld-' + Date.now(),
        target_id: 'fld-' + Date.now(),
        target_type: 'folder',
        inherit_parent: Boolean(parentId)
      },
      created_by: userEmail,
      created_at: now,
      updated_at: now
    };

    folders.push(newFolder);
    setLocal(STORAGE_KEYS.FOLDERS, folders);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('storage_folders').upsert([newFolder]);
      } catch (err) {
        console.warn('Supabase upsert folder notice:', err);
      }
    }

    fileManagerApi.logAccess({
      file_id: newFolder.id,
      file_name: newFolder.name,
      action: 'upload',
      user_email: userEmail,
      user_role: 'admin',
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent,
      status: 'allowed',
      details: `Created new folder directory "${folderPath}" in bucket [${bucketId}]`
    });

    return newFolder;
  },

  renameFolder: async (folderId: string, newName: string): Promise<FileFolder> => {
    const folders = await fileManagerApi.getFolders();
    const idx = folders.findIndex(f => f.id === folderId);
    if (idx === -1) throw new Error('Folder not found');

    const folder = folders[idx];
    const oldPath = folder.path;
    const pathParts = oldPath.split('/');
    pathParts[pathParts.length - 1] = newName.trim();
    const newPath = pathParts.join('/');

    folder.name = newName.trim();
    folder.path = newPath;
    folder.updated_at = new Date().toISOString();

    // Update child folder paths
    folders.forEach(f => {
      if (f.path.startsWith(oldPath + '/')) {
        f.path = f.path.replace(oldPath, newPath);
      }
    });

    setLocal(STORAGE_KEYS.FOLDERS, folders);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('storage_folders').upsert(folders);
      } catch (err) {
        console.warn('Supabase rename folder notice:', err);
      }
    }

    return folder;
  },

  moveFolder: async (folderId: string, targetParentId: string | null): Promise<FileFolder> => {
    if (folderId === targetParentId) throw new Error('Cannot move folder into itself');
    const folders = await fileManagerApi.getFolders();
    const folder = folders.find(f => f.id === folderId);
    if (!folder) throw new Error('Folder not found');

    let newParentPath = '';
    if (targetParentId) {
      const targetParent = folders.find(f => f.id === targetParentId);
      if (!targetParent) throw new Error('Target folder not found');
      // Prevent moving parent into its own child
      if (targetParent.path.startsWith(folder.path)) {
        throw new Error('Cannot move a folder inside one of its subfolders');
      }
      newParentPath = targetParent.path;
    }

    const oldPath = folder.path;
    const newPath = newParentPath ? `${newParentPath}/${folder.name}` : `/${folder.name}`;

    folder.parent_id = targetParentId;
    folder.path = newPath;
    folder.updated_at = new Date().toISOString();

    // Update child subfolder paths
    folders.forEach(f => {
      if (f.path.startsWith(oldPath + '/')) {
        f.path = f.path.replace(oldPath, newPath);
      }
    });

    setLocal(STORAGE_KEYS.FOLDERS, folders);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('storage_folders').upsert(folders);
      } catch (err) {
        console.warn('Supabase move folder notice:', err);
      }
    }

    return folder;
  },

  toggleFolderFavorite: async (folderId: string): Promise<FileFolder> => {
    const folders = await fileManagerApi.getFolders();
    const folder = folders.find(f => f.id === folderId);
    if (!folder) throw new Error('Folder not found');
    folder.is_favorite = !folder.is_favorite;
    folder.updated_at = new Date().toISOString();
    setLocal(STORAGE_KEYS.FOLDERS, folders);
    return folder;
  },

  trashFolder: async (folderId: string): Promise<boolean> => {
    const folders = await fileManagerApi.getFolders();
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return false;
    folder.is_in_trash = true;
    folder.trashed_at = new Date().toISOString();
    setLocal(STORAGE_KEYS.FOLDERS, folders);
    return true;
  },

  restoreFolder: async (folderId: string): Promise<boolean> => {
    const folders = await fileManagerApi.getFolders();
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return false;
    folder.is_in_trash = false;
    delete folder.trashed_at;
    setLocal(STORAGE_KEYS.FOLDERS, folders);
    return true;
  },

  deleteFolderPermanent: async (folderId: string): Promise<boolean> => {
    let folders = await fileManagerApi.getFolders();
    let files = await fileManagerApi.getFiles();

    // Find all subfolder IDs
    const targetFolder = folders.find(f => f.id === folderId);
    if (!targetFolder) return false;

    const subfolderIds = folders
      .filter(f => f.path.startsWith(targetFolder.path))
      .map(f => f.id);

    folders = folders.filter(f => !subfolderIds.includes(f.id));
    files = files.filter(f => !subfolderIds.includes(f.folder_id || ''));

    setLocal(STORAGE_KEYS.FOLDERS, folders);
    setLocal(STORAGE_KEYS.FILES, files);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('storage_folders').delete().in('id', subfolderIds);
      } catch (err) {
        console.warn('Supabase delete folder notice:', err);
      }
    }

    return true;
  },

  // --- FILES ---
  getFiles: async (): Promise<ManagedFile[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('storage_files').select('*');
        if (!error && data && data.length > 0) {
          setLocal(STORAGE_KEYS.FILES, data);
          return data as ManagedFile[];
        }
      } catch (e) {
        console.warn('Supabase fetch storage_files notice:', e);
      }
    }
    const current = getLocal<ManagedFile[]>(STORAGE_KEYS.FILES, INITIAL_FILES);
    const existingIds = new Set(current.map(f => f.id));
    let mutated = false;
    for (const initFile of INITIAL_FILES) {
      if (!existingIds.has(initFile.id)) {
        current.push(initFile);
        mutated = true;
      }
    }
    if (mutated) {
      setLocal(STORAGE_KEYS.FILES, current);
    }
    return current;
  },

  getFileById: async (id: string): Promise<ManagedFile | null> => {
    const files = await fileManagerApi.getFiles();
    return files.find(f => f.id === id) || null;
  },

  uploadFile: async (
    file: File,
    folderId: string | null,
    bucketId = 'compound-media',
    customRLS?: Partial<FileRLSPolicy>,
    userEmail = 'admin@bkresearchlabs.com',
    userName = 'BK Research Labs Admin'
  ): Promise<ManagedFile> => {
    const files = await fileManagerApi.getFiles();
    const folders = await fileManagerApi.getFolders();

    const ext = file.name.split('.').pop() || '';
    const category = getCategoryFromMime(file.type, ext);
    const hash = await computeFileHash(file);
    const now = new Date().toISOString();

    let storagePath = `${bucketId}/${file.name}`;
    if (folderId) {
      const folder = folders.find(f => f.id === folderId);
      if (folder) {
        storagePath = `${bucketId}${folder.path}/${file.name}`;
      }
    }

    // Read as Data URL for browser preview
    let dataUrl: string | undefined = undefined;
    let thumbnailUrl: string | undefined = undefined;
    let dimensions: { width: number; height: number } | undefined = undefined;

    if (category === 'image' || file.size < 5 * 1024 * 1024) {
      try {
        dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });

        if (category === 'image' && dataUrl) {
          thumbnailUrl = dataUrl;
          const img = new Image();
          await new Promise<void>((resolve) => {
            img.onload = () => {
              dimensions = { width: img.naturalWidth, height: img.naturalHeight };
              resolve();
            };
            img.onerror = () => resolve();
            img.src = dataUrl!;
          });
        }
      } catch {
        // Continue if data URL fails
      }
    }

    const fileId = 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    // If Supabase is connected, attempt direct Supabase storage upload
    let publicUrl = dataUrl || `https://xqqjaylwikpkkngtprno.supabase.co/storage/v1/object/public/${storagePath}`;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from(bucketId)
          .upload(`${folderId || 'root'}/${Date.now()}-${file.name}`, file, {
            upsert: true
          });

        if (!uploadErr && uploadData) {
          const { data: pubUrlData } = supabase.storage
            .from(bucketId)
            .getPublicUrl(uploadData.path);
          if (pubUrlData?.publicUrl) {
            publicUrl = pubUrlData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload notice, utilizing client cache:', err);
      }
    }

    const defaultRLS = bucketId === 'compound-media' ? DEFAULT_PUBLIC_RLS : DEFAULT_AUTH_RLS;

    const rlsPolicy: FileRLSPolicy = {
      ...defaultRLS,
      id: 'rls-' + fileId,
      target_id: fileId,
      target_type: 'file',
      ...customRLS,
      inherit_parent: Boolean(folderId)
    };

    const newManagedFile: ManagedFile = {
      id: fileId,
      name: file.name,
      extension: ext.toLowerCase(),
      mime_type: file.type || 'application/octet-stream',
      size_bytes: file.size,
      folder_id: folderId,
      bucket_id: bucketId,
      storage_path: storagePath,
      public_url: publicUrl,
      data_url: dataUrl,
      thumbnail_url: thumbnailUrl,
      file_type_category: category,
      checksum_sha256: hash,
      dimensions,
      tags: [ext.toUpperCase(), category.toUpperCase()],
      description: `Uploaded ${file.name} to ${bucketId}`,
      is_favorite: false,
      is_in_trash: false,
      rls_policy: rlsPolicy,
      download_count: 0,
      uploaded_by: userEmail,
      uploaded_by_name: userName,
      created_at: now,
      updated_at: now
    };

    files.unshift(newManagedFile);
    setLocal(STORAGE_KEYS.FILES, files);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('storage_files').upsert([newManagedFile]);
      } catch (err) {
        console.warn('Supabase upsert file record notice:', err);
      }
    }

    fileManagerApi.logAccess({
      file_id: newManagedFile.id,
      file_name: newManagedFile.name,
      action: 'upload',
      user_email: userEmail,
      user_role: 'admin',
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent,
      status: 'allowed',
      details: `Uploaded ${formatBytes(file.size)} file (${category.toUpperCase()}) with RLS policy [${rlsPolicy.access_level.toUpperCase()}]`
    });

    return newManagedFile;
  },

  // Move files to target folder (DRAG AND DROP HANDLER)
  moveFiles: async (
    fileIds: string[],
    targetFolderId: string | null,
    userEmail = 'admin@bkresearchlabs.com'
  ): Promise<ManagedFile[]> => {
    const files = await fileManagerApi.getFiles();
    const folders = await fileManagerApi.getFolders();
    const idSet = new Set(fileIds);
    const moved: ManagedFile[] = [];

    const targetFolder = targetFolderId ? folders.find(f => f.id === targetFolderId) : null;
    const folderLabel = targetFolder ? targetFolder.name : 'Root Directory';

    files.forEach(f => {
      if (idSet.has(f.id)) {
        f.folder_id = targetFolderId;
        if (targetFolder) {
          f.storage_path = `${targetFolder.bucket_id}${targetFolder.path}/${f.name}`;
          f.bucket_id = targetFolder.bucket_id;
          if (f.rls_policy.inherit_parent && targetFolder.rls_policy) {
            f.rls_policy = {
              ...targetFolder.rls_policy,
              id: 'rls-' + f.id,
              target_id: f.id,
              target_type: 'file',
              inherit_parent: true
            };
          }
        }
        f.updated_at = new Date().toISOString();
        moved.push(f);
      }
    });

    setLocal(STORAGE_KEYS.FILES, files);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('storage_files').upsert(moved);
      } catch (err) {
        console.warn('Supabase move files notice:', err);
      }
    }

    fileManagerApi.logAccess({
      file_id: fileIds[0] || 'bulk',
      file_name: moved.map(m => m.name).join(', '),
      action: 'move',
      user_email: userEmail,
      user_role: 'admin',
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent,
      status: 'allowed',
      details: `Moved ${moved.length} file(s) into folder "${folderLabel}"`
    });

    return moved;
  },

  renameFile: async (fileId: string, newName: string): Promise<ManagedFile> => {
    const files = await fileManagerApi.getFiles();
    const file = files.find(f => f.id === fileId);
    if (!file) throw new Error('File not found');

    const clean = newName.trim();
    file.name = clean;
    file.extension = (clean.split('.').pop() || file.extension).toLowerCase();
    file.updated_at = new Date().toISOString();

    setLocal(STORAGE_KEYS.FILES, files);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('storage_files').upsert([file]);
      } catch (err) {
        console.warn('Supabase rename file notice:', err);
      }
    }

    return file;
  },

  updateFileDetails: async (
    fileId: string,
    updates: { description?: string; tags?: string[]; is_pinned?: boolean }
  ): Promise<ManagedFile> => {
    const files = await fileManagerApi.getFiles();
    const file = files.find(f => f.id === fileId);
    if (!file) throw new Error('File not found');

    if (updates.description !== undefined) file.description = updates.description;
    if (updates.tags !== undefined) file.tags = updates.tags;
    if (updates.is_pinned !== undefined) file.is_pinned = updates.is_pinned;
    file.updated_at = new Date().toISOString();

    setLocal(STORAGE_KEYS.FILES, files);
    return file;
  },

  toggleFileFavorite: async (fileId: string): Promise<ManagedFile> => {
    const files = await fileManagerApi.getFiles();
    const file = files.find(f => f.id === fileId);
    if (!file) throw new Error('File not found');

    file.is_favorite = !file.is_favorite;
    file.updated_at = new Date().toISOString();
    setLocal(STORAGE_KEYS.FILES, files);
    return file;
  },

  duplicateFile: async (fileId: string): Promise<ManagedFile> => {
    const files = await fileManagerApi.getFiles();
    const source = files.find(f => f.id === fileId);
    if (!source) throw new Error('Source file not found');

    const now = new Date().toISOString();
    const nameParts = source.name.split('.');
    const ext = nameParts.pop();
    const baseName = nameParts.join('.');
    const copyName = `${baseName} (Copy).${ext}`;
    const newId = 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    const duplicate: ManagedFile = {
      ...source,
      id: newId,
      name: copyName,
      download_count: 0,
      is_favorite: false,
      rls_policy: {
        ...source.rls_policy,
        id: 'rls-' + newId,
        target_id: newId
      },
      created_at: now,
      updated_at: now
    };

    files.unshift(duplicate);
    setLocal(STORAGE_KEYS.FILES, files);
    return duplicate;
  },

  trashFiles: async (fileIds: string[], userEmail = 'admin@bkresearchlabs.com'): Promise<boolean> => {
    const files = await fileManagerApi.getFiles();
    const idSet = new Set(fileIds);
    const now = new Date().toISOString();

    files.forEach(f => {
      if (idSet.has(f.id)) {
        f.is_in_trash = true;
        f.trashed_at = now;
      }
    });

    setLocal(STORAGE_KEYS.FILES, files);

    fileManagerApi.logAccess({
      file_id: fileIds[0] || 'bulk',
      file_name: `${fileIds.length} files`,
      action: 'trash',
      user_email: userEmail,
      user_role: 'admin',
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent,
      status: 'allowed',
      details: `Moved ${fileIds.length} file(s) to Recycle Bin`
    });

    return true;
  },

  restoreFiles: async (fileIds: string[]): Promise<boolean> => {
    const files = await fileManagerApi.getFiles();
    const idSet = new Set(fileIds);

    files.forEach(f => {
      if (idSet.has(f.id)) {
        f.is_in_trash = false;
        delete f.trashed_at;
      }
    });

    setLocal(STORAGE_KEYS.FILES, files);
    return true;
  },

  deleteFilesPermanent: async (fileIds: string[]): Promise<boolean> => {
    let files = await fileManagerApi.getFiles();
    const idSet = new Set(fileIds);
    files = files.filter(f => !idSet.has(f.id));
    setLocal(STORAGE_KEYS.FILES, files);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('storage_files').delete().in('id', fileIds);
      } catch (err) {
        console.warn('Supabase delete files notice:', err);
      }
    }

    return true;
  },

  // --- RLS POLICY CONTROL & EVALUATION ---
  updateRLSPolicy: async (
    targetId: string,
    targetType: 'file' | 'folder',
    policy: Partial<FileRLSPolicy>,
    userEmail = 'admin@bkresearchlabs.com'
  ): Promise<FileRLSPolicy> => {
    const now = new Date().toISOString();
    let updatedPolicy: FileRLSPolicy;

    if (targetType === 'file') {
      const files = await fileManagerApi.getFiles();
      const file = files.find(f => f.id === targetId);
      if (!file) throw new Error('Target file not found');

      updatedPolicy = {
        ...file.rls_policy,
        ...policy,
        target_id: targetId,
        target_type: 'file',
        updated_at: now
      };
      file.rls_policy = updatedPolicy;
      file.updated_at = now;
      setLocal(STORAGE_KEYS.FILES, files);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('storage_files').update({ rls_policy: updatedPolicy, updated_at: now }).eq('id', targetId);
        } catch (err) {
          console.warn('Supabase update RLS policy notice:', err);
        }
      }

      fileManagerApi.logAccess({
        file_id: targetId,
        file_name: file.name,
        action: 'rls_policy_updated',
        user_email: userEmail,
        user_role: 'admin',
        ip_address: '127.0.0.1',
        user_agent: navigator.userAgent,
        status: 'allowed',
        details: `Updated RLS Access Level to [${updatedPolicy.access_level.toUpperCase()}] with roles: ${updatedPolicy.allowed_roles.join(', ')}`
      });
    } else {
      const folders = await fileManagerApi.getFolders();
      const folder = folders.find(f => f.id === targetId);
      if (!folder) throw new Error('Target folder not found');

      updatedPolicy = {
        ...folder.rls_policy,
        ...policy,
        target_id: targetId,
        target_type: 'folder',
        updated_at: now
      };
      folder.rls_policy = updatedPolicy;
      folder.updated_at = now;

      // If cascading down to child files
      const files = await fileManagerApi.getFiles();
      files.forEach(f => {
        if (f.folder_id === targetId && f.rls_policy.inherit_parent) {
          f.rls_policy = {
            ...updatedPolicy,
            id: 'rls-' + f.id,
            target_id: f.id,
            target_type: 'file',
            inherit_parent: true
          };
        }
      });
      setLocal(STORAGE_KEYS.FILES, files);
      setLocal(STORAGE_KEYS.FOLDERS, folders);
    }

    return updatedPolicy;
  },

  // Batch update RLS policy for multiple files
  batchUpdateRLSPolicy: async (
    fileIds: string[],
    policyUpdates: Partial<FileRLSPolicy>,
    userEmail = 'admin@bkresearchlabs.com'
  ): Promise<ManagedFile[]> => {
    const files = await fileManagerApi.getFiles();
    const idSet = new Set(fileIds);
    const now = new Date().toISOString();
    const modified: ManagedFile[] = [];

    files.forEach(f => {
      if (idSet.has(f.id)) {
        f.rls_policy = {
          ...f.rls_policy,
          ...policyUpdates,
          updated_at: now
        };
        f.updated_at = now;
        modified.push(f);
      }
    });

    setLocal(STORAGE_KEYS.FILES, files);

    fileManagerApi.logAccess({
      file_id: fileIds[0] || 'bulk',
      file_name: `${fileIds.length} files`,
      action: 'rls_policy_updated',
      user_email: userEmail,
      user_role: 'admin',
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent,
      status: 'allowed',
      details: `Batch modified RLS policies for ${fileIds.length} files: Access Level -> ${(policyUpdates.access_level || 'unchanged').toUpperCase()}`
    });

    return modified;
  },

  // Evaluate user access to a file based on RLS rules
  evaluateAccess: (
    file: ManagedFile,
    userEmail?: string | null,
    userRole?: UserRole | null,
    enteredPassword?: string
  ): {
    canRead: boolean;
    canDownload: boolean;
    canWrite: boolean;
    requiresPassword: boolean;
    requiresWatermark: boolean;
    watermarkText?: string;
    denialReason?: string;
  } => {
    const policy = file.rls_policy;

    // Check expiration date
    if (policy.expiration_date) {
      const exp = new Date(policy.expiration_date).getTime();
      if (Date.now() > exp) {
        return {
          canRead: false,
          canDownload: false,
          canWrite: false,
          requiresPassword: false,
          requiresWatermark: false,
          denialReason: 'Access Expired: This file link reached its configured expiration date.'
        };
      }
    }

    // Owner and Admin always have full read/write access
    if (userRole === 'owner' || userRole === 'admin') {
      return {
        canRead: true,
        canDownload: true,
        canWrite: true,
        requiresPassword: false,
        requiresWatermark: policy.require_watermark,
        watermarkText: policy.watermark_text
      };
    }

    // Check password protection
    if (policy.password_protected && policy.password_hash) {
      if (!enteredPassword || enteredPassword !== policy.password_hash) {
        return {
          canRead: false,
          canDownload: false,
          canWrite: false,
          requiresPassword: true,
          requiresWatermark: false,
          denialReason: 'Password Protected: Valid passkey required to decrypt and view this document.'
        };
      }
    }

    // Public level
    if (policy.access_level === 'public') {
      return {
        canRead: true,
        canDownload: policy.allow_anonymous_download,
        canWrite: false,
        requiresPassword: false,
        requiresWatermark: policy.require_watermark,
        watermarkText: policy.watermark_text
      };
    }

    // Check authentication requirement
    if (!userEmail) {
      return {
        canRead: false,
        canDownload: false,
        canWrite: false,
        requiresPassword: false,
        requiresWatermark: false,
        denialReason: 'Authentication Required: You must be signed in to access this laboratory file.'
      };
    }

    // Authenticated level
    if (policy.access_level === 'authenticated') {
      return {
        canRead: true,
        canDownload: true,
        canWrite: false,
        requiresPassword: false,
        requiresWatermark: policy.require_watermark,
        watermarkText: policy.watermark_text
      };
    }

    // Role-restricted level
    if (policy.access_level === 'role_restricted') {
      if (userRole && policy.allowed_roles.includes(userRole)) {
        return {
          canRead: true,
          canDownload: true,
          canWrite: false,
          requiresPassword: false,
          requiresWatermark: policy.require_watermark,
          watermarkText: policy.watermark_text
        };
      }
      return {
        canRead: false,
        canDownload: false,
        canWrite: false,
        requiresPassword: false,
        requiresWatermark: false,
        denialReason: `Role Denied: Requires one of [${policy.allowed_roles.join(', ')}]. Current role: ${userRole || 'none'}`
      };
    }

    // User-restricted level
    if (policy.access_level === 'user_restricted') {
      const isExplicitUser = policy.allowed_user_emails.some(
        e => e.toLowerCase() === userEmail.toLowerCase()
      );
      if (isExplicitUser) {
        return {
          canRead: true,
          canDownload: true,
          canWrite: false,
          requiresPassword: false,
          requiresWatermark: policy.require_watermark,
          watermarkText: policy.watermark_text
        };
      }
      return {
        canRead: false,
        canDownload: false,
        canWrite: false,
        requiresPassword: false,
        requiresWatermark: false,
        denialReason: 'Access Denied: Your account email is not on the authorized recipient allowlist for this file.'
      };
    }

    // Private Admin
    return {
      canRead: false,
      canDownload: false,
      canWrite: false,
      requiresPassword: false,
      requiresWatermark: false,
      denialReason: 'Executive Restricted: Strictly accessible to Platform Administrator and Owner accounts.'
    };
  },

  // Generate a temporary expiring signed URL with security token
  generateSignedUrl: async (
    fileId: string,
    ttlSeconds = 3600,
    userEmail = 'admin@bkresearchlabs.com',
    userRole = 'admin'
  ): Promise<{ signedUrl: string; expiresAt: string; token: string }> => {
    const file = await fileManagerApi.getFileById(fileId);
    if (!file) throw new Error('File not found');

    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    let signedUrl = `${file.public_url}?token=${token}&expires=${encodeURIComponent(expiresAt)}&ttl=${ttlSeconds}`;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from(file.bucket_id)
          .createSignedUrl(file.storage_path, ttlSeconds);
        if (!error && data?.signedUrl) {
          signedUrl = data.signedUrl;
        }
      } catch (err) {
        console.warn('Supabase createSignedUrl notice:', err);
      }
    }

    fileManagerApi.logAccess({
      file_id: file.id,
      file_name: file.name,
      action: 'signed_url_generated',
      user_email: userEmail,
      user_role: userRole,
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent,
      status: 'allowed',
      details: `Generated expiring signed URL (TTL: ${Math.round(ttlSeconds / 60)} minutes, Expires: ${new Date(expiresAt).toLocaleTimeString()})`
    });

    return { signedUrl, expiresAt, token };
  },

  // Trigger file download & increment counter
  triggerDownload: async (
    fileId: string,
    userEmail = 'admin@bkresearchlabs.com',
    userRole = 'admin'
  ): Promise<void> => {
    const files = await fileManagerApi.getFiles();
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    file.download_count += 1;
    file.last_accessed_at = new Date().toISOString();
    setLocal(STORAGE_KEYS.FILES, files);

    fileManagerApi.logAccess({
      file_id: file.id,
      file_name: file.name,
      action: 'download',
      user_email: userEmail,
      user_role: userRole,
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent,
      status: 'allowed',
      details: `File downloaded successfully (Total downloads: ${file.download_count})`
    });

    // Create browser download link
    const link = document.createElement('a');
    link.href = file.data_url || file.public_url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // --- STATS & AUDIT LOGS ---
  getStats: async (): Promise<StorageStats> => {
    const files = await fileManagerApi.getFiles();
    const folders = await fileManagerApi.getFolders();
    const activeFiles = files.filter(f => !f.is_in_trash);

    const by_category: Record<FileCategory, { count: number; size_bytes: number }> = {
      image: { count: 0, size_bytes: 0 },
      pdf: { count: 0, size_bytes: 0 },
      document: { count: 0, size_bytes: 0 },
      spreadsheet: { count: 0, size_bytes: 0 },
      archive: { count: 0, size_bytes: 0 },
      audio: { count: 0, size_bytes: 0 },
      video: { count: 0, size_bytes: 0 },
      code: { count: 0, size_bytes: 0 },
      other: { count: 0, size_bytes: 0 }
    };

    const by_bucket: Record<string, { count: number; size_bytes: number }> = {};
    const by_rls: Record<RLSAccessLevel, { count: number; size_bytes: number }> = {
      public: { count: 0, size_bytes: 0 },
      authenticated: { count: 0, size_bytes: 0 },
      role_restricted: { count: 0, size_bytes: 0 },
      user_restricted: { count: 0, size_bytes: 0 },
      private_admin: { count: 0, size_bytes: 0 }
    };

    let totalSize = 0;

    activeFiles.forEach(f => {
      totalSize += f.size_bytes;

      if (by_category[f.file_type_category]) {
        by_category[f.file_type_category].count += 1;
        by_category[f.file_type_category].size_bytes += f.size_bytes;
      }

      if (!by_bucket[f.bucket_id]) {
        by_bucket[f.bucket_id] = { count: 0, size_bytes: 0 };
      }
      by_bucket[f.bucket_id].count += 1;
      by_bucket[f.bucket_id].size_bytes += f.size_bytes;

      const rlsLevel = f.rls_policy.access_level;
      if (by_rls[rlsLevel]) {
        by_rls[rlsLevel].count += 1;
        by_rls[rlsLevel].size_bytes += f.size_bytes;
      }
    });

    const quotaLimit = 10 * 1024 * 1024 * 1024; // 10 GB
    const usedPercent = Math.min(100, Math.round((totalSize / quotaLimit) * 100));

    return {
      total_files: activeFiles.length,
      total_folders: folders.filter(f => !f.is_in_trash).length,
      total_size_bytes: totalSize,
      used_percent: usedPercent,
      quota_limit_bytes: quotaLimit,
      by_category,
      by_bucket,
      by_rls
    };
  },

  getAccessLogs: async (): Promise<FileAccessLog[]> => {
    return getLocal<FileAccessLog[]>(STORAGE_KEYS.ACCESS_LOGS, INITIAL_ACCESS_LOGS);
  },

  logAccess: (logEntry: Omit<FileAccessLog, 'id' | 'timestamp'>): void => {
    const logs = getLocal<FileAccessLog[]>(STORAGE_KEYS.ACCESS_LOGS, INITIAL_ACCESS_LOGS);
    const newLog: FileAccessLog = {
      ...logEntry,
      id: 'log-fl-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    if (logs.length > 500) logs.length = 500;
    setLocal(STORAGE_KEYS.ACCESS_LOGS, logs);
  },

  // Export full JSON backup
  exportStorageMetadataJson: async (): Promise<string> => {
    const buckets = await fileManagerApi.getBuckets();
    const folders = await fileManagerApi.getFolders();
    const files = await fileManagerApi.getFiles();
    const logs = await fileManagerApi.getAccessLogs();

    return JSON.stringify(
      {
        version: '1.0',
        exported_at: new Date().toISOString(),
        buckets,
        folders,
        files,
        logs
      },
      null,
      2
    );
  },

  // Generate SQL Migration script for Supabase Storage tables & RLS policies
  generateSupabaseStorageSQL: (): string => {
    return `-- ====================================================================
-- BKR LABS - SUPABASE STORAGE BUCKETS & RLS SECURITY POLICIES MIGRATION
-- ====================================================================

-- 1. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('lab-certificates', 'lab-certificates', false, 52428800, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
  ('compound-media', 'compound-media', true, 104857600, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'video/mp4']),
  ('research-documents', 'research-documents', false, 52428800, ARRAY['application/pdf', 'text/plain', 'text/markdown', 'application/msword']),
  ('office-files', 'office-files', false, 104857600, ARRAY['text/csv', 'application/json', 'application/vnd.ms-excel']),
  ('system-backups', 'system-backups', false, 262144000, ARRAY['application/zip', 'application/sql'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit;

-- 2. Metadata Tables for Folders & RLS Policies
CREATE TABLE IF NOT EXISTS public.storage_folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id TEXT REFERENCES public.storage_folders(id) ON DELETE CASCADE,
  bucket_id TEXT NOT NULL,
  path TEXT NOT NULL,
  color TEXT DEFAULT '#10B981',
  icon TEXT DEFAULT 'Folder',
  is_favorite BOOLEAN DEFAULT false,
  is_in_trash BOOLEAN DEFAULT false,
  trashed_at TIMESTAMPTZ,
  rls_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.storage_files (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  extension TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  folder_id TEXT REFERENCES public.storage_folders(id) ON DELETE SET NULL,
  bucket_id TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_type_category TEXT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  dimensions JSONB,
  page_count INT,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  is_favorite BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  is_in_trash BOOLEAN DEFAULT false,
  trashed_at TIMESTAMPTZ,
  rls_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
  download_count INT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  uploaded_by TEXT NOT NULL,
  uploaded_by_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.storage_access_logs (
  id TEXT PRIMARY KEY,
  file_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  action TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_role TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable Row-Level Security on Storage Tables
ALTER TABLE public.storage_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_access_logs ENABLE ROW LEVEL SECURITY;

-- 4. Storage Objects Policies (Supabase Storage RLS)
-- Policy A: Public read access for compound-media bucket
CREATE POLICY "Public Read for Compound Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'compound-media');

-- Policy B: Authenticated access for certificates and research docs
CREATE POLICY "Authenticated Read for Research & COA"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id IN ('lab-certificates', 'research-documents'));

-- Policy C: Admin & Owner full control over all storage objects
CREATE POLICY "Admin All Access"
ON storage.objects FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role IN ('admin', 'owner')
  )
);
`;
  }
};
