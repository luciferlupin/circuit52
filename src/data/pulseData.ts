import type {
  LocationItem,
  Restaurant,
  Movie,
  EventItem,
  ExperienceItem,
  Booking,
  SavedCollection,
  OfferItem
} from '../types/pulse';

export const LOCATIONS: LocationItem[] = [
  {
    id: 'loc-1',
    name: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    popularSpots: ['100ft Road', '12th Main', 'Defence Colony', 'Koramangala']
  },
  {
    id: 'loc-2',
    name: 'Bandra West & BKC',
    city: 'Mumbai',
    state: 'Maharashtra',
    popularSpots: ['Pali Hill', 'Carter Road', 'Maker Maxity', 'Juhu']
  },
  {
    id: 'loc-3',
    name: 'CyberHub & Golf Course',
    city: 'Gurugram',
    state: 'Haryana',
    popularSpots: ['CyberHub', 'Horizon Centre', 'Sector 29', 'Golf Course Ext']
  },
  {
    id: 'loc-4',
    name: 'Connaught Place & Aerocity',
    city: 'New Delhi',
    state: 'Delhi NCR',
    popularSpots: ['Inner Circle', 'Worldmark Aerocity', 'Khan Market', 'Hauz Khas']
  }
];

export const HERO_CAROUSEL_ITEMS = [
  {
    id: 'hero-1',
    label: 'CURATED WEEKEND',
    headline: 'Your Weekend Starts Here',
    subtext: 'Discover 42 live gigs, rooftop jazz bars, and trending tableside omakase.',
    cta: 'Explore Weekend Guide',
    category: 'EVENTS' as const,
    imageUrl: '/images/pulse/concert_event.jpg'
  },
  {
    id: 'hero-2',
    label: 'DATE NIGHT SPECIAL',
    headline: 'Skyline Dining & Craft Cocktails',
    subtext: 'Reserve rooftop tables with sunset vistas and complimentary chef pairings.',
    cta: 'Book Intimate Tables',
    category: 'DINING' as const,
    imageUrl: '/images/pulse/rooftop_lounge.jpg'
  },
  {
    id: 'hero-3',
    label: 'CINEMATIC EVENT',
    headline: 'CHRONOS: The IMAX Experience',
    subtext: 'Advance bookings now open. Feel the bass in crystal-clear laser IMAX.',
    cta: 'Reserve Seats',
    category: 'MOVIES' as const,
    imageUrl: '/images/pulse/cinema_poster.jpg'
  },
  {
    id: 'hero-4',
    label: 'LIVE COMEDY',
    headline: 'Laugh Out Loud This Friday',
    subtext: 'Intimate comedy sessions featuring top touring headliners & craft brews.',
    cta: 'Get Tickets from ₹499',
    category: 'EVENTS' as const,
    imageUrl: '/images/pulse/standup_comedy.jpg'
  }
];

