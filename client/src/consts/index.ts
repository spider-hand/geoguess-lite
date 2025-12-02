export const AVATAR_CLASS_MAP: Record<string, string> = {
  red: 'bg-red-100 border-red-200',
  orange: 'bg-orange-100 border-orange-200',
  amber: 'bg-amber-100 border-amber-200',
  yellow: 'bg-yellow-100 border-yellow-200',
  lime: 'bg-lime-100 border-lime-200',
  green: 'bg-green-100 border-green-200',
  emerald: 'bg-emerald-100 border-emerald-200',
  teal: 'bg-teal-100 border-teal-200',
  cyan: 'bg-cyan-100 border-cyan-200',
  sky: 'bg-sky-100 border-sky-200',
  blue: 'bg-blue-100 border-blue-200',
  indigo: 'bg-indigo-100 border-indigo-200',
  violet: 'bg-violet-100 border-violet-200',
  purple: 'bg-purple-100 border-purple-200',
  fuchsia: 'bg-fuchsia-100 border-fuchsia-200',
  pink: 'bg-pink-100 border-pink-200',
  rose: 'bg-rose-100 border-rose-200',
} as const

export const EARTH_RADIUS_KM = 6371 as const
export const MAX_SCORE = 5000 as const
export const PERFECT_SCORE_THRESHOLD_KM = 0.025 as const
export const DEFAULT_WORLD_SCALE = 14917 as const

// Number of rounds are currently fixed to calculate the best score in a fair way
export const ROUNDS = 5 as const

