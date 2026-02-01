import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { API_BASE } from "@/lib/api";

export interface Event {
    _id: string;
    name: string;
    date: string;
    time: string;
    location: string;
    requiredVolunteers: number;
    creator: {
        _id: string;
        fullName: string;
        avatar?: string;
    };
    volunteers: {
        _id: string;
        fullName: string;
        avatar?: string;
    }[];
}

interface EventCardProps {
    event: Event;
    currentUserId?: string;
    onJoin: (eventId: string) => void;
    isJoining?: boolean;
}

export function EventCard({ event, currentUserId, onJoin, isJoining }: EventCardProps) {
    // Add null safety checks
    const volunteers = event.volunteers || [];
    const creator = event.creator || { _id: '', fullName: 'Unknown' };

    const isVolunteered = volunteers.some(v => v?._id === currentUserId);
    const isCreator = creator._id === currentUserId;
    const isFull = volunteers.length >= event.requiredVolunteers;

    const handleJoin = () => {
        if (!isVolunteered && !isCreator && !isFull) {
            onJoin(event._id);
        }
    };

    const [showVolunteers, setShowVolunteers] = useState(false);

    return (
        <>
            <Card className="w-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold text-foreground">{event.name}</CardTitle>
                        {isCreator && <Badge variant="secondary">Host</Badge>}
                        {isVolunteered && <Badge variant="default" className="bg-green-600">Joined</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">Hosted by {creator.fullName}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar size={16} />
                            <span>{format(new Date(event.date), "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock size={16} />
                            <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin size={16} />
                            <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users size={16} />
                            <span>{volunteers.length} / {event.requiredVolunteers} Volunteers</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    {isCreator ? (
                        <Button className="w-full" variant="outline" onClick={() => setShowVolunteers(true)}>
                            Manage Event
                        </Button>
                    ) : (
                        <Button
                            className="w-full"
                            onClick={handleJoin}
                            disabled={isVolunteered || isFull || isJoining}
                            variant={isVolunteered ? "outline" : "default"}
                        >
                            {isVolunteered ? "Already Joined" :
                                isFull ? "Event Full" :
                                    isJoining ? "Joining..." : "Join as Volunteer"}
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <Dialog open={showVolunteers} onOpenChange={setShowVolunteers}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Volunteers for {event.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {volunteers.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">No volunteers yet.</p>
                        ) : (
                            volunteers.map(volunteer => (
                                <div key={volunteer._id} className="flex items-center gap-3 p-2 rounded-lg border">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {volunteer.avatar ? (
                                            <img src={`${API_BASE}${volunteer.avatar}`} alt={volunteer.fullName} className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            volunteer.fullName.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium">{volunteer.fullName}</div>
                                        <div className="text-xs text-muted-foreground">Volunteer</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
