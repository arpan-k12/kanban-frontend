import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchStore } from "../../store/searchStore";

export default function PublicHeader() {
  const { searchQuery, setSearchQuery, clearSearch } = useSearchStore();
  const [localValue, setLocalValue] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, setSearchQuery]);

  return (
    <header className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <div className="text-xl font-bold text-gray-800">MyWebsite</div>

      <div className="relative w-full max-w-xs">
        <input
          type="text"
          placeholder="Search..."
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="w-full pl-10 pr-9 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />

        {localValue && (
          <button
            onClick={() => {
              setLocalValue("");
              clearSearch();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
