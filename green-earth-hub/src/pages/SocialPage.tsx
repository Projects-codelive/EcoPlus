import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { CreatePostModal } from '@/components/social/CreatePostModal';
import { Feed } from '@/components/social/Feed';
import { socket } from '@/lib/socket';

const SocialPage = () => {
    const { user } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        // Ensure socket is connected
        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            // Optional: disconnect on unmount if you want strict connection management
            // socket.disconnect(); 
        };
    }, []);

    return (
        <AppLayout>
            <div className="p-4 space-y-4 max-w-2xl mx-auto">
                {/* Header */}
                <div className="pt-2 pb-2 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Social Feed</h1>
                        <p className="text-muted-foreground">Share your eco-journey</p>
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    >
                        <Plus size={18} />
                        New Post
                    </Button>
                </div>

                {/* Feed */}
                <Feed />

                {/* Create Post Modal */}
                <CreatePostModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            </div>
        </AppLayout>
    );
};

export default SocialPage;
