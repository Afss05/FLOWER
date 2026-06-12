export interface FestivalProduct {
  id: number
  name: string
  price: number
  image: string
  tag?: string
}

export interface Festival {
  id: string
  name: string
  nameTa: string
  date: string // ISO date string (YYYY-MM-DD)
  description: string
  descriptionTa: string
  emoji: string
  color: string // Tailwind gradient classes
  orderByDays: number // days before festival to order
  suggestedProducts: FestivalProduct[]
  tips: string[]
}

export const festivals2026: Festival[] = [
  {
    id: 'pongal',
    name: 'Pongal',
    nameTa: 'பொங்கல்',
    date: '2026-01-14',
    description: 'The harvest festival of Tamil Nadu celebrated with great joy and offerings.',
    descriptionTa: 'தமிழ்நாட்டின் அறுவடை விழா மிகுந்த மகிழ்ச்சியுடன் கொண்டாடப்படுகிறது.',
    emoji: '🌾',
    color: 'from-yellow-500 to-orange-500',
    orderByDays: 3,
    suggestedProducts: [
      { id: 101, name: 'Marigold Garland (5ft)', price: 249, image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=400&fit=crop', tag: 'Bestseller' },
      { id: 102, name: 'Sugarcane Bouquet', price: 149, image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=400&h=400&fit=crop', tag: 'Traditional' },
      { id: 103, name: 'Mixed Pooja Flowers (500g)', price: 199, image: 'https://images.unsplash.com/photo-1613545882494-85ad14f74b9b?w=400&h=400&fit=crop' },
      { id: 104, name: 'Kolam Flowers Set', price: 99, image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=400&h=400&fit=crop', tag: 'New' },
    ],
    tips: [
      'Order marigold garlands at least 2 days before for freshest blooms',
      'Kolam flowers sell out fast — pre-order recommended',
      'Traditional yellow and orange flowers are most auspicious',
    ],
  },
  {
    id: 'thai-poosam',
    name: 'Thai Poosam',
    nameTa: 'தை பூசம்',
    date: '2026-02-03',
    description: 'Sacred festival dedicated to Lord Murugan, celebrated with devotion and flowers.',
    descriptionTa: 'முருகன் பெருமானுக்கு அர்ப்பணிக்கப்பட்ட புனித திருவிழா.',
    emoji: '🙏',
    color: 'from-orange-500 to-red-600',
    orderByDays: 2,
    suggestedProducts: [
      { id: 201, name: 'Kavadi Flower Set', price: 399, image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=400&fit=crop', tag: 'Festival Special' },
      { id: 202, name: 'Yellow Marigold Bunch', price: 179, image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=400&h=400&fit=crop', tag: 'Bestseller' },
      { id: 203, name: 'Bilva Leaves & Flowers Pack', price: 129, image: 'https://images.unsplash.com/photo-1613545882494-85ad14f74b9b?w=400&h=400&fit=crop' },
    ],
    tips: [
      'Yellow marigolds are the primary offering for Thai Poosam',
      'Bilva leaves are considered very sacred for this festival',
    ],
  },
  {
    id: 'ugadi',
    name: 'Ugadi',
    nameTa: 'உகாதி',
    date: '2026-03-19',
    description: 'Telugu and Kannada New Year, celebrated with neem flowers and festive arrangements.',
    descriptionTa: 'தெலுங்கு மற்றும் கன்னட புத்தாண்டு.',
    emoji: '🌸',
    color: 'from-green-500 to-teal-500',
    orderByDays: 2,
    suggestedProducts: [
      { id: 301, name: 'Neem Flower Bunch', price: 99, image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=400&h=400&fit=crop', tag: 'Traditional' },
      { id: 302, name: 'Mixed Spring Flowers', price: 299, image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=400&h=400&fit=crop' },
    ],
    tips: ['Neem flowers are essential for Ugadi Pachadi preparation'],
  },
  {
    id: 'tamil-new-year',
    name: 'Tamil New Year (Puthandu)',
    nameTa: 'தமிழ் புத்தாண்டு (புதண்டு)',
    date: '2026-04-14',
    description: 'The Tamil New Year begins on the first day of the month of Chithirai.',
    descriptionTa: 'சித்திரை மாதத்தின் முதல் நாளில் தமிழ் புத்தாண்டு தொடங்குகிறது.',
    emoji: '🎊',
    color: 'from-pink-500 to-rose-600',
    orderByDays: 3,
    suggestedProducts: [
      { id: 401, name: 'Kani Flowers Set (Auspicious)', price: 449, image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=400&fit=crop', tag: 'Most Popular' },
      { id: 402, name: 'Jasmine Garland 3ft', price: 199, image: 'https://images.unsplash.com/photo-1613545882494-85ad14f74b9b?w=400&h=400&fit=crop', tag: 'Bestseller' },
      { id: 403, name: 'Yellow & White Flowers Mix', price: 249, image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=400&h=400&fit=crop' },
      { id: 404, name: 'Rose Petals Pack (decorative)', price: 149, image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=400&h=400&fit=crop' },
    ],
    tips: [
      'Kani flowers (first sight on New Year morning) must be arranged the night before',
      'Jasmine is widely used for hair adornment during Tamil New Year',
      'Order 3 days in advance for guaranteed freshness',
    ],
  },
  {
    id: 'aadi-perukku',
    name: 'Aadi Perukku',
    nameTa: 'ஆடி பெருக்கு',
    date: '2026-08-03',
    description: 'Festival celebrating rivers and water bodies, observed on the 18th day of Aadi month.',
    descriptionTa: 'ஆடி மாதத்தின் 18ஆம் நாளில் ஆறுகள் மற்றும் நீர்நிலைகளை கொண்டாடும் விழா.',
    emoji: '💧',
    color: 'from-blue-500 to-cyan-500',
    orderByDays: 1,
    suggestedProducts: [
      { id: 501, name: 'Lotus Flowers Bunch', price: 349, image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=400&fit=crop', tag: 'Sacred' },
      { id: 502, name: 'Water Lily Set', price: 299, image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=400&h=400&fit=crop' },
    ],
    tips: ['Lotus flowers are offered to water bodies during Aadi Perukku'],
  },
  {
    id: 'krishna-jayanti',
    name: 'Krishna Jayanti (Gokulashtami)',
    nameTa: 'கோகுலாஷ்டமி',
    date: '2026-08-16',
    description: 'Birthday of Lord Krishna celebrated with flowers, butter, and devotional songs.',
    descriptionTa: 'கண்ணன் பிறந்த நாள் மலர்கள், வெண்ணெய் மற்றும் பக்தி பாடல்களுடன் கொண்டாடப்படுகிறது.',
    emoji: '🦚',
    color: 'from-blue-600 to-indigo-600',
    orderByDays: 2,
    suggestedProducts: [
      { id: 601, name: 'Tulsi Garland', price: 149, image: 'https://images.unsplash.com/photo-1613545882494-85ad14f74b9b?w=400&h=400&fit=crop', tag: 'Sacred' },
      { id: 602, name: 'Blue & White Flowers Mix', price: 279, image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=400&h=400&fit=crop', tag: 'Festive' },
      { id: 603, name: 'Kadamba Flowers', price: 199, image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=400&fit=crop', tag: 'Traditional' },
    ],
    tips: [
      'Tulsi (Holy Basil) is the most sacred offering for Krishna',
      'Kadamba flowers are especially associated with Lord Krishna',
    ],
  },
  {
    id: 'vinayaka-chaturthi',
    name: 'Vinayaka Chaturthi',
    nameTa: 'விநாயக சதுர்த்தி',
    date: '2026-08-25',
    description: 'Grand celebration of Lord Ganesha\'s birthday with flower decorations and offerings.',
    descriptionTa: 'விநாயகர் பிறந்த நாள் மலர் அலங்காரங்கள் மற்றும் படையல்களுடன் மிகவும் சிறப்பாக கொண்டாடப்படுகிறது.',
    emoji: '🐘',
    color: 'from-yellow-500 to-amber-600',
    orderByDays: 3,
    suggestedProducts: [
      { id: 701, name: 'Marigold Garland Pack (10ft)', price: 499, image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=400&fit=crop', tag: 'Most Popular' },
      { id: 702, name: 'Red & Orange Mixed Flowers', price: 299, image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=400&h=400&fit=crop', tag: 'Bestseller' },
      { id: 703, name: 'Durva Grass Bundle', price: 79, image: 'https://images.unsplash.com/photo-1613545882494-85ad14f74b9b?w=400&h=400&fit=crop', tag: 'Sacred' },
      { id: 704, name: 'Ganesha Decoration Flowers Set', price: 649, image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=400&h=400&fit=crop', tag: 'Premium' },
    ],
    tips: [
      'Durva grass (21 blades) is the most important offering for Ganesha',
      'Marigold garlands sell out 2 days before — pre-order strongly recommended',
      'Red flowers and hibiscus are especially favored by Ganesha',
    ],
  },
  {
    id: 'navaratri',
    name: 'Navaratri',
    nameTa: 'நவராத்திரி',
    date: '2026-10-14',
    description: 'Nine nights of worship dedicated to Goddess Durga, Lakshmi, and Saraswati.',
    descriptionTa: 'துர்கா, லக்ஷ்மி மற்றும் சரஸ்வதி தேவிகளுக்கு அர்ப்பணிக்கப்பட்ட ஒன்பது இரவுகள்.',
    emoji: '🪔',
    color: 'from-purple-600 to-pink-600',
    orderByDays: 5,
    suggestedProducts: [
      { id: 801, name: 'Daily Pooja Flowers Bundle (9 days)', price: 999, image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=400&fit=crop', tag: 'Festival Pack' },
      { id: 802, name: 'Red Hibiscus Bunch', price: 199, image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=400&h=400&fit=crop', tag: 'Sacred' },
      { id: 803, name: 'Jasmine Strings 100g', price: 249, image: 'https://images.unsplash.com/photo-1613545882494-85ad14f74b9b?w=400&h=400&fit=crop', tag: 'Bestseller' },
      { id: 804, name: 'Kolu Decoration Flowers', price: 799, image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=400&h=400&fit=crop', tag: 'Premium' },
    ],
    tips: [
      'Subscribe to our 9-day Navaratri flower package for daily fresh deliveries',
      'Red flowers for Durga, white for Saraswati, yellow/gold for Lakshmi',
      'Jasmine strings are essential for Kolu decoration',
      'Book the 9-day bundle to save 15% vs daily orders',
    ],
  },
  {
    id: 'saraswati-puja',
    name: 'Saraswati Puja',
    nameTa: 'சரஸ்வதி பூஜை',
    date: '2026-10-22',
    description: 'Eighth day of Navaratri, dedicated to Goddess Saraswati — worship of knowledge and arts.',
    descriptionTa: 'நவராத்திரியின் எட்டாம் நாள், கலை மற்றும் ஞானத்தின் தேவியான சரஸ்வதிக்கு அர்ப்பணிக்கப்பட்டது.',
    emoji: '📚',
    color: 'from-yellow-400 to-orange-400',
    orderByDays: 1,
    suggestedProducts: [
      { id: 901, name: 'White Flower Garland', price: 229, image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=400&fit=crop', tag: 'Auspicious' },
      { id: 902, name: 'Lotus & Jasmine Mix', price: 349, image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=400&h=400&fit=crop' },
    ],
    tips: ['White and yellow flowers are the most auspicious for Saraswati Puja'],
  },
  {
    id: 'diwali',
    name: 'Diwali',
    nameTa: 'தீபாவளி',
    date: '2026-11-07',
    description: 'Festival of lights — homes and temples decorated with flowers, diyas, and rangoli.',
    descriptionTa: 'விளக்குகளின் திருவிழா — வீடுகள் மற்றும் கோவில்கள் மலர்கள், தீபங்கள் மற்றும் கோலங்களால் அலங்கரிக்கப்படுகின்றன.',
    emoji: '✨',
    color: 'from-yellow-400 to-red-500',
    orderByDays: 4,
    suggestedProducts: [
      { id: 1001, name: 'Marigold Decoration Pack (20ft)', price: 899, image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=400&fit=crop', tag: 'Most Popular' },
      { id: 1002, name: 'Rose Petal Bag (1kg)', price: 299, image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=400&h=400&fit=crop', tag: 'Bestseller' },
      { id: 1003, name: 'Chrysanthemum Bunch', price: 249, image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=400&h=400&fit=crop' },
      { id: 1004, name: 'Diwali Door Decoration Set', price: 1299, image: 'https://images.unsplash.com/photo-1613545882494-85ad14f74b9b?w=400&h=400&fit=crop', tag: 'Premium' },
    ],
    tips: [
      'Marigold garlands for door hanging (toran) are in highest demand',
      'Pre-order the Diwali set by Oct 31 to guarantee availability',
      'Rose petals for floor rangoli sell out fastest',
    ],
  },
  {
    id: 'karthigai-deepam',
    name: 'Karthigai Deepam',
    nameTa: 'கார்த்திகை தீபம்',
    date: '2026-11-30',
    description: 'Festival of lamps during the Karthigai month, homes lit with rows of oil lamps and flowers.',
    descriptionTa: 'கார்த்திகை மாதத்தில் தீப விழா, வீடுகளில் தொடர் விளக்குகள் மற்றும் மலர்கள் அலங்காரம்.',
    emoji: '🪔',
    color: 'from-orange-500 to-yellow-400',
    orderByDays: 2,
    suggestedProducts: [
      { id: 1101, name: 'Yellow Chrysanthemum Garland', price: 299, image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=400&fit=crop', tag: 'Traditional' },
      { id: 1102, name: 'Lamp Decoration Flowers Set', price: 449, image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=400&h=400&fit=crop' },
    ],
    tips: ['Yellow flowers are most traditional for Karthigai Deepam'],
  },
  {
    id: 'margazhi',
    name: 'Margazhi Season',
    nameTa: 'மார்கழி',
    date: '2026-12-16',
    description: 'Sacred month of Margazhi — daily kolam, flower offerings, and Thiruvannamalai deepam celebrations.',
    descriptionTa: 'பவித்திரமான மார்கழி மாதம் — தினசரி கோலம், மலர் படையல்கள்.',
    emoji: '🌺',
    color: 'from-red-600 to-rose-500',
    orderByDays: 1,
    suggestedProducts: [
      { id: 1201, name: 'Daily Jasmine Subscription (30 days)', price: 599, image: 'https://images.unsplash.com/photo-1613545882494-85ad14f74b9b?w=400&h=400&fit=crop', tag: 'Subscribe & Save' },
      { id: 1202, name: 'Marigold Monthly Pack', price: 799, image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=400&fit=crop', tag: 'Best Value' },
      { id: 1203, name: 'Mixed Pooja Flower Subscription', price: 999, image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=400&h=400&fit=crop', tag: 'Popular' },
    ],
    tips: [
      'Margazhi runs for 30 days — subscribe to save vs daily orders',
      'Jasmine is the most popular flower during Margazhi month',
      'Thiruvannamalai Deepam subscribers need special garland packages',
    ],
  },
]

/** Returns upcoming festivals within the next `days` days, sorted by date */
export function getUpcomingFestivals(days = 60): Festival[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const limit = new Date(today)
  limit.setDate(today.getDate() + days)

  return festivals2026
    .filter((f) => {
      const fd = new Date(f.date)
      return fd >= today && fd <= limit
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/** Returns the next single upcoming festival */
export function getNextFestival(): Festival | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sorted = festivals2026
    .filter((f) => new Date(f.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return sorted[0] ?? null
}

/** Returns how many days until a festival date */
export function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/** Returns true if the festival's pre-order window is open */
export function isPreOrderOpen(festival: Festival): boolean {
  const days = daysUntil(festival.date)
  return days > 0 && days <= 14
}
