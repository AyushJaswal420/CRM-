import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CalendarCheck, ChevronLeft, ChevronRight, Phone, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Calendar() {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);

    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/calendar?month=${month}&year=${year}`, { withCredentials: true });
            setEvents(res.data);
        } catch (e) {
            console.error('Failed to load calendar events');
        }
        setLoading(false);
    }, [month, year]);

    useEffect(() => { fetchEvents(); }, [fetchEvents]);

    const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    const goToday = () => setCurrentDate(new Date());

    // Build calendar grid
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    const isToday = (d) => today.getDate() === d && today.getMonth() === month - 1 && today.getFullYear() === year;

    // Group events by day
    const eventsByDay = {};
    events.forEach(ev => {
        const ed = ev.eventDate;
        if (!ed) return;
        const d = new Date(ed);
        if (d.getMonth() + 1 === month && d.getFullYear() === year) {
            const day = d.getDate();
            if (!eventsByDay[day]) eventsByDay[day] = [];
            eventsByDay[day].push(ev);
        }
    });

    const selectedEvents = selectedDay ? (eventsByDay[selectedDay] || []) : [];

    return (
        <div className="max-w-5xl mx-auto py-6 px-4" data-testid="calendar-page">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <CalendarCheck size={22} className="text-[#E8536A]" />
                    <h1 className="text-xl font-heading font-semibold text-gray-900">Meetings Calendar</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={prevMonth} className="h-8 w-8 p-0 rounded-[8px]" data-testid="cal-prev">
                        <ChevronLeft size={16} />
                    </Button>
                    <button onClick={goToday} className="text-[13px] font-semibold text-gray-800 px-3 py-1 rounded-[8px] hover:bg-gray-50" data-testid="cal-month-label">
                        {MONTHS[month - 1]} {year}
                    </button>
                    <Button variant="outline" size="sm" onClick={nextMonth} className="h-8 w-8 p-0 rounded-[8px]" data-testid="cal-next">
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
                {/* Calendar Grid */}
                <div className="bg-white border border-gray-100 rounded-[12px] overflow-hidden">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 border-b border-gray-100">
                        {DAYS.map(d => (
                            <div key={d} className="text-center py-2 text-[10px] font-bold text-gray-500 uppercase">{d}</div>
                        ))}
                    </div>
                    {/* Day cells */}
                    <div className="grid grid-cols-7">
                        {Array.from({ length: firstDay }, (_, i) => (
                            <div key={`empty-${i}`} className="h-[80px] border-b border-r border-gray-50 bg-gray-50/30" />
                        ))}
                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const dayEvents = eventsByDay[day] || [];
                            const isSelected = selectedDay === day;
                            const followups = dayEvents.filter(e => e.eventType === 'followup').length;
                            const meetings = dayEvents.filter(e => e.eventType === 'meeting').length;
                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(isSelected ? null : day)}
                                    data-testid={`cal-day-${day}`}
                                    className={`h-[80px] border-b border-r border-gray-50 p-1 text-left transition-colors relative ${
                                        isSelected ? 'bg-[#FFF5F5] ring-1 ring-[#E8536A]' :
                                        dayEvents.length > 0 ? 'hover:bg-blue-50/30 cursor-pointer' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <span className={`text-[11px] font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                        isToday(day) ? 'bg-[#E8536A] text-white' : 'text-gray-700'
                                    }`}>
                                        {day}
                                    </span>
                                    {dayEvents.length > 0 && (
                                        <div className="mt-0.5 space-y-0.5">
                                            {followups > 0 && (
                                                <div className="text-[8px] bg-blue-100 text-blue-700 rounded px-1 py-0.5 truncate">
                                                    {followups} follow-up{followups > 1 ? 's' : ''}
                                                </div>
                                            )}
                                            {meetings > 0 && (
                                                <div className="text-[8px] bg-green-100 text-green-700 rounded px-1 py-0.5 truncate">
                                                    {meetings} meeting{meetings > 1 ? 's' : ''}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Side panel */}
                <div className="bg-white border border-gray-100 rounded-[12px] p-3">
                    <h2 className="text-[12px] font-bold text-gray-700 mb-3">
                        {selectedDay
                            ? `${MONTHS[month - 1]} ${selectedDay}, ${year}`
                            : 'Select a day'
                        }
                    </h2>
                    {loading ? (
                        <p className="text-[11px] text-gray-400 py-4 text-center">Loading...</p>
                    ) : !selectedDay ? (
                        <p className="text-[11px] text-gray-400 py-4 text-center">Click on a date to see events</p>
                    ) : selectedEvents.length === 0 ? (
                        <p className="text-[11px] text-gray-400 py-4 text-center">No events on this day</p>
                    ) : (
                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {selectedEvents.map(ev => (
                                <button
                                    key={ev.id}
                                    onClick={() => navigate(`/leads/${ev.id}`)}
                                    className="w-full text-left p-2 rounded-[8px] border border-gray-100 hover:border-[#E8536A]/30 hover:bg-[#FFF5F5]/50 transition-colors"
                                    data-testid={`cal-event-${ev.id}`}
                                >
                                    <p className="text-[12px] font-semibold text-gray-800 truncate">{ev.companyName || 'Unnamed'}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                                            ev.eventType === 'meeting' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {ev.eventType === 'meeting' ? 'Meeting' : 'Follow-up'}
                                        </span>
                                        {ev.phone && (
                                            <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                                                <Phone size={9} /> {ev.phone}
                                            </span>
                                        )}
                                    </div>
                                    {ev.city && (
                                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-0.5">
                                            <MapPin size={9} /> {ev.city}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Legend */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-[9px] font-bold text-gray-500 uppercase mb-2">Legend</p>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
                                <span className="text-[10px] text-gray-600">Follow-up scheduled</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-green-100 border border-green-200" />
                                <span className="text-[10px] text-gray-600">Meeting</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
