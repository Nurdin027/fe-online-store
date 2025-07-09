"use client";

import {useState, useEffect} from "react";
import {getCart, updateCart, deleteFromCart} from "@/actions/cart";
import Image from "next/image";
import {Cart} from "@/types";
import {useRouter} from "next/navigation";

const CartPage = ({params}: { params: Promise<{ userId: string }> }) => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    const {userId} = await params
    const cartData = await getCart(userId);
    setCarts(cartData);
    setLoading(false);
  };

  const handleIncreaseQuantity = async (cartId: string, quantity: number) => {
    console.log("Cart ID:", cartId);

    await updateCart(cartId, quantity + 1);

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Cart Data Before Update:", cart);

    const updatedCart = cart.map((item: any) =>
      item.id === cartId ? {...item, quantity: item.quantity + 1} : item
    );

    console.log("Updated Cart Data:", updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    fetchCart();
  };

  const handleDecreaseQuantity = async (cartId: string, quantity: number) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Before Update:", cart);

    if (quantity > 1) {
      // Update di server
      await updateCart(cartId, quantity - 1);

      // Update di localStorage
      const updatedCart = cart.map((item: any) =>
        item.id === cartId ? {...item, quantity: item.quantity - 1} : item
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      console.log("Updated Cart (Decreased Quantity):", updatedCart);
    } else {
      // Hapus dari server jika quantity == 1
      await deleteFromCart(cartId);

      // Hapus dari localStorage
      const updatedCart = cart.filter((item: any) => item.id !== cartId);

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      console.log("Updated Cart (Item Removed):", updatedCart);
    }

    // Tunggu sebentar sebelum fetchCart untuk menghindari race condition
    setTimeout(() => {
      fetchCart();
    }, 500);
  };

  const handleDeleteItem = async (cartId: string) => {
    // Hapus dari server
    await deleteFromCart(cartId);

    // Hapus dari localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = cart.filter((item: any) => item.id !== cartId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    fetchCart();
  };

  if (loading) {
    return <p className="text-gray-500 text-center mt-6">Memuat keranjang...</p>;
  }

  if (carts.length === 0) {
    return <p className="text-gray-500 text-center mt-6">Keranjang kamu kosong.</p>;
  }

  // Hitung total harga
  const totalPrice = carts.reduce((total, cart) => {
    const price = cart.product.discountPrice || cart.product.price;
    return total + price * cart.quantity;
  }, 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>

      <div className="border-b pb-2 mb-4 grid grid-cols-5 font-semibold">
        <span>Produk</span>
        <span>Harga Satuan</span>
        <span>Kuantitas</span>
        <span>Total Harga</span>
        <span>Aksi</span>
      </div>

      {carts.map((cart) => (
        <div key={cart.id} className="grid grid-cols-5 items-center border-b py-2">
          <div className="flex items-center gap-4">
            {cart.product.image && (
              <Image src={cart.product.image} alt={cart.product.name} width={50} height={50}/>
            )}
            <span>{cart.product.name}</span>
          </div>

          <span>Rp. {(cart.product.discountPrice || cart.product.price).toLocaleString()}</span>

          <div className="flex items-center">
            <button
              className="px-2 py-1 border"
              onClick={() => handleDecreaseQuantity(cart.id, cart.quantity)}
            >
              -
            </button>
            <span className="px-3">{cart.quantity}</span>
            <button
              className="px-2 py-1 border"
              onClick={() => handleIncreaseQuantity(cart.id, cart.quantity)}
            >
              +
            </button>
          </div>

          <span>Rp. {((cart.product.discountPrice || cart.product.price) * cart.quantity).toLocaleString()}</span>

          <button
            className="text-left text-red-500 hover:underline"
            onClick={() => handleDeleteItem(cart.id)}
          >
            Hapus
          </button>
        </div>
      ))}

      <div className="mt-4 flex justify-between items-center">
        <span className="font-semibold">Total: Rp. {totalPrice.toLocaleString()}</span>
        {/* Tombol Checkout */}
        <button
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => router.push("/checkout")}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;