export const CANDIDATE_LOCATIONS: [number, number][] = [
  // --- NORTH AMERICA (80 Locations) ---
  // Northeast US & Canada
  [40.7128, -74.006], // New York City, NY, USA
  [42.3601, -71.0589], // Boston, MA, USA
  [39.9526, -75.1652], // Philadelphia, PA, USA
  [38.9072, -77.0369], // Washington D.C., USA
  [43.6532, -79.3832], // Toronto, Canada
  [45.5017, -73.5673], // Montreal, Canada
  [45.4215, -75.6972], // Ottawa, Canada
  [44.6488, -63.5752], // Halifax, Canada
  [42.8864, -78.8784], // Buffalo, NY, USA
  [41.7658, -72.6734], // Hartford, CT, USA
  [40.6331, -73.9385], // Brooklyn, NY, USA
  [41.4993, -81.6944], // Cleveland, OH, USA
  [40.4406, -79.9959], // Pittsburgh, PA, USA
  [39.2904, -76.6122], // Baltimore, MD, USA
  [39.7392, -84.1933], // Dayton, OH, USA
  // Midwest US
  [41.8781, -87.6298], // Chicago, IL, USA
  [42.3314, -83.0458], // Detroit, MI, USA
  [44.9778, -93.265], // Minneapolis, MN, USA
  [39.7684, -86.158], // Indianapolis, IN, USA
  [38.627, -90.1994], // St. Louis, MO, USA
  [39.0997, -94.5786], // Kansas City, MO, USA
  [43.0389, -87.9065], // Milwaukee, WI, USA
  [42.7325, -84.5555], // Lansing, MI, USA
  [41.2524, -95.998], // Omaha, NE, USA
  // Southeast US
  [25.7617, -80.1918], // Miami, FL, USA
  [33.749, -84.388], // Atlanta, GA, USA
  [35.2271, -80.8431], // Charlotte, NC, USA
  [32.0835, -81.0998], // Savannah, GA, USA
  [30.4515, -91.1871], // Baton Rouge, LA, USA
  [29.9511, -90.0715], // New Orleans, LA, USA
  [27.9475, -82.4589], // Tampa, FL, USA
  [30.3322, -81.6557], // Jacksonville, FL, USA
  [36.1627, -86.7816], // Nashville, TN, USA
  [35.9606, -83.9207], // Knoxville, TN, USA
  [33.5207, -86.802], // Birmingham, AL, USA
  // Texas & Southwest
  [29.7604, -95.3698], // Houston, TX, USA
  [30.2672, -97.7431], // Austin, TX, USA
  [32.7767, -96.797], // Dallas, TX, USA
  [29.4241, -98.4936], // San Antonio, TX, USA
  [35.0844, -106.6504], // Albuquerque, NM, USA
  [32.2217, -110.9265], // Tucson, AZ, USA
  [33.4484, -112.074], // Phoenix, AZ, USA
  [36.1699, -115.1398], // Las Vegas, NV, USA
  // West Coast US & Canada
  [34.0522, -118.2437], // Los Angeles, CA, USA
  [37.7749, -122.4194], // San Francisco, CA, USA
  [32.7157, -117.1611], // San Diego, CA, USA
  [37.3382, -121.8863], // San Jose, CA, USA
  [38.5816, -121.4944], // Sacramento, CA, USA
  [47.6062, -122.3321], // Seattle, WA, USA
  [45.5152, -122.6784], // Portland, OR, USA
  [49.2827, -123.1207], // Vancouver, Canada
  [48.4284, -123.3656], // Victoria, Canada
  [34.4208, -119.6982], // Santa Barbara, CA, USA
  // Mountain West US
  [39.7392, -104.9903], // Denver, CO, USA
  [40.7608, -111.891], // Salt Lake City, UT, USA
  [43.615, -116.2024], // Boise, ID, USA
  [45.6802, -108.5009], // Billings, MT, USA
  // Mexico & Central America (Hubs)
  [19.4326, -99.1332], // Mexico City, Mexico
  [25.6866, -100.3161], // Monterrey, Mexico
  [20.6597, -103.3496], // Guadalajara, Mexico
  [14.0825, -87.2029], // Tegucigalpa, Honduras
  [13.6929, -89.2182], // San Salvador, El Salvador
  [9.9281, -84.0907], // San Jose, Costa Rica
  [8.9824, -79.5199], // Panama City, Panama
  [18.4735, -69.9199], // Santo Domingo, Dominican Republic
  [18.4655, -66.1057], // San Juan, Puerto Rico
  [23.1136, -82.3666], // Havana, Cuba

  // --- EUROPE (140 Locations - Maximum Density) ---
  // UK & Ireland
  [51.5074, -0.1278], // London, UK
  [53.4808, -2.2426], // Manchester, UK
  [55.9533, -3.1883], // Edinburgh, UK
  [53.3498, -6.2603], // Dublin, Ireland
  [51.4545, -2.5879], // Bristol, UK
  [53.4084, -2.9916], // Liverpool, UK
  [51.4816, -3.1791], // Cardiff, UK
  [54.5973, -5.9301], // Belfast, UK
  [53.8008, -1.5491], // Leeds, UK
  [52.6292, 1.2979], // Norwich, UK
  // France
  [48.8566, 2.3522], // Paris, France
  [45.764, 4.8357], // Lyon, France
  [43.2965, 5.3698], // Marseille, France
  [43.6047, 1.4442], // Toulouse, France
  [44.8378, -0.5792], // Bordeaux, France
  [47.2184, -1.5536], // Nantes, France
  [43.7102, 7.262], // Nice, France
  [48.1173, -1.6778], // Rennes, France
  [45.1885, 5.7245], // Grenoble, France
  [49.4432, 1.0999], // Rouen, France
  // Benelux
  [50.8503, 4.3517], // Brussels, Belgium
  [52.3676, 4.9041], // Amsterdam, Netherlands
  [51.9244, 4.4777], // Rotterdam, Netherlands
  [51.2194, 4.4025], // Antwerp, Belgium
  [50.8427, 3.2246], // Kortrijk, Belgium
  [50.8795, 4.7009], // Leuven, Belgium
  [50.9351, 5.3458], // Hasselt, Belgium
  [52.0907, 5.1214], // Utrecht, Netherlands
  [51.4416, 5.4697], // Eindhoven, Netherlands
  [51.5833, 4.7833], // Breda, Netherlands
  // Germany
  [52.52, 13.405], // Berlin, Germany
  [48.1351, 11.582], // Munich, Germany
  [53.5511, 9.9937], // Hamburg, Germany
  [50.9375, 6.9603], // Cologne (Köln), Germany
  [50.1109, 8.6821], // Frankfurt, Germany
  [51.5136, 7.4653], // Dortmund, Germany
  [51.2277, 6.7735], // Düsseldorf, Germany
  [48.7758, 9.1829], // Stuttgart, Germany
  [51.3397, 12.3731], // Leipzig, Germany
  [49.4521, 11.0767], // Nuremberg (Nürnberg), Germany
  [49.0122, 8.4037], // Karlsruhe, Germany
  [53.0736, 8.8064], // Bremen, Germany
  [50.3582, 7.5959], // Koblenz, Germany
  [50.7753, 6.0839], // Aachen, Germany
  [54.3233, 10.1394], // Kiel, Germany
  // Iberia
  [40.4168, -3.7038], // Madrid, Spain
  [41.3851, 2.1734], // Barcelona, Spain
  [39.4699, -0.3774], // Valencia, Spain
  [43.263, -2.9348], // Bilbao, Spain
  [40.6331, -8.6592], // Aveiro, Portugal
  [41.1579, -8.6291], // Porto, Portugal
  [38.7223, -9.1393], // Lisbon, Portugal
  [36.7213, -4.4203], // Málaga, Spain
  [37.3828, -5.9732], // Seville, Spain
  [39.862, -4.0249], // Toledo, Spain
  // Italy
  [41.9028, 12.4964], // Rome, Italy
  [45.4642, 9.19], // Milan, Italy
  [40.8518, 14.2681], // Naples, Italy
  [45.4384, 10.9916], // Verona, Italy
  [43.7696, 11.2558], // Florence, Italy
  [45.0703, 7.6869], // Turin (Torino), Italy
  [44.4949, 11.3426], // Bologna, Italy
  [38.1157, 13.3615], // Palermo, Italy
  [45.4408, 12.3155], // Venice, Italy
  [44.4056, 8.9463], // Genoa (Genova), Italy
  // Scandinavia & Nordics
  [59.3293, 18.0686], // Stockholm, Sweden
  [59.9139, 10.7522], // Oslo, Norway
  [55.6761, 12.5683], // Copenhagen, Denmark
  [60.1699, 24.9384], // Helsinki, Finland
  [55.7047, 13.191], // Malmö, Sweden
  [57.7089, 11.9746], // Gothenburg, Sweden
  [63.4305, 10.3951], // Trondheim, Norway
  [60.472, 8.4689], // Bergen, Norway
  [56.1629, 10.2039], // Aarhus, Denmark
  [65.0121, 25.4651], // Oulu, Finland
  // Central/Eastern Europe (Expanded)
  [52.2297, 21.0122], // Warsaw, Poland
  [50.0755, 14.4378], // Prague, Czech Republic
  [47.4979, 19.0402], // Budapest, Hungary
  [48.2082, 16.3738], // Vienna, Austria
  [48.1486, 17.1077], // Bratislava, Slovakia
  [45.815, 15.9819], // Zagreb, Croatia
  [46.0569, 14.5058], // Ljubljana, Slovenia
  [43.9159, 17.6791], // Sarajevo, Bosnia and Herzegovina
  [42.6629, 21.1655], // Pristina, Kosovo
  [44.7866, 20.4489], // Belgrade, Serbia
  [42.0, 21.4333], // Skopje, North Macedonia
  [42.6977, 23.3219], // Sofia, Bulgaria
  [44.4268, 26.1025], // Bucharest, Romania
  [47.0105, 28.8638], // Chișinău, Moldova
  [50.4501, 30.5234], // Kyiv, Ukraine
  [46.4825, 30.7123], // Odesa, Ukraine
  [49.8397, 24.0297], // Lviv, Ukraine
  [59.437, 24.7536], // Tallinn, Estonia
  [56.9496, 24.1052], // Riga, Latvia
  [54.6872, 25.2797], // Vilnius, Lithuania
  [43.0, 12.5], // Central Italy (General Area)
  [44.8, 20.9], // Central Balkan Area (General Area)
  // Switzerland/Austria
  [46.2044, 6.1432], // Geneva, Switzerland
  [47.0502, 8.3094], // Lucerne, Switzerland
  [47.28, 9.155], // St. Gallen, Switzerland
  [47.0167, 15.4333], // Graz, Austria
  [47.8095, 13.055], // Salzburg, Austria
  // Greece/Turkey
  [37.9838, 23.7275], // Athens, Greece
  [40.6401, 22.9444], // Thessaloniki, Greece
  [41.0082, 28.9784], // Istanbul, Turkey
  [39.9334, 32.8597], // Ankara, Turkey
  [38.4192, 27.1287], // Izmir, Turkey
  [36.8969, 30.7133], // Antalya, Turkey
  // Additional European Cities
  [43.8563, 18.4131], // Sarajevo, Bosnia and Herzegovina
  [51.1079, 17.0385], // Wrocław, Poland
  [52.4064, 16.9252], // Poznań, Poland
  [47.3739, 8.5377], // Bern, Switzerland
  [40.4637, -3.7492], // Central Spain (General Area)
  [44.0328, 12.4206], // San Marino
  [35.8852, 14.5144], // Valletta, Malta
  [41.3275, 19.8187], // Tirana, Albania
  [42.4419, 19.2617], // Podgorica, Montenegro
  [51.8986, -8.4757], // Cork, Ireland
  [50.2718, -4.1426], // Plymouth, UK
  [50.0, 8.0], // Wiesbaden, Germany
  [49.2, 16.6], // Brno, Czech Republic
  [45.5422, 18.6942], // Osijek, Croatia
  [50.5, 20.0], // Central Poland (General Area)
  [49.5, 10.0], // Central Germany (General Area)
  [46.0, 7.0], // Central Alps Area (General Area)

  // --- ASIA (50 Locations - Hub Focused) ---
  // Japan (Very Dense)
  [35.6762, 139.6503], // Tokyo
  [34.6937, 135.5023], // Osaka
  [35.0116, 135.7681], // Kyoto
  [43.0618, 141.3545], // Sapporo
  [33.5902, 130.4017], // Fukuoka
  [34.3963, 132.4596], // Hiroshima
  [35.1815, 136.9066], // Nagoya
  [38.2682, 140.8694], // Sendai
  [34.6925, 133.917], // Okayama
  [34.7, 135.8], // Nara
  [32.7833, 129.8667], // Nagasaki
  [33.357, 130.435], // Kumamoto
  [35.5, 139.6], // Yokohama
  // East Asia
  [37.5665, 126.978], // Seoul, South Korea
  [35.1796, 129.0756], // Busan, South Korea
  [37.4563, 126.7052], // Incheon, South Korea
  [25.033, 121.5654], // Taipei, Taiwan
  [22.3193, 114.1694], // Hong Kong
  [22.1987, 113.5439], // Macau
  [23.0, 120.21], // Tainan, Taiwan
  [24.1478, 120.6736], // Taichung, Taiwan
  [36.3504, 127.3845], // Daejeon, South Korea
  // Southeast Asia
  [1.3521, 103.8198], // Singapore
  [13.7563, 100.5018], // Bangkok, Thailand
  [3.139, 101.6869], // Kuala Lumpur, Malaysia
  [-6.2088, 106.8456], // Jakarta, Indonesia
  [14.5995, 120.9842], // Manila, Philippines
  [10.8231, 106.6297], // Ho Chi Minh City, Vietnam
  [16.0544, 108.2022], // Da Nang, Vietnam
  [21.0285, 105.8542], // Hanoi, Vietnam
  [10.3157, 123.8854], // Cebu City, Philippines
  [-7.2575, 112.7521], // Surabaya, Indonesia
  [15.8203, 102.5855], // Khon Kaen, Thailand
  // South/West Asia
  [28.6139, 77.209], // New Delhi, India
  [19.076, 72.8777], // Mumbai, India
  [12.9716, 77.5946], // Bangalore, India
  [13.0827, 80.2707], // Chennai, India
  [22.5726, 88.3639], // Kolkata, India
  [17.385, 78.4867], // Hyderabad, India
  [33.5132, 36.2765], // Damascus, Syria (Limited)
  [33.3152, 44.3661], // Baghdad, Iraq (Limited)
  [25.2048, 55.2708], // Dubai, UAE
  [24.4539, 54.3773], // Abu Dhabi, UAE
  [26.2285, 50.586], // Manama, Bahrain
  [31.9539, 35.9106], // Amman, Jordan
  [32.0853, 34.7818], // Tel Aviv, Israel
  [35.717, 51.3889], // Tehran, Iran (Limited)

  // --- SOUTH AMERICA (20 Locations - Coastal/Hub Focus) ---
  [-23.5505, -46.6333], // Sao Paulo, Brazil
  [-22.9068, -43.1729], // Rio de Janeiro, Brazil
  [-15.8267, -47.9218], // Brasilia, Brazil
  [-19.9167, -43.9345], // Belo Horizonte, Brazil
  [-30.0346, -51.2177], // Porto Alegre, Brazil
  [-34.6037, -58.3816], // Buenos Aires, Argentina
  [-32.9468, -60.6393], // Rosario, Argentina
  [-33.4489, -70.6693], // Santiago, Chile
  [-36.8202, -73.0448], // Concepcion, Chile
  [4.711, -74.0721], // Bogota, Colombia
  [6.2442, -75.5812], // Medellin, Colombia
  [-12.0464, -77.0428], // Lima, Peru
  [-0.1807, -78.4678], // Quito, Ecuador
  [-2.17, -79.92], // Guayaquil, Ecuador
  [-34.9011, -56.1645], // Montevideo, Uruguay
  [-16.4897, -68.1193], // La Paz, Bolivia (Limited)
  [6.8012, -58.1551], // Georgetown, Guyana
  [10.4806, -66.9033], // Caracas, Venezuela (Limited)
  [10.9969, -74.7813], // Barranquilla, Colombia
  [-34.9036, -57.971], // La Plata, Argentina

  // --- OCEANIA (10 Locations) ---
  [-33.8688, 151.2093], // Sydney, Australia
  [-37.8136, 144.9631], // Melbourne, Australia
  [-27.4698, 153.0251], // Brisbane, Australia
  [-31.9505, 115.8605], // Perth, Australia
  [-34.9285, 138.6007], // Adelaide, Australia
  [-42.8821, 147.3272], // Hobart, Australia
  [-36.8485, 174.7633], // Auckland, New Zealand
  [-41.2865, 174.7762], // Wellington, New Zealand
  [-43.5321, 172.6362], // Christchurch, New Zealand
  [-17.7792, 177.0141], // Suva, Fiji (Limited)

  // --- AFRICA (10 Locations - Major Hubs) ---
  [-33.9249, 18.4241], // Cape Town, South Africa
  [-26.2041, 28.0473], // Johannesburg, South Africa
  [-29.8587, 31.0218], // Durban, South Africa
  [30.0444, 31.2357], // Cairo, Egypt
  [36.8065, 10.1815], // Tunis, Tunisia
  [-1.2921, 36.8219], // Nairobi, Kenya
  [6.5244, 3.3792], // Lagos, Nigeria
  [12.0466, -1.0658], // Ouagadougou, Burkina Faso (Limited)
  [33.5731, -7.5898], // Casablanca, Morocco
  [32.8872, 13.5828], // Tripoli, Libya (Limited)
]
