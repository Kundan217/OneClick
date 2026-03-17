import { askGemini } from '../utils/gemini.js';
import { Product } from '../models/Product.js';

// ─── Smart Search Handler ──────────────────────────────────────────────────────
export const search = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    // Fetch products from DB (limit to 80 for context window efficiency)
    const products = await Product.find({ availability: true })
      .populate('category', 'name')
      .select('title description price discount category rating numReviews image countInStock _id slug')
      .limit(80)
      .lean();

    if (products.length === 0) {
      return res.json({ products: [], message: 'No products available in the database.' });
    }

    // Build a compact product list for Gemini
    const productList = products.map((p, i) =>
      `${i}. [ID:${p._id}] "${p.title}" | Category: ${p.category?.name || 'Unknown'} | Price: ₹${p.price} | Discount: ${p.discount}% | Rating: ${p.rating}/5 | Stock: ${p.countInStock}`
    ).join('\n');

    const prompt = `You are a smart product search engine for an e-commerce platform called OneClick.

User query: "${query}"

Available products:
${productList}

Your task:
- Identify the product indices (0-based) that best match the user's query.
- Consider: product title, category, price range hints (e.g. "cheap", "affordable", "under ₹500"), and quality hints (e.g. "best", "rated").
- Return ONLY a valid JSON array of the matching 0-based indices, sorted by relevance.
- Return at most 12 results.
- If NO products match at all, return an empty array: []
- Do NOT include any explanation, only the JSON array.

Example response format: [2, 5, 11, 0]`;

    const aiResponse = await askGemini(prompt);

    // Parse the indices returned by Gemini
    const jsonMatch = aiResponse.match(/\[[\d,\s]*\]/);
    if (!jsonMatch) {
      return res.json({ products: [], message: 'Could not understand the search. Try different keywords.' });
    }

    const indices = JSON.parse(jsonMatch[0]);
    const matchedProducts = indices
      .filter(i => i >= 0 && i < products.length)
      .map(i => products[i]);

    res.json({ products: matchedProducts });
  } catch (error) {
    console.error('AI Search error:', error.message);
    res.status(500).json({ error: 'AI search is temporarily unavailable.' });
  }
};
