import { UserRole } from './index';

export type RLSAccessLevel =
  | 'public'          // Public CDN / anyone can access
  | 'authenticated'   // Logged in users only (any valid session)
  | 'role_restricted' // Limited to specific roles (e.g. admin, employee)
  | 'user_restricted' // Limited to specific user IDs / emails
  | 'private_admin';  // Restricted strictly to owner & admin

export interface FileRLSPolicy {
  id: string;
  target_id: string; // file ID or folder ID
  target_type: 'file' | 'folder';
  access_level: RLSAccessLevel;
  allowed_roles: UserRole[];
  allowed_user_emails: string[];
  allow_anonymous_read: boolean;
  allow_anonymous_download: boolean;
  require_watermark: boolean;
  watermark_text?: string;
  signed_url_ttl_seconds: number; // e.g. 3600 (1 hour), 86400 (24 hrs)
  password_protected: boolean;
  password_hash?: string;
  expiration_date?: string; // ISO date string or undefined
  inherit_parent: boolean;
  created_at: string;
  updated_at: string;
}

export interface StorageBucket {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  file_size_limit_mb: number;
  allowed_mime_types: string[];
  icon: string;
  color: string;
  total_files_count?: number;
  total_size_bytes?: number;
}

export interface FileFolder {
  id: string;
  name: string;
  parent_id: string | null; // null for top-level root
  bucket_id: string;
  path: string;
  color?: string;
  icon?: string;
  is_system?: boolean;
  is_favorite?: boolean;
  is_in_trash?: boolean;
  trashed_at?: string;
  rls_policy: FileRLSPolicy;
  created_by: string;
  created_at: string;
  updated_at: string;
  subfolder_count?: number;
  file_count?: number;
  total_size_bytes?: number;
}

export type FileCategory =
  | 'image'
  | 'pdf'
  | 'document'
  | 'spreadsheet'
  | 'archive'
  | 'audio'
  | 'video'
  | 'code'
  | 'other';

export interface ManagedFile {
  id: string;
  name: string;
  extension: string;
  mime_type: string;
  size_bytes: number;
  folder_id: string | null;
  bucket_id: string;
  storage_path: string;
  public_url: string;
  data_url?: string;
  thumbnail_url?: string;
  file_type_category: FileCategory;
  checksum_sha256: string;
  dimensions?: { width: number; height: number };
  page_count?: number;
  tags: string[];
  description?: string;
  is_favorite: boolean;
  is_pinned?: boolean;
  is_in_trash: boolean;
  trashed_at?: string;
  rls_policy: FileRLSPolicy;
  download_count: number;
  last_accessed_at?: string;
  uploaded_by: string;
  uploaded_by_name: string;
  created_at: string;
  updated_at: string;
}

export type FileActionType =
  | 'upload'
  | 'view'
  | 'preview'
  | 'download'
  | 'signed_url_generated'
  | 'rls_policy_updated'
  | 'rename'
  | 'move'
  | 'duplicate'
  | 'trash'
  | 'restore'
  | 'delete_permanent';

export interface FileAccessLog {
  id: string;
  file_id: string;
  file_name: string;
  action: FileActionType;
  user_email: string;
  user_role: string;
  ip_address: string;
  user_agent: string;
  status: 'allowed' | 'denied' | 'expired';
  details?: string;
  timestamp: string;
}

export type FileViewMode = 'grid' | 'list' | 'compact';

export type FileSortField = 'name' | 'size' | 'updated_at' | 'extension' | 'downloads' | 'rls';
export type FileSortOrder = 'asc' | 'desc';

export interface FileSortConfig {
  field: FileSortField;
  order: FileSortOrder;
}

export interface FileFilterCriteria {
  searchQuery: string;
  category: 'all' | FileCategory;
  accessLevel: 'all' | RLSAccessLevel;
  bucketId: string | 'all';
  folderId: string | null | 'all';
  onlyFavorites: boolean;
  onlyTrash: boolean;
  tags: string[];
}

export interface StorageStats {
  total_files: number;
  total_folders: number;
  total_size_bytes: number;
  used_percent: number;
  quota_limit_bytes: number;
  by_category: Record<FileCategory, { count: number; size_bytes: number }>;
  by_bucket: Record<string, { count: number; size_bytes: number }>;
  by_rls: Record<RLSAccessLevel, { count: number; size_bytes: number }>;
}

export interface DraggedItemPayload {
  type: 'file' | 'folder';
  ids: string[];
  source_folder_id: string | null;
}
