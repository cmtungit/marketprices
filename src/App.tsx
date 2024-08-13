import "./App.css";
import * as React from "react";
import {
  ProductList,
  Searchfield,
  BasicCard,
  fetchProductImage,
} from "./Components";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

export interface ProductProps {
  code: string;
  brand: {
    en: string;
    "zh-Hant": string;
    "zh-Hans": string;
  };
  name: {
    en: string;
    "zh-Hant": string;
    "zh-Hans": string;
  };
  cat1Name?: {
    en: string;
    "zh-Hant": string;
    "zh-Hans": string;
  };
  cat2Name?: {
    en: string;
    "zh-Hant": string;
    "zh-Hans": string;
  };
  cat3Name?: {
    en: string;
    "zh-Hant": string;
    "zh-Hans": string;
  };
  prices: {
    supermarketCode: string;
    price: string;
  }[];
  offers?: {
    supermarketCode: string;
    en: string;
    "zh-Hant": string;
    "zh-Hans": string;
  }[];
  imageUrl?: string;
  isFavorite: boolean;
  handleFavorite: (product: any) => void;
}

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<ProductProps[]>([]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserInput(event.currentTarget.value);
  }

  const handleSearch = async (
    originalProducts: ProductProps[],
    searchValue: string
  ) => {
    const filtered = originalProducts
      .filter((item) => item.name["zh-Hant"].includes(searchValue))
      .filter((product) => product.prices.length !== 0);

    // Fetch the images for each filtered product
    const productsWithImages = await Promise.all(
      filtered.map(async (product) => {
        const imageUrl = await fetchProductImage(product.name["zh-Hant"]);
        return { ...product, imageUrl };
      })
    );
    setFilteredProducts(productsWithImages);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission behavior
      handleSearch(products, userInput);
    }
  };

  const handleFavorite = (product: ProductProps) => {
    // Add or remove the product from the favoriteProducts state
    if (favoriteProducts.some((p) => p.code === product.code)) {
      setFavoriteProducts(
        favoriteProducts.filter((p) => p.code !== product.code)
      );
    } else {
      setFavoriteProducts([...favoriteProducts, product]);
    }
    console.log(favoriteProducts);
  };

  // logs for data
  useEffect(() => {
    console.log(userInput);
    console.log(products);
    console.log(filteredProducts);
  }, [filteredProducts]);

  useEffect(() => {
    // Load favorite products from localStorage on initial render
    const storedFavorites = localStorage.getItem("favoriteProducts");
    if (storedFavorites) {
      setFavoriteProducts(JSON.parse(storedFavorites));
    }
    console.log(favoriteProducts);
  }, []);

  useEffect(() => {
    // Save favorite products to localStorage whenever it changes
    localStorage.setItem("favoriteProducts", JSON.stringify(favoriteProducts));
  }, [favoriteProducts]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <ProductList products={products} setProducts={setProducts} />
        <Searchfield
          value={userInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {filteredProducts.map((product) => (
            <Grid xs={2} sm={4} md={4}>
              <BasicCard
                code={product.code}
                brand={product.brand}
                name={product.name}
                prices={product.prices}
                offers={product.offers}
                imageUrl={product.imageUrl}
                isFavorite={favoriteProducts.some(
                  (p) => p.code === product.code
                )}
                handleFavorite={() => handleFavorite(product)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};
export default App;