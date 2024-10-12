export const CardFooterSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-4 w-full p-4 animate-pulse">

      <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>

      <div className="w-full flex justify-between items-center">
        <div className="h-6 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-6 w-10 bg-gray-300 dark:bg-gray-600 rounded ml-2"></div>
      </div>
    </div>
  );
};
