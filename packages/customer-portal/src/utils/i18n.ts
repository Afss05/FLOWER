import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      common: {
        home: 'Home',
        products: 'Products',
        cart: 'Cart',
        checkout: 'Checkout',
        profile: 'Profile',
        logout: 'Logout',
        login: 'Login',
        register: 'Register',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        price: 'Price',
        quantity: 'Quantity',
        total: 'Total',
        add_to_cart: 'Add to Cart',
        remove_from_cart: 'Remove from Cart',
        update_cart: 'Update Cart',
        clear_cart: 'Clear Cart',
        continue_shopping: 'Continue Shopping',
        proceed_checkout: 'Proceed to Checkout',
        place_order: 'Place Order',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Info',
      },
      nav: {
        home: 'Home',
        products: 'Products',
        about: 'About',
        contact: 'Contact',
        subscriptions: 'Subscriptions',
        blogs: 'Blogs',
        cart: 'Cart',
        account: 'Account',
      },
      home: {
        title: 'Fresh Flowers & Pooja Items',
        subtitle: 'Same-day delivery in Chennai',
        featured_products: 'Featured Products',
        trending: 'Trending',
        festival_specials: 'Festival Specials',
        subscriptions: 'Subscription Plans',
      },
    },
  },
  ta: {
    translation: {
      common: {
        home: 'முகப்பு',
        products: 'பொருட்கள்',
        cart: 'வண்டி',
        checkout: 'கட்டணம்',
        profile: 'சுயவிவரம்',
        logout: 'வெளியேறு',
        login: 'உள்நுழைக',
        register: 'பதிவு',
        search: 'தேடல்',
        add_to_cart: 'கார்டில் சேர்க்கவும்',
      },
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
