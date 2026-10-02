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
    name: 'Indiranagar Club Corridor',
    city: 'Bengaluru',
    state: 'Karnataka',
    popularSpots: ['100ft Road Club Row', '12th Main Felt', 'Defence Colony', 'Koramangala Room']
  },
  {
    id: 'loc-2',
    name: 'Goa Offshore Strip',
    city: 'Goa',
    state: 'Goa',
    popularSpots: ['Mandovi Cruisers', 'Panjim Poker Row', 'Candolim Lounge', 'Baga Card Room']
  },
  {
    id: 'loc-3',
    name: 'Las Vegas Strip Corridor',
    city: 'Las Vegas',
    state: 'Nevada',
    popularSpots: ['Bellagio High Stakes', 'Wynn Grand Felt', 'Aria Poker Room', 'Resorts World Tech']
  },
  {
    id: 'loc-4',
    name: 'London Mayfair District',
    city: 'London',
    state: 'United Kingdom',
    popularSpots: ['Mayfair Club', 'Crown Aspinalls', 'Les Ambassadeurs', 'Hippodrome Square']
  }
];

export const HERO_CAROUSEL_ITEMS = [
  {
    id: 'hero-1',
    label: 'HIGH STAKES ACTION',
    headline: 'Wynn Grand High Roller Lounge',
    subtext: '16 Live cash tables active. ₹100/₹200 to ₹1,000/₹2,000 NLH & PLO with RFID tracking.',
    cta: 'Reserve Table Seat',
    category: 'DINING' as const,
    imageUrl: '/images/wynn.jpg'
  },
  {
    id: 'hero-2',
    label: 'WEEKEND CHAMPIONSHIP',
    headline: 'Aria ₹50L GTD Deepstack Tourney',
    subtext: 'Late registration open. 100k starting chips, 25-minute levels & live stream featured table.',
    cta: 'Register Tourney Seat',
    category: 'MOVIES' as const,
    imageUrl: '/images/aria.jpg'
  },
  {
    id: 'hero-3',
    label: 'PRIVATE VIP SANCTUARY',
    headline: "Bobby's Room High Stakes Felt",
    subtext: 'Exclusive high roller mixed games, private security cage & Michelin tableside dining.',
    cta: 'Book VIP Pass',
    category: 'NIGHTLIFE' as const,
    imageUrl: '/images/bobbys_room.jpg'
  },
  {
    id: 'hero-4',
    label: 'ACTION PLO-5 ROOM',
    headline: 'Resorts World Tech Lounge',
    subtext: 'Automatic card shufflers, USB felt chargers, zero-rake happy hours & ₹50k hourly high hand.',
    cta: 'Join Live Waitlist',
    category: 'DINING' as const,
    imageUrl: '/images/resorts_world.jpg'
  }
];

