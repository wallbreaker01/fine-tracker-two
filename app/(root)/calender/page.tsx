'use client';

import { useEffect, useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface Fine {
  id: number;
  reason: string;
  date: string;
  amount: number;
  user: {
    id: number;
    name: string;
    image: string | null;
    initials: string;
  };
}

interface CalendarEvent {
  title: string;
  date: string;
}

export default function CalenderPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const response = await fetch('/api/fines');
        const result = await response.json();
        
        if (result.success && result.data) {
          const calendarEvents = result.data.map((fine: Fine) => ({
            title: `${fine.reason}: ${fine.user.name}`,
            date: fine.date,
          }));
          setEvents(calendarEvents);
        }
      } catch (error) {
        console.error('Failed to fetch fines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFines();
  }, []);

  return (
    <div className="p-6 min-h-screen text-zinc-500 rounded-lg">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        dayHeaderFormat={{weekday:"short"}}
        events={events}
        height="auto"
      />
    </div>
  )
}