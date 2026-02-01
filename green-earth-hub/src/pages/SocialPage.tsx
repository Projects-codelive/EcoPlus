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
            {/* Main Container with max-width and centered */}
            <div className="min-h-screen bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header - Sticky on scroll */}
                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
                        <div className="py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                                    Social Feed
                                </h1>
                                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                                    Share your eco-journey with the community
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEventModalOpen(true)}
                                    size="default"
                                    className="flex-1 sm:flex-none gap-2"
                                >
                                    <CalendarPlus size={18} />
                                    <span className="hidden sm:inline">Create Event</span>
                                    <span className="inline sm:hidden">Event</span>
                                </Button>
                                <Button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    size="default"
                                    className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                                >
                                    <Plus size={18} />
                                    <span className="hidden sm:inline">Create Post</span>
                                    <span className="inline sm:hidden">Post</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Feed Content */}
                    <div className="py-6 sm:py-8">
                        <Feed refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            </div>

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
        </AppLayout>
    );
};

export default SocialPage;
