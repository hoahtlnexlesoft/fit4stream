export type EventStatus = 'live' | 'upcoming' | 'ended';
export type EventItem = {
  id: string;
  title: string;
  image: string;
  organizer: string;
  organizerAvatar?: string;
  category: string;
  status: EventStatus;
  /** "09:43" */
  start: string;
  /** "12:00" */
  end: string;
  dateLabel: string;
  price?: string;
  watching?: string;
  registered?: boolean;
};