export const RESTAURANTS_DATA: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Wynn Poker Room & High Roller Lounge',
    cuisine: ['₹100/₹200 NLH', '₹200/₹500 PLO-5', 'RFID Smart Felt'],
    rating: 4.9,
    reviewCount: 1840,
    distanceKm: 1.8,
    priceForTwo: 10000,
    area: '100ft Road Club Row',
    isTableAvailable: true,
    tableWaitMinutes: 0,
    featuredOffer: '₹500 Free Bonus Chips on ₹10k Buy-in',
    imageUrl: '/images/wynn.jpg',
    galleryUrls: [
      '/images/wynn.jpg',
      '/images/bobbys_room.jpg',
      '/images/dining.jpg',
      '/images/resorts_world.jpg',
      '/images/pulse/rooftop_lounge.jpg'
    ],
    popularDishes: [
      { name: '₹100/₹200 Deepstack NLH', price: 10000, isVeg: false, tag: 'Bestseller Table' },
      { name: '₹200/₹500 Action PLO-5', price: 25000, isVeg: false, tag: 'High Action' },
      { name: '₹500/₹1000 High Roller Felt', price: 50000, isVeg: false, tag: 'VIP Stakes' },
      { name: 'Bobby’s Mixed Game (PLO/Stud)', price: 100000, isVeg: false }
    ],
    about: 'The premier luxury poker destination featuring 28 custom felt tables with RFID tracking, automatic card shufflers, 24/7 dedicated cage cashiers, and complimentary tableside gourmet dining.',
    address: 'Plot 482, 100ft Road, Stage 2, Indiranagar Poker Corridor',
    phone: '+91 80 4965 2200',
    isOpen: true,
    timings: '24 Hours Open • 7 Days a Week',
    facilities: ['RFID Smart Felt', 'Automatic Shufflers', 'Complimentary Gourmet Dining', '24/7 Cashier Cage', 'Valet Parking', 'High Hand Hourly Jackpots'],
    sectionTag: 'POPULAR'
  },
  {
    id: 'rest-2',
    name: 'Aria Modern Poker Room & Tables',
    cuisine: ['₹200/₹500 NLH', '₹500/₹1,000 High Stakes', 'Championship Felt'],
    rating: 4.9,
    reviewCount: 1420,
    distanceKm: 2.4,
    priceForTwo: 20000,
    area: '12th Main Strip',
    isTableAvailable: true,
    tableWaitMinutes: 5,
    featuredOffer: '100% High Hand Bonus Match Today',
    imageUrl: '/images/aria.jpg',
    galleryUrls: [
      '/images/aria.jpg',
      '/images/wynn.jpg',
      '/images/resorts_world.jpg',
      '/images/bellagio.jpg',
      '/images/dining.jpg'
    ],
    popularDishes: [
      { name: '₹200/₹500 Deepstack NLH (9-Max)', price: 20000, isVeg: false, tag: 'Most Popular' },
      { name: '₹500/₹1,000 High Roller NLH', price: 50000, isVeg: false, tag: 'High Stakes' },
      { name: '₹100/₹200 Beginner Fast-Fold', price: 10000, isVeg: false },
      { name: 'PLO-4 Round of Each (ROE)', price: 30000, isVeg: false }
    ],
    about: 'Sleek modern poker room designed with ergonomic custom leather chairs, premium ceramic clay chips, soundproof acoustic ceiling, and tableside USB ports.',
    address: '777, 12th Main Rd, HAL 2nd Stage, Indiranagar',
    phone: '+91 80 4128 9090',
    isOpen: true,
    timings: '24 Hours Open • Daily Cash Games',
    facilities: ['RFID Smart Tables', 'Private High Stakes Salon', 'Tableside Massage', 'Handcrafted Cocktails & Coffee', 'Direct Cage UPI Payouts'],
    sectionTag: 'DATE_NIGHT'
  },
  {
    id: 'rest-3',
    name: "Bobby's VIP High Stakes Room",
    cuisine: ['₹1,000/₹2,000 Stakes', 'Private Mixed Games', 'VIP Salon'],
    rating: 5.0,
    reviewCount: 650,
    distanceKm: 3.2,
    priceForTwo: 50000,
    area: 'High Roller Penthouse Row',
    isTableAvailable: true,
    tableWaitMinutes: 0,
    featuredOffer: 'Zero Rake on Tables above ₹1,000/₹2,000',
    imageUrl: '/images/bobbys_room.jpg',
    galleryUrls: [
      '/images/bobbys_room.jpg',
      '/images/wynn.jpg',
      '/images/dining.jpg',
      '/images/pulse/rooftop_lounge.jpg',
      '/images/bellagio.jpg'
    ],
    popularDishes: [
      { name: '₹1,000/₹2,000 VIP Mixed Game', price: 100000, isVeg: false, tag: 'Nosebleed Stakes' },
      { name: '₹500/₹1,000 NLH Uncapped', price: 50000, isVeg: false, tag: 'Deep Action' },
      { name: '₹500/₹1,000 PLO-5 Big O', price: 50000, isVeg: false },
      { name: 'Private Table Rental (Heads Up / 6-Max)', price: 150000, isVeg: false }
    ],
    about: 'Legendary private poker sanctuary reserved for top professionals and high-net-worth players. Featuring crystal chandeliers, private security escorts, and private cage settlement.',
    address: 'Penthouse Level, Barton Centre, Club District',
    phone: '+91 80 2558 7711',
    isOpen: true,
    timings: '2:00 PM – 6:00 AM Daily',
    facilities: ['Ultra Private Salon', 'Private Cage & Safe Deposit', 'Dedicated Butler Service', 'Private Cigar Lounge', 'Armored Transport'],
    sectionTag: 'TRENDING'
  },
  {
    id: 'rest-4',
    name: 'Resorts World High Tech Poker Lounge',
    cuisine: ['₹100/₹200 NLH', '₹200/₹500 PLO-5', 'Automated Shufflers'],
    rating: 4.8,
    reviewCount: 1120,
    distanceKm: 4.1,
    priceForTwo: 10000,
    area: 'Defence Tech District',
    isTableAvailable: true,
    tableWaitMinutes: 10,
    featuredOffer: 'Hourly ₹10,000 High Hand Bonus Active',
    imageUrl: '/images/resorts_world.jpg',
    galleryUrls: [
      '/images/resorts_world.jpg',
      '/images/aria.jpg',
      '/images/wynn.jpg',
      '/images/bellagio.jpg',
      '/images/dining.jpg'
    ],
    popularDishes: [
      { name: '₹100/₹200 Fast Action NLH', price: 10000, isVeg: false, tag: 'Instant Seat' },
      { name: '₹200/₹500 PLO-5 Action Bomb Pot', price: 25000, isVeg: false, tag: 'Bomb Pots' },
      { name: 'Nightly Sit & Go Turbo (6-Max)', price: 5000, isVeg: false }
    ],
    about: 'The most technologically advanced poker club with electronic table displays, real-time hand history tracking, automated card shufflers, and live tournament clocks.',
    address: '92, 6th Cross, Defence Colony, Indiranagar',
    phone: '+91 80 4390 1200',
    isOpen: true,
    timings: '24 Hours Open',
    facilities: ['RFID Smart Felt', 'Electronic Waitlist Kiosk', 'USB Fast Chargers at Every Seat', 'Tableside Food Delivery', 'Secure Parking'],
    sectionTag: 'NEW'
  },
  {
    id: 'rest-5',
    name: 'Bellagio Luxury High Stakes Room',
    cuisine: ['₹200/₹500 NLH', '₹500/₹1,000 PLO', 'Tableside Dining'],
    rating: 4.9,
    reviewCount: 2200,
    distanceKm: 2.9,
    priceForTwo: 25000,
    area: 'Lavelle Luxury Enclave',
    isTableAvailable: true,
    tableWaitMinutes: 0,
    featuredOffer: 'Complimentary Michelin Tableside Dining',
    imageUrl: '/images/bellagio.jpg',
    galleryUrls: [
      '/images/bellagio.jpg',
      '/images/bobbys_room.jpg',
      '/images/dining.jpg',
      '/images/wynn.jpg',
      '/images/pulse/rooftop_lounge.jpg'
    ],
    popularDishes: [
      { name: '₹200/₹500 Deepstack NLH', price: 25000, isVeg: false, tag: 'Signature Game' },
      { name: '₹500/₹1,000 High Roller PLO', price: 50000, isVeg: false, tag: 'Deepstack' },
      { name: '₹100/₹200 Warmup Cash Table', price: 10000, isVeg: false }
    ],
    about: 'Iconic poker institution boasting gold-trimmed felt, world-class dealers, European cash game structures, and complimentary tableside sommelier pairings.',
    address: '14, Lavelle Road, Shanthala Nagar, Luxury Poker Corridor',
    phone: '+91 80 4112 3344',
    isOpen: true,
    timings: '24 Hours Open • 7 Days a Week',
    facilities: ['RFID Felt Tables', 'Tableside Dining Menu', 'Sommelier Wine Service', 'Private Cashiers', 'VIP Valet'],
    sectionTag: 'HIDDEN_GEM'
  }
];

