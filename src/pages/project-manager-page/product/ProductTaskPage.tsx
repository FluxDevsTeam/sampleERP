import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductTaskManager from "./Product Components/ProductTaskManager";

const ProductTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/product/${id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError("Error loading product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!product) return <div className="text-red-500 text-center mt-10">Product not found.</div>;

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-blue-500">Product Tasks: {product.name}</h1>
      <ProductTaskManager product={product} onUpdate={() => {}} />
    </div>
  );
};

export default ProductTaskPage; 