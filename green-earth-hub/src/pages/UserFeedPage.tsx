import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PostCard } from '@/components/social/PostCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { socket } from '@/lib/socket';

export const UserFeedPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    const fetchUserPosts = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/social/user/${userId}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
                if (data.length > 0) {
                    setUserName(data[0].userId.fullName);
                }
            }
        } catch (error) {
            console.error('Fetch User Posts Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;
        fetchUserPosts();

        // Re-use same socket listeners for real-time updates on this specific feed
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

        socket.on('post:like', handleLikeUpdate);
        socket.on('post:comment', handleNewComment);
        socket.on('comment:react', handleReactionUpdate);

        return () => {
            socket.off('post:like', handleLikeUpdate);
            socket.off('post:comment', handleNewComment);
            socket.off('comment:react', handleReactionUpdate);
        };
    }, [userId]);

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

    return (
        <AppLayout>
            <div className="p-4 space-y-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 pt-2 pb-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {loading ? 'Loading...' : `${userName || 'User'}'s Posts`}
                        </h1>
                        <p className="text-muted-foreground">{posts.length} Posts</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-10 bg-accent/10 rounded-xl">
                        <p className="text-muted-foreground">This user hasn't posted anything yet.</p>
                    </div>
                ) : (
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
                )}
            </div>
        </AppLayout>
    );
};

export default UserFeedPage;
