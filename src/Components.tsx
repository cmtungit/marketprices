import * as React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { ProductProps } from "./App";

interface SearchfieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
async function fetchAPI(): Promise<any> {
  const APIUrl =
    "https://online-price-watch.consumer.org.hk/opw/opendata/pricewatch.json";
  const response = await fetch(APIUrl);
  const result = await response.json();
  console.log(result);
  return result;
}

export function ProductList({
  products,
  setProducts,
}: {
  products: any[];
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchAPI();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(error);
      }
    }
    fetchData();
  }, []);
  return <div id="products">User: {JSON.stringify(products)}</div>;
}

export const Searchfield: React.FC<SearchfieldProps> = ({
  value,
  onChange,
  onKeyDown,
}) => {
  return (
    <div>
      <TextField
        fullWidth
        id="outlined-search"
        label="搵價錢"
        type="search"
        margin="normal"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export const BasicCard: React.FC<ProductProps> = ({
  code,
  brand,
  name,
  prices,
  offers,
  imageUrl,
  isFavorite,
  handleFavorite,
}) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={name["zh-Hant"]}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {brand["zh-Hant"]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {name["zh-Hant"]}
        </Typography>
        {prices.map((price, index) => (
          <Typography key={index} variant="body2" color="text.secondary">
            {price.supermarketCode}: {price.price}
          </Typography>
        ))}
        {offers?.map((offer, index) => (
          <Typography key={index} variant="body2" color="text.secondary">
            {offer.supermarketCode}: {offer["zh-Hant"]}
          </Typography>
        ))}
      </CardContent>
      <Checkbox
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite color="error" />}
        checked={isFavorite}
        onChange={() =>
          handleFavorite({
            code,
            brand,
            name,
            prices,
            offers,
            imageUrl,
            isFavorite,
            handleFavorite,
          })
        }
      />
    </Card>
  );
};
export const fetchProductImage = async (
  productName: string
): Promise<string> => {
  const searchQuery = encodeURIComponent(productName);
  // console.log(searchQuery);
  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?q=${searchQuery}&cx=373ff5a0ef6534bc7&key=AIzaSyBXFaaHIeTJJ6UkBaoHGXta0nz0BBV9JVE&num=1&searchType=image`
  );
  const data = await response.json();
  console.log(data);
  return data.items[0].link;
};
