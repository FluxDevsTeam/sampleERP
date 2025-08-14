import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AssetsData, AssetSummary } from "./_api/apiService";
import AssetsDataTable from "./_components/AssetsTable";
import AssetsDataCard from "./_components/AssetsData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import AddAssetModal from "./_components/AddAssetsModal";
// import Header from "./_components/AssetsHeader"
// import AssetsTable from "./_components/AssetsTable"

const Assets = () => {
  document.title = "Assets - KDC Admin";
  const tableHeaders = ["Asset", "Value", "Lifespan", "Status", "Details"];
  const [totalAssetsCount, setTotalAssetsCount] = useState(0);
  const [goodAssetsCount, setGoodAssetsCount] = useState(0);
  const [goodAssetsValue, setGoodAssetsValue] = useState(0);
  const [depreciatedAssetsCount, setDepreciatedAssetsCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery<AssetSummary, Error>({
    queryKey: ["assetsData", searchQuery, showAvailable, showDeprecated],
    queryFn: () => AssetsData({ search: searchQuery, is_still_available: getAvailabilityFilter() }),
  });

  useEffect(() => {
    if (data) {
      setTotalAssetsCount(data.results.total_assets_count);
      setGoodAssetsCount(data.results.good_assets_count);
      setGoodAssetsValue(data.results.good_assets_value);
      setDepreciatedAssetsCount(data.results.depreciated_assets_count);
    }
  }, [data]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
    setShowAvailable(false);
    setShowDeprecated(false);
  };

  const getAvailabilityFilter = () => {
    if (showAvailable && !showDeprecated) {
      return true;
    }
    if (showDeprecated && !showAvailable) {
      return false;
    }
    return undefined; // Neither selected, or both selected (ambiguous, so show all)
  };

  if (isLoading) return <p>Loading assets data...</p>;
  if (error) return <p>Error loading assets: {error.message}</p>;

  return (
    <div className="wrapper w-full mb-20 md:mb-2 mx-auto md:pt-4">
      {/* Asset Summary Cards */}
      <div
        className={`grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 sm:mb-6 ${
          isAddModalOpen || isTableModalOpen ? "blur-md" : ""
        }`}
      >
        <AssetsDataCard info="Total Assets Count" digits={totalAssetsCount} />
        <AssetsDataCard info="Good Assets Count" digits={goodAssetsCount} />
        <AssetsDataCard info="deprecated Assets Count" digits={depreciatedAssetsCount} />
        <AssetsDataCard info="Good Assets Value" digits={goodAssetsValue} currency="₦ " />
      </div>

      {/* Asset Items Heading and Add Button Row */}
      <div className={`flex flex-row items-center justify-between gap-2 ${
        isAddModalOpen || isTableModalOpen ? "blur-md" : ""
      }`}>
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold md:py-3 mt-2"
        >
          Asset Items
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="border border-blue-400 text-blue-400 bg-transparent px-2 py-2 rounded hover:bg-blue-50 text-xs sm:text-sm transition-colors"
        >
          <FontAwesomeIcon className="pr-2" icon={faPlus} />
          Add Asset
        </button>
      </div>

      {/* Search, Clear, Filters Row - always one line, right aligned, no wrap */}
      <div className={`w-full flex flex-row flex-nowrap justify-end items-center gap-2 mb-5 overflow-x-auto ${isAddModalOpen || isTableModalOpen ? "blur-md" : ""}`}>
        <input
          type="text"
          placeholder="Search for assets by name..."
          className="border p-2 rounded text-xs w-32 sm:w-48 md:w-64 min-w-[120px]"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button
          onClick={handleSearch}
          className="border border-blue-400 text-blue-400 bg-transparent px-2 py-2 rounded hover:bg-blue-50 text-xs whitespace-nowrap transition-colors"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-300 text-black px-2 py-2 rounded hover:bg-gray-400 text-xs whitespace-nowrap"
        >
          Clear
        </button>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="border p-2 rounded flex items-center text-xs whitespace-nowrap"
          >
            Filters
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-10">
              <div className="p-4">
                <label className="flex items-center cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                    checked={showAvailable}
                    onChange={() => {
                      setShowAvailable(!showAvailable);
                      if (!showAvailable) setShowDeprecated(false);
                    }}
                  />
                  <span>Show Available</span>
                </label>
                <label className="flex items-center cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                    checked={showDeprecated}
                    onChange={() => {
                      setShowDeprecated(!showDeprecated);
                      if (!showDeprecated) setShowAvailable(false);
                    }}
                  />
                  <span>Show Depreciated</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`min-h-0 overflow-auto ${
          isAddModalOpen || isTableModalOpen ? "blur-md" : ""
        }`}
      >
        
        <AssetsDataTable
          headers={tableHeaders}
          searchQuery={searchQuery}
          showAvailable={showAvailable}
          showDeprecated={showDeprecated}
          isTableModalOpen={isTableModalOpen}
        />
      </div>

      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default Assets;