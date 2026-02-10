import { useState, useEffect } from 'react';
import { type Product } from '../types';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
    category: string;
    currentProductId: string;
}

const RelatedProducts = ({ category, currentProductId }: RelatedProductsProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                // Use the new ML-based recommendation endpoint
                const response = await fetch(`http://localhost:5000/api/products/${currentProductId}/recommendations`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    // Fallback to category based if ML endpoint fails or returns empty (though ML engine handles it, failsafe)
                    console.warn('ML Recommendations failed, falling back to category');
                    const catResponse = await fetch(`http://localhost:5000/api/products?category=${encodeURIComponent(category)}`);
                    const catData = await catResponse.json();
                    setProducts(catData.filter((p: any) => p._id !== currentProductId).slice(0, 4));
                }
            } catch (error) {
                console.error('Failed to load related products', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentProductId) {
            fetchRelated();
        }
    }, [category, currentProductId]);

    if (loading || products.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
                <ProductCard key={product.id || product._id} product={product} />
            ))}
        </div>
    );
};

export default RelatedProducts;
