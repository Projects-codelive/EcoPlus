import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export interface Notification {
    _id: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

interface NotificationListProps {
    notifications: Notification[];
}

export function NotificationList({ notifications }: NotificationListProps) {
    if (notifications.length === 0) {
        return (
            <div className="text-center p-4 text-muted-foreground flex flex-col items-center">
                <Bell className="h-8 w-8 mb-2 opacity-20" />
                <p>No new notifications</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification._id}
                        className={`p-3 rounded-lg border text-sm ${notification.read ? 'bg-background' : 'bg-muted/50 border-accent/20'}`}
                    >
                        <p className="text-foreground font-medium">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
