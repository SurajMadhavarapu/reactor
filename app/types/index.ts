export type UserRole = 'owner' | 'collaborator' | 'viewer';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  twoFAEnabled: boolean;
  lastLogin?: Date;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  progress: 'concept' | 'validation' | 'mvp' | 'beta' | 'live';
  upvotes: number;
  commentCount: number;
  collaborators: Collaborator[];
  createdAt: Date;
  updatedAt: Date;
  progressHistory: ProgressChange[];
  pin: string;
  pinVerified: { [userId: string]: boolean };
}

export interface Collaborator {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  joinedAt: Date;
}

export interface ProgressChange {
  userId: string;
  username: string;
  fromStage: string;
  toStage: string;
  timestamp: Date;
}

export interface Comment {
  id: string;
  ideaId: string;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Upvote {
  userId: string;
  ideaId: string;
  timestamp: Date;
}

export interface SecurityLog {
  id: string;
  userId: string;
  email: string;
  action: 'login' | 'failed_login' | 'signup' | 'password_reset' | 'twofa_enable' | 'twofa_disable' | 'logout';
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failed';
  reason?: string;
  timestamp: Date;
}

export interface Invite {
  id: string;
  ideaId: string;
  invitedEmail: string;
  role: UserRole;
  invitedBy: string;
  createdAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired';
}
