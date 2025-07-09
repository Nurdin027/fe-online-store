"use client";

import {Product} from "@/types";
import Image from "next/image";
import IconButton from "./icon-button";
import {Expand} from "lucide-react";
import Currency from "./currency";
import {useRouter} from "next/navigation";
import {MouseEventHandler} from "react";
import PreviewModal from "../preview-modal";
import usePreviewModal from "@/hooks/use-preview-modal";

interface ProductCardProps {
  data: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({data}) => {
  const previewModal = usePreviewModal();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    previewModal.onOpen(data);
  };

  return (
    <div
      onClick={handleClick}
      className={"bg-white group cursor-pointer rounded-xl border p-3 space-y-4 " + (data?.isAvailable ? '' : "opacity-60 border-gray-300")}
    >
      {/* Images dan action */}
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          alt="Image"
          src={data?.images?.[0]?.url}
          fill
          className="aspect-square object-cover rounded-md"
        />
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <IconButton
              onClick={onPreview}
              icon={<Expand size={20} className="text-gray-600"/>}
            />
          </div>
        </div>
      </div>
      {/* Product Description */}
      <div>
        <p className="font-semibold text-lg">{data.name}</p>
        <p className="text-sm text-gray-500">{data.category?.name}</p>
      </div>
      {/* Harga */}
      <div className="flex items-center justify-between">
        {parseInt(data?.discountPrice) > 0 ? (
          <div className="grid">
            <Currency value={data?.discountPrice}/>
            <s className="text-red-500 opacity-60">
              <Currency value={data?.price}/>
            </s>
          </div>
        ) : (
          <Currency value={data?.price}/>
        )}
        {data?.isAvailable ? (
          <h2 className="self-start">Stok tersedia</h2>
        ) : (
          <h2 className="self-start text-red-500">Tidak tersedia</h2>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
