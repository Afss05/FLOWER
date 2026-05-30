export interface GiftItem {
  id: string
  name: string
  category: 'flowers' | 'chocolates' | 'teddy' | 'cake' | 'card' | 'perfume' | 'candles'
  icon: string
  price: number
}

export const GIFT_ITEMS: GiftItem[] = [
  { id: '1',  name: 'Red Roses',       category: 'flowers',    icon: '🌹', price: 799 },
  { id: '2',  name: 'Sunflowers',      category: 'flowers',    icon: '🌻', price: 599 },
  { id: '3',  name: 'Lavender Bouquet',category: 'flowers',    icon: '💐', price: 899 },
  { id: '4',  name: 'Ferrero Rocher',  category: 'chocolates', icon: '🍫', price: 399 },
  { id: '5',  name: 'Lindt Truffles',  category: 'chocolates', icon: '🍬', price: 499 },
  { id: '6',  name: 'Soft Teddy',      category: 'teddy',      icon: '🧸', price: 599 },
  { id: '7',  name: 'Chocolate Cake',  category: 'cake',       icon: '🎂', price: 799 },
  { id: '8',  name: 'Greeting Card',   category: 'card',       icon: '💌', price: 99  },
  { id: '9',  name: 'Premium Perfume', category: 'perfume',    icon: '💐', price: 1299 },
  { id: '10', name: 'Scented Candles', category: 'candles',    icon: '🕯️', price: 399 },
]

export const GIFT_CATEGORIES = [
  { id: 'flowers',    label: 'Flowers',    icon: '🌸' },
  { id: 'chocolates', label: 'Chocolates', icon: '🍫' },
  { id: 'teddy',      label: 'Teddy',      icon: '🧸' },
  { id: 'cake',       label: 'Cake',       icon: '🎂' },
  { id: 'card',       label: 'Card',       icon: '💌' },
  { id: 'perfume',    label: 'Perfume',    icon: '💐' },
  { id: 'candles',    label: 'Candles',    icon: '🕯️' },
]
