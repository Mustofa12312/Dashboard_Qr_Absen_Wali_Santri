"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type EventContextType = {
    activeEvent: string;
    setEvent: (name: string) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
    // Default ke "Wisuda Santri" jika belum ada di localStorage
    const [activeEvent, setActiveEvent] = useState("Wisuda Santri");
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Load dari localStorage saat mount
        const saved = localStorage.getItem("active_event");
        if (saved) {
            setActiveEvent(saved);
        }
        setIsInitialized(true);
    }, []);

    const setEvent = (name: string) => {
        setActiveEvent(name);
        localStorage.setItem("active_event", name);
    };

    if (!isInitialized) {
        return null; // Mencegah hydration mismatch atau flash content
    }

    return (
        <EventContext.Provider value={{ activeEvent, setEvent }}>
            {children}
        </EventContext.Provider>
    );
}

export function useEvent() {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error("useEvent must be used within an EventProvider");
    }
    return context;
}