export const MOVIES_DATA: Movie[] = [
  {
    id: 'mov-1',
    title: 'Aria Weekend ₹50L GTD Deepstack Tourney',
    genre: ['Deepstack', 'No-Limit Hold\'em', 'Championship'],
    language: 'Freezeout • 100k Chips',
    certification: 'A',
    rating: 4.9,
    votesCount: '1.2k Players',
    runtime: 'Level 12 • 25m Blinds',
    releaseDate: 'Tonight 8:00 PM',
    posterUrl: '/images/aria.jpg',
    backdropUrl: '/images/wynn.jpg',
    synopsis: 'Premier weekend deepstack poker tournament with ₹50,00,000 guaranteed prize pool. 100,000 starting chip stack, 25-minute blind levels, and full live stream coverage on the final table.',
    cast: [
      { name: 'Floor Director', role: 'Vikram Mehta' },
      { name: 'Lead Dealer', role: 'Kavita Roy' },
      { name: 'Live Stream Host', role: 'Samir Grover' }
    ],
    crew: { director: 'Aria Poker Floor Management', composer: 'RFID Chip Track' },
    status: 'NOW_SHOWING',
    cinemas: [
      {
        id: 'cin-1',
        name: 'Aria Main Tournament Arena',
        chain: 'Aria Poker Club',
        distanceKm: 2.4,
        area: '12th Main Indiranagar',
        formats: ['2D', 'IMAX'],
        showtimes: [
          {
            id: 'st-1',
            time: '08:00 PM',
            format: 'IMAX',
            language: 'Flight A',
            price: 15000,
            screenName: 'Table Felt 01-10',
            availability: 'FAST_FILLING'
          },
          {
            id: 'st-2',
            time: '10:30 PM',
            format: '2D',
            language: 'Turbo Flight B',
            price: 15000,
            screenName: 'Table Felt 11-18',
            availability: 'AVAILABLE'
          }
        ]
      }
    ]
  },
  {
    id: 'mov-2',
    title: 'Wynn ₹10L GTD Nightly Bounty Blitz',
    genre: ['PKO Bounty', 'Turbo Structure', 'NLH'],
    language: '₹3,000 Bounty Per Knockout',
    certification: 'A',
    rating: 4.8,
    votesCount: '840 Players',
    runtime: '15m Blinds • Fast Paced',
    releaseDate: 'Daily at 9:30 PM',
    posterUrl: '/images/wynn.jpg',
    backdropUrl: '/images/resorts_world.jpg',
    synopsis: 'Nightly progressive knockout bounty poker tournament. Win ₹3,000 instantly in cash for every player you eliminate, plus battle for the ₹10 Lakh guaranteed main prize pool.',
    cast: [
      { name: 'Floor Manager', role: 'Rajesh Sen' },
      { name: 'Head Ref', role: 'Daniel D.' }
    ],
    crew: { director: 'Wynn Cardroom Operations' },
    status: 'NOW_SHOWING',
    cinemas: [
      {
        id: 'cin-2',
        name: 'Wynn Tournament Felt',
        chain: 'Wynn Grand Club',
        distanceKm: 1.8,
        area: '100ft Road Club Row',
        formats: ['2D', '4DX'],
        showtimes: [
          {
            id: 'st-3',
            time: '09:30 PM',
            format: '4DX',
            language: 'Main Flight',
            price: 8000,
            screenName: 'Felt 01-08',
            availability: 'FAST_FILLING'
          }
        ]
      }
    ]
  },
  {
    id: 'mov-3',
    title: "Bobby's Championship PLO ₹1 Crore GTD",
    genre: ['Pot-Limit Omaha', 'High Stakes', '5-Card PLO'],
    language: '₹50,000 Buy-in • Deep Stack',
    certification: 'A',
    rating: 5.0,
    votesCount: '450 High Rollers',
    runtime: '30m Blinds • 2-Day Major',
    releaseDate: 'Saturday 6:00 PM',
    posterUrl: '/images/bobbys_room.jpg',
    backdropUrl: '/images/bobbys_room.jpg',
    synopsis: 'The crown jewel of high stakes Pot Limit Omaha tournaments in the region. ₹1,00,00,000 guaranteed prize pool with standard 5-card Omaha rules and 200 big blind starting stacks.',
    cast: [
      { name: 'Tournament Host', role: 'Bobby Baldwin Suite' }
    ],
    crew: { director: 'High Roller Series Committee' },
    status: 'TRENDING',
    cinemas: [
      {
        id: 'cin-3',
        name: "Bobby's VIP Salon",
        chain: "Bobby's Poker Room",
        distanceKm: 3.2,
        area: 'Penthouse Row',
        formats: ['IMAX'],
        showtimes: [
          {
            id: 'st-4',
            time: '06:00 PM',
            format: 'IMAX',
            language: 'Day 1 Flight',
            price: 50000,
            screenName: 'VIP Felt Salon',
            availability: 'ALMOST_FULL'
          }
        ]
      }
    ]
  }
];

