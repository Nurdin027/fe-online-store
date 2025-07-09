import Link from "next/link";
import Container from "./ui/container";
import MainNav from "./main-nav";
import getCategories from "@/actions/get-categories";
import AuthButtons from "./auth-buttons"; // Import tombol login/logout

export const revalidate = 0;

const Navbar = async () => {
  const categories = await getCategories();

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          {/* Kiri: Logo dan Navigasi */}
          <div className="flex items-center gap-x-4">
            <Link href="/" className="ml-4 flex lg:ml-8 gap-x-2">
              <p className="font-bold text-xl">TOKO</p>
            </Link>
            <MainNav data={categories} />
          </div>

          {/* Kanan: Keranjang dan Login/Logout */}
          <div className="flex items-center gap-x-4">
            {/* Tombol Login/Logout */}
            <AuthButtons />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;