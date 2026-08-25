const Product = require('../models/Product.model');

// @desc    Process chat message and return AI response with product recommendations
// @route   POST /api/v1/ai/chat
// @access  Public
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }

    // Step 1: Pre-fetch some relevant products based on the query to give Ollama context
    // In a real advanced setup, you'd use embeddings (RAG). Here we do simple keyword matching 
    // to feed a context list to Ollama.
    const lowercaseMsg = message.toLowerCase();
    let query = {};
    
    if (lowercaseMsg.includes('phone') || lowercaseMsg.includes('smartphone') || lowercaseMsg.includes('mobile')) {
      query = { $or: [{ title: { $regex: 'phone|mobile', $options: 'i' } }, { tags: { $in: ['electronics', 'smartphone', 'mobile'] } }] };
    } else if (lowercaseMsg.includes('laptop') || lowercaseMsg.includes('computer')) {
      query = { $or: [{ title: { $regex: 'laptop|computer', $options: 'i' } }, { tags: { $in: ['electronics', 'laptop', 'computer'] } }] };
    } else if (lowercaseMsg.includes('shoe') || lowercaseMsg.includes('sneaker')) {
      query = { $or: [{ title: { $regex: 'shoe|sneaker', $options: 'i' } }, { tags: { $in: ['shoes', 'footwear', 'sneakers'] } }] };
    } else if (lowercaseMsg.includes('shirt') || lowercaseMsg.includes('clothing') || lowercaseMsg.includes('wear')) {
      query = { $or: [{ title: { $regex: 'shirt|clothing|wear', $options: 'i' } }, { tags: { $in: ['clothing', 'apparel', 'shirt'] } }] };
    } else if (lowercaseMsg.includes('cheap') || lowercaseMsg.includes('budget') || lowercaseMsg.includes('sale')) {
      query = { discount: { $gt: 0 } };
    } else if (lowercaseMsg.includes('recommend') || lowercaseMsg.includes('best') || lowercaseMsg.includes('popular')) {
      query = { rating: { $gte: 4 } };
    }

    let recommendedProducts = await Product.find(query)
      .select('title slug images price discountedPrice rating discount category tags')
      .limit(5)
      .sort({ rating: -1, reviewCount: -1 });

    if (recommendedProducts.length === 0) {
      recommendedProducts = await Product.find({ isFeatured: true })
        .select('title slug images price discountedPrice rating discount category tags')
        .limit(5);
    }

    // Prepare context for the prompt
    const productsContext = recommendedProducts.map(p => 
      `- ${p.title} ($${p.discountedPrice || p.price}): ${p.category} with rating ${p.rating}`
    ).join('\\n');

    const prompt = `You are an expert, friendly AI shopping assistant for ShopPilot.
    
The user says: "${message}"

Here is a list of available products that match their query or are featured:
${productsContext}

Answer the user directly and concisely. Recommend 1 or 2 products from the list above if they match the user's intent. Do not mention that you were given a list, just act naturally. Keep your response under 3 sentences.`;

    let replyText = "I'm having trouble connecting to my brain right now, but here are some products you might like!";

    // Call local Ollama API
    try {
      const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'phi3', // Default to a lightweight model, you can change to 'llama3'
          prompt: prompt,
          stream: false
        })
      });

      if (ollamaResponse.ok) {
        const data = await ollamaResponse.json();
        replyText = data.response;
      } else {
        console.warn('Ollama API returned an error:', ollamaResponse.statusText);
      }
    } catch (ollamaErr) {
      console.warn('Could not connect to local Ollama instance at localhost:11434. Falling back to default response.', ollamaErr.message);
    }

    res.status(200).json({
      success: true,
      replyText,
      recommendedProducts
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message'
    });
  }
};
