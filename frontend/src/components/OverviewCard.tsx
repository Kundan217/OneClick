const OverviewCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-semibold text-gray-800 mt-2">{value}</p>
    </div>
  );
};

export default OverviewCard;
