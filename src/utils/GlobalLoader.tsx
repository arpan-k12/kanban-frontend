import { useIsFetching, useIsMutating } from "@tanstack/react-query";

const GlobalLoader = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  if (isFetching || isMutating) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }
  return null;
};

export default GlobalLoader;
