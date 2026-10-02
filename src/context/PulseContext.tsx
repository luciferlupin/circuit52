import React, { createContext, useContext, useState, useMemo } from 'react';
import type {
  PrimaryCategory,
  BottomTab,
  QuickFilterId,
  LocationItem,
  Restaurant,
  Movie,
  Cinema,
  Showtime,
  Seat,
  EventItem,
  ExperienceItem,
  Booking,
  SavedCollection,
  OfferItem
} from '../types/pulse';
import {
  LOCATIONS,
  RESTAURANTS_DATA,
  MOVIES_DATA,
  EVENTS_DATA,
  EXPERIENCES_DATA,
  INITIAL_BOOKINGS,
  SAVED_COLLECTIONS,
  OFFERS_DATA
} from '../data/pulseData';

interface CheckoutItemDetails {
  type: 'RESTAURANT' | 'MOVIE' | 'EVENT';
  title: string;
  venue: string;
  date: string;
  time: string;
  details: string;
  subtotal: number;
  convenienceFee: number;
  tax: number;
  imageUrl: string;
}

interface FilterState {
  maxDistanceKm: number;
  minRating: number;
  priceLevel: number[]; // 1 = under 1000, 2 = 1000-2000, 3 = 2000+
  pureVeg: boolean;
  outdoorSeating: boolean;
  openNow: boolean;
  hasOffers: boolean;
}

interface PulseContextType {
  // Navigation & Shell
  activeTab: BottomTab;
  setActiveTab: (tab: BottomTab) => void;
  activeCategory: PrimaryCategory;
  setActiveCategory: (cat: PrimaryCategory) => void;
  activeFilterChip: QuickFilterId;
  setActiveFilterChip: (chip: QuickFilterId) => void;
  isPhoneFrameMode: boolean;
  setIsPhoneFrameMode: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Location
  currentLocation: LocationItem;
  setCurrentLocation: (loc: LocationItem) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
  resetFilters: () => void;

  // Data Collections
  restaurants: Restaurant[];
  movies: Movie[];
  events: EventItem[];
  experiences: ExperienceItem[];
  bookings: Booking[];
  savedCollections: SavedCollection[];
  savedItemIds: string[];
  toggleSaveItem: (id: string) => void;
  offers: OfferItem[];

  // Detail Sheets
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (r: Restaurant | null) => void;
  selectedMovie: Movie | null;
  setSelectedMovie: (m: Movie | null) => void;
  selectedEvent: EventItem | null;
  setSelectedEvent: (e: EventItem | null) => void;

  // Table Reservation Flow
  isTableSheetOpen: boolean;
  setIsTableSheetOpen: (open: boolean) => void;
  tableGuests: number;
  setTableGuests: (g: number) => void;
  tableDate: string;
  setTableDate: (d: string) => void;
  tableTime: string;
  setTableTime: (t: string) => void;
  confirmTableBooking: (restaurant: Restaurant, offerCode?: string) => void;

  // Movie Booking & Seat Selection Flow
  isSeatSheetOpen: boolean;
  setIsSeatSheetOpen: (open: boolean) => void;
  activeCinema: Cinema | null;
  activeShowtime: Showtime | null;
  openSeatSelector: (movie: Movie, cinema: Cinema, showtime: Showtime) => void;
  selectedSeats: Seat[];
  toggleSeat: (seat: Seat) => void;
  confirmMovieSeatsBooking: () => void;

  // Event Booking Flow
  bookEventTicket: (event: EventItem, quantity?: number) => void;

  // Checkout Flow
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutItem: CheckoutItemDetails | null;
  appliedCoupon: OfferItem | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  selectedPaymentMethod: 'UPI' | 'CARD' | 'WALLET' | 'NETBANKING';
  setSelectedPaymentMethod: (m: 'UPI' | 'CARD' | 'WALLET' | 'NETBANKING') => void;
  processPayment: () => void;

  // Digital Ticket Modal
  activeTicket: Booking | null;
  setActiveTicket: (b: Booking | null) => void;

  // Booking Success Celebration
  latestSuccessBooking: Booking | null;
  clearSuccess: () => void;

  // Cancel Booking
  cancelBooking: (bookingId: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  maxDistanceKm: 10,
  minRating: 4.0,
  priceLevel: [1, 2, 3],
  pureVeg: false,
  outdoorSeating: false,
  openNow: false,
  hasOffers: false
};

const PulseContext = createContext<PulseContextType | null>(null);

export const PulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<BottomTab>('HOME');
  const [activeCategory, setActiveCategory] = useState<PrimaryCategory>('DINING');
  const [activeFilterChip, setActiveFilterChip] = useState<QuickFilterId>('NEAR_ME');
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(true);

