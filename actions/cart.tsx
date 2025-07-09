import {Cart} from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/cart`;

export const getCart = async (userId: string): Promise<Cart[]> => {
  try {
    const res = await fetch(`${URL}?userId=${userId}`);
    if (!res.ok) throw new Error(`Gagal mengambil data keranjang: ${res.statusText}`);

    const data = await res.json();

    if (!data || data.length === 0) {
      console.log("Cart kosong, menghapus localStorage...");
      localStorage.removeItem("cart");
      return [];
    }

    return data.map((cart: any) => ({
      id: cart.id,
      userId: cart.userId,
      product: {
        id: cart.product.id,
        name: cart.product.name,
        price: Number(cart.product.price),
        discountPrice: Number(cart.product.discountPrice),
        image: cart.product.image,
        subtotal: Number(cart.product.price) * cart.quantity
      },
      quantity: cart.quantity
    }));
  } catch (error) {
    console.error("Error saat mengambil data keranjang:", error);
    return [];
  }
};

export const addToCart = async (userId: string, productId: string, quantity = 1) => {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({userId, productId, quantity}),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Gagal menambahkan produk ke keranjang");
    }

    return await res.json();
  } catch (error) {
    console.error("Error saat menambahkan produk ke keranjang:", error);
  }
};

export const deleteFromCart = async (cartId: string) => {
  try {
    const res = await fetch(`${URL}/${cartId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Gagal menghapus produk dari keranjang");

    return await res.text();
  } catch (error) {
    console.error("Error saat menghapus produk dari keranjang:", error);
  }
};

export const updateCart = async (cartId: string, quantity: number) => {
  try {
    const res = await fetch(`${URL}/${cartId}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({quantity}),
    });

    if (!res.ok) throw new Error("Gagal memperbarui jumlah produk");

    return await res.json();
  } catch (error) {
    console.error("Error saat memperbarui jumlah produk di keranjang:", error);
  }
};