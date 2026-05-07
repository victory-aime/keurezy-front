import { useEffect, useState, useCallback } from 'react';
import { ENUM } from '_types/*';

export type AppointmentStatus = ENUM.COMMON.Status;
export type AppointmentPriority = 'low' | 'normal' | 'high';

export interface Appointment {
  id: string;
  title: string;
  propertyId?: string;
  clientName: string;
  agentName: string;
  start: string; // ISO
  end: string; // ISO
  notes?: string;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  reminder?: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'rentflow.appointments';
const EVT = 'appointments:updated';

function read(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as Appointment[];
  } catch {
    return [];
  }
}

function write(items: Appointment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVT));
}

function seed(): Appointment[] {
  const today = new Date();
  const mk = (
    offsetDays: number,
    h: number,
    dur: number,
    partial: Partial<Appointment>,
  ): Appointment => {
    const s = new Date(today);
    s.setDate(s.getDate() + offsetDays);
    s.setHours(h, 0, 0, 0);
    const e = new Date(s);
    e.setHours(s.getHours() + dur);
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      title: 'Visite',
      clientName: '—',
      agentName: '—',
      start: s.toISOString(),
      end: e.toISOString(),
      status: ENUM.COMMON.Status.PLANNED,
      priority: 'normal',
      reminder: true,
      createdAt: now,
      updatedAt: now,
      ...partial,
    };
  };
  const list = [
    mk(0, 10, 1, {
      title: 'Visite — Studio Marais',
      clientName: 'Sophie Martin',
      agentName: 'Karim B.',
      status: ENUM.COMMON.Status.CONFIRMED,
    }),
    mk(0, 14, 1, {
      title: 'Visite — Loft Bastille',
      clientName: 'Paul Durand',
      agentName: 'Léa M.',
      status: ENUM.COMMON.Status.PLANNED,
    }),
    mk(1, 11, 2, {
      title: 'Visite — Penthouse La Défense',
      clientName: 'Anna Leroy',
      agentName: 'Karim B.',
      status: ENUM.COMMON.Status.CONFIRMED,
      priority: 'high',
    }),
    mk(2, 9, 1, {
      title: 'Visite — Maison Neuilly',
      clientName: 'Marc P.',
      agentName: 'Yacine R.',
      status: ENUM.COMMON.Status.PLANNED,
    }),
    mk(-1, 15, 1, {
      title: 'Visite — Appartement T3',
      clientName: 'Julie F.',
      agentName: 'Léa M.',
      status: ENUM.COMMON.Status.DONE,
    }),
    mk(3, 16, 1, {
      title: 'Visite — Studio République',
      clientName: 'Hugo D.',
      agentName: 'Karim B.',
      status: ENUM.COMMON.Status.CANCELLED,
    }),
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(() => read());

  useEffect(() => {
    const sync = () => setAppointments(read());
    window.addEventListener(EVT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const createAppointment = useCallback(
    (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const item: Appointment = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      write([item, ...read()]);
      return item;
    },
    [],
  );

  const updateAppointment = useCallback(
    (id: string, patch: Partial<Omit<Appointment, 'id' | 'createdAt'>>) => {
      write(
        read().map((a) =>
          a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a,
        ),
      );
    },
    [],
  );

  const deleteAppointment = useCallback((id: string) => {
    write(read().filter((a) => a.id !== id));
  }, []);

  const duplicateAppointment = useCallback((id: string) => {
    const a = read().find((x) => x.id === id);
    if (!a) return;
    const now = new Date().toISOString();
    write([
      {
        ...a,
        id: crypto.randomUUID(),
        title: `${a.title} (copie)`,
        createdAt: now,
        updatedAt: now,
      },
      ...read(),
    ]);
  }, []);

  return {
    appointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    duplicateAppointment,
  };
}
// ---------------------------------------------------------------------------
// CalendarGrid — public API
// ---------------------------------------------------------------------------
export type CalendarView = 'day' | 'week' | 'month' | 'agenda';
