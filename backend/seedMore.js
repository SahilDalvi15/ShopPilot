const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product.model');
const Category = require('./src/models/Category.model');
const Brand = require('./src/models/Brand.model');

dotenv.config();

const seedMore = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Get existing brand/category
    let techBrand = await Brand.findOne({ slug: 'techbrand' });

    // Create more brands
    const brands = {};
    const brandData = [
      { name: 'Nike', slug: 'nike', description: 'Just Do It - Athletic wear and shoes' },
      { name: 'Samsung', slug: 'samsung', description: 'Samsung Electronics' },
      { name: 'Apple', slug: 'apple', description: 'Think Different' },
      { name: 'Sony', slug: 'sony', description: 'Be Moved - Electronics and entertainment' },
      { name: 'Adidas', slug: 'adidas', description: 'Impossible is Nothing' },
      { name: 'Boat', slug: 'boat', description: 'Enjoy every beat' },
      { name: 'OnePlus', slug: 'oneplus', description: 'Never Settle' },
      { name: 'Puma', slug: 'puma', description: 'Forever Faster' },
    ];

    for (const b of brandData) {
      let existing = await Brand.findOne({ slug: b.slug });
      if (!existing) {
        existing = await Brand.create(b);
        console.log(`Created brand: ${b.name}`);
      }
      brands[b.slug] = existing;
    }
    brands['techbrand'] = techBrand;

    // Create more categories
    const categories = {};
    const categoryData = [
      { name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes and accessories' },
      { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home appliances and kitchen essentials' },
      { name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Sports gear and fitness equipment' },
      { name: 'Audio', slug: 'audio', description: 'Headphones, speakers and audio gear' },
      { name: 'Wearables', slug: 'wearables', description: 'Smartwatches and fitness trackers' },
      { name: 'Accessories', slug: 'accessories', description: 'Phone cases, chargers and more' },
    ];

    let electronics = await Category.findOne({ slug: 'electronics' });
    categories['electronics'] = electronics;

    for (const c of categoryData) {
      let existing = await Category.findOne({ slug: c.slug });
      if (!existing) {
        existing = await Category.create(c);
        console.log(`Created category: ${c.name}`);
      }
      categories[c.slug] = existing;
    }

    // New products
    const products = [
      {
        title: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: '6.8" Dynamic AMOLED, 200MP camera, S Pen included, Titanium frame with Snapdragon 8 Gen 3.',
        shortDescription: 'Flagship smartphone with S Pen',
        brandId: brands['samsung']._id,
        categoryId: categories['electronics']._id,
        images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80'],
        price: 129999,
        discount: 12,
        stock: 25,
        rating: 4.9,
        reviewCount: 234,
        isFeatured: true,
      },
      {
        title: 'Apple AirPods Pro 2',
        slug: 'apple-airpods-pro-2',
        description: 'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio with H2 chip.',
        shortDescription: 'Premium wireless earbuds',
        brandId: brands['apple']._id,
        categoryId: categories['audio']._id,
        images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&q=80'],
        price: 24900,
        discount: 8,
        stock: 60,
        rating: 4.7,
        reviewCount: 189,
        isFeatured: true,
      },
      {
        title: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        description: 'The Nike Air Max 270 features Nike\'s biggest heel Air unit yet for a super-soft ride.',
        shortDescription: 'Lifestyle running shoes',
        brandId: brands['nike']._id,
        categoryId: categories['fashion']._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'],
        price: 12995,
        discount: 20,
        stock: 45,
        rating: 4.4,
        reviewCount: 67,
        isFeatured: true,
      },
      {
        title: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        description: 'Industry-leading noise cancellation, 30 hours battery, crystal clear hands-free calling.',
        shortDescription: 'Premium noise cancelling headphones',
        brandId: brands['sony']._id,
        categoryId: categories['audio']._id,
        images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80'],
        price: 29990,
        discount: 15,
        stock: 35,
        rating: 4.8,
        reviewCount: 156,
        isFeatured: true,
      },
      {
        title: 'OnePlus 12',
        slug: 'oneplus-12',
        description: 'Snapdragon 8 Gen 3, 50MP Hasselblad camera, 100W SUPERVOOC charging, 5400mAh battery.',
        shortDescription: 'Performance flagship phone',
        brandId: brands['oneplus']._id,
        categoryId: categories['electronics']._id,
        images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80'],
        price: 64999,
        discount: 10,
        stock: 40,
        rating: 4.6,
        reviewCount: 98,
        isFeatured: false,
      },
      {
        title: 'Adidas Ultraboost 22',
        slug: 'adidas-ultraboost-22',
        description: 'Energy-returning Boost midsole, Primeknit upper, Continental rubber outsole.',
        shortDescription: 'Performance running shoes',
        brandId: brands['adidas']._id,
        categoryId: categories['sports-fitness']._id,
        images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80'],
        price: 16999,
        discount: 25,
        stock: 55,
        rating: 4.5,
        reviewCount: 78,
        isFeatured: false,
      },
      {
        title: 'Boat Airdopes 441',
        slug: 'boat-airdopes-441',
        description: 'TWS earbuds with IWP technology, IPX7 water resistance, 30 hours total playback.',
        shortDescription: 'True wireless earbuds',
        brandId: brands['boat']._id,
        categoryId: categories['audio']._id,
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500&q=80'],
        price: 1999,
        discount: 30,
        stock: 100,
        rating: 4.1,
        reviewCount: 312,
        isFeatured: false,
      },
      {
        title: 'Samsung Galaxy Watch 6',
        slug: 'samsung-galaxy-watch-6',
        description: 'Advanced health monitoring, BioActive sensor, sapphire crystal glass, Wear OS.',
        shortDescription: 'Premium smartwatch',
        brandId: brands['samsung']._id,
        categoryId: categories['wearables']._id,
        images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80'],
        price: 29999,
        discount: 18,
        stock: 30,
        rating: 4.3,
        reviewCount: 65,
        isFeatured: true,
      },
      {
        title: 'Apple iPad Air M2',
        slug: 'apple-ipad-air-m2',
        description: '11-inch Liquid Retina display, M2 chip, 12MP camera, all-day battery life.',
        shortDescription: 'Powerful and portable tablet',
        brandId: brands['apple']._id,
        categoryId: categories['electronics']._id,
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80'],
        price: 59900,
        discount: 5,
        stock: 20,
        rating: 4.7,
        reviewCount: 143,
        isFeatured: true,
      },
      {
        title: 'Nike Dri-FIT Training Tee',
        slug: 'nike-dri-fit-training-tee',
        description: 'Sweat-wicking Dri-FIT technology, lightweight mesh, standard fit for everyday comfort.',
        shortDescription: 'Moisture-wicking training shirt',
        brandId: brands['nike']._id,
        categoryId: categories['sports-fitness']._id,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80'],
        price: 1995,
        discount: 0,
        stock: 80,
        rating: 4.3,
        reviewCount: 45,
        isFeatured: false,
      },
      {
        title: 'Sony PlayStation DualSense Controller',
        slug: 'sony-dualsense-controller',
        description: 'Haptic feedback, adaptive triggers, built-in microphone and speaker, USB-C charging.',
        shortDescription: 'PS5 wireless controller',
        brandId: brands['sony']._id,
        categoryId: categories['electronics']._id,
        images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80'],
        price: 5990,
        discount: 10,
        stock: 70,
        rating: 4.6,
        reviewCount: 210,
        isFeatured: false,
      },
      {
        title: 'Puma RS-X Reinvention',
        slug: 'puma-rs-x-reinvention',
        description: 'Retro-inspired running shoe with RS cushioning, mesh upper, and bold color blocking.',
        shortDescription: 'Retro lifestyle sneakers',
        brandId: brands['puma']._id,
        categoryId: categories['fashion']._id,
        images: ['https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&q=80'],
        price: 8999,
        discount: 15,
        stock: 40,
        rating: 4.2,
        reviewCount: 34,
        isFeatured: false,
      },
      {
        title: 'Samsung 27" 4K Monitor',
        slug: 'samsung-27-4k-monitor',
        description: '27 inch UHD 4K IPS panel, HDR10, 99% sRGB, USB-C connectivity, height-adjustable stand.',
        shortDescription: '4K UHD professional monitor',
        brandId: brands['samsung']._id,
        categoryId: categories['electronics']._id,
        images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'],
        price: 34999,
        discount: 20,
        stock: 15,
        rating: 4.5,
        reviewCount: 88,
        isFeatured: true,
      },
      {
        title: 'Apple Watch Ultra 2',
        slug: 'apple-watch-ultra-2',
        description: '49mm titanium case, precision dual-frequency GPS, up to 36 hours battery life.',
        shortDescription: 'Adventure-ready smartwatch',
        brandId: brands['apple']._id,
        categoryId: categories['wearables']._id,
        images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80'],
        price: 89900,
        discount: 5,
        stock: 12,
        rating: 4.9,
        reviewCount: 176,
        isFeatured: true,
      },
      {
        title: 'Boat Rockerz 550 Headphones',
        slug: 'boat-rockerz-550',
        description: '50mm drivers, 20 hours playback, physical noise isolation, foldable design.',
        shortDescription: 'Over-ear wireless headphones',
        brandId: brands['boat']._id,
        categoryId: categories['audio']._id,
        images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80'],
        price: 1799,
        discount: 35,
        stock: 90,
        rating: 4.0,
        reviewCount: 425,
        isFeatured: false,
      },
      {
        title: 'Adidas Essentials Hoodie',
        slug: 'adidas-essentials-hoodie',
        description: 'Soft French terry cotton, kangaroo pocket, ribbed cuffs, relaxed fit.',
        shortDescription: 'Classic cotton hoodie',
        brandId: brands['adidas']._id,
        categoryId: categories['fashion']._id,
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80'],
        price: 3499,
        discount: 10,
        stock: 65,
        rating: 4.4,
        reviewCount: 56,
        isFeatured: false,
      },
      {
        title: 'OnePlus Buds Pro 2',
        slug: 'oneplus-buds-pro-2',
        description: 'Spatial Audio, ANC up to 48dB, dual drivers, 39 hours total playback.',
        shortDescription: 'Premium ANC earbuds',
        brandId: brands['oneplus']._id,
        categoryId: categories['audio']._id,
        images: ['https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&q=80'],
        price: 11999,
        discount: 20,
        stock: 50,
        rating: 4.5,
        reviewCount: 89,
        isFeatured: false,
      },
    ];

    let added = 0;
    for (const p of products) {
      const exists = await Product.findOne({ slug: p.slug });
      if (!exists) {
        await Product.create(p);
        console.log(`✓ Added: ${p.title}`);
        added++;
      } else {
        console.log(`  Skipped (exists): ${p.title}`);
      }
    }

    console.log(`\nDone! Added ${added} new products.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedMore();
