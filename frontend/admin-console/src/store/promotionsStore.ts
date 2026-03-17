import { create } from 'zustand';
import { Promotion } from '@/types';
import { mockPromotions } from '@/lib/mockData';

interface PromotionsState {
  promotions: Promotion[];
  isLoading: boolean;
  showModal: boolean;
  editingPromotion: Promotion | null;
  setShowModal: (show: boolean, promo?: Promotion | null) => void;
  toggleStatus: (id: string) => void;
}

export const usePromotionsStore = create<PromotionsState>((set) => ({
  promotions: mockPromotions,
  isLoading: false,
  showModal: false,
  editingPromotion: null,
  setShowModal: (show, promo = null) => set({ showModal: show, editingPromotion: promo }),
  toggleStatus: (id) => set(state => ({
    promotions: state.promotions.map(p =>
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' as const : 'active' as const } : p
    ),
  })),
}));