  // Location
  const [currentLocation, setCurrentLocation] = useState<LocationItem>(LOCATIONS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Bomba Pasta',
    'IMAX Laser',
    'Sunburn Arena',
    'Rooftop Lounge'
  ]);

  // Filters
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState<boolean>(false);

  // Core Data
  const [restaurants] = useState<Restaurant[]>(RESTAURANTS_DATA);
  const [movies] = useState<Movie[]>(MOVIES_DATA);
  const [events] = useState<EventItem[]>(EVENTS_DATA);
  const [experiences] = useState<ExperienceItem[]>(EXPERIENCES_DATA);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [savedCollections] = useState<SavedCollection[]>(SAVED_COLLECTIONS);
  const [savedItemIds, setSavedItemIds] = useState<string[]>(['rest-1', 'mov-1', 'evt-1']);
  const [offers] = useState<OfferItem[]>(OFFERS_DATA);

  // Detail States
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Table Booking
  const [isTableSheetOpen, setIsTableSheetOpen] = useState<boolean>(false);
  const [tableGuests, setTableGuests] = useState<number>(2);
  const [tableDate, setTableDate] = useState<string>('Tonight');
  const [tableTime, setTableTime] = useState<string>('8:30 PM');

  // Movie & Seats
  const [isSeatSheetOpen, setIsSeatSheetOpen] = useState<boolean>(false);
  const [activeCinema, setActiveCinema] = useState<Cinema | null>(null);
  const [activeShowtime, setActiveShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItemDetails | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<OfferItem | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI' | 'CARD' | 'WALLET' | 'NETBANKING'>('UPI');

  // Digital Ticket & Success
  const [activeTicket, setActiveTicket] = useState<Booking | null>(null);
  const [latestSuccessBooking, setLatestSuccessBooking] = useState<Booking | null>(null);

  const addRecentSearch = (q: string) => {
    if (!q.trim()) return;
    setRecentSearches(prev => [q, ...prev.filter(item => item.toLowerCase() !== q.toLowerCase())].slice(0, 8));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const toggleSaveItem = (id: string) => {
    setSavedItemIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Table reservation confirmation
  const confirmTableBooking = (restaurant: Restaurant, offerCode?: string) => {
    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      type: 'RESTAURANT',
      title: restaurant.name,
      venue: restaurant.area,
      date: tableDate,
      time: tableTime,
      status: 'UPCOMING',
      details: `Table for ${tableGuests} Guests • ${offerCode ? `Offer: ${offerCode}` : 'Instant Confirmation'}`,
      bookingCode: `PLS-${restaurant.name.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PLS-TABLE-${restaurant.id}`,
      totalAmount: 0,
      imageUrl: restaurant.imageUrl,
      createdAt: 'Just now'
    };

    setBookings(prev => [newBooking, ...prev]);
    setIsTableSheetOpen(false);
    setSelectedRestaurant(null);
    setLatestSuccessBooking(newBooking);
  };

  // Movie Seat selection opener
  const openSeatSelector = (movie: Movie, cinema: Cinema, showtime: Showtime) => {
    setSelectedMovie(movie);
    setActiveCinema(cinema);
    setActiveShowtime(showtime);
    setSelectedSeats([
      { id: 'F11', row: 'F', number: 11, tier: 'PREMIUM', price: showtime.price, status: 'SELECTED' },
      { id: 'F12', row: 'F', number: 12, tier: 'PREMIUM', price: showtime.price, status: 'SELECTED' }
    ]);
    setIsSeatSheetOpen(true);
  };

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'SOLD') return;
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seat.id);
      if (exists) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        if (prev.length >= 8) {
          alert('You can select a maximum of 8 seats per booking.');
          return prev;
        }
        return [...prev, { ...seat, status: 'SELECTED' }];
      }
    });
  };

  // Proceed from seat selector to checkout
  const confirmMovieSeatsBooking = () => {
    if (!selectedMovie || !activeCinema || !activeShowtime || selectedSeats.length === 0) return;
    const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
    const convenienceFee = Math.round(selectedSeats.length * 35.4);
    const tax = Math.round((subtotal + convenienceFee) * 0.05);

    setCheckoutItem({
      type: 'MOVIE',
      title: selectedMovie.title,
      venue: `${activeCinema.name} (${activeShowtime.format})`,
      date: 'Tomorrow, 03 Oct',
      time: activeShowtime.time,
      details: `${selectedSeats.length} Tickets • Seats: ${selectedSeats.map(s => s.id).join(', ')}`,
      subtotal,
      convenienceFee,
      tax,
      imageUrl: selectedMovie.posterUrl
    });

    setIsSeatSheetOpen(false);
    setIsCheckoutOpen(true);
  };

  // Event booking opener
  const bookEventTicket = (event: EventItem, quantity: number = 2) => {
    const subtotal = event.priceStarting * quantity;
    const convenienceFee = Math.round(subtotal * 0.06);
    const tax = Math.round((subtotal + convenienceFee) * 0.18);

    setCheckoutItem({
      type: 'EVENT',
      title: event.title,
      venue: event.venue,
      date: event.dateBadge,
      time: event.fullDateTime.split('•')[1] || '7:00 PM',
      details: `${quantity} General Admission Passes`,
      subtotal,
      convenienceFee,
      tax,
      imageUrl: event.artworkUrl
    });

    setSelectedEvent(null);
    setIsCheckoutOpen(true);
  };

  // Apply Coupon
  const applyCoupon = (code: string): boolean => {
    const found = offers.find(o => o.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      setAppliedCoupon(found);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Complete Payment
  const processPayment = () => {
    if (!checkoutItem) return;

    let discount = 0;
    if (appliedCoupon) {
      discount = appliedCoupon.maxDiscount || 150;
    }

    const total = Math.max(0, checkoutItem.subtotal + checkoutItem.convenienceFee + checkoutItem.tax - discount);

    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      type: checkoutItem.type,
      title: checkoutItem.title,
      venue: checkoutItem.venue,
      date: checkoutItem.date,
      time: checkoutItem.time,
      status: 'UPCOMING',
      details: checkoutItem.details,
      bookingCode: `PLS-${checkoutItem.type.slice(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PLS-${checkoutItem.title.slice(0, 4)}`,
      totalAmount: total,
      imageUrl: checkoutItem.imageUrl,
      createdAt: 'Just now'
    };

    setBookings(prev => [newBooking, ...prev]);
    setIsCheckoutOpen(false);
    setCheckoutItem(null);
    setAppliedCoupon(null);
    setSelectedMovie(null);
    setSelectedEvent(null);
    setLatestSuccessBooking(newBooking);
  };

  const clearSuccess = () => {
    setLatestSuccessBooking(null);
  };

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'CANCELLED' } : b))
    );
  };

  const value = useMemo(() => ({
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    activeFilterChip,
    setActiveFilterChip,
    isPhoneFrameMode,
    setIsPhoneFrameMode,
    currentLocation,
    setCurrentLocation,
    isLocationModalOpen,
    setIsLocationModalOpen,
    searchQuery,
    setSearchQuery,
    isSearchModalOpen,
    setIsSearchModalOpen,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    filters,
    setFilters,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    resetFilters,
    restaurants,
    movies,
    events,
    experiences,
    bookings,
    savedCollections,
    savedItemIds,
    toggleSaveItem,
    offers,
    selectedRestaurant,
    setSelectedRestaurant,
    selectedMovie,
    setSelectedMovie,
    selectedEvent,
    setSelectedEvent,
    isTableSheetOpen,
    setIsTableSheetOpen,
    tableGuests,
    setTableGuests,
    tableDate,
    setTableDate,
    tableTime,
    setTableTime,
    confirmTableBooking,
    isSeatSheetOpen,
    setIsSeatSheetOpen,
    activeCinema,
    activeShowtime,
    openSeatSelector,
    selectedSeats,
    toggleSeat,
    confirmMovieSeatsBooking,
    bookEventTicket,
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutItem,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    processPayment,
    activeTicket,
    setActiveTicket,
    latestSuccessBooking,
    clearSuccess,
    cancelBooking
  }), [
    activeTab,
    activeCategory,
    activeFilterChip,
    isPhoneFrameMode,
    currentLocation,
    isLocationModalOpen,
    searchQuery,
    isSearchModalOpen,
    recentSearches,
    filters,
    isFilterSheetOpen,
    restaurants,
    movies,
    events,
    experiences,
    bookings,
    savedCollections,
    savedItemIds,
    offers,
    selectedRestaurant,
    selectedMovie,
    selectedEvent,
    isTableSheetOpen,
    tableGuests,
    tableDate,
    tableTime,
    isSeatSheetOpen,
    activeCinema,
    activeShowtime,
    selectedSeats,
    isCheckoutOpen,
    checkoutItem,
    appliedCoupon,
    selectedPaymentMethod,
    activeTicket,
    latestSuccessBooking
  ]);

  return <PulseContext.Provider value={value}>{children}</PulseContext.Provider>;
};

export const usePulse = (): PulseContextType => {
  const ctx = useContext(PulseContext);
  if (!ctx) throw new Error('usePulse must be used within PulseProvider');
  return ctx;
};
