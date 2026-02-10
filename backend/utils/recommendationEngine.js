import natural from 'natural';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

export const getRecommendations = (currentProduct, allProducts, limit = 4) => {
    const tfidf = new TfIdf();

    // 1. Add documents to TF-IDF
    // We combine title, category, and description for a rich context
    allProducts.forEach(product => {
        const content = `${product.title} ${product.category} ${product.description}`;
        tfidf.addDocument(content);
    });

    // 2. Find the index of the current product
    const currentIndex = allProducts.findIndex(p => p._id.toString() === currentProduct._id.toString());

    if (currentIndex === -1) return [];

    // 3. Calculate similarities
    // We'll use the vector space model provided by natural or manually compute cosine similarity from terms
    // natural's tfidf.tfidfs gives us the weights for a set of terms.

    // Alternative efficient approach with 'natural':
    // Get terms for the current document
    const currentTerms = tfidf.listTerms(currentIndex);

    const similarityScores = allProducts.map((product, index) => {
        if (index === currentIndex) return { index, score: -1 }; // Ignore self

        // Simple similarity: Sum of TF-IDF weights of shared terms
        // A more proper cosine similarity is better but requires full vector magnitude.
        // For this scale, summing shared term weights is a good approximation of relevance.
        let score = 0;
        currentTerms.forEach(item => {
            score += tfidf.tfidf(item.term, index);
        });

        return { index, score };
    });

    // 4. Sort by score
    const sorted = similarityScores.sort((a, b) => b.score - a.score);

    // 5. Return top N products
    const topRecommendations = sorted.slice(0, limit).map(item => allProducts[item.index]);

    return topRecommendations;
};

export const searchByQuery = (query, allProducts, limit = 10) => {
    const tfidf = new TfIdf();

    // 1. Add documents
    allProducts.forEach(product => {
        const content = `${product.title} ${product.category} ${product.description}`;
        tfidf.addDocument(content);
    });

    // 2. Calculate measure for the query
    // tfidf.tfidfs(query, callback) measures how well the query matches each document
    const scores = [];

    tfidf.tfidfs(query, function (i, measure) {
        scores.push({ index: i, score: measure });
    });

    // 3. Filter and Sort
    // We only want items with some relevance (score > 0)
    const results = scores
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => allProducts[item.index]);

    return results;
};
