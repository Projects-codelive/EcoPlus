import { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { socket } from '@/lib/socket';
import { toast } from 'sonner';

export const Feed = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeed = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/social/feed', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Feed error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();

        // Socket Event Listeners
        const handleNewPost = (newPost: any) => {
            setPosts(prev => [newPost, ...prev]);
        };

        const handleLikeUpdate = ({ postId, likes }: any) => {
            setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes } : p));
        };

        const handleNewComment = ({ postId, comment }: any) => {
            setPosts(prev => prev.map(p =>
                p._id === postId ? { ...p, comments: [...p.comments, comment] } : p
            ));
        };

        const handleReactionUpdate = ({ postId, commentId, reactions }: any) => {
            setPosts(prev => prev.map(p => {
                if (p._id !== postId) return p;
                return {
                    ...p,
                    comments: p.comments.map((c: any) =>
                        c._id === commentId ? { ...c, reactions } : c
                    )
                };
            }));
        };

        socket.on('post:create', handleNewPost);
        socket.on('post:like', handleLikeUpdate);
        socket.on('post:comment', handleNewComment);
        socket.on('comment:react', handleReactionUpdate);

        return () => {
            socket.off('post:create', handleNewPost);
            socket.off('post:like', handleLikeUpdate);
            socket.off('post:comment', handleNewComment);
            socket.off('comment:react', handleReactionUpdate);
        };
    }, []);

    const handleLike = async (postId: string) => {
        try {
            await fetch(`http://localhost:5000/api/social/${postId}/like`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleComment = async (postId: string, text: string) => {
        try {
            await fetch(`http://localhost:5000/api/social/${postId}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
                credentials: 'include'
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleReactToComment = async (postId: string, commentId: string, type: string) => {
        try {
            await fetch(`http://localhost:5000/api/social/${postId}/comment/${commentId}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type }),
                credentials: 'include'
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-muted-foreground">Loading feed...</div>;
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-10 bg-accent/10 rounded-xl">
                <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {posts.map(post => (
                <PostCard
                    key={post._id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onReactToComment={handleReactToComment}
                />
            ))}
        </div>
    );
};