export const EVENTS_DATA: EventItem[] = [
  {
    id: 'evt-1',
    title: 'National Poker Series - Main Event Satellite Super Gigs',
    category: 'PARTIES',
    dateBadge: 'TONIGHT, 9 PM',
    fullDateTime: 'Friday, Oct 2 • 9:00 PM – 3:00 AM',
    venue: 'Wynn Grand Poker Lounge',
    address: '100ft Road Club Row, Indiranagar',
    distanceKm: 1.8,
    priceStarting: 5000,
    interestedCount: 3200,
    artworkUrl: '/images/wynn.jpg',
    artists: [
      { name: 'Vikram "Shark" Sethi', role: 'Keynote & Pro Player' },
      { name: 'DJ Zedd Live', role: 'Tableside Music Session' }
    ],
    schedule: [
      { time: '08:30 PM', activity: 'Player Registration & Welcome Drinks' },
      { time: '09:00 PM', activity: 'Shuffle Up & Deal — Satellite Flight A' },
      { time: '11:30 PM', activity: 'Late Reg Closes & High Hand Payout' },
      { time: '02:00 AM', activity: 'Final 5 Seats Awarded for Main Event' }
    ],
    about: 'Mega satellite tournament awarding 5 guaranteed ₹1,00,000 Main Event seats. Features live DJ sets, complimentary cocktails, and RFID real-time player statistics.',
    terms: [
      'Entry restricted to players 21 years and older with valid government ID.',
      'Starting stack: 50,000 chips with 15-minute blind levels.',
      'RFID table card etiquette rules strictly enforced.',
      'Non-refundable after registration closes.'
    ],
    isWeekendHighlight: true,
    isTrending: true
  },
  {
    id: 'evt-2',
    title: 'High Stakes PLO-5 Invitational Cash Night',
    category: 'EXPERIENCES',
    dateBadge: 'SAT, 10 PM',
    fullDateTime: 'Saturday, Oct 3 • 10:00 PM – 6:00 AM',
    venue: "Bobby's VIP High Stakes Room",
    address: 'Penthouse Level, Barton Centre, Club District',
    distanceKm: 3.2,
    priceStarting: 50000,
    interestedCount: 1850,
    artworkUrl: '/images/bobbys_room.jpg',
    artists: [
      { name: 'High Roller Floor Staff', role: 'Dedicated Dealer & Butler' }
    ],
    schedule: [
      { time: '09:45 PM', activity: 'Champagne Reception & Safe Deposit' },
      { time: '10:00 PM', activity: 'Cards in the Air — Uncapped PLO-5' },
      { time: '01:30 AM', activity: 'Midnight Tableside Wagyu Course' }
    ],
    about: 'Invitation-only high action Pot Limit Omaha session featuring ₹500/₹1,000 blinds with mandatory straddle. Uncapped buy-in with private cage settlement.',
    terms: [
      'Minimum buy-in ₹50,000. No maximum limit.',
      'Strict dress code: Smart casual or formal.',
      'Private security valet and safe deposit facilities included.'
    ],
    isWeekendHighlight: true
  },
  {
    id: 'evt-3',
    title: 'Aria Sunday Bounty Blitz & Player Meetup',
    category: 'PARTIES',
    dateBadge: 'SUN, 4 PM',
    fullDateTime: 'Sunday, Oct 4 • 4:00 PM – 10:00 PM',
    venue: 'Aria Modern Poker Room',
    address: '12th Main Strip, Indiranagar',
    distanceKm: 2.4,
    priceStarting: 10000,
    interestedCount: 2400,
    artworkUrl: '/images/aria.jpg',
    artists: [
      { name: 'Kunal Patni', role: 'Guest Pro Bounty' }
    ],
    schedule: [
      { time: '03:30 PM', activity: 'Pre-game Networking & Craft Coffee' },
      { time: '04:00 PM', activity: 'Bounty Tournament Kickoff' },
      { time: '08:00 PM', activity: 'Final Table Live Stream with Commentary' }
    ],
    about: 'Knock out special celebrity guest pro bounty players to win instantaneous ₹10,000 cash prizes per bounty tag, with full live stream coverage on big screens.',
    terms: [
      'Tournament structure: 20-minute levels, 75,000 starting chips.',
      'Cash payout distributed immediately at cage upon exit.'
    ]
  }
];

