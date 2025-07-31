"use client";

import {useState} from "react";
import {Product} from "@/types";
import Currency from "./ui/currency";
import {Button} from "./ui/button";
import {MessageCircleIcon} from "lucide-react";
import Link from "next/link";
import {addToCart} from "@/actions/cart";
import {useUser} from "@clerk/nextjs"; // Import useUser dari Clerk

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({data}) => {
  const {user} = useUser(); // Mengambil user dari Clerk
  const userId = user?.id; // Ambil userId jika user sudah login
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const URL = `${window.location.origin}/product/${data.id}`;
  // const URL = `www.test.com`;
  const telp = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const pesan = `Halo saya ingin membeli ${data.name} - ${data.price} dengan link: ${URL}`;
  const link = `https://wa.me/${telp}?text=${pesan}`;

  const handleBuyNow = () => {
    if (!userId) {
      alert("Anda harus login untuk membeli produk.");
      return;
    }

    // Kosongkan single-cart
    localStorage.removeItem("single-cart");

    const singleCart = [
      {
        id: data.id,
        name: data.name,
        price: data.price,
        discountPrice: data.discountPrice,
        image: data.images[0]?.url,
        quantity: 1,
      },
    ];

    localStorage.setItem("single-cart", JSON.stringify(singleCart));

    // Redirect ke halaman checkout single
    window.location.href = "/checkout-single";
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Anda harus login untuk menambahkan produk ke keranjang.");
      return;
    }

    setIsAdding(true);
    setAddedToCart(false);

    try {
      const cartItem = await addToCart(userId, data.id, 1);

      if (!cartItem || !cartItem.id) {
        alert("Gagal menambahkan ke keranjang.");
        return;
      }

      const cartId = cartItem.id;

      // Ambil cart yang sudah ada di localStorage
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");

      // Cek apakah produk sudah ada di keranjang (berdasarkan cartId)
      const existingProductIndex = cart.findIndex((item: any) => item.cartId === cartId);

      if (existingProductIndex !== -1) {
        // Jika sudah ada, update quantity
        cart[existingProductIndex].quantity += 1;
      } else {
        // Jika belum ada, tambahkan produk baru
        console.log('PUSHED');
        cart.push({
          id: cartId,
          productId: data.id,
          name: data.name,
          price: data.price,
          discountPrice: data.discountPrice,
          image: data.images[0]?.url,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      setAddedToCart(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan, coba lagi.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-3 flex items-end gap-10">
        {/*<Currency value={data?.price}/>*/}
        {data?.discountPrice > 0 ? (
          <p className="text-2xl text-gray-900">
            <s className="text-red-500 opacity-60">
              <Currency value={data?.price}/>
            </s>
            <Currency value={data?.discountPrice}/>
          </p>
        ) : (
          <p className="text-2xl text-gray-900">
            <Currency value={data?.price}/>
          </p>
        )}
        {data?.isAvailable ?
          (<h2 className="self-center">Produk tersedia</h2>) :
          (<h2 className="self-center text-red-500">Tidak tersedia</h2>)
        }
      </div>
      <hr className="my-4"/>

      <div className="mt-10 flex items-center gap-x-3">
        <Link href={link} target="_blank">
          <Button className="flex items-center gap-x-2">
            Chat Penjual
            <MessageCircleIcon size={20}/>
          </Button>
        </Link>
      </div>

      <br/>
      <p>{data?.description}</p>
      <br/>

      {data?.isAvailable && (
        <div className="mt-10 flex items-center gap-x-3">
          <Button className="flex items-center gap-x-2" onClick={handleBuyNow}>
            Beli Sekarang
          </Button>

          <Button
            className="flex items-center gap-x-2"
            onClick={handleAddToCart}
            disabled={isAdding || !userId}
          >
            {isAdding ? "Menambah..." : userId ? "Tambah Keranjang" : "Login untuk Beli"}
          </Button>
        </div>
      )}

      {addedToCart && <p className="mt-3 text-green-600">Produk ditambahkan ke keranjang!</p>}
    </div>
  );
};

export default Info;