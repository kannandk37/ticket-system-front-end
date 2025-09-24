import type { DateTime } from "luxon";

export class Ticket {
    id?: string;
    title?: string;
    description?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    createdAt?: DateTime;
    updatedAt?: DateTime;
}

export enum TicketStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    CLOSED = 'closed',
}

export enum TicketPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}