export const EXPERIENCES_DATA: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: 'VIP Private Felt & High Roller Host Experience',
    category: 'VIP Salon',
    duration: 'Full Evening (6h)',
    rating: 4.9,
    reviewsCount: 310,
    pricePerPerson: 25000,
    area: 'Penthouse Salon',
    imageUrl: '/images/bobbys_room.jpg',
    perks: ['Private Dedicated Dealer', 'Complimentary Vintage Bar', 'Personal Valet', 'Private Security Cage']
  },
  {
    id: 'exp-2',
    title: 'Masterclass: Deepstack Cash Exploits with Pro Coaches',
    category: 'Coaching',
    duration: '3 Hours',
    rating: 4.8,
    reviewsCount: 420,
    pricePerPerson: 8500,
    area: 'Aria Training Suite',
    imageUrl: '/images/aria.jpg',
    perks: ['Live RFID Hand History Analysis', '1-on-1 GTO Solver Review', 'VIP Cardroom Access']
  },
  {
    id: 'exp-3',
    title: 'Tableside Gourmet Dining & Private Poker Evening',
    category: 'Dining & Cards',
    duration: '4 Hours',
    rating: 4.9,
    reviewsCount: 195,
    pricePerPerson: 12000,
    area: 'Lavelle Luxury Enclave',
    imageUrl: '/images/dining.jpg',
    perks: ['5-Course Tasting Menu at Felt', 'Sommelier Wine Pairings', 'Reserved 9-Max Table']
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1',
    type: 'RESTAURANT',
    title: 'Wynn Poker Room — Table 04',
    venue: 'Wynn Grand Poker Lounge',
    date: 'Today, 2 Oct',
    time: '09:00 PM',
    status: 'UPCOMING',
    details: 'Seat 6 (Cutoff) • ₹200/₹500 NLH • ₹25,000 Buy-in Reserved',
    bookingCode: 'WYNN-POKER-9042',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=WYNN-POKER-9042-ALEX-SEAT-6',
    totalAmount: 25000,
    imageUrl: '/images/wynn.jpg',
    createdAt: '2026-10-02T14:30:00Z'
  },
  {
    id: 'bk-2',
    type: 'MOVIE',
    title: 'Aria Weekend ₹50L GTD Tourney',
    venue: 'Aria Modern Poker Room',
    date: 'Tomorrow, 3 Oct',
    time: '08:00 PM',
    status: 'UPCOMING',
    details: 'Seat Table Felt 04 (Seat 3) • 100k Chips Ready at Cage',
    bookingCode: 'ARIA-TOURNEY-4819',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ARIA-TOURNEY-4819',
    totalAmount: 15000,
    imageUrl: '/images/aria.jpg',
    createdAt: '2026-10-02T12:00:00Z'
  },
  {
    id: 'bk-3',
    type: 'EVENT',
    title: "Bobby's Room High Stakes Session",
    venue: "Bobby's VIP High Stakes Room",
    date: '28 Sep 2026',
    time: '11:00 PM',
    status: 'PAST',
    details: 'VIP Table 1 (Seat 5) • ₹500/₹1,000 PLO-5 Session Completed',
    bookingCode: 'BOBBY-VIP-1102',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BOBBY-VIP-1102',
    totalAmount: 50000,
    imageUrl: '/images/bobbys_room.jpg',
    createdAt: '2026-09-28T18:00:00Z'
  }
];

