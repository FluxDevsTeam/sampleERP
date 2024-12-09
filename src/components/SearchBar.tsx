import { Notifications, SearchIcon } from "../utils/SvgIcons";
import { woman } from "../assets";

const SearchBar = () => {
  return (
    <div className="md:w-[60%] w-fit flex items-center gap-4">
      <div className="max-w-[533px] hidden  w-full pl-4 md:flex items-center gap-4 bg-gray-10 h-[52px] rounded-full">
        <SearchIcon className="#718EBF" />
        <input
          type="text"
          name="search"
          id="serach"
          placeholder="Search for something..."
          className="w-full outline-none focus:outline-none bg-transparent appearance-none h-full rounded-r-full text-blue-10 text-base"
        />
      </div>
      {/* notifications */}
      <div className="size-[29px] md:size-[45px] items-center justify-center flex rounded-full bg-gray-10">
        <Notifications />
      </div>
      <img
        src={woman}
        alt="user"
        className="size-[29px] md:size-[45px] rounded-full object-cover"
      />
    </div>
  );
};

export default SearchBar;
