import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Reducer/productsSlice";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQuery") || "");
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem("selectedCategory") || "");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showMore, setShowMore] = useState({});

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const toggleShowMore = (id) => {
    setShowMore((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ["All", "Men's Clothing", "Women's Clothing", "Electronics", "Jewelry"];

  return (
    <div className="container mx-auto p-4">
      <div className="bg-blue-500 text-white p-6">
  <div className="container mx-auto text-center">
    <h1 className="text-3xl font-bold ">SHOPPY</h1>
  </div>
</div>
      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div className="w-full lg:w-1/4">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category}
                className={`p-2 cursor-pointer rounded ${
                  selectedCategory === category.toLowerCase()
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() =>
                  setSelectedCategory(category === "All" ? "" : category.toLowerCase())
                }
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-l w-full sm:w-1/2"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((product, index) => (
              <div
                key={product.id}
                className={`p-4 rounded-lg shadow-md ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                }`}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-600 mb-4">
                  {showMore[product.id] || product.description.length <= 100
                    ? product.description
                    : `${product.description.slice(0, 100)}...`}
                  {product.description.length > 100 && (
                    <button
                      className="text-blue-500 ml-2"
                      onClick={() => toggleShowMore(product.id)}
                    >
                      {showMore[product.id] ? "Show Less" : "Show More"}
                    </button>
                  )}
                </p>
                <p className="text-lg font-bold mb-2">₹ {product.price}</p>
                <Rating
                  name={`rating-${product.id}`}
                  value={product.rating.rate}
                  precision={0.1}
                  readOnly
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                <p className="text-gray-500 text-sm">Reviews: {product.rating.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