export const RESTAURANTS_DATA: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Bomba Dining Room',
    cuisine: ['Modern Italian', 'Artisanal Pasta', 'Wine Bar'],
    rating: 4.8,
    reviewCount: 1420,
    distanceKm: 1.8,
    priceForTwo: 1800,
    area: '100ft Road, Indiranagar',
    isTableAvailable: true,
    tableWaitMinutes: 0,
    featuredOffer: 'Flat 20% off with Pulse Pay',
    imageUrl: '/images/pulse/bistro_dining.jpg',
    galleryUrls: [
      '/images/pulse/bistro_dining.jpg',
      '/images/pulse/rooftop_lounge.jpg',
      '/images/pulse/artisanal_sushi.jpg'
    ],
    popularDishes: [
      { name: 'Truffle Tagliolini', price: 680, isVeg: true, tag: "Chef's Signature" },
      { name: 'Burrata di Puglia', price: 540, isVeg: true },
      { name: 'Wood-fired Pepperoni Pizza', price: 720, isVeg: false, tag: 'Bestseller' },
      { name: 'Smoked Tiramisu Al Forno', price: 420, isVeg: true }
    ],
    about: 'Bomba crafts hand-rolled pastas and heritage wood-fired pizzas paired with natural biodynamic wines in an intimate, modern velvet-accented setting overlooking the tree-lined avenues.',
    address: 'Plot 482, 100ft Road, Stage 2, Indiranagar, Bengaluru',
    phone: '+91 80 4965 2200',
    isOpen: true,
    timings: '12:00 PM – 11:30 PM',
    facilities: ['Valet Parking', 'Cocktail Bar', 'Outdoor Balcony', 'Air Conditioned', 'Live Jazz Fridays'],
    sectionTag: 'POPULAR'
  },
  {
    id: 'rest-2',
    name: 'Mizu Japanese Omakase',
    cuisine: ['Japanese', 'Sushi & Sashimi', 'Izakaya'],
    rating: 4.9,
    reviewCount: 980,
    distanceKm: 2.4,
    priceForTwo: 2600,
    area: '12th Main, Indiranagar',
    isTableAvailable: true,
    tableWaitMinutes: 10,
    featuredOffer: 'Complimentary Sake flight on tables of 4+',
    imageUrl: '/images/pulse/artisanal_sushi.jpg',
    galleryUrls: [
      '/images/pulse/artisanal_sushi.jpg',
      '/images/pulse/bistro_dining.jpg',
      '/images/pulse/rooftop_lounge.jpg'
    ],
    popularDishes: [
      { name: 'Truffle Salmon Nigiri (4 pcs)', price: 790, isVeg: false, tag: 'Must Try' },
      { name: 'Bluefin Tuna Otoro Tartare', price: 920, isVeg: false },
      { name: 'Avocado & Crispy Asparagus Roll', price: 580, isVeg: true },
      { name: 'Matcha Fondant Lava', price: 450, isVeg: true }
    ],
    about: 'Mizu brings the art of Tokyo counter-dining with fresh fish air-flown weekly from Toyosu Market, paired with rare artisanal sakes in a minimalist cedarwood space.',
    address: '777, 12th Main Rd, HAL 2nd Stage, Indiranagar',
    phone: '+91 80 4128 9090',
    isOpen: true,
    timings: '12:30 PM – 3:30 PM, 7:00 PM – 11:45 PM',
    facilities: ['Chef Counter', 'Private Dining Room', 'Valet Parking', 'Handcrafted Mocktails'],
    sectionTag: 'DATE_NIGHT'
  },
  {
    id: 'rest-3',
    name: 'Skyline Deck & Cocktail Bar',
    cuisine: ['Contemporary Global', 'Tapas', 'Mixology'],
    rating: 4.7,
    reviewCount: 2150,
    distanceKm: 3.2,
    priceForTwo: 2200,
    area: 'MG Road Rooftop',
    isTableAvailable: true,
    tableWaitMinutes: 15,
    featuredOffer: 'Happy Hour 1+1 on Craft Cocktails till 8 PM',
    imageUrl: '/images/pulse/rooftop_lounge.jpg',
    galleryUrls: [
      '/images/pulse/rooftop_lounge.jpg',
      '/images/pulse/bistro_dining.jpg',
      '/images/pulse/concert_event.jpg'
    ],
    popularDishes: [
      { name: 'Smoked Rosemary Mezcalita', price: 620, isVeg: true, tag: 'Award Winner' },
      { name: 'Wagyu Sliders (3 pcs)', price: 850, isVeg: false },
      { name: 'Truffle Edamame Dumplings', price: 490, isVeg: true },
      { name: 'Firecracker Prawn Skewers', price: 680, isVeg: false }
    ],
    about: 'Elevated 24 floors above the cityscape, Skyline Deck offers unobstructed panoramic skyline views, fire pits, curated deep house sets, and cutting-edge craft mixology.',
    address: '24th Floor, Barton Centre, MG Road, Bengaluru',
    phone: '+91 80 2558 7711',
    isOpen: true,
    timings: '4:00 PM – 1:00 AM',
    facilities: ['Rooftop Seating', 'Live DJ', 'Designated Smoking Area', 'Valet Parking'],
    sectionTag: 'TRENDING'
  },
  {
    id: 'rest-4',
    name: 'Olive & Coal Smokehouse',
    cuisine: ['Artisanal BBQ', 'Mediterranean', 'Craft Beers'],
    rating: 4.6,
    reviewCount: 840,
    distanceKm: 4.1,
    priceForTwo: 1600,
    area: 'Defence Colony',
    isTableAvailable: false,
    tableWaitMinutes: 30,
    featuredOffer: '15% instant cashback on Axis Cards',
    imageUrl: '/images/pulse/bistro_dining.jpg',
    galleryUrls: [
      '/images/pulse/bistro_dining.jpg',
      '/images/pulse/artisanal_sushi.jpg'
    ],
    popularDishes: [
      { name: 'Slow-Smoked Lamb Shanks', price: 950, isVeg: false, tag: 'Signature' },
      { name: 'Charred Halloumi Salad', price: 460, isVeg: true },
      { name: 'Craft IPA Pint', price: 380, isVeg: true }
    ],
    about: 'Rustic Mediterranean smokehouse combining slow hickory smoking techniques with coastal olive oil traditions and local microbrews.',
    address: '92, 6th Cross, Defence Colony, Indiranagar',
    phone: '+91 80 4390 1200',
    isOpen: true,
    timings: '12:00 PM – 11:00 PM',
    facilities: ['Pet Friendly', 'Craft Brewery on Tap', 'Outdoor Courtyard'],
    sectionTag: 'NEW'
  },
  {
    id: 'rest-5',
    name: 'Botanica Glasshouse Bistro',
    cuisine: ['Farm-to-Table', 'European', 'Organic Coffee'],
    rating: 4.7,
    reviewCount: 1120,
    distanceKm: 2.9,
    priceForTwo: 1400,
    area: 'Lavelle Road',
    isTableAvailable: true,
    tableWaitMinutes: 0,
    featuredOffer: 'Complimentary artisan dessert with 2 mains',
    imageUrl: '/images/pulse/rooftop_lounge.jpg',
    galleryUrls: [
      '/images/pulse/rooftop_lounge.jpg',
      '/images/pulse/bistro_dining.jpg'
    ],
    popularDishes: [
      { name: 'Wild Mushroom Risotto', price: 590, isVeg: true },
      { name: 'Burnt Butter Gnocchi', price: 540, isVeg: true, tag: 'Bestseller' },
      { name: 'Sea Salt Dark Chocolate Tart', price: 390, isVeg: true }
    ],
    about: 'Housed inside an architectural sunlit greenhouse surrounded by 200+ exotic plants, Botanica serves seasonal organic dishes harvested from local Karnataka farms.',
    address: '14, Lavelle Road, Shanthala Nagar, Ashok Nagar',
    phone: '+91 80 4112 3344',
    isOpen: true,
    timings: '9:00 AM – 10:30 PM',
    facilities: ['Outdoor Greenhouse', 'Breakfast Menu', 'Artisan Bakery', 'Free WiFi'],
    sectionTag: 'HIDDEN_GEM'
  }
];

