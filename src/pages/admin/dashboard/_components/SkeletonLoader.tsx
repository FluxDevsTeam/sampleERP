const SkeletonLoader = () => {
  return (
    <div className="w-full">
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-full"></div>
        <div className="h-6 bg-gray-300 rounded w-full"></div>
        <div className="h-6 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
