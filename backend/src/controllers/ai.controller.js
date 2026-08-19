const Product = require('../models/Product.model');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Process chat message and return AI response with product recommendations
// @route   POST /api/v1/ai/chat
// @access  Public (or Private depending on requirements, let's keep it public so anyone can ask)
exports.chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a message'
    });
  }

  const lowercaseMsg = message.toLowerCase();
  let query = {};
  let replyText = "I'm not quite sure what you're looking for, but here are some of our popular items!";
  let limit = 4;

  // Simple keyword matching for mock AI logic
  if (lowercaseMsg.includes('phone') || lowercaseMsg.includes('smartphone') || lowercaseMsg.includes('mobile')) {
    query = { 
      $or: [
        { title: { $regex: 'phone|mobile', $options: 'i' } },
        { tags: { $in: ['electronics', 'smartphone', 'mobile'] } }
      ]
    };
    replyText = "I'd recommend checking out these fantastic smartphones we have in stock!";
  } else if (lowercaseMsg.includes('laptop') || lowercaseMsg.includes('computer')) {
    query = { 
      $or: [
        { title: { $regex: 'laptop|computer', $options: 'i' } },
        { tags: { $in: ['electronics', 'laptop', 'computer'] } }
      ]
    };
    replyText = "Whether for work or gaming, these laptops are excellent choices.";
  } else if (lowercaseMsg.includes('shoe') || lowercaseMsg.includes('sneaker')) {
    query = { 
      $or: [
        { title: { $regex: 'shoe|sneaker', $options: 'i' } },
        { tags: { $in: ['shoes', 'footwear', 'sneakers'] } }
      ]
    };
    replyText = "Step up your style with these top-rated shoes.";
  } else if (lowercaseMsg.includes('shirt') || lowercaseMsg.includes('clothing') || lowercaseMsg.includes('wear')) {
    query = { 
      $or: [
        { title: { $regex: 'shirt|clothing|wear', $options: 'i' } },
        { tags: { $in: ['clothing', 'apparel', 'shirt'] } }
      ]
    };
    replyText = "Here are some clothing options that might catch your eye.";
  } else if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi ')) {
    replyText = "Hello there! I'm your AI Shopping Assistant. How can I help you find the perfect product today?";
    // Return featured products for a generic greeting
    query = { isFeatured: true };
  } else if (lowercaseMsg.includes('cheap') || lowercaseMsg.includes('budget') || lowercaseMsg.includes('sale')) {
    replyText = "Everyone loves a good deal! Check out these items currently on sale.";
    query = { discount: { $gt: 0 } };
  } else if (lowercaseMsg.includes('recommend') || lowercaseMsg.includes('best') || lowercaseMsg.includes('popular')) {
    replyText = "Here are some of our best-selling and most highly rated products.";
    query = { rating: { $gte: 4 } };
  }

  // Fetch the recommendations
  const recommendedProducts = await Product.find(query)
    .select('title slug images price discountedPrice rating discount')
    .limit(limit)
    .sort({ rating: -1, reviewCount: -1 });

  // If our query found nothing, fall back to featured products
  let finalProducts = recommendedProducts;
  if (finalProducts.length === 0) {
    finalProducts = await Product.find({ isFeatured: true })
      .select('title slug images price discountedPrice rating discount')
      .limit(limit);
    
    if (!lowercaseMsg.includes('hello')) {
       replyText = "I couldn't find exactly what you were asking for, but I think you'll love these featured items!";
    }
  }

  res.status(200).json({
    success: true,
    replyText,
    recommendedProducts: finalProducts
  });
});
