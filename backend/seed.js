const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product.model');
const Category = require('./src/models/Category.model');
const Brand = require('./src/models/Brand.model');

// Load env vars
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();

    // Create Brand
    const createdBrand = await Brand.create({
      name: 'TechBrand',
      slug: 'techbrand',
      description: 'Quality tech products',
    });

    // Create Category
    const createdCategory = await Category.create({
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic items and gadgets',
    });

    // Create Products
    const products = [
      {
        title: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'High quality noise cancelling wireless headphones.',
        shortDescription: 'Noise cancelling headphones',
        brandId: createdBrand._id,
        categoryId: createdCategory._id,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'],
        price: 4999,
        discount: 10,
        stock: 50,
        rating: 4.5,
        reviewCount: 12,
        isFeatured: true,
      },
      {
        title: 'Smart Watch Series 5',
        slug: 'smart-watch-series-5',
        description: 'Latest smartwatch with health tracking.',
        shortDescription: 'Smartwatch with fitness tracking',
        brandId: createdBrand._id,
        categoryId: createdCategory._id,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'],
        price: 2999,
        discount: 0,
        stock: 30,
        rating: 4.2,
        reviewCount: 8,
        isFeatured: false,
      },
      {
        title: 'Smartphone Pro Max',
        slug: 'smartphone-pro-max',
        description: '6.7 inch display, 128GB storage, 12MP camera.',
        shortDescription: 'Latest smartphone model',
        brandId: createdBrand._id,
        categoryId: createdCategory._id,
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'],
        price: 45000,
        discount: 15,
        stock: 15,
        rating: 4.8,
        reviewCount: 45,
        isFeatured: true,
      }
    ];

    await Product.insertMany(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
