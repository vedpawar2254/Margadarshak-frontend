import EventsClient from './EventsClient';

export const metadata = {
    title: 'Events & Workshops | Margdarshak',
    description: 'Upcoming events, workshops, and seminars at Margdarshak. Join us to learn, network, and grow.',
};

export default function EventsPage() {
    return <EventsClient />;
}