export const SAVED_COLLECTIONS: SavedCollection[] = [
  {
    id: 'col-1',
    name: 'High Stakes VIP',
    icon: '💎',
    color: '#3b82f6',
    itemIds: ['rest-1', 'rest-3', 'mov-3']
  },
  {
    id: 'col-2',
    name: 'Weekend Action',
    icon: '🔥',
    color: '#2563eb',
    itemIds: ['evt-1', 'rest-2', 'mov-1']
  },
  {
    id: 'col-3',
    name: 'Action PLO Rooms',
    icon: '♠️',
    color: '#1d4ed8',
    itemIds: ['rest-4', 'mov-2', 'exp-1']
  },
  {
    id: 'col-4',
    name: 'Favourite Cardrooms',
    icon: '❤️',
    color: '#60a5fa',
    itemIds: ['rest-1', 'rest-5']
  }
];

export const OFFERS_DATA: OfferItem[] = [
  {
    id: 'off-1',
    code: 'POKER500',
    title: 'Flat ₹500 Bonus Chips on First Buy-in',
    discountText: 'FLAT ₹500 CHIPS',
    category: 'FOR_YOU',
    minOrder: 10000,
    maxDiscount: 500,
    description: 'Valid on your first cash game reservation at Wynn, Aria, or Bellagio. Bonus chips credited directly at the cashier cage.',
    validTill: 'Valid till 31 Oct'
  },
  {
    id: 'off-2',
    code: 'HIGHROLLER25',
    title: '25% Extra Comp Points on Buy-ins ₹50,000+',
    discountText: '25% COMP MATCH',
    category: 'DINING',
    minOrder: 50000,
    maxDiscount: 12500,
    description: 'Earn 25% accelerated VIP comp points redeemable for private penthouses, dining, and spa treatments.',
    validTill: 'Valid on Weekends'
  },
  {
    id: 'off-3',
    code: 'ZERORAKE',
    title: 'Zero Rake Happy Hours (2 PM – 5 PM)',
    discountText: '0% RAKE CAP',
    category: 'BANK',
    bankOrProvider: 'Pulse Obsidian Club',
    description: 'Enjoy 100% rake-free action on all ₹100/₹200 and ₹200/₹500 tables booked between 2 PM and 5 PM.',
    validTill: 'Valid Monday – Thursday'
  },
  {
    id: 'off-4',
    code: 'HIGHHAND10K',
    title: 'Instant ₹10,000 High Hand Bonus',
    discountText: '₹10,000 JACKPOT',
    category: 'EVENTS',
    description: 'Hit Quads or better during any live cash game to win an instant ₹10,000 cashier payout bonus.',
    validTill: 'Valid Everyday'
  }
];
