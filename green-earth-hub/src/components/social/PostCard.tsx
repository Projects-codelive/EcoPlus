import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Send, Smile } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface Comment {
    _id: string;
    userId: { _id: string; fullName: string; points: number };
    text: string;
    reactions: { userId: string; type: string }[];
    createdAt: string;
}

interface Post {
    _id: string;
    userId: { _id: string; fullName: string; points: number };
    content: string;
    images: string[];
    likes: string[];
    comments: Comment[];
    createdAt: string;
}

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onComment: (postId: string, text: string) => void;
    onReactToComment: (postId: string, commentId: string, type: string) => void;
}

export const PostCard = ({ post, onLike, onComment, onReactToComment }: PostCardProps) => {
    const { user } = useAuth();
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    const isLiked = user && post.likes.includes(user.id);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(post._id, commentText);
            setCommentText('');
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-4 flex items-center gap-3">
                <Link to={`/social/user/${post.userId._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.userId.fullName}`} />
                        <AvatarFallback>{post.userId.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-foreground text-sm">{post.userId.fullName}</h3>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                    </div>
                </Link>
            </div>

            {/* Content */}
            <div className="px-4 pb-2">
                <p className="text-sm text-foreground whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Images - Swipeable Carousel */}
            {post.images.length > 0 && (
                <div className="mt-2">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {post.images.map((img, idx) => (
                                <CarouselItem key={idx}>
                                    <div className="relative aspect-square w-full overflow-hidden bg-muted">
                                        <img
                                            src={`http://localhost:5000${img}`}
                                            alt={`Post image ${idx + 1}`}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {post.images.length > 1 && (
                            <>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                            </>
                        )}
                    </Carousel>
                </div>
            )}

            {/* Actions */}
            <div className="p-2 px-4 flex gap-4 border-t border-border mt-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn("gap-1.5", isLiked ? "text-red-500" : "text-muted-foreground")}
                    onClick={() => onLike(post._id)}
                >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                    <span>{post.likes.length}</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground"
                    onClick={() => setShowComments(!showComments)}
                >
                    <MessageCircle size={20} />
                    <span>{post.comments.length}</span>
                </Button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="bg-accent/10 p-4 border-t border-border">
                    <div className="space-y-4 max-h-60 overflow-y-auto mb-4 custom-scrollbar">
                        {post.comments.map((comment) => (
                            <div key={comment._id} className="flex gap-2.5">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.userId.fullName}`} />
                                    <AvatarFallback>{comment.userId.fullName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="bg-card p-2.5 rounded-lg border border-border/50 text-sm">
                                        <span className="font-semibold text-xs text-foreground block mb-0.5">{comment.userId.fullName}</span>
                                        <span className="text-foreground/90">{comment.text}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 ml-1">
                                        <button
                                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                            onClick={() => onReactToComment(post._id, comment._id, 'heart')}
                                        >

                                            {comment.reactions?.some(r => r.userId === user?.id) ? '❤️' : 'React'}
                                            {/* Show count of reactions if > 0 */}
                                            {comment.reactions?.length > 0 && (
                                                <span className="bg-secondary px-1 rounded-full text-[10px] min-w-[16px] text-center">
                                                    {comment.reactions.length}
                                                </span>
                                            )}
                                        </button>
                                        <span className="text-[10px] text-muted-foreground">
                                            {formatDistanceToNow(new Date(comment.createdAt))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleCommentSubmit} className="flex gap-2">
                        <Input
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="h-9 text-sm"
                        />
                        <Button type="submit" size="sm" variant="ghost" className="h-9 w-9 p-0" disabled={!commentText.trim()}>
                            <Send size={16} className="text-primary" />
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
};
