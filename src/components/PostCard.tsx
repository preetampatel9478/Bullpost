import React, { useState } from 'react';
import { Post } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  MessageSquare, 
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
    <article className="glass-card p-3.5 sm:p-5 space-y-3.5 sm:space-y-4 animate-fadeIn border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)] transition-all">
      
      {/* 1. Header: Author info & Follow button */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 cursor-pointer min-w-0" onClick={() => viewUserProfile(post.author)}>
          <div className="relative shrink-0">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#00E676]/30 hover:border-[#00E676] transition-colors"
            />
            {post.author.verified && (
              <span className="absolute -bottom-1 -right-1 bg-[#00E676] text-[#070a11] rounded-full p-0.5 text-[8px] sm:text-[9px] font-extrabold">
                ✓
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-gray-100 truncate hover:text-[#00E676] transition-colors">{post.author.name}</span>
              <span className="text-[10px] sm:text-xs font-mono text-gray-400 truncate">@{post.author.username}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400 mt-0.5">
              <span>{post.createdAt}</span>
              <span>•</span>
              <span className="text-bullish font-mono font-semibold">+{post.author.winRate}% Win</span>
            </div>
          </div>
        </div>

        {/* Follow / Connect Button */}
        {!isOwnPost && (
          <button
            onClick={() => toggleFollowUser(post.author.id)}
            className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
              post.author.isFollowing 
                ? 'bg-white/10 text-gray-300 border border-white/10'
                : 'bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30 hover:bg-[#00E676] hover:text-[#070a11]'
            }`}
          >
            {post.author.isFollowing ? (
              <>
                <UserCheck className="w-3 h-3" /> <span className="hidden sm:inline">Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3" /> <span>Follow</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 2. Target Stock Pill, Sentiment & Interactive Disclaimer Icon Badge */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        {post.targetStockSymbol && (
          <button
            onClick={() => openStockModal(post.targetStockSymbol!)}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-[#131c30] border border-[#00E676]/30 text-[11px] sm:text-xs font-mono font-bold text-gray-200 hover:border-[#00E676] transition-colors"
          >
            <TrendingUp className="w-3 h-3 text-[#00E676]" />
            ${post.targetStockSymbol}
            {post.stockChange && (
              <span className={`text-[10px] sm:text-[11px] font-bold ${post.stockChange >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                ({post.stockChange >= 0 ? '+' : ''}{post.stockChange}%)
              </span>
            )}
          </button>
        )}

        {post.sentiment && (
          <span className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold flex items-center gap-1 ${
            post.sentiment === 'bullish' ? 'badge-bullish' : 'badge-bearish'
          }`}>
            {post.sentiment === 'bullish' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {post.sentiment.toUpperCase()}
          </span>
        )}

        <span className="px-1.5 py-0.5 text-[9px] uppercase font-mono font-semibold rounded bg-white/5 text-gray-400 border border-white/5">
          {post.type.replace('_', ' ')}
        </span>

        {/* Compact Interactive Disclaimer Icon Badge Button */}
        <button
          onClick={() => setShowDisclaimer(!showDisclaimer)}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold font-mono transition-all border ${
            showDisclaimer 
              ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
          }`}
          title="Click to view financial disclaimer"
        >
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>Disclaimer ℹ️</span>
        </button>
      </div>

      {/* Popover / Expandable Disclaimer Alert on Click */}
      {showDisclaimer && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/40 text-amber-200 text-xs animate-fadeIn space-y-1 my-2 shadow-lg">
          <div className="flex items-center justify-between font-bold text-amber-400 text-xs">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 burning-fire-icon" /> SEBI & Financial Disclaimer
            </span>
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="text-amber-400 hover:text-white p-0.5 rounded-full hover:bg-white/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-200/90 pt-0.5">
            {post.disclaimerText}
          </p>
        </div>
      )}

      {/* 3. Main Post Content */}
      <p className="text-gray-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words">
        {post.content}
      </p>

      {/* 4. Hashtags */}
      {post.hashtags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {post.hashtags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => {
                setFilterHashtag(tag);
                setActiveTab('trending');
              }}
              className="text-[11px] sm:text-xs font-mono font-bold text-amber-400 hover:underline"
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
          
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <div>
              <span className="text-xs font-extrabold text-white uppercase font-mono tracking-wider">
                {post.pnlDetails.symbol}
              </span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded bg-white/10 text-gray-300 font-mono">
                {post.pnlDetails.tradeType}
              </span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#00E676]/20 text-[#00E676] font-mono border border-[#00E676]/30">
              VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div>
              <span className="text-[9px] text-gray-400 block">ENTRY PRICE</span>
              <span className="font-semibold text-gray-200">₹{post.pnlDetails.entryPrice.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 block">EXIT PRICE</span>
              <span className="font-semibold text-gray-200">₹{post.pnlDetails.exitPrice.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 block">QTY</span>
              <span className="font-semibold text-gray-200">{post.pnlDetails.qty.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 block">RETURN %</span>
              <span className={`font-extrabold ${post.pnlDetails.pnlPercentage >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                {post.pnlDetails.pnlPercentage >= 0 ? '+' : ''}{post.pnlDetails.pnlPercentage}%
              </span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium">REALIZED P&L PROFIT:</span>
            <span className={`text-base sm:text-lg font-extrabold font-mono ${post.pnlDetails.pnlAmount >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              {post.pnlDetails.pnlAmount >= 0 ? '+₹' : '-₹'}{Math.abs(post.pnlDetails.pnlAmount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      {/* 6. Responsive Social Buttons Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-[11px] sm:text-xs text-gray-400">
        
        {/* Like */}
        <button
          onClick={() => toggleLikePost(post.id)}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors ${
            post.isLiked ? 'text-red-400 font-bold' : 'hover:text-gray-200'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
          <span>{post.likesCount}</span>
        </button>

        {/* Comments Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 hover:text-gray-200 transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#00F2FE]" />
          <span>{post.commentsCount} <span className="hidden sm:inline">Comments</span></span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 hover:text-gray-200 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>{copiedShare ? 'Copied!' : 'Share'}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={() => toggleBookmarkPost(post.id)}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors ${
            post.isBookmarked ? 'text-[#00E676] font-bold' : 'hover:text-gray-200'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${post.isBookmarked ? 'fill-[#00E676] text-[#00E676]' : ''}`} />
          <span>{post.bookmarksCount}</span>
        </button>

      </div>

      {/* 7. Nested Comments Drawer */}
      {showComments && (
        <div className="pt-2 border-t border-white/10 space-y-2.5 animate-fadeIn">
          
          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0" />
            <input
              type="text"
              placeholder="Add your trader comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-[#131c30] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#00E676]"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-xl bg-[#00E676] text-[#070a11] font-bold text-xs hover:opacity-90 flex items-center gap-1 shrink-0"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>

          {/* Comment list */}
          <div className="space-y-1.5 max-h-52 overflow-y-auto">
            {post.comments.length === 0 ? (
              <p className="text-[11px] text-gray-500 italic py-1">No comments yet. Be the first!</p>
            ) : (
              post.comments.map(c => (
                <div key={c.id} className="p-2 rounded-xl bg-white/5 text-[11px] space-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <img src={c.userAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                      <span className="font-bold text-gray-200">{c.userName}</span>
                      <span className="text-[9px] text-gray-400 font-mono">@{c.userHandle}</span>
                    </div>
                    <span className="text-[9px] text-gray-500">{c.createdAt}</span>
                  </div>
                  <p className="text-gray-300 pl-5">{c.content}</p>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </article>
  );
};