export const MOVIES_DATA: Movie[] = [
  {
    id: 'mov-1',
    title: 'CHRONOS: Beyond The Edge',
    genre: ['Sci-Fi', 'Adventure', 'Mystery'],
    language: 'English (Original)',
    certification: 'UA 13+',
    rating: 9.1,
    votesCount: '48.2k',
    runtime: '2h 46m',
    releaseDate: 'Fri, 27 Sep 2024',
    posterUrl: '/images/pulse/cinema_poster.jpg',
    backdropUrl: '/images/pulse/cinema_poster.jpg',
    synopsis: 'When a mysterious cosmic monolith begins resonating with Earth’s quantum core, an elite expedition journeys across the event horizon to decipher an ancient message left before time itself began.',
    cast: [
      { name: 'Alexander Sterling', role: 'Commander David Vance' },
      { name: 'Maya Lin', role: 'Dr. Evelyn Cross' },
      { name: 'Marcus Brody', role: 'Chief Engineer Cole' }
    ],
    crew: {
      director: 'Denis Villeneuve',
      composer: 'Hans Zimmer'
    },
    status: 'NOW_SHOWING',
    cinemas: [
      {
        id: 'cin-1',
        name: 'PVR INOX: Nexus Koramangala',
        chain: 'PVR INOX',
        distanceKm: 2.1,
        area: 'Koramangala, Bengaluru',
        formats: ['IMAX', '4DX', '3D', '2D'],
        showtimes: [
          { id: 'st-1', time: '1:45 PM', format: 'IMAX', language: 'Eng', price: 450, screenName: 'IMAX Laser Screen 1', availability: 'FAST_FILLING' },
          { id: 'st-2', time: '5:15 PM', format: 'IMAX', language: 'Eng', price: 550, screenName: 'IMAX Laser Screen 1', availability: 'ALMOST_FULL' },
          { id: 'st-3', time: '8:45 PM', format: 'IMAX', language: 'Eng', price: 600, screenName: 'IMAX Laser Screen 1', availability: 'FAST_FILLING' },
          { id: 'st-4', time: '10:30 PM', format: '4DX', language: 'Eng', price: 500, screenName: '4DX Screen 4', availability: 'AVAILABLE' }
        ]
      },
      {
        id: 'cin-2',
        name: 'Cinepolis: 1MG Mall',
        chain: 'Cinepolis',
        distanceKm: 3.4,
        area: 'MG Road, Trinity Metro',
        formats: ['3D', '2D', '4DX'],
        showtimes: [
          { id: 'st-5', time: '3:00 PM', format: '3D', language: 'Eng', price: 320, screenName: 'VIP Atmos Screen 2', availability: 'AVAILABLE' },
          { id: 'st-6', time: '6:30 PM', format: '3D', language: 'Eng', price: 380, screenName: 'VIP Atmos Screen 2', availability: 'FAST_FILLING' },
          { id: 'st-7', time: '9:45 PM', format: '2D', language: 'Eng', price: 290, screenName: 'Audi 3', availability: 'AVAILABLE' }
        ]
      },
      {
        id: 'cin-3',
        name: 'INOX: Garuda Mall',
        chain: 'INOX',
        distanceKm: 4.0,
        area: 'Magrath Road, Ashok Nagar',
        formats: ['IMAX', '2D'],
        showtimes: [
          { id: 'st-8', time: '4:20 PM', format: 'IMAX', language: 'Eng', price: 480, screenName: 'IMAX Screen 1', availability: 'AVAILABLE' },
          { id: 'st-9', time: '7:45 PM', format: 'IMAX', language: 'Eng', price: 520, screenName: 'IMAX Screen 1', availability: 'FAST_FILLING' }
        ]
      }
    ]
  },
  {
    id: 'mov-2',
    title: 'Shadow Protocol: Redline',
    genre: ['Action', 'Thriller', 'Espionage'],
    language: 'Hindi & English',
    certification: 'UA 16+',
    rating: 8.7,
    votesCount: '32.1k',
    runtime: '2h 18m',
    releaseDate: 'Fri, 20 Sep 2024',
    posterUrl: '/images/pulse/concert_event.jpg',
    backdropUrl: '/images/pulse/concert_event.jpg',
    synopsis: 'A covert intelligence agent goes rogue after discovering that the black-ops unit he trusted has fabricated a synthetic geopolitical crisis to trigger global market collapses.',
    cast: [
      { name: 'Vikram Malhotra', role: 'Agent Kabir Roy' },
      { name: 'Sarah Deville', role: 'Director Hayes' }
    ],
    crew: {
      director: 'Chad Stahelski'
    },
    status: 'NOW_SHOWING',
    cinemas: [
      {
        id: 'cin-1',
        name: 'PVR INOX: Nexus Koramangala',
        chain: 'PVR INOX',
        distanceKm: 2.1,
        area: 'Koramangala',
        formats: ['4DX', '2D'],
        showtimes: [
          { id: 'st-10', time: '2:15 PM', format: '4DX', language: 'Hindi', price: 420, screenName: 'Screen 4', availability: 'AVAILABLE' },
          { id: 'st-11', time: '6:00 PM', format: '4DX', language: 'Hindi', price: 480, screenName: 'Screen 4', availability: 'FAST_FILLING' },
          { id: 'st-12', time: '9:30 PM', format: '2D', language: 'Hindi', price: 280, screenName: 'Screen 2', availability: 'AVAILABLE' }
        ]
      }
    ]
  },
  {
    id: 'mov-3',
    title: 'Solaris: Genesis Wave',
    genre: ['Animation', 'Fantasy', 'Sci-Fi'],
    language: 'Japanese & English',
    certification: 'U',
    rating: 9.3,
    votesCount: '19.4k',
    runtime: '1h 55m',
    releaseDate: 'Fri, 04 Oct 2024',
    posterUrl: '/images/pulse/rooftop_lounge.jpg',
    backdropUrl: '/images/pulse/rooftop_lounge.jpg',
    synopsis: 'A young meteorologist apprentice and an awakened celestial star spirit unite to restore the lost harmonic frequencies of the floating cloud sanctuaries.',
    cast: [
      { name: 'Kaito Shindo', role: 'Riku' },
      { name: 'Aoi Miyazaki', role: 'Lumina' }
    ],
    crew: {
      director: 'Makoto Shinkai'
    },
    status: 'TRENDING',
    cinemas: [
      {
        id: 'cin-2',
        name: 'Cinepolis: 1MG Mall',
        chain: 'Cinepolis',
        distanceKm: 3.4,
        area: 'MG Road',
        formats: ['IMAX', '2D'],
        showtimes: [
          { id: 'st-13', time: '4:00 PM', format: 'IMAX', language: 'Jap', price: 400, screenName: 'Screen 1', availability: 'FAST_FILLING' },
          { id: 'st-14', time: '7:15 PM', format: '2D', language: 'Eng', price: 300, screenName: 'Screen 3', availability: 'AVAILABLE' }
        ]
      }
    ]
  }
];

