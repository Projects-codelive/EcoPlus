import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { EventCard, Event } from "@/components/events/EventCard";
import { EventForm } from "@/components/events/EventForm";
import { NotificationList, Notification } from "@/components/notifications/NotificationList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, Plus } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import axios from "axios";

export default function EventsPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/events`);
            setEvents(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load events");
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/notifications`, {
                withCredentials: true
            });
            setNotifications(res.data);
            setUnreadCount(res.data.filter((n: Notification) => !n.read).length);
        } catch (error) {
            console.error(error);
        }
    };

    const markNotificationsRead = async () => {
        if (unreadCount === 0) return;
        try {
            await axios.put(`${API_BASE}/api/notifications/read-all`, {}, {
                withCredentials: true
            });
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEvents();
        if (user) {
            fetchNotifications();
        }

        // Auto-refresh events every 30 seconds
        const eventInterval = setInterval(() => {
            fetchEvents();
        }, 30000);

        // Auto-refresh notifications every 60 seconds if user is logged in
        const notificationInterval = user ? setInterval(() => {
            fetchNotifications();
        }, 60000) : null;

        return () => {
            clearInterval(eventInterval);
            if (notificationInterval) clearInterval(notificationInterval);
        };
    }, [user]);

    const handleCreateEvent = async (values: any) => {
        setIsLoading(true);
        try {
            await axios.post(`${API_BASE}/api/events/create`, values, {
                withCredentials: true
            });
            toast.success("Event created successfully!");
            setIsOpen(false);
            fetchEvents();
        } catch (error) {
            toast.error("Failed to create event");
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinEvent = async (eventId: string) => {
        if (!user) {
            toast.error("Please login to join events");
            return;
        }
        try {
            await axios.post(`${API_BASE}/api/events/${eventId}/join`, {}, {
                withCredentials: true
            });
            toast.success("Joined event successfully!");
            fetchEvents();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to join event");
        }
    };

    return (
        <AppLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Community Events</h1>
                        <p className="text-muted-foreground mt-1">Join local eco-initiatives or start your own.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Popover onOpenChange={(open) => { if (open) markNotificationsRead(); }}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="relative">
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-80 p-0">
                                <div className="p-3 border-b font-semibold">Notifications</div>
                                <NotificationList notifications={notifications} />
                            </PopoverContent>
                        </Popover>

                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus size={18} /> Create Event
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Event</DialogTitle>
                                </DialogHeader>
                                <EventForm onSubmit={handleCreateEvent} isLoading={isLoading} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <EventCard
                            key={event._id}
                            event={event}
                            currentUserId={user?.id}
                            onJoin={handleJoinEvent}
                            isJoining={false}
                        />
                    ))}
                    {events.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No upcoming events found. Be the first to start one!
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
