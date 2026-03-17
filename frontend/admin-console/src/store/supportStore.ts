import { create } from 'zustand';
import { SupportTicket, TicketStatus, TicketPriority } from '@/types';
import { mockSupportTickets } from '@/lib/mockData';

interface SupportState {
  tickets: SupportTicket[];
  statusFilter: TicketStatus | 'all';
  priorityFilter: TicketPriority | 'all';
  searchQuery: string;
  isLoading: boolean;
  setStatusFilter: (s: TicketStatus | 'all') => void;
  setPriorityFilter: (p: TicketPriority | 'all') => void;
  setSearchQuery: (q: string) => void;
  getFiltered: () => SupportTicket[];
  resolveTicket: (id: string) => void;
  closeTicket: (id: string) => void;
  assignTicket: (id: string, adminId: string, adminName: string) => void;
}

export const useSupportStore = create<SupportState>((set, get) => ({
  tickets: mockSupportTickets,
  statusFilter: 'all',
  priorityFilter: 'all',
  searchQuery: '',
  isLoading: false,
  setStatusFilter: (s) => set({ statusFilter: s }),
  setPriorityFilter: (p) => set({ priorityFilter: p }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  getFiltered: () => {
    const { tickets, statusFilter, priorityFilter, searchQuery } = get();
    let filtered = [...tickets];
    if (statusFilter !== 'all') filtered = filtered.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'all') filtered = filtered.filter(t => t.priority === priorityFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.userName.toLowerCase().includes(q));
    }
    return filtered;
  },
  resolveTicket: (id) => set(state => ({
    tickets: state.tickets.map(t => t.id === id ? { ...t, status: 'resolved' as const } : t),
  })),
  closeTicket: (id) => set(state => ({
    tickets: state.tickets.map(t => t.id === id ? { ...t, status: 'closed' as const } : t),
  })),
  assignTicket: (id, adminId, adminName) => set(state => ({
    tickets: state.tickets.map(t => t.id === id ? { ...t, assignedTo: adminId, assignedToName: adminName } : t),
  })),
}));
