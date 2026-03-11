import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ProductDetail.css";

function addToCartLocal(product, qty) {
  const saved = localStorage.getItem("cartItems");
  const cart = saved ? JSON.parse(saved) : [];

  const productId = product.id;
  const exists = cart.find((it) => it.id === productId);

  if (exists) {
    exists.quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.ten_sanpham,
      price: product.gia,
      available: product.so_luong,
      image: product.anh,
      quantity: qty,
    });
  }

  localStorage.setItem("cartItems", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");
  const [qty, setQty] = useState(1);
  const [imagesList, setImagesList] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`http://localhost:3000/api/shop/${productId}`);
        const data = await res.json();

        if (!res.ok) {
          setProduct(null);
          return;
        }

        let parsedImages = [];
        if (data.mauanh) {
          try {
            parsedImages = Array.isArray(data.mauanh)
              ? data.mauanh
              : JSON.parse(data.mauanh);
          } catch {
            parsedImages = [];
          }
        }

        setProduct(data);
        setImagesList(parsedImages);
        setActiveImg(parsedImages[0] || data.anh || "");
        setQty(1);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-card">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-page">
        <div className="pd-card pd-notfound">
          <h2>Product not found</h2>
          <button className="pd-btn" onClick={() => navigate("/shop")}>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const stockLeft = Math.max(0, product.so_luong ?? 0);
  const canAdd = stockLeft > 0;

  const handleAdd = async () => {
    if (!canAdd) return;

    const userData = JSON.parse(localStorage.getItem("user"));
    const userEmail = userData?.email;

    if (!userEmail) {
      alert("Please login to add products to bag!");
      navigate("/login");
      return;
    }

    if (qty > stockLeft) {
      alert("Quantity exceeds available stock!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/shop/themgiohang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          productId: product.id,
          quantity: qty,
        }),
      });

      if (response.ok) {
        addToCartLocal(product, qty);
        alert("Added to bag successfully!");
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        alert("Failed to add to bag");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const handleBuyNow = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      alert("Vui lòng đăng nhập để mua hàng!");
      navigate("/login");
      return;
    }

    if (!canAdd) return;

    if (qty > stockLeft) {
      alert("Quantity exceeds available stock!");
      return;
    }

    navigate("/checkout", {
      state: {
        buyNowItem: {
          id: product.id,
          ten_sanpham: product.ten_sanpham,
          gia: product.gia,
          anh: product.anh,
          loai: product.loai,
          quantity: qty
        }
      }
    });
  };

  return (
    <div className="pd-page">
      <div className="pd-breadcrumb">
        <Link to="/shop">Shop</Link>
        <span> / </span>
        <span>{product.ten_sanpham}</span>
      </div>

      <div className="pd-card">
        <div className="pd-left">
          <div className="pd-main-img">
            {activeImg && <img src={activeImg} alt={product.ten_sanpham} />}
          </div>

          <div className="pd-thumbs">
            {[...new Set([product.anh, ...imagesList])]
              .filter(Boolean)
              .map((url, index) => (
                <button
                  key={index}
                  className={`pd-thumb ${activeImg === url ? "active" : ""}`}
                  onClick={() => setActiveImg(url)}
                  type="button"
                >
                  <img src={url} alt={`thumb-${index}`} />
                </button>
              ))}
          </div>
        </div>

        <div className="pd-right">
          <h1 className="pd-title">{product.ten_sanpham}</h1>

          <p className="pd-meta">
            <b>Category:</b> {product.loai || "General"}
          </p>

          <p className="pd-meta">
            <b>Available:</b> {stockLeft}
          </p>

          <div className="pd-price">
            {product.gia?.toLocaleString("vi-VN")} VND
          </div>

          <div className="pd-qty">
            <button
              className="pd-qty-btn"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              type="button"
            >
              -
            </button>

            <span className="pd-qty-value">{qty}</span>

            <button
              className="pd-qty-btn"
              onClick={() => {
                if (qty + 1 > stockLeft) {
                  alert("Quantity exceeds available stock!");
                  return;
                }
                setQty((q) => q + 1);
              }}
              type="button"
              disabled={!canAdd}
            >
              +
            </button>
          </div>

          <button className="pd-btn" onClick={handleAdd} disabled={!canAdd}>
            {canAdd ? "Add to bag" : "Out of stock"}
          </button>

          <button className="pd-btn buy-now-btn" onClick={handleBuyNow} disabled={!canAdd}>
            Buy Now
          </button>

          <div className="pd-desc">
            <h3>Description</h3>
            <p>{product.mota || "No description available."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}