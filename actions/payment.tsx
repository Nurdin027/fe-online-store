const URL = `${process.env.NEXT_PUBLIC_API_URL}/payment`

export const addPayment = async (userId: string, cart: object[], customerName: string, customerPhone: string, customerAddress: string) => {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({userId, customerName, customerPhone, customerAddress, cart}),
    });
    console.log(res)

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Gagal memproses pembelian");
    }

    return await res.json();
  } catch (error) {
    console.error("Error saat memproses pembelian:", error);
  }
}