'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getAllIdeas } from '@/app/utils/firebaseUtils';
import { IdeaCard } from '@/app/components/IdeaCard';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { THEME, ERROR_MESSAGES } from '@/app/utils/constants';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  ownerName: string;
  progress: string;
  upvotes: number;
  commentCount: number;
}

export default function IdeasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadIdeas();
    }
  }, [user, authLoading, router]);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      const fetchedIdeas = await getAllIdeas();
      setIdeas(fetchedIdeas as Idea[]);
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.network.error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || idea.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (authLoading || (loading && !ideas.length)) {
    return (
      <DashboardLayout>
        <div
          style={{ background: THEME.gradients.bgGradient }}
          className="flex items-center justify-center min-h-screen"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ color: THEME.colors.gold }}
            className="text-3xl"
          >
            ⚙️
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ background: THEME.gradients.bgGradient }} className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header with Gradient */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1
                  className="text-5xl font-bold mb-2"
                  style={{
                    background: THEME.gradients.hero,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  💡 Startup Ideas
                </h1>
                <p style={{ color: THEME.colors.brightOrange }} className="text-sm font-semibold">
                  ✨ Transform ideas into reality
                </p>
              </div>
              <Link href="/ideas/new">
                <motion.button
                  whileHover={{ scale: 1.08, boxShadow: THEME.shadows.heavyGlow }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg font-bold transition shadow-lg"
                  style={{
                    background: THEME.gradients.button,
                    color: THEME.colors.darkSteel,
                  }}
                >
                  ✨ New Idea
                </motion.button>
              </Link>
            </div>
            <p style={{ color: THEME.colors.white }} className="text-sm opacity-80">
              Discover and collaborate on innovative startup concepts from our community
            </p>
          </motion.div>

          {/* Search & Filter with Gradient Borders */}
          <motion.div
            className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent text-white focus:outline-none transition backdrop-blur-sm"
                style={{
                  background: THEME.gradients.card,
                  border: `2px solid ${THEME.colors.gold}`,
                  boxShadow: THEME.shadows.glow,
                }}
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 rounded-lg bg-transparent text-white focus:outline-none transition backdrop-blur-sm"
              style={{
                background: THEME.gradients.card,
                border: `2px solid ${THEME.colors.gold}`,
                boxShadow: THEME.shadows.glow,
              }}
            >
              <option value="">🎯 All Categories</option>
              <option value="SaaS">SaaS</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Web App">Web App</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Hardware">Hardware</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Social">Social</option>
              <option value="Finance">Finance</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-6 p-4 rounded-lg text-sm backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%)`,
                color: THEME.colors.error,
                border: `2px solid ${THEME.colors.error}`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Ideas Grid */}
          {filteredIdeas.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredIdeas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <IdeaCard
                    id={idea.id}
                    title={idea.title}
                    description={idea.description}
                    category={idea.category}
                    ownerName={idea.ownerName}
                    progress={idea.progress}
                    upvotes={idea.upvotes}
                    commentCount={idea.commentCount}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16 rounded-xl backdrop-blur-sm"
              style={{
                background: THEME.gradients.card,
                border: `3px dashed ${THEME.colors.gold}`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p
                className="text-2xl mb-4 font-bold"
                style={{
                  background: THEME.gradients.hero,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {searchTerm || filterCategory ? '🔍 No ideas match your search' : '💡 No ideas yet'}
              </p>
              <p style={{ color: THEME.colors.white }} className="text-sm mb-8 opacity-70">
                {searchTerm || filterCategory
                  ? 'Try adjusting your search or filter criteria'
                  : 'Be the first to share a revolutionary startup idea!'}
              </p>
              <Link href="/ideas/new">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  className="px-8 py-3 rounded-lg font-bold inline-block transition"
                  style={{
                    background: THEME.gradients.button,
                    color: THEME.colors.darkSteel,
                    boxShadow: THEME.shadows.heavyGlow,
                  }}
                >
                  🚀 Create First Idea
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
