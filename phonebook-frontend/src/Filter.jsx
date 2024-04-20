const Filter = ({ searchName, handleSearchChange }) => {
  return (
    <div>
      filter shown with:{" "}
      <input value={searchName} onChange={handleSearchChange} />
    </div>
  );
};

export default Filter;
