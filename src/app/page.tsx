
import AllProducts from "@/Components/AllProducts";
import Banner from "@/Components/Banner";
import PriceFall from "@/Components/PriceFall";
import PriceRise from "@/Components/PriceRise";
export default function Home() {
  return (
    <div>
      
      <Banner/>
      <PriceRise/>
      <PriceFall/>
      <AllProducts/>
    </div>
  );
}
