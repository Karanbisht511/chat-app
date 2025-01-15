import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  return (
    <div className="search" style={{ color: "#8A8888" }}>
      <FontAwesomeIcon icon={faMagnifyingGlass} />
      <input
        type="text"
        name=""
        id=""
        placeholder="Search"
        style={{ border: "2px solid black" }}
      />
    </div>
  );
};

export default Search;
