import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Reducer/productsSlice";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

const Parent = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQuery") || "");
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem("selectedCategory") || "");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [expandedDescriptions, setExpandedDescriptions] = useState({}); 

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    let result = items;

    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(result);
  }, [selectedCategory, searchQuery, items]);

  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory);
    localStorage.setItem("searchQuery", searchQuery);
  }, [selectedCategory, searchQuery]);

  const sortItems = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    setFilteredItems((prevItems) =>
      [...prevItems].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (typeof aValue === "string") {
          return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      })
    );
  };

  const toTitleCase = (str) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-blue-500 text-white p-6">
  <div className="container mx-auto text-center">
    <h1 className="text-3xl font-bold ">SHOPPY</h1>
  </div>
</div>
      <div className="flex flex-col sm:flex-row items-center mt-6 gap-4 mb-6">
        <select
          className="border border-gray-300 p-2 rounded w-full sm:w-1/4"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="men's clothing">Men's Clothing</option>
          <option value="women's clothing">Women's Clothing</option>
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelry</option>
        </select>

        <div className="flex flex-1">
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-l w-full"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 rounded-r"
            onClick={() => setSearchQuery(searchQuery)}
          >
            Search
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left cursor-pointer" onClick={() => sortItems("category")}>
                Category
              </th>
              <th className="p-4 text-left cursor-pointer w-1/4 hidden sm:table-cell" onClick={() => sortItems("title")}>
                Title
              </th>
              <th className="p-4 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((product, index) => (
              <tr
                key={product.id}
                className={`hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-4">{toTitleCase(product.category)}</td>
                <td className="p-4 font-medium hidden sm:table-cell">{product.title}</td>
                <td className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-32 h-32 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-600">
                      {expandedDescriptions[product.id]
                        ? product.description
                        : `${product.description.slice(0, 50)}...`}
                    </p>
                    {product.description.length > 50 && (
                      <button
                        onClick={() => toggleDescription(product.id)}
                        className="text-blue-500 text-sm"
                      >
                        {expandedDescriptions[product.id] ? "Show Less" : "Show More"}
                      </button>
                    )}
                    <Rating
                      name={`rating-${product.id}`}
                      value={product.rating.rate}
                      precision={0.1}
                      readOnly
                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <p className="text-gray-700 text-sm">{product.rating.count} Reviews</p>
                    <p className="font-bold text-gray-800">₹ {product.price}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Parent;
