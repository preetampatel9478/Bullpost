import React, { useState } from 'react';
import { Post } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  UserPlus, 
  UserCheck, 
  Send,
  AlertTriangle,
  X
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { 
    currentUser, 
    toggleLikePost, 
    toggleBookmarkPost, 
    addComment, 
    toggleFollowUser, 
    viewUserProfile, 
    openStockModal,
    setFilterHashtag,
    setActiveTab
  } = useApp();

  const [showComments, setShowComments] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  const isOwnPost = post.author.id === currentUser.id;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <article className="glass-card p-4 sm:p-6 space-y-4 animate-fadeIn border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      
      {/* 1. Header: Author info & Follow button */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={() => viewUserProfile(post.author)}>
          <div className="relative shrink-0">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
            />
            {post.author.verified && (
              <span className="absolute -bottom-1 -right-1 bg-[#2563EB] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black shadow-xs">
                ✓
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                {post.author.name}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                @{post.author.username}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{post.createdAt}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">+{post.author.winRate}% Win</span>
            </div>
          </div>
        </div>

        {/* Follow / Connect Button */}
        {!isOwnPost && (
          <button
            onClick={() => toggleFollowUser(post.author.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              post.author.isFollowing 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400'
                : 'bg-blue-50 dark:bg-blue-600/20 text-[#2563EB] dark:text-[#60A5FA] border border-blue-200 dark:border-blue-500/30 hover:bg-[#2563EB] hover:text-white'
            }`}
          >
            {post.author.isFollowing ? (
              <>
                <UserCheck className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" /> <span>+ Follow</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 2. Target Stock Pill, Sentiment & Interactive Disclaimer Icon Badge */}
      <div className="flex items-center gap-2 flex-wrap pt-0.5">
        {post.targetStockSymbol && (
          <button
            onClick={() => openStockModal(post.targetStockSymbol!)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:border-[#2563EB] dark:hover:border-[#60A5FA] transition-colors shadow-2xs"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
            ${post.targetStockSymbol}
            {post.stockChange && (
              <span className={`text-[11px] font-bold ${post.stockChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                ({post.stockChange >= 0 ? '+' : ''}{post.stockChange}%)
              </span>
            )}
          </button>
        )}

        {post.sentiment && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            post.sentiment === 'bullish' ? 'badge-bullish' : 'badge-bearish'
          }`}>
            {post.sentiment === 'bullish' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {post.sentiment.toUpperCase()}
          </span>
        )}

        <span className="px-2.5 py-1 text-[10px] uppercase font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
          {post.type.replace('_', ' ')}
        </span>

        {/* Compact Interactive Disclaimer Icon Badge Button */}
        <button
          onClick={() => setShowDisclaimer(!showDisclaimer)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
            showDisclaimer 
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-xs' 
              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300'
          }`}
          title="Click to view financial disclaimer"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Disclaimer</span>
        </button>
      </div>

      {/* Popover / Expandable Disclaimer Alert on Click */}
      {showDisclaimer && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs animate-fadeIn space-y-1 my-2 shadow-xs">
          <div className="flex items-center justify-between font-bold text-amber-700 dark:text-amber-400 text-xs">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> SEBI & Financial Disclaimer
            </span>
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-white p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/90 pt-0.5">
            {post.disclaimerText}
          </p>
        </div>
      )}

      {/* 3. Main Post Content - High-contrast & crisp */}
      <p className="text-slate-800 dark:text-slate-100 text-sm leading-relaxed whitespace-pre-line break-words font-medium">
        {post.content}
      </p>

      {/* 4. Hashtags */}
      {post.hashtags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {post.hashtags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => {
                setFilterHashtag(tag);
                setActiveTab('trending');
              }}
              className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* 5. Rich P&L Card Proof Graphic */}
      {post.pnlDetails && (
        <div className={`pnl-proof-card ${post.pnlDetails.pnlAmount < 0 ? 'loss' : ''}`}>
          <div className="pnl-watermark">P&L PROOF</div>
          
          <div className="flex items-center justify-between border-b border-emerald-100 dark:border-slate-800 pb-2 mb-2.5">
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                ${post.pnlDetails.symbol}
              </span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono">
                {post.pnlDetails.tradeType}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono shadow-2xs">
              VERIFIED P&L
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">ENTRY PRICE</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">₹{post.pnlDetails.entryPrice.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">EXIT PRICE</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">₹{post.pnlDetails.exitPrice.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">QUANTITY</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{post.pnlDetails.qty.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">RETURN</span>
              <span className={`font-black ${post.pnlDetails.pnlPercentage >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {post.pnlDetails.pnlPercentage >= 0 ? '+' : ''}{post.pnlDetails.pnlPercentage}%
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-emerald-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">REALIZED P&L PROFIT:</span>
            <span className={`text-lg font-black font-mono ${post.pnlDetails.pnlAmount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {post.pnlDetails.pnlAmount >= 0 ? '+₹' : '-₹'}{Math.abs(post.pnlDetails.pnlAmount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      {/* 6. Social Action Bar */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-xs text-slate-500 dark:text-slate-400">
        
        {/* Like */}
        <button
          onClick={() => toggleLikePost(post.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
            post.isLiked ? 'text-red-500 font-bold bg-red-50 dark:bg-red-500/10' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
          <span>{post.likesCount}</span>
        </button>

        {/* Comments Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
            showComments
              ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold bg-blue-50 dark:bg-blue-600/20'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#2563EB] dark:hover:text-[#60A5FA]'
          }`}
          title="Comments"
        >
          <MessageCircle className={`w-4 h-4 ${showComments ? 'stroke-[2.5] fill-[#2563EB]/20 dark:fill-[#60A5FA]/20' : ''}`} />
          <span>{post.commentsCount} Comments</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Share2 className="w-4 h-4 text-slate-400" />
          <span>{copiedShare ? 'Copied!' : 'Share'}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={() => toggleBookmarkPost(post.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
            post.isBookmarked ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold bg-blue-50 dark:bg-blue-500/10' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-[#2563EB] dark:fill-[#60A5FA] text-[#2563EB] dark:text-[#60A5FA]' : ''}`} />
          <span>{post.bookmarksCount}</span>
        </button>

      </div>

      {/* 7. Nested Comments Section */}
      {showComments && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fadeIn">
          
          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
            <input
              type="text"
              placeholder="Add your trader comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#60A5FA]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Comment list */}
          <div className="space-y-2 max-h-52 overflow-y-auto pt-1">
            {post.comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-1">No comments yet. Be the first to analyze!</p>
            ) : (
              post.comments.map(c => (
                <div key={c.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-xs space-y-1 border border-transparent dark:border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={c.userAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-bold text-slate-900 dark:text-white">{c.userName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">@{c.userHandle}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 pl-7">{c.content}</p>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </article>
  );
};
