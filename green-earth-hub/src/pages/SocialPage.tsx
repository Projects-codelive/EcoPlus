import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Plus, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { CreatePostModal } from '@/components/social/CreatePostModal';
import { Feed } from '@/components/social/Feed';
import { socket } from '@/lib/socket';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "@/components/events/EventForm";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";

const SocialPage = () => {
    const { user } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isEventLoading, setIsEventLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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

    const handleCreateEvent = async (values: any) => {
        setIsEventLoading(true);
        try {
            await axios.post(`${API_BASE}/api/events/create`, values, {
                withCredentials: true
            });
            toast.success("Event created successfully!");
            setIsEventModalOpen(false);
            setRefreshTrigger(prev => prev + 1); // Trigger feed refresh
        } catch (error) {
            toast.error("Failed to create event");
        } finally {
            setIsEventLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="p-4 space-y-4 max-w-2xl mx-auto">
                {/* Header */}
                <div className="pt-2 pb-2 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Social Feed</h1>
                        <p className="text-muted-foreground">Share your eco-journey</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsEventModalOpen(true)}
                            size="sm"
                            className="rounded-full gap-2 text-xs md:text-sm px-3"
                        >
                            <CalendarPlus size={16} />
                            <span className="hidden sm:inline">New Event</span>
                            <span className="inline sm:hidden">Event</span>
                        </Button>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            size="sm"
                            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-xs md:text-sm px-3"
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">New Post</span>
                            <span className="inline sm:hidden">Post</span>
                        </Button>
                    </div>
                </div>

                {/* Feed */}
                <Feed refreshTrigger={refreshTrigger} />

                {/* Create Post Modal */}
                <CreatePostModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />

                {/* Create Event Modal */}
                <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                        </DialogHeader>
                        <EventForm onSubmit={handleCreateEvent} isLoading={isEventLoading} />
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default SocialPage;
