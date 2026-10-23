import React, { useEffect, useMemo, useState } from "react";
import "./NewArrivals.css";
import heading from "../assets/New Arrivals.png";
import Card from "./Card";
import axios from "axios";

const NewArrivals = () => {
  // ==========================================
  // STATES
  // ==========================================

  const [cateList, setCateList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [activeCategory, setActiveCategory] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const [showMore, setShowMore] = useState(false);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH PRODUCTS + CATEGORIES
  // ==========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [categoryResponse, productResponse] = await Promise.all([
          axios.get("https://dummyjson.com/products/categories"),

          axios.get("https://dummyjson.com/products?limit=0"),
        ]);

        const categories = categoryResponse.data || [];

        const products = productResponse.data?.products || [];

        console.log("Products:", products);
        console.log("Categories:", categories);

        setCateList(categories);
        setAllProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==========================================
  // NORMALIZE SEARCH TEXT
  // ==========================================

  const normalizeText = (text) => {
    return String(text || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  };

  // ==========================================
  // SEARCH + CATEGORY FILTER
  // ==========================================

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    const search = normalizeText(searchTerm);

    // ------------------------------------------
    // SEARCH
    // ------------------------------------------

    if (search !== "") {
      products = products.filter((product) => {
        const title = normalizeText(product.title);

        const category = normalizeText(product.category);

        const brand = normalizeText(product.brand);

        const description = normalizeText(product.description);

        return (
          title.includes(search) ||
          category.includes(search) ||
          brand.includes(search) ||
          description.includes(search)
        );
      });
    }

    // ------------------------------------------
    // CATEGORY
    // ------------------------------------------

    if (activeCategory !== "All") {
      products = products.filter(
        (product) =>
          normalizeText(product.category) === normalizeText(activeCategory),
      );
    }

    return products;
  }, [allProducts, searchTerm, activeCategory]);

  // ==========================================
  // SEARCH CATEGORY AUTO HIGHLIGHT
  // ==========================================

  useEffect(() => {
    const search = normalizeText(searchTerm);

    if (search === "") {
      return;
    }

    // ------------------------------------------
    // FIRST: CHECK CATEGORY NAME
    // ------------------------------------------

    const matchedCategory = cateList.find((category) => {
      const categoryName = normalizeText(category.name);

      const categorySlug = normalizeText(category.slug);

      return (
        categoryName === search ||
        categorySlug === search ||
        categoryName.includes(search) ||
        categorySlug.includes(search)
      );
    });

    if (matchedCategory) {
      setActiveCategory(matchedCategory.slug);

      return;
    }

    // ------------------------------------------
    // SECOND: CHECK PRODUCT
    // ------------------------------------------

    const matchedProduct = allProducts.find((product) => {
      const title = normalizeText(product.title);

      const brand = normalizeText(product.brand);

      return title === search || title.includes(search) || brand === search;
    });

    if (matchedProduct?.category) {
      setActiveCategory(matchedProduct.category);
    }
  }, [searchTerm, cateList, allProducts]);

  // ==========================================
  // CATEGORY CLICK
  // ==========================================

  const filter = (categorySlug) => {
    setActiveCategory(categorySlug);

    // Category select karte waqt search clear
    setSearchTerm("");

    setShowMore(false);
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const clearSearch = () => {
    setSearchTerm("");
    setActiveCategory("All");
    setShowMore(false);
  };

  // ==========================================
  // VIEW MORE / LESS
  // ==========================================

  const visibleProducts = showMore
    ? filteredProducts
    : filteredProducts.slice(0, 6);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="New-container">
        <div className="text-containerr">
          <div>
            <img src={heading} className="NewA-text" alt="New Arrivals" />
          </div>

          <div className="paragraph">
            <p>
              Discover our latest collection with trending products, amazing
              prices and exciting deals.
            </p>
          </div>
        </div>

        <div
          className="
            min-h-[300px]
            flex
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <div className="text-4xl mb-3">⏳</div>

            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div>
      <div className="New-container">
        {/* ==========================================
            HEADING
        ========================================== */}

        <div className="text-containerr">
          <div>
            <img src={heading} className="NewA-text" alt="New Arrivals" />
          </div>

          <div className="paragraph">
            <p>
              Discover our latest collection with trending products, amazing
              prices and exciting deals.
            </p>
          </div>
        </div>

        {/* ==========================================
            SEARCH BAR
        ========================================== */}

        <div className="w-full flex justify-center mt-8 px-4">
          <div className="relative w-full max-w-[600px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowMore(false);
              }}
              placeholder="Search products..."
              className="
                w-full
                h-[52px]
                border
                border-gray-300
                rounded-[10px]
                px-12
                pr-12
                outline-none
                font-[Poppins]
                text-sm
                sm:text-base
                focus:border-black
                transition-all
              "
            />

            {/* SEARCH ICON */}

            <span
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-500
                text-xl
              "
            >
              🔍
            </span>

            {/* CLEAR SEARCH */}

            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-black
                  text-lg
                  cursor-pointer
                "
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ==========================================
            CATEGORY LIST
        ========================================== */}

        <div
          className="
            w-full
            max-w-[1070px]
            h-[60px]
            mt-[40px]
            mx-auto
            px-2
            sm:px-3
            md:px-4
            flex
            items-center
            overflow-x-auto
            gap-3
            sm:gap-4
            md:gap-6
            lg:gap-8
            font-[Poppins]
            text-[13px]
            scrollbar-none
          "
        >
          {/* ALL */}

          <div
            className={`
              min-w-[130px]
              sm:min-w-[150px]
              md:min-w-[170px]
              h-[46px]
              sm:h-[52px]
              md:h-[56px]
              flex-shrink-0
              rounded-[10px]
              flex
              items-center
              justify-center
              cursor-pointer
              transition-all
              duration-300
              text-[12px]
              sm:text-[14px]
              md:text-[16px]
              whitespace-nowrap

              ${
                activeCategory === "All"
                  ? "bg-black text-white"
                  : "bg-[rgba(250,250,250,1)] text-[rgba(138,138,138,1)] hover:bg-black hover:text-white"
              }
            `}
            onClick={() => filter("All")}
          >
            All
          </div>

          {/* CATEGORIES */}

          {cateList.map((item) => (
            <div
              key={item.slug}
              className={`
                min-w-[140px]
                sm:min-w-[170px]
                md:min-w-[207px]
                h-[46px]
                sm:h-[52px]
                md:h-[56px]
                px-3
                sm:px-4
                md:px-6
                flex-shrink-0
                rounded-[10px]
                flex
                items-center
                justify-center
                cursor-pointer
                transition-all
                duration-300
                text-[12px]
                sm:text-[14px]
                md:text-[16px]
                whitespace-nowrap
                overflow-hidden
                text-ellipsis

                ${
                  activeCategory === item.slug
                    ? "bg-black text-white"
                    : "bg-[rgba(250,250,250,1)] text-[rgba(138,138,138,1)] hover:bg-black hover:text-white"
                }
              `}
              onClick={() => filter(item.slug)}
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* ==========================================
            RESULT COUNT
        ========================================== */}

        <div
          className="
            w-full
            max-w-[1200px]
            mx-auto
            px-4
            mt-5
            flex
            items-center
            justify-between
            flex-wrap
            gap-3
          "
        >
          <p
            className="
              text-sm
              text-gray-500
              font-[Poppins]
            "
          >
            {searchTerm ? (
              <>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"} found
                for "
                <span className="text-black font-medium">{searchTerm}</span>"
              </>
            ) : (
              <>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </>
            )}
          </p>

          {/* CLEAR FILTER */}

          {(searchTerm || activeCategory !== "All") && (
            <button
              type="button"
              onClick={clearSearch}
              className="
                text-sm
                underline
                text-black
                hover:text-gray-500
                transition-all
              "
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* ==========================================
            PRODUCTS
        ========================================== */}

        {filteredProducts.length > 0 ? (
          <div
            className="
              w-full
              max-w-[1200px]
              mx-auto
              grid
              grid-cols-2
              sm:grid-cols-2
              lg:grid-cols-3
              gap-2
              sm:gap-4
              md:gap-5
              lg:gap-6
              px-2
              sm:px-3
              md:px-4
              pt-6
              sm:pt-8
              pb-8
              items-start
            "
          >
            {visibleProducts.map((item) => (
              <div key={item.id} className="w-full min-w-0">
                <Card
                  id={item.id}
                  name={item.title}
                  image={item.thumbnail}
                  price={item.price}
                  type={item.category}
                  rating={item.rating}
                  discount={item.discountPercentage}
                  stock={item.stock}
                />
              </div>
            ))}
          </div>
        ) : (
          /* ==========================================
              NO PRODUCTS FOUND
          ========================================== */

          <div
            className="
              min-h-[300px]
              flex
              flex-col
              items-center
              justify-center
              px-4
            "
          >
            <div className="text-5xl mb-4">🔍</div>

            <h3
              className="
                text-xl
                sm:text-2xl
                font-semibold
              "
            >
              No Products Found
            </h3>

            <p
              className="
                text-gray-500
                mt-2
                text-center
                max-w-[400px]
              "
            >
              We couldn't find any products matching your search.
            </p>

            <button
              type="button"
              onClick={clearSearch}
              className="
                mt-5
                bg-black
                text-white
                px-6
                py-3
                rounded-lg
                hover:bg-gray-800
                active:scale-95
                transition-all
              "
            >
              Clear Search
            </button>
          </div>
        )}

        {/* ==========================================
            VIEW MORE / VIEW LESS
        ========================================== */}

        {filteredProducts.length > 6 && (
          <div
            className="
              flex
              justify-center
              items-center
              py-8
            "
          >
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="
                w-[170px]
                h-[56px]
                rounded-[10px]
                bg-[rgba(250,250,250,1)]
                flex
                items-center
                justify-center
                cursor-pointer
                hover:bg-black
                hover:text-white
                transition-all
                duration-300
                font-semibold
              "
            >
              {showMore ? "View Less" : "View More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;
