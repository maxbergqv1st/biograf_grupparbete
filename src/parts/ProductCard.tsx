import { useNavigate } from "react-router-dom";
import type Product from "../interfaces/Product";

import BiografButton from "@/components/custom/BiografButton";
import BiografCard from "@/components/custom/BiografCard";
import Image from "./Image";

export default function ProductCard({
  id,
  name,
  quantity,
  price$,
  slug,
}: Product) {
  const navigate = useNavigate();
  return (
    <BiografCard
      className="group mb-4 cursor-pointer transition-shadow hover:shadow-md"
      role="button"
      onClick={() => navigate("/products/" + slug)}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">
              Freshly stocked and thoughtfully sourced.
            </p>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Quantity</span>
            <span className="text-foreground">{quantity}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Price</span>
            <span className="text-foreground">${price$.toFixed(2)}</span>
          </div>
          <div className="pt-2">
            <BiografButton>More info</BiografButton>
          </div>
        </div>
        <div className="md:w-44">
          <Image
            src={"/images/products/" + id + ".jpg"}
            alt={"Product image of the product " + name + "."}
            className="h-full"
          />
        </div>
      </div>
    </BiografCard>
  );
}