export const EVENTS_DATA: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Sunburn Arena: Cosmic Frequency',
    category: 'MUSIC',
    dateBadge: 'SAT, 12 OCT',
    fullDateTime: 'Saturday, 12 Oct 2024 • 5:00 PM Onwards',
    venue: 'Bhartiya Mall Arena, North Bengaluru',
    address: 'Thanisandra Main Rd, Kannuru, Bengaluru, Karnataka 560064',
    distanceKm: 8.5,
    priceStarting: 999,
    interestedCount: 14200,
    artworkUrl: '/images/pulse/concert_event.jpg',
    artists: [
      { name: 'Boris Brejcha', role: 'Headliner (High-Tech Minimal)' },
      { name: 'Anyma Visuals', role: 'Live AV Performance' },
      { name: 'Nora En Pure', role: 'Opening Deep House' }
    ],
    schedule: [
      { time: '5:00 PM', activity: 'Gates Open & Resident DJs' },
      { time: '6:30 PM', activity: 'Nora En Pure Sunset Session' },
      { time: '8:30 PM', activity: 'Anyma AV Holographic Showcase' },
      { time: '10:00 PM', activity: 'Boris Brejcha 2.5hr Extended Set' }
    ],
    about: 'The flagship electronic music spectacle returns with a 60-meter panoramic 4K LED stage, kinetic laser arrays, and world-renowned electronic titans for an unforgettable night.',
    terms: [
      'Age restriction: 18+ only with government-issued photo ID.',
      'Re-entry is not permitted under any circumstances.',
      'Outside food, beverages, and recording equipment are strictly prohibited.'
    ],
    isWeekendHighlight: true,
    isTrending: true
  },
  {
    id: 'evt-2',
    title: 'Stand-Up Spotlight: Almost Famous',
    category: 'COMEDY',
    dateBadge: 'FRI, 04 OCT',
    fullDateTime: 'Friday, 04 Oct 2024 • 8:00 PM – 9:45 PM',
    venue: 'The Underground Comedy Club',
    address: '42, Double Road, Indiranagar Stage 1, Bengaluru',
    distanceKm: 1.6,
    priceStarting: 499,
    interestedCount: 3100,
    artworkUrl: '/images/pulse/standup_comedy.jpg',
    artists: [
      { name: 'Kanan Gill', role: 'Headlining Standup' },
      { name: 'Urooj Ashfaq', role: 'Featured Comedian' },
      { name: 'Sonali Thakker', role: 'Host & MC' }
    ],
    schedule: [
      { time: '7:30 PM', activity: 'Seating & Craft Beer Service' },
      { time: '8:00 PM', activity: 'Opening Act' },
      { time: '8:45 PM', activity: 'Headliner Solo Hour' }
    ],
    about: 'An intimate 90-seater comedy room where top national comics test fresh tour material. Every ticket includes 1 complimentary craft brew or mocktail.',
    terms: [
      'Age limit: 16+ years.',
      'Strict no-recording policy inside the auditorium.',
      'Seating is on a first-come, first-served basis.'
    ],
    isWeekendHighlight: true
  },
  {
    id: 'evt-3',
    title: 'Electric Sundowner: Rooftop Sessions',
    category: 'PARTIES',
    dateBadge: 'SUN, 06 OCT',
    fullDateTime: 'Sunday, 06 Oct 2024 • 4:00 PM – 11:30 PM',
    venue: 'Highline Terrace & Lawn',
    address: 'Trinity Circle, MG Road, Bengaluru',
    distanceKm: 3.0,
    priceStarting: 799,
    interestedCount: 5800,
    artworkUrl: '/images/pulse/rooftop_lounge.jpg',
    artists: [
      { name: 'Madboy/Mink', role: 'Live Disco Funk' },
      { name: 'DJ SA', role: 'Afrobeats & Hip Hop' }
    ],
    schedule: [
      { time: '4:00 PM', activity: 'Sundowner Cocktails & Vinyl Sets' },
      { time: '6:30 PM', activity: 'Golden Hour Live Band' },
      { time: '9:00 PM', activity: 'Peak Rooftop Party' }
    ],
    about: 'Spend Sunday sunset dancing atop the city skyline with artisan cocktail stations, artisanal wood-fired snacks, and infectious disco-funk grooves.',
    terms: [
      'Strict dress code: Smart casuals / Chic eveningwear.',
      'Entry strictly by couple or mixed groups after 7:00 PM.'
    ],
    isTrending: true
  }
];

