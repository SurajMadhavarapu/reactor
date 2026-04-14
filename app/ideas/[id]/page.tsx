'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import {
  getIdeaById,
  addComment,
  getComments,
  updateIdeaProgress,
  updateCollaboratorRole,
  listenToComments,
  removeCollaborator,
  listenToIdea,
} from '@/app/utils/firebaseUtils';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { PinVerification } from '@/app/components/PinVerification';
import { THEME, PROGRESS_STAGES, ERROR_MESSAGES, VALIDATION } from '@/app/utils/constants';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  ownerName: string;
  ownerId: string;
  progress: string;
  upvotes: number;
  upvoters: string[];
  commentCount: number;
  collaborators: any[];
  pin?: string;
  pinVerified?: { [userId: string]: boolean };
}

interface Comment {
  id: string;
  userName: string;
  content: string;
  createdAt: any;
}

export default function IdeaDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const ideaId = params.id as string;

  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [musicMood, setMusicMood] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [editingRoleFor, setEditingRoleFor] = useState<string | null>(null);
  const [customRoleInput, setCustomRoleInput] = useState('');


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && ideaId) {
      const unsubscribers: Array<() => void> = [];
      
      const loadAndListen = async () => {
        try {
          // Initial load
          const fetchedIdea = await getIdeaById(ideaId);
          
          // Ensure collaborators array exists
          if (!fetchedIdea.collaborators) {
            fetchedIdea.collaborators = [];
          }
          
          setIdea(fetchedIdea);

          // Check if user has PIN verified or is owner
          const isOwner = user?.uid === fetchedIdea.ownerId;
          const userVerified = fetchedIdea.pinVerified?.[user?.uid || ''] || false;
          
          if (isOwner || userVerified) {
            setPinVerified(true);
            
            // Set up real-time listener for idea changes (progress, description, collaborators)
            const ideaUnsubscribe = listenToIdea(ideaId, (updatedIdea) => {
              setIdea(updatedIdea);
            }, (error) => {
              console.error('Error in idea listener:', error);
              setError('Failed to sync idea updates');
            });
            
            if (ideaUnsubscribe) {
              unsubscribers.push(ideaUnsubscribe);
            }
            
            // Set up real-time listener for comments
            const commentsUnsubscribe = listenToComments(ideaId, setComments, (error) => {
              console.error('Error in comments listener:', error);
              setError('Failed to sync updates');
            });
            
            if (commentsUnsubscribe) {
              unsubscribers.push(commentsUnsubscribe);
            }
          }
          setLoading(false);
        } catch (err: any) {
          console.error('Error loading idea:', err);
          setError(err.message || ERROR_MESSAGES.network.error);
          setLoading(false);
        }
      };
      
      loadAndListen();
      
      // Cleanup both listeners when component unmounts
      return () => {
        unsubscribers.forEach((unsub) => {
          if (typeof unsub === 'function') {
            unsub();
          }
        });
      };
    }
  }, [user, authLoading, router, ideaId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError('');

    if (!user || !newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    if (newComment.length > VALIDATION.comment.maxLength) {
      setCommentError(`Comment must be under ${VALIDATION.comment.maxLength} characters`);
      return;
    }

    try {
      await addComment(ideaId, user.uid, user.displayName || user.email || 'Anonymous', newComment);
      setNewComment('');
      // Comments will update automatically via the real-time listener
    } catch (err: any) {
      setCommentError(err.message || ERROR_MESSAGES.network.error);
    }
  };

  const handleProgressUpdate = async (newProgress: string) => {
    if (!user || !idea) return;

    if (idea.progress === newProgress) {
      return; // No change
    }

    try {
      await updateIdeaProgress(ideaId, newProgress, user.uid, user.displayName || user.email || 'Anonymous');
      setIdea({ ...idea, progress: newProgress });
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.network.error);
    }
  };

  const handleRoleUpdate = async (collaboratorId: string, newRole: string) => {
    if (!idea) return;

    setUpdatingRole(collaboratorId);
    try {
      await updateCollaboratorRole(ideaId, collaboratorId, newRole);
      const updatedCollaborators = idea.collaborators.map((collab) =>
        collab.userId === collaboratorId ? { ...collab, role: newRole } : collab
      );
      setIdea({ ...idea, collaborators: updatedCollaborators });
      setError('');
      setEditingRoleFor(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleCustomRoleSubmit = (collaboratorId: string) => {
    if (!customRoleInput.trim()) {
      setError('Role name cannot be empty');
      return;
    }
    handleRoleUpdate(collaboratorId, customRoleInput.trim());
    setCustomRoleInput('');
  };

  const handleLeaveIdea = async () => {
    if (!user || !idea) return;

    const confirmLeave = window.confirm('Are you sure you want to leave this idea? You can rejoin with the PIN.');
    if (!confirmLeave) return;

    try {
      await removeCollaborator(ideaId, user.uid);
      router.push('/ideas');
    } catch (err: any) {
      setError(err.message || 'Failed to leave idea');
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div style={{ background: THEME.gradients.bgGradient }} className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ color: THEME.colors.navy }}
            className="text-4xl"
          >
            ◈
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  if (!idea) {
    return (
      <DashboardLayout>
        <div style={{ background: THEME.gradients.bgGradient }} className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 style={{ color: THEME.colors.navy }} className="text-3xl font-serif font-bold mb-4">
              Idea Not Found
            </h1>
            <p style={{ color: THEME.colors.charcoal }} className="mb-8 opacity-70">
              The idea you're looking for doesn't exist or has been deleted
            </p>
            <Link href="/ideas">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 rounded-lg font-bold"
                style={{
                  background: THEME.gradients.button,
                  color: THEME.colors.cream,
                }}
              >
                ← Back to Ideas
              </motion.button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Check if PIN verification is needed
  const isOwner = user?.uid === idea.ownerId;
  if (!pinVerified && !isOwner) {
    return <PinVerification ideaId={ideaId} userId={user?.uid || ''} userName={user?.displayName || user?.email || 'User'} onSuccess={() => { setPinVerified(true); }} />;
  }

  const progressIndex = PROGRESS_STAGES.indexOf(idea.progress as any);
  const progressPercent = ((progressIndex + 1) / PROGRESS_STAGES.length) * 100;

  return (
    <DashboardLayout>
      <div style={{ background: THEME.gradients.bgGradient }} className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link href="/ideas" className="text-sm mb-6 inline-block hover:opacity-80 transition" style={{ color: THEME.colors.navy }}>
              ← Back to Ideas
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1
              className="text-5xl font-serif font-bold mb-3"
              style={{
                background: THEME.gradients.hero,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {idea.title}
            </h1>
            <p style={{ color: THEME.colors.charcoal }} className="text-sm opacity-70">
              By <strong style={{ color: THEME.colors.navy }}>{idea.ownerName}</strong> · {idea.category}
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Description & Progress */}
            <motion.div
              className="lg:col-span-2 p-8 rounded-xl backdrop-blur-sm"
              style={{
                background: THEME.gradients.card,
                border: `2px solid ${THEME.colors.gold}`,
                boxShadow: THEME.shadows.goldShadow,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 style={{ color: THEME.colors.navy }} className="text-lg font-serif font-bold mb-4">
                Description
              </h2>
              <p style={{ color: THEME.colors.charcoal }} className="mb-8 leading-relaxed whitespace-pre-wrap opacity-90">
                {idea.description}
              </p>

              {/* Progress Section */}
              <div className="border-t pt-6" style={{ borderColor: `${THEME.colors.gold}60` }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ color: THEME.colors.navy }} className="text-lg font-serif font-bold">
                    Progress
                  </h3>
                  {isOwner && (
                    <span style={{ color: THEME.colors.slate }} className="text-xs opacity-70">
                      Owner - Can update
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div
                    className="h-3 rounded-full overflow-hidden mb-3"
                    style={{
                      background: `linear-gradient(90deg, ${THEME.colors.gold}60, ${THEME.colors.gold}30)`,
                    }}
                  >
                    <motion.div
                      className="h-full"
                      style={{
                        background: THEME.gradients.progressGradient,
                      }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <p style={{ color: THEME.colors.navy }} className="text-sm font-semibold">
                    {idea.progress.toUpperCase()} · {progressPercent.toFixed(0)}%
                  </p>
                </div>

                {/* Progress Buttons */}
                {isOwner && (
                  <div className="flex flex-wrap gap-2">
                    {PROGRESS_STAGES.map((stage) => (
                      <button
                        key={stage}
                        onClick={() => handleProgressUpdate(stage)}
                        disabled={stage === idea.progress}
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background:
                            stage === idea.progress
                              ? `${THEME.colors.gold}60`
                              : THEME.gradients.button,
                          color: THEME.colors.cream,
                        }}
                      >
                        {stage.charAt(0).toUpperCase() + stage.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar - Upvotes & Collaborators */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Music Mood Card */}
              <div
                className="p-6 rounded-xl backdrop-blur-sm"
                style={{
                  background: THEME.gradients.card,
                  border: `2px solid ${THEME.colors.gold}`,
                  boxShadow: THEME.shadows.goldShadow,
                }}
              >
                <h3 style={{ color: THEME.colors.navy }} className="text-sm font-serif font-bold mb-4">
                  WORKING VIBE
                </h3>
                <p style={{ color: THEME.colors.charcoal }} className="text-xs mb-4 opacity-80">
                  What music are you working to?
                </p>
                <div className="space-y-2 mb-4">
                  {['🎵 Spotify', '🎵 YouTube Music', '🎵 Apple Music'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setMusicMood(platform)}
                      className="w-full py-2 px-3 rounded-lg text-sm font-medium transition"
                      style={{
                        background:
                          musicMood === platform
                            ? THEME.gradients.button
                            : `${THEME.colors.gold}20`,
                        color: THEME.colors.cream,
                        opacity: musicMood === platform ? 1 : 0.7,
                        border: `1px solid ${musicMood === platform ? THEME.colors.gold : 'transparent'}`,
                      }}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
                {musicMood && (
                  <p style={{ color: THEME.colors.navy }} className="text-xs font-medium">
                    Vibing with: <span style={{ color: THEME.colors.gold }}>{musicMood}</span>
                  </p>
                )}
              </div>

              {/* Collaborators Card */}
              <div
                className="p-6 rounded-xl backdrop-blur-sm"
                style={{
                  background: THEME.gradients.card,
                  border: `2px solid ${THEME.colors.gold}`,
                  boxShadow: THEME.shadows.goldShadow,
                }}
              >
                <h3 style={{ color: THEME.colors.navy }} className="text-sm font-serif font-bold mb-4">
                  COLLABORATORS ({idea.collaborators?.length || 0})
                </h3>
                <div className="space-y-3">
                  {idea.collaborators && idea.collaborators.length > 0 ? (
                    idea.collaborators.map((collab) => (
                      <div key={collab.userId} className="flex items-center justify-between gap-2">
                        <span style={{ color: THEME.colors.charcoal }} className="text-sm truncate flex-1">
                          {collab.username}
                        </span>
                        {isOwner ? (
                          editingRoleFor === collab.userId ? (
                            // Custom role input mode
                            <div className="flex gap-1 items-center w-48">
                              <input
                                type="text"
                                placeholder="e.g., Designer"
                                defaultValue={collab.role}
                                onChange={(e) => setCustomRoleInput(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleCustomRoleSubmit(collab.userId);
                                  }
                                }}
                                className="text-xs px-2 py-1 rounded font-medium focus:outline-none flex-1"
                                style={{
                                  background: THEME.colors.cream,
                                  color: THEME.colors.navy,
                                  border: `1px solid ${THEME.colors.gold}`,
                                }}
                                autoFocus
                              />
                              <button
                                onClick={() => handleCustomRoleSubmit(collab.userId)}
                                disabled={updatingRole === collab.userId}
                                className="text-xs px-2 py-1 rounded font-medium transition"
                                style={{
                                  background: THEME.colors.gold,
                                  color: THEME.colors.navy,
                                  opacity: updatingRole === collab.userId ? 0.6 : 1,
                                  cursor: updatingRole === collab.userId ? 'not-allowed' : 'pointer',
                                }}
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => {
                                  setEditingRoleFor(null);
                                  setCustomRoleInput('');
                                }}
                                className="text-xs px-2 py-1 rounded font-medium transition"
                                style={{
                                  background: `${THEME.colors.burgundy}40`,
                                  color: THEME.colors.burgundy,
                                  border: `1px solid ${THEME.colors.burgundy}`,
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            // Dropdown mode
                            <select
                              value={collab.role}
                              onChange={(e) => {
                                if (e.target.value === 'custom') {
                                  setEditingRoleFor(collab.userId);
                                  setCustomRoleInput(collab.role);
                                } else {
                                  handleRoleUpdate(collab.userId, e.target.value);
                                }
                              }}
                              disabled={updatingRole === collab.userId}
                              className="text-xs px-2 py-1 rounded font-medium focus:outline-none transition"
                              style={{
                                background: `${THEME.colors.gold}40`,
                                color: THEME.colors.navy,
                                border: `1px solid ${THEME.colors.gold}`,
                                opacity: updatingRole === collab.userId ? 0.6 : 1,
                                cursor: updatingRole === collab.userId ? 'not-allowed' : 'pointer',
                              }}
                            >
                              <option value="owner">Owner</option>
                              <option value="collaborator">Collaborator</option>
                              <option value="viewer">Viewer</option>
                              <option value="custom">Custom Role...</option>
                            </select>
                          )
                        ) : (
                          <span
                            className="text-xs px-2 py-1 rounded font-medium"
                            style={{
                              background: `${THEME.colors.gold}40`,
                              color: THEME.colors.navy,
                            }}
                          >
                            {collab.role}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ color: THEME.colors.charcoal }} className="text-sm opacity-70">
                      Only you have access to this idea
                    </p>
                  )}
                </div>
                
                {/* Leave Idea Button (Non-Owners Only) */}
                {!isOwner && (
                  <motion.button
                    onClick={handleLeaveIdea}
                    whileHover={{ scale: 1.05 }}
                    className="w-full py-2 rounded-lg font-semibold text-sm transition"
                    style={{
                      backgroundColor: `${THEME.colors.burgundy}`,
                      color: THEME.colors.cream,
                    }}
                  >
                    Leave Idea
                  </motion.button>
                )}
              </div>

              {/* PIN Card (Owner Only) */}
              {isOwner && (
                <div
                  className="p-6 rounded-xl backdrop-blur-sm"
                  style={{
                    background: THEME.gradients.card,
                    border: `2px solid ${THEME.colors.gold}`,
                    boxShadow: THEME.shadows.goldShadow,
                  }}
                >
                  <h3 style={{ color: THEME.colors.navy }} className="text-sm font-serif font-bold mb-4">
                    PIN PROTECTION
                  </h3>
                  <p style={{ color: THEME.colors.charcoal }} className="text-xs mb-3 opacity-80">
                    Share this 6-digit PIN with people you want to invite:
                  </p>
                  <div
                    className="p-4 rounded-lg text-center font-mono text-2xl font-bold tracking-widest"
                    style={{
                      backgroundColor: THEME.colors.cream,
                      border: `2px solid ${THEME.colors.gold}`,
                      color: THEME.colors.navy,
                      letterSpacing: '0.3em',
                    }}
                  >
                    {idea.pin}
                  </div>
                  <p style={{ color: THEME.colors.slate }} className="text-xs mt-3 opacity-70">
                    Only people with this PIN can view idea details
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Updates & Assignments Chat Section */}
          <motion.div
            className="p-8 rounded-xl backdrop-blur-sm"
            style={{
              background: THEME.gradients.card,
              border: `2px solid ${THEME.colors.gold}`,
              boxShadow: THEME.shadows.goldShadow,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 style={{ color: THEME.colors.navy }} className="text-xl font-serif font-bold mb-6">
              Updates & Work Assignments
            </h2>

            {/* Chat Display - Messages */}
            <div
              className="mb-8 p-4 rounded-lg space-y-3 overflow-y-auto"
              style={{
                backgroundColor: THEME.colors.cream,
                border: `1px solid ${THEME.colors.gold}40`,
                minHeight: '300px',
                maxHeight: '400px',
              }}
            >
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    className="rounded-lg p-3"
                    style={{
                      backgroundColor: THEME.colors.ivory,
                      borderLeft: `4px solid ${THEME.colors.gold}`,
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p style={{ color: THEME.colors.navy }} className="font-serif font-semibold text-sm">
                        {comment.userName}
                      </p>
                      <p style={{ color: THEME.colors.slate }} className="text-xs opacity-50">
                        {comment.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Recently'}
                      </p>
                    </div>
                    <p style={{ color: THEME.colors.charcoal }} className="text-sm opacity-90 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p style={{ color: THEME.colors.charcoal }} className="text-center py-12 opacity-50">
                  No updates yet. Start collaborating by posting work assignments and progress updates!
                </p>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleAddComment} className="border-t pt-6" style={{ borderColor: `${THEME.colors.gold}40` }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post an update or work assignment..."
                className="w-full px-4 py-3 rounded-lg focus:outline-none transition resize-none"
                style={{
                  backgroundColor: THEME.colors.cream,
                  border: `2px solid ${THEME.colors.gold}`,
                  boxShadow: `inset 0 0 10px ${THEME.colors.gold}40`,
                  color: THEME.colors.charcoal,
                }}
                rows={2}
                maxLength={VALIDATION.comment.maxLength}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs opacity-70" style={{ color: THEME.colors.slate }}>
                  {newComment.length}/{VALIDATION.comment.maxLength}
                </p>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-lg font-semibold"
                  style={{
                    background: THEME.gradients.button,
                    color: THEME.colors.cream,
                  }}
                >
                  Send Update
                </motion.button>
              </div>
              {commentError && <p style={{ color: THEME.colors.error }} className="text-sm mt-2">{commentError}</p>}
            </form>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

