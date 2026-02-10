interface Category {
  name: string;
  description: string;
  icon: string;
  color: string;
}

import { Link } from 'react-router-dom';

const CategoryCard = ({ category }: { category: Category }) => {
  const categoryLink = `/category/${encodeURIComponent(category.name)}`;
  return (
    <Link to={categoryLink} className={`block p-6 rounded-xl text-white transform hover:scale-105 transition-transform duration-300 ease-in-out ${category.color}`}>
      <div className="text-4xl mb-4">{category.icon}</div>
      <h3 className="text-2xl font-bold">{category.name}</h3>
      <p className="mt-2 opacity-90">{category.description}</p>
    </Link>
  );
};

export default CategoryCard;
