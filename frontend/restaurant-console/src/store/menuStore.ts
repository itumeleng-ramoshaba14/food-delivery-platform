import { create } from 'zustand';
import { MenuItem, MenuCategory } from '@/types';
import { mockMenuItems, mockCategories } from '@/lib/mockData';

interface MenuState {
  items: MenuItem[];
  categories: MenuCategory[];
  selectedCategory: string | null;
  editingItem: MenuItem | null;
  editingCategory: MenuCategory | null;
  isItemModalOpen: boolean;
  isCategoryModalOpen: boolean;
  setSelectedCategory: (id: string | null) => void;
  toggleAvailability: (itemId: string) => void;
  addItem: (item: MenuItem) => void;
  updateItem: (item: MenuItem) => void;
  deleteItem: (itemId: string) => void;
  addCategory: (category: MenuCategory) => void;
  updateCategory: (category: MenuCategory) => void;
  openItemModal: (item?: MenuItem) => void;
  closeItemModal: () => void;
  openCategoryModal: (category?: MenuCategory) => void;
  closeCategoryModal: () => void;
  getItemsByCategory: (categoryId: string) => MenuItem[];
}

export const useMenuStore = create<MenuState>((set, get) => ({
  items: mockMenuItems,
  categories: mockCategories,
  selectedCategory: null,
  editingItem: null,
  editingCategory: null,
  isItemModalOpen: false,
  isCategoryModalOpen: false,

  setSelectedCategory: (id) => set({ selectedCategory: id }),

  toggleAvailability: (itemId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      ),
    })),

  addItem: (item) => set((state) => ({ items: [...state.items, item] })),

  updateItem: (updatedItem) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    })),

  deleteItem: (itemId) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== itemId) })),

  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),

  updateCategory: (updatedCategory) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)),
    })),

  openItemModal: (item) =>
    set({ editingItem: item || null, isItemModalOpen: true }),

  closeItemModal: () =>
    set({ editingItem: null, isItemModalOpen: false }),

  openCategoryModal: (category) =>
    set({ editingCategory: category || null, isCategoryModalOpen: true }),

  closeCategoryModal: () =>
    set({ editingCategory: null, isCategoryModalOpen: false }),

  getItemsByCategory: (categoryId) =>
    get().items.filter((item) => item.categoryId === categoryId),
}));
