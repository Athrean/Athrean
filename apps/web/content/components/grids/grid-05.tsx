"use client";

import { motion } from "framer-motion";
import { Star, Heart, MessageCircle, Share2, Bookmark, TrendingUp } from "lucide-react";

// Social/Creative Bento - Instagram/Pinterest style with image focus
export default function Grid05() {
  const posts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop",
      likes: "2.4k",
      comments: 89,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1633218388467-539651dcf81a?w=600&h=600&fit=crop",
      likes: "1.8k",
      comments: 45,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&h=600&fit=crop",
      likes: "3.2k",
      comments: 127,
    },
  ];

  const trending = [
    { tag: "#design", posts: "2.4M" },
    { tag: "#creative", posts: "1.8M" },
    { tag: "#minimal", posts: "985K" },
  ];

  return (
    <div className="min-h-screen w-full bg-black p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-pink-500 via-purple-500 to-orange-500 p-0.5">
              <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                <span className="text-xl font-bold text-white">A</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">@artistry</h1>
              <p className="text-sm text-gray-500">Digital Creator</p>
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm"
          >
            Follow
          </motion.button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-3">
          {/* Featured Post - Large */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 md:col-span-6 row-span-2 rounded-3xl overflow-hidden relative group cursor-pointer"
            style={{ aspectRatio: "1" }}
          >
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop"
              alt="Featured"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <span className="text-white font-medium">12.5k</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">342</span>
                </div>
              </div>
              <p className="text-white text-lg font-medium">
                Exploring the boundaries of digital art and reality ✨
              </p>
            </div>
            {/* Hover Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
              >
                <Bookmark className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-6 md:col-span-3 bg-linear-to-br from-violet-600 to-purple-700 rounded-3xl p-6 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-white/80 text-sm">Rating</span>
            </div>
            <div>
              <div className="text-5xl font-bold text-white">4.9</div>
              <div className="text-white/60 text-sm">Based on 2.4k reviews</div>
            </div>
          </motion.div>

          {/* Followers Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="col-span-6 md:col-span-3 bg-zinc-900 rounded-3xl p-6 flex flex-col justify-between border border-zinc-800"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-zinc-400 text-sm">Growth</span>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">+28%</div>
              <div className="text-zinc-500 text-sm">This month</div>
            </div>
          </motion.div>

          {/* Post Grid */}
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="col-span-4 md:col-span-2 aspect-square rounded-2xl overflow-hidden relative group cursor-pointer"
            >
              <img
                src={post.image}
                alt={`Post ${post.id}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">{post.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Trending Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-12 md:col-span-6 bg-zinc-900 rounded-3xl p-6 border border-zinc-800"
          >
            <h3 className="text-white font-semibold mb-4">Trending Now</h3>
            <div className="flex flex-wrap gap-3">
              {trending.map((item, i) => (
                <motion.div
                  key={item.tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors"
                >
                  <span className="text-white font-medium">{item.tag}</span>
                  <span className="text-zinc-500 text-sm ml-2">{item.posts}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Engagement Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="col-span-12 md:col-span-6 bg-linear-to-r from-pink-500 via-rose-500 to-orange-500 rounded-3xl p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-white/80 text-sm mb-1">Total Engagement</h3>
              <div className="text-4xl font-bold text-white">847.2K</div>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 backdrop-blur-sm"
                  style={{
                    backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                    backgroundSize: "cover",
                  }}
                />
              ))}
              <div className="w-12 h-12 rounded-full bg-black/30 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-sm font-bold">+99</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
