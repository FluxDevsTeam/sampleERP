

const SkeletonLoader = () => {
  return (
    <div>
         <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded w-full"></div>
        <div className="h-6 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  )
}

export default SkeletonLoader