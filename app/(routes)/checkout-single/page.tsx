"use client";

import {useEffect, useState} from "react";
import {addPayment} from "@/actions/payment";
import {useUser} from "@clerk/nextjs";

interface CartItem {
  id: number;
  name: string;
  price: number;
  discountPrice: number;
  image: string;
  quantity: number;
}

const CheckoutSingle = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const {user} = useUser();
  const userId = user?.id;
  let old = false

  // Ambil data dari localStorage saat halaman dimuat
  useEffect(() => {
    const storedSingleCart = JSON.parse(localStorage.getItem("single-cart") || "{}");

    console.log(storedSingleCart)
    if (storedSingleCart) {
      setCart([{...storedSingleCart[0], quantity: 1}]); // Pastikan dalam array
    }
  }, []);

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
  };

  const handlePlaceOrder = () => {
    if (!customerName || !customerPhone || !customerAddress) {
      alert("Harap isi semua data pengiriman!");
      return;
    }

    if (!selectedPayment && old) {
      alert("Pilih metode pembayaran terlebih dahulu!");
      return;
    }

    if (cart.length === 0) {
      alert("Produk tidak ditemukan!");
      return;
    }

    function viaWhatsapp() {
      // Format pesan WhatsApp
      let message = `Halo, saya ingin memesan produk berikut:\n\n`;
      cart.forEach((item, index) => {
        let price = item.discountPrice || item.price
        message += `${index + 1}. ${item.name} - Rp. ${price.toLocaleString()} x ${item.quantity} = Rp. ${(item.price * item.quantity).toLocaleString()}\n`;
      });

      const totalPrice = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
      message += `\nTotal Harga: Rp. ${totalPrice.toLocaleString()}\n\n`;
      message += `*Data Pengiriman:*\n`;
      message += `Nama: ${customerName}\n`;
      message += `Nomor HP: ${customerPhone}\n`;
      message += `Alamat: ${customerAddress}\n`;
      message += `Metode Pembayaran: ${selectedPayment}\n\n`;
      message += `Mohon konfirmasi pesanan saya. Terima kasih!`;

      // Encode pesan untuk URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_PHONE_NUMBER}?text=${encodedMessage}`;

      // Redirect ke WhatsApp
      window.open(whatsappUrl, "_blank");
    }

    async function payment(userId: any, cartId: object[], customerName: string, customerPhone: string, customerAddress: string) {
      try {
        const paymentProc = await addPayment(userId, cartId, customerName, customerPhone, customerAddress, true);

        if (paymentProc?.purchase.id) {
          localStorage.removeItem("cart");
          // window.snap.pay(paymentProc.token,);
          window.open(paymentProc.redirect);
        } else {
          alert("Proses pembayaran gagal.");
          return;
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan, coba lagi.");
      }
    }

    // payment(userId, cart, customerName, customerPhone, customerAddress);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Alamat Pengiriman */}
      <div className="border p-4 mb-4">
        <h2 className="text-lg font-semibold">Alamat Pengiriman</h2>
        <input
          type="text"
          placeholder="Nama"
          className="w-full p-2 border rounded mb-2"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nomor HP"
          className="w-full p-2 border rounded mb-2"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
        <textarea
          placeholder="Alamat Pengiriman"
          className="w-full p-2 border rounded"
          rows={3}
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
        />
      </div>

      {/* Produk Dipesan */}
      <div className="border p-4 mb-4">
        <h2 className="text-lg font-semibold">Produk Dipesan</h2>
        {cart.length === 0 ? (
          <p>Produk tidak ditemukan.</p>
        ) : (
          cart.map((item: CartItem) => (
            <div key={item.id} className="grid grid-cols-5 gap-4 items-center border-b pb-2 mb-2">
              <img src={item.image} alt={item.name} className="w-16 h-16"/>
              <p>{item.name}</p>
              <p>Rp. {(item.discountPrice > 0 ? item.discountPrice : item.price).toLocaleString()}</p>
              <p>{item.quantity}</p>
              <p>Rp. {((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      {/* Total Harga */}
      <div className="border p-4 mb-4">
        <h2 className="text-lg font-semibold">
          Total Harga: Rp.{" "}
          {cart.reduce((acc, item) => acc + (item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity, 0).toLocaleString()}
        </h2>
      </div>

      {/* Metode Pembayaran */}
      {old && (
        <div className="border p-4 mb-4">
          <h2 className="text-lg font-semibold">Metode Pembayaran</h2>
          <div className="grid grid-cols-3 gap-2">
            {["Transfer Bank", "E-Wallet", "COD", "Kartu Kredit", "QRIS"].map((method) => (
              <button
                key={method}
                className={`px-4 py-2 border rounded ${
                  selectedPayment === method ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handlePaymentSelect(method)}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tombol Checkout */}
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handlePlaceOrder}>
        {/*Buat Pesanan*/}
        Lanjutkan ke pembayaran
      </button>
    </div>
  );
};

export default CheckoutSingle;