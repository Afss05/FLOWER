import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import sequelize from "../config/database.js";
import { setupAssociations } from "../models/associations.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import ProductImage from "../models/ProductImage.js";
import Blog from "../models/Blog.js";
import Coupon from "../models/Coupon.js";

// Import rest so associations resolve
import "../models/Cart.js";
import "../models/CartItem.js";
import "../models/Order.js";
import "../models/OrderItem.js";
import "../models/Payment.js";
import "../models/Address.js";
import "../models/Review.js";
import "../models/Subscription.js";
import "../models/SubscriptionDelivery.js";

setupAssociations();

const TENANT_ID = "default";

async function seed(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("✓ Database connected");

    // ── Users ─────────────────────────────────────────────────────────────
    const adminHash = await bcrypt.hash("Admin@12345", 12);
    const customerHash = await bcrypt.hash("Customer@12345", 12);

    const [admin] = await User.findOrCreate({
      where: { email: "admin@flowershop.com", tenantId: TENANT_ID },
      defaults: {
        tenantId: TENANT_ID,
        name: "Admin User",
        email: "admin@flowershop.com",
        phone: "+91-9876543210",
        password: adminHash,
        role: "admin",
        status: "active",
      },
    });

    const [customer] = await User.findOrCreate({
      where: { email: "customer@flowershop.com", tenantId: TENANT_ID },
      defaults: {
        tenantId: TENANT_ID,
        name: "Priya Sundaram",
        email: "customer@flowershop.com",
        phone: "+91-9876543211",
        password: customerHash,
        role: "customer",
        status: "active",
      },
    });

    console.log("✓ Users seeded");

    // ── Categories ────────────────────────────────────────────────────────
    const categoryData = [
      { name: "Garlands", slug: "garlands", description: "Traditional flower garlands for puja and celebrations", displayOrder: 1 },
      { name: "Loose Flowers", slug: "loose-flowers", description: "Fresh loose flowers sold by weight", displayOrder: 2 },
      { name: "Pooja Items", slug: "pooja-items", description: "Essential items for daily and special puja", displayOrder: 3 },
      { name: "Festival Specials", slug: "festival-specials", description: "Special arrangements for Tamil festivals", displayOrder: 4 },
      { name: "Flower Baskets", slug: "flower-baskets", description: "Decorative flower baskets for gifting", displayOrder: 5 },
    ];

    const categories: Category[] = [];
    for (const cat of categoryData) {
      const [c] = await Category.findOrCreate({
        where: { slug: cat.slug, tenantId: TENANT_ID },
        defaults: { ...cat, tenantId: TENANT_ID },
      });
      categories.push(c);
    }

    console.log("✓ Categories seeded");

    // ── Products ──────────────────────────────────────────────────────────
    const productData = [
      {
        categoryIndex: 0,
        name: "Jasmine Garland (Malli Malai)",
        descriptionEn: "Fresh jasmine garland, hand-woven with premium mogra flowers. Perfect for temple offerings and bridal use.",
        descriptionTa: "தாஜா மல்லிகை மாலை, தரமான மொக்க பூக்களால் கைமுறையாக நெய்யப்பட்டது. கோயில் நேர்த்திக்கு சரியானது.",
        templeUsage: "Offered to Goddess Parvati and Lord Shiva",
        sku: "GRLND-JAS-001",
        price: 80,
        discountedPrice: 65,
        stockQuantity: 50,
        minOrderQuantity: 1,
        isFresh: true,
        freshnessdays: 1,
        isSeasonal: false,
        isFestivalSpecial: false,
        rating: 4.8,
        reviewCount: 124,
      },
      {
        categoryIndex: 0,
        name: "Rose Garland (Roja Malai)",
        descriptionEn: "Premium red rose garland for weddings and special occasions. Each garland is 3 feet long.",
        descriptionTa: "திருமணம் மற்றும் சிறப்பு நிகழ்வுகளுக்கான தரமான சிவப்பு ரோஜா மாலை.",
        templeUsage: "Offered to Lord Murugan and Goddess Lakshmi",
        sku: "GRLND-ROSE-001",
        price: 150,
        discountedPrice: 120,
        stockQuantity: 30,
        minOrderQuantity: 1,
        isFresh: true,
        freshnessdays: 2,
        isSeasonal: false,
        isFestivalSpecial: false,
        rating: 4.6,
        reviewCount: 89,
      },
      {
        categoryIndex: 1,
        name: "Marigold Flowers (Samandhi Poo)",
        descriptionEn: "Bright orange marigold flowers, sold per 100g. Essential for Navratri and festival decorations.",
        descriptionTa: "பிரகாசமான ஆரஞ்சு சாமந்தி பூக்கள், 100 கிராமுக்கு விற்கப்படுகின்றன. நவராத்திரி அலங்காரத்திற்கு அவசியம்.",
        templeUsage: "Used for deity decoration and kolam",
        sku: "FLWR-MRGL-001",
        price: 40,
        discountedPrice: null,
        stockQuantity: 200,
        minOrderQuantity: 1,
        isFresh: true,
        freshnessdays: 3,
        isSeasonal: false,
        isFestivalSpecial: false,
        rating: 4.5,
        reviewCount: 203,
      },
      {
        categoryIndex: 1,
        name: "Lotus Flowers (Thaamarai)",
        descriptionEn: "Sacred pink lotus flowers for Lakshmi puja. Available in bud and full bloom.",
        descriptionTa: "லக்ஷ்மி பூஜைக்கான புனிதமான இளஞ்சிவப்பு தாமரை பூக்கள்.",
        templeUsage: "Essential for Lakshmi puja and Saraswati puja",
        sku: "FLWR-LTUS-001",
        price: 120,
        discountedPrice: 100,
        stockQuantity: 60,
        minOrderQuantity: 5,
        isFresh: true,
        freshnessdays: 2,
        isSeasonal: true,
        isFestivalSpecial: false,
        rating: 4.9,
        reviewCount: 67,
      },
      {
        categoryIndex: 2,
        name: "Camphor Tablets (Karpooram)",
        descriptionEn: "Pure camphor tablets for aarti and puja. Pack of 100 tablets.",
        descriptionTa: "ஆரத்தி மற்றும் பூஜைக்கான தூய கர்பூர மாத்திரைகள். 100 மாத்திரைகள் தொகுப்பு.",
        templeUsage: "Used in all pujas for aarti",
        sku: "POOJ-CAMP-001",
        price: 60,
        discountedPrice: 50,
        stockQuantity: 500,
        minOrderQuantity: 1,
        isFresh: false,
        freshnessdays: null,
        isSeasonal: false,
        isFestivalSpecial: false,
        rating: 4.7,
        reviewCount: 341,
      },
      {
        categoryIndex: 2,
        name: "Incense Sticks (Agarbathi) - Jasmine",
        descriptionEn: "Premium jasmine incense sticks, long-burning 45-minute sticks. Pack of 50.",
        descriptionTa: "தரமான மல்லிகை அகர்பத்தி, 45 நிமிட நீண்ட எரியும் குச்சிகள். 50 தொகுப்பு.",
        templeUsage: "Daily puja and meditation",
        sku: "POOJ-INCN-JAS",
        price: 45,
        discountedPrice: null,
        stockQuantity: 300,
        minOrderQuantity: 1,
        isFresh: false,
        freshnessdays: null,
        isSeasonal: false,
        isFestivalSpecial: false,
        rating: 4.4,
        reviewCount: 178,
      },
      {
        categoryIndex: 3,
        name: "Pongal Special Arrangement",
        descriptionEn: "Beautiful flower arrangement for Pongal celebrations. Includes sugarcane, turmeric, and seasonal flowers.",
        descriptionTa: "பொங்கல் கொண்டாட்டங்களுக்கான அழகான மலர் அமைப்பு. கரும்பு, மஞ்சள் மற்றும் பருவகால பூக்கள் உள்ளிட்டவை.",
        templeUsage: "Pongal festival puja",
        sku: "FEST-PNGL-001",
        price: 350,
        discountedPrice: 280,
        stockQuantity: 25,
        minOrderQuantity: 1,
        isFresh: true,
        freshnessdays: 2,
        isSeasonal: true,
        isFestivalSpecial: true,
        rating: 4.8,
        reviewCount: 42,
      },
      {
        categoryIndex: 4,
        name: "Mixed Flower Basket",
        descriptionEn: "Elegant basket with roses, lilies, marigold and jasmine. Perfect gifting option.",
        descriptionTa: "ரோஜா, லில்லி, சாமந்தி மற்றும் மல்லிகையுடன் நேர்த்தியான கூடை. அன்பளிப்புக்கு சரியான விருப்பம்.",
        templeUsage: "Gift and temple offering",
        sku: "BSKT-MIX-001",
        price: 450,
        discountedPrice: 380,
        stockQuantity: 15,
        minOrderQuantity: 1,
        isFresh: true,
        freshnessdays: 2,
        isSeasonal: false,
        isFestivalSpecial: false,
        rating: 4.6,
        reviewCount: 55,
      },
    ];

    const products: Product[] = [];
    for (const pd of productData) {
      const { categoryIndex, ...fields } = pd;
      const [p] = await Product.findOrCreate({
        where: { sku: fields.sku, tenantId: TENANT_ID },
        defaults: {
          ...fields,
          tenantId: TENANT_ID,
          categoryId: categories[categoryIndex].id,
        } as any,
      });
      products.push(p);
    }

    console.log("✓ Products seeded");

    // ── Product Images ────────────────────────────────────────────────────
    const imageUrls = [
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
      "https://images.unsplash.com/photo-1487530811015-780bdf01b25e?w=400",
      "https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=400",
      "https://images.unsplash.com/photo-1592429827892-2f4e03b2e1a8?w=400",
      "https://images.unsplash.com/photo-1549989476-69a92fa57c36?w=400",
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      "https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?w=400",
    ];

    for (let i = 0; i < products.length; i++) {
      await ProductImage.findOrCreate({
        where: { productId: products[i].id, displayOrder: 1 },
        defaults: {
          productId: products[i].id,
          imageUrl: imageUrls[i],
          altText: products[i].name,
          displayOrder: 1,
        },
      });
    }

    console.log("✓ Product images seeded");

    // ── Blog Posts ────────────────────────────────────────────────────────
    await Blog.findOrCreate({
      where: { slug: "significance-of-flowers-in-south-indian-temples" },
      defaults: {
        tenantId: TENANT_ID,
        authorId: admin.id,
        titleEn: "Significance of Flowers in South Indian Temples",
        titleTa: "தென்னிந்திய கோயில்களில் பூக்களின் முக்கியத்துவம்",
        slug: "significance-of-flowers-in-south-indian-temples",
        contentEn: `Flowers have always held a sacred place in South Indian temple worship. Each deity has specific flowers associated with them.

Lord Murugan: Lotus and red roses are the preferred flowers. Lord Shiva: Jasmine (Malli) and white flowers. Goddess Lakshmi: Pink lotus for purity and prosperity.

Order your fresh temple flowers from our store for next-day delivery across Chennai and Coimbatore.`,
        contentTa: "தென்னிந்திய கோயில் வழிபாட்டில் பூக்கள் எப்போதும் புனித இடம் பெற்றுள்ளன.",
        excerptEn: "Discover which flowers are sacred to each South Indian deity and how to properly offer them.",
        excerptTa: "தென்னிந்திய தெய்வங்களுக்கு எந்த பூக்கள் புனிதமானவை என்று கண்டறியுங்கள்.",
        featuredImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800",
        status: "published",
        publishedAt: new Date(),
        seoTitle: "Sacred Flowers in South Indian Temples",
        seoDescription: "Learn about the significance of flowers in South Indian temple worship.",
        seoKeywords: "temple flowers, puja flowers, south india, jasmine, lotus",
      } as any,
    });

    await Blog.findOrCreate({
      where: { slug: "pongal-flowers-guide" },
      defaults: {
        tenantId: TENANT_ID,
        authorId: admin.id,
        titleEn: "Complete Guide to Pongal Flower Decorations",
        titleTa: "பொங்கல் மலர் அலங்காரங்களுக்கான முழுமையான வழிகாட்டி",
        slug: "pongal-flowers-guide",
        contentEn: `Pongal is one of the most important harvest festivals in Tamil Nadu. Flower decorations play a vital role.

Marigold petals are used to create colorful kolam designs around the pongal pot. Fresh sugarcane tied with banana leaves and marigold creates the traditional entrance decoration.

Order your Pongal flowers at least 2 days in advance to ensure freshness.`,
        contentTa: "பொங்கல் தமிழ்நாட்டில் மிக முக்கியமான அறுவடை திருவிழாவாகும்.",
        excerptEn: "A complete guide to traditional flower decorations for Pongal festival celebrations.",
        excerptTa: "பொங்கல் திருவிழா கொண்டாட்டங்களுக்கான பாரம்பரிய மலர் அலங்காரங்கள்.",
        featuredImage: "https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=800",
        status: "published",
        publishedAt: new Date(),
        seoTitle: "Pongal Flower Decorations Guide",
        seoDescription: "Complete guide to traditional flower decorations for Pongal festival.",
        seoKeywords: "pongal, marigold, festival flowers, kolam, decoration",
      } as any,
    });

    console.log("✓ Blog posts seeded");

    // ── Coupons ───────────────────────────────────────────────────────────
    await Coupon.findOrCreate({
      where: { code: "WELCOME10" },
      defaults: {
        tenantId: TENANT_ID,
        code: "WELCOME10",
        discountType: "percentage",
        discountValue: 10,
        minAmount: 100,
        maxUses: 1000,
        usedCount: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      } as any,
    });

    await Coupon.findOrCreate({
      where: { code: "PONGAL25" },
      defaults: {
        tenantId: TENANT_ID,
        code: "PONGAL25",
        discountType: "percentage",
        discountValue: 25,
        minAmount: 300,
        maxUses: 500,
        usedCount: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      } as any,
    });

    console.log("✓ Coupons seeded");

    console.log("\n✅ Seed complete!");
    console.log("   Admin:    admin@flowershop.com   / Admin@12345");
    console.log("   Customer: customer@flowershop.com / Customer@12345");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