export const EXPERIENCES_DATA: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: 'Artisan Sourdough & Pizza Masterclass',
    category: 'Culinary Workshop',
    duration: '3 hours',
    rating: 4.9,
    reviewsCount: 310,
    pricePerPerson: 1850,
    area: 'Indiranagar',
    imageUrl: '/images/pulse/bistro_dining.jpg',
    perks: ['All ingredients provided', 'Take home your baked sourdough loaf', 'Glass of organic wine included']
  },
  {
    id: 'exp-2',
    title: 'Private Sunset Sailing Experience',
    category: 'Luxury Outdoor',
    duration: '2.5 hours',
    rating: 4.95,
    reviewsCount: 140,
    pricePerPerson: 3500,
    area: 'Ulsoor Lake Yacht Club',
    imageUrl: '/images/pulse/rooftop_lounge.jpg',
    perks: ['Private skipper', 'Champagne & grazing board', 'Lifejackets & safety gear']
  },
  {
    id: 'exp-3',
    title: 'Neon Bowling & Arcade Night',
    category: 'Gaming & Nightlife',
    duration: '2 hours',
    rating: 4.7,
    reviewsCount: 890,
    pricePerPerson: 650,
    area: 'Koramangala',
    imageUrl: '/images/pulse/concert_event.jpg',
    perks: ['Unlimited arcade credits', '2 craft beers included', 'Shoe rental included']
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-901',
    type: 'RESTAURANT',
    title: 'Bomba Dining Room',
    venue: '100ft Road, Indiranagar',
    date: 'Tonight, 02 Oct',
    time: '8:30 PM',
    status: 'UPCOMING',
    details: 'Table for 2 Guests • Indoor Velvet Booth',
    bookingCode: 'PLS-BM-8402',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PLS-BM-8402-BOMBA',
    totalAmount: 0,
    imageUrl: '/images/pulse/bistro_dining.jpg',
    createdAt: 'Today, 4:15 PM'
  },
  {
    id: 'bk-902',
    type: 'MOVIE',
    title: 'CHRONOS: Beyond The Edge',
    venue: 'PVR INOX: Nexus Koramangala (IMAX Laser)',
    date: 'Tomorrow, 03 Oct',
    time: '5:15 PM',
    status: 'UPCOMING',
    details: '2 Tickets • Prime Seats F11, F12 • 3D Glasses Included',
    bookingCode: 'PLS-CR-1934',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PLS-CR-1934-CHRONOS',
    totalAmount: 1100,
    imageUrl: '/images/pulse/cinema_poster.jpg',
    createdAt: 'Yesterday, 9:20 PM'
  },
  {
    id: 'bk-903',
    type: 'EVENT',
    title: 'Stand-Up Spotlight: Almost Famous',
    venue: 'The Underground Comedy Club, Indiranagar',
    date: '28 Sep 2024',
    time: '8:00 PM',
    status: 'PAST',
    details: '2 General Admission Tickets',
    bookingCode: 'PLS-CC-7719',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PLS-CC-7719-COMEDY',
    totalAmount: 998,
    imageUrl: '/images/pulse/standup_comedy.jpg',
    createdAt: '25 Sep 2024'
  }
];

