'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import {
  getIdeaById,
  addComment,
  getComments,
  upvoteIdea,
  removeUpvote,
  updateIdeaProgress,
} from '@/app/utils/firebaseUtils';
import { DashboardLayout } from '@/app/components/DashboardLayout';
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
  const [isUpvoted, setIsUpvoted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && ideaId) {
      loadIdea();
    }
  }, [user, authLoading, router, ideaId]);

  const loadIdea = async () => {
    try {
      setLoading(true);
      const fetchedIdea = await getIdeaById(ideaId);
      setIdea(fetchedIdea);
      setIsUpvoted(user ? fetchedIdea.upvoters?.includes(user.uid) : false);

      const fetchedComments = await getComments(ideaId);
      setComments(fetchedComments as Comment[]);
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.network.error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!user || !idea) return;

    try {
      if (isUpvoted) {
        await removeUpvote(ideaId, user.uid);
        setIdea({ ...idea, upvotes: idea.upvotes - 1, upvoters: idea.upvoters.filter((u) => u !== user.uid) });
        setIsUpvoted(false);
      } else {
        await upvoteIdea(ideaId, user.uid);
        setIdea({ ...idea, upvotes: idea.upvotes + 1, upvoters: [...idea.upvoters, user.uid] });
        setIsUpvoted(true);
      }
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.network.error);
    }
  };

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
      await loadIdea();
    } catch (err: any) {
      setCommentError(err.message || ERROR_MESSAGES.network.error);
    }
  };

  const handleProgressUpdate = async (newProgress: string) => {
    if (!user || !idea) return;

    const currentIndex = PROGRESS_STAGES.indexOf(idea.progress as any);
    const newIndex = PROGRESS_STAGES.indexOf(newProgress as any);

    if (newIndex <= currentIndex) {
      setError('Progress can only move forward');
      return;
    }

    try {
      await updateIdeaProgress(ideaId, newProgress, user.uid, user.displayName || user.email || 'Anonymous');
      setIdea({ ...idea, progress: newProgress });
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.network.error);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div style={{ background: THEME.gradients.bgGradient }} className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ color: THEME.colors.gold }}
            className="text-4xl"
          >
            ⚙️
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
            <h1 style={{ color: THEME.colors.gold }} className="text-3xl font-bold mb-4">
              💔 Idea Not Found
            </h1>
            <p style={{ color: THEME.colors.white }} className="mb-8 opacity-70">
              The idea you're looking for doesn't exist or has been deleted
            </p>
            <Link href="/ideas">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 rounded-lg font-bold"
                style={{
                  background: THEME.gradients.button,
                  color: THEME.colors.darkSteel,
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

  const progressIndex = PROGRESS_STAGES.indexOf(idea.progress as any);
  const progressPercent = ((progressIndex + 1) / PROGRESS_STAGES.length) * 100;
  const isOwner = user?.uid === idea.ownerId;

  return (
    <DashboardLayout>
      <div style={{ background: THEME.gradients.bgGradient }} className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link href="/ideas" className="text-sm mb-6 inline-block hover:opacity-80 transition" style={{ color: THEME.colors.brightOrange }}>
              ← Back to Ideas
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1
              className="text-5xl font-bold mb-3"
              style={{
                background: THEME.gradients.hero,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {idea.title}
            </h1>
            <p style={{ color: THEME.colors.white }} className="text-sm opacity-70">
              By <strong style={{ color: THEME.colors.brightOrange }}>{idea.ownerName}</strong> · {idea.category}
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
              <h2 style={{ color: THEME.colors.brightOrange }} className="text-lg font-bold mb-4">
                📝 Description
              </h2>
              <p style={{ color: THEME.colors.white }} className="mb-8 leading-relaxed whitespace-pre-wrap opacity-90">
                {idea.description}
              </p>

              {/* Progress Section */}
              <div className="border-t pt-6" style={{ borderColor: `${THEME.colors.gold}30` }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ color: THEME.colors.brightOrange }} className="text-lg font-bold">
                    🚀 Progress
                  </h3>
                  {isOwner && (
                    <span style={{ color: THEME.colors.white }} className="text-xs opacity-70">
                      Owner - Can update
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div
                    className="h-3 rounded-full overflow-hidden mb-3"
                    style={{
                      background: `linear-gradient(90deg, ${THEME.colors.darkSteel}40, ${THEME.colors.darkSteel}20)`,
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
                  <p style={{ color: THEME.colors.brightOrange }} className="text-sm font-semibold">
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
                        disabled={PROGRESS_STAGES.indexOf(stage) <= progressIndex}
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background:
                            PROGRESS_STAGES.indexOf(stage) <= progressIndex
                              ? `${THEME.colors.darkSteel}40`
                              : THEME.gradients.button,
                          color:
                            PROGRESS_STAGES.indexOf(stage) <= progressIndex ? THEME.colors.white : THEME.colors.darkSteel,
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
              {/* Upvote Card */}
              <div
                className="p-6 rounded-xl backdrop-blur-sm text-center"
                style={{
                  background: THEME.gradients.card,
                  border: `2px solid ${THEME.colors.gold}`,
                  boxShadow: THEME.shadows.goldShadow,
                }}
              >
                <motion.button
                  onClick={handleUpvote}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mb-4"
                >
                  <span className="text-5xl" style={{ opacity: isUpvoted ? 1 : 0.6 }}>
                    ❤️
                  </span>
                </motion.button>
                <p style={{ color: THEME.colors.gold }} className="text-3xl font-bold mb-2">
                  {idea.upvotes}
                </p>
                <p style={{ color: THEME.colors.white }} className="text-sm opacity-70">
                  {isUpvoted ? 'You upvoted this' : 'Upvote this idea'}
                </p>
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
                <h3 style={{ color: THEME.colors.brightOrange }} className="text-sm font-bold mb-4">
                  👥 COLLABORATORS ({idea.collaborators.length})
                </h3>
                <div className="space-y-2">
                  {idea.collaborators.map((collab) => (
                    <div key={collab.userId} className="flex items-center justify-between">
                      <span style={{ color: THEME.colors.white }} className="text-sm">
                        {collab.username}
                      </span>
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          background: `${THEME.colors.brightOrange}20`,
                          color: THEME.colors.brightOrange,
                        }}
                      >
                        {collab.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Comments Section */}
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
            <h2 style={{ color: THEME.colors.brightOrange }} className="text-xl font-bold mb-6">
              💬 Discussion ({comments.length})
            </h2>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 rounded-lg bg-transparent text-white focus:outline-none transition resize-none backdrop-blur-sm"
                style={{
                  border: `2px solid ${THEME.colors.gold}`,
                  boxShadow: `inset 0 0 10px ${THEME.colors.gold}20`,
                }}
                rows={3}
                maxLength={VALIDATION.comment.maxLength}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs opacity-70" style={{ color: THEME.colors.brightOrange }}>
                  {newComment.length}/{VALIDATION.comment.maxLength}
                </p>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-lg font-semibold"
                  style={{
                    background: THEME.gradients.button,
                    color: THEME.colors.darkSteel,
                  }}
                >
                  Post Comment
                </motion.button>
              </div>
              {commentError && <p style={{ color: THEME.colors.error }} className="text-sm mt-2">{commentError}</p>}
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    className="p-4 rounded-lg"
                    style={{
                      background: `${THEME.colors.darkSteel}20`,
                      border: `1px solid ${THEME.colors.gold}20`,
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p style={{ color: THEME.colors.gold }} className="font-semibold text-sm">
                        {comment.userName}
                      </p>
                      <p style={{ color: THEME.colors.white }} className="text-xs opacity-50">
                        {comment.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Recently'}
                      </p>
                    </div>
                    <p style={{ color: THEME.colors.white }} className="text-sm opacity-90">
                      {comment.content}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p style={{ color: THEME.colors.white }} className="text-center py-8 opacity-50">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
