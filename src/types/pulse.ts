// PULSE - Core Domain Types

export type PrimaryCategory = 'DINING' | 'MOVIES' | 'EVENTS' | 'ACTIVITIES' | 'NIGHTLIFE' | 'EXPERIENCES';

export type BottomTab = 'HOME' | 'EXPLORE' | 'BOOKINGS' | 'SAVED' | 'PROFILE';

export type QuickFilterId = 
  | 'NEAR_ME' 
  | 'TOP_RATED' 
  | 'TRENDING' 
  | 'NEW' 
  | 'UNDER_500' 
  | 'OFFERS' 
  | 'OPEN_NOW' 
  | 'OUTDOOR' 
  | 'PREMIUM';

export interface LocationItem {
  id: string;
  name: string;
  city: string;
  state: string;
  popularSpots: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  distanceKm: number;
  priceForTwo: number;
  area: string;
  isTableAvailable: boolean;
  tableWaitMinutes?: number;
  featuredOffer?: string;
  imageUrl: string;
  galleryUrls: string[];
  popularDishes: { name: string; price: number; isVeg: boolean; tag?: string }[];
  about: string;
  address: string;
  phone: string;
  isOpen: boolean;
  timings: string;
  facilities: string[];
  sectionTag: 'POPULAR' | 'DATE_NIGHT' | 'NEW' | 'HIDDEN_GEM' | 'TRENDING';
}

export interface Showtime {
  id: string;
  time: string;
  format: '2D' | '3D' | 'IMAX' | '4DX';
  language: string;
  price: number;
  screenName: string;
  availability: 'FAST_FILLING' | 'AVAILABLE' | 'ALMOST_FULL';
}

export interface Cinema {
  id: string;
  name: string;
  chain: string;
  distanceKm: number;
  area: string;
  formats: ('2D' | '3D' | 'IMAX' | '4DX')[];
  showtimes: Showtime[];
}

export interface Movie {
  id: string;
  title: string;
  genre: string[];
  language: string;
  certification: 'U' | 'UA 13+' | 'UA 16+' | 'A';
  rating: number; // e.g. 9.1
  votesCount: string;
  runtime: string; // e.g. "2h 46m"
  releaseDate: string;
  posterUrl: string;
  backdropUrl: string;
  synopsis: string;
  cast: { name: string; role: string }[];
  crew: { director: string; composer?: string };
  status: 'NOW_SHOWING' | 'COMING_SOON' | 'TRENDING';
  cinemas: Cinema[];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  tier: 'REGULAR' | 'PREMIUM' | 'RECLINER';
  price: number;
  status: 'AVAILABLE' | 'SELECTED' | 'SOLD';
}

export interface EventItem {
  id: string;
  title: string;
  category: 'MUSIC' | 'COMEDY' | 'SPORTS' | 'WORKSHOPS' | 'PARTIES' | 'EXPERIENCES';
  dateBadge: string; // e.g. "SAT, 12 OCT"
  fullDateTime: string;
  venue: string;
  address: string;
  distanceKm: number;
  priceStarting: number;
  interestedCount: number;
  artworkUrl: string;
  artists: { name: string; role: string; avatarUrl?: string }[];
  schedule: { time: string; activity: string }[];
  about: string;
  terms: string[];
  isWeekendHighlight?: boolean;
  isTrending?: boolean;
}

export interface ExperienceItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  rating: number;
  reviewsCount: number;
  pricePerPerson: number;
  area: string;
  imageUrl: string;
  perks: string[];
}

export interface Booking {
  id: string;
  type: 'RESTAURANT' | 'MOVIE' | 'EVENT';
  title: string;
  venue: string;
  date: string;
  time: string;
  status: 'UPCOMING' | 'PAST' | 'CANCELLED';
  details: string; // e.g. "Table for 2 Guests" or "Seats: E4, E5 (IMAX 3D)"
  bookingCode: string;
  qrCodeUrl: string;
  totalAmount: number;
  imageUrl: string;
  createdAt: string;
}

export interface SavedCollection {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemIds: string[];
}

export interface OfferItem {
  id: string;
  code: string;
  title: string;
  discountText: string;
  category: 'FOR_YOU' | 'DINING' | 'MOVIES' | 'EVENTS' | 'BANK';
  bankOrProvider?: string;
  minOrder?: number;
  maxDiscount?: number;
  description: string;
  validTill: string;
}