export const SAVED_COLLECTIONS: SavedCollection[] = [
  {
    id: 'col-1',
    name: 'Date Night',
    icon: '✨',
    color: '#3b82f6',
    itemIds: ['rest-1', 'rest-2', 'mov-1']
  },
  {
    id: 'col-2',
    name: 'Weekend Plans',
    icon: '🔥',
    color: '#2563eb',
    itemIds: ['evt-1', 'rest-3', 'exp-1']
  },
  {
    id: 'col-3',
    name: 'Want to Try',
    icon: '📌',
    color: '#1d4ed8',
    itemIds: ['rest-4', 'mov-3', 'exp-2']
  },
  {
    id: 'col-4',
    name: 'Favourite Restaurants',
    icon: '❤️',
    color: '#60a5fa',
    itemIds: ['rest-1', 'rest-5']
  }
];

export const OFFERS_DATA: OfferItem[] = [
  {
    id: 'off-1',
    code: 'PULSE150',
    title: 'Flat ₹150 OFF on First Reservation',
    discountText: 'FLAT ₹150 OFF',
    category: 'FOR_YOU',
    minOrder: 1000,
    maxDiscount: 150,
    description: 'Valid across all restaurants and table bookings in your city on bills above ₹1,000.',
    validTill: '31 Oct 2024'
  },
  {
    id: 'off-2',
    code: 'HDFCFEST',
    title: '20% Instant Discount on HDFC Credit Cards',
    discountText: '20% OFF UPTO ₹350',
    category: 'BANK',
    bankOrProvider: 'HDFC Bank',
    minOrder: 1200,
    maxDiscount: 350,
    description: 'Applicable on dining, live events and movie ticket bookings using HDFC Bank Credit & Debit cards.',
    validTill: '15 Nov 2024'
  },
  {
    id: 'off-3',
    code: 'IMAXPASS',
    title: 'Buy 1 Get 1 on IMAX Tickets',
    discountText: 'BOGO 1+1 FREE',
    category: 'MOVIES',
    bankOrProvider: 'ICICI Bank',
    minOrder: 500,
    maxDiscount: 500,
    description: 'Book 2 tickets for any IMAX or 4DX screening and get the second ticket 100% complimentary.',
    validTill: '20 Oct 2024'
  },
  {
    id: 'off-4',
    code: 'EARLYBIRD',
    title: '15% Off on Sunburn & Concert Arena Tickets',
    discountText: '15% OFF',
    category: 'EVENTS',
    minOrder: 999,
    maxDiscount: 600,
    description: 'Early bird special for upcoming live concerts and festival passes.',
    validTill: '10 Oct 2024'
  }
];
