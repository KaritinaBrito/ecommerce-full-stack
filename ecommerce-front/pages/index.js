import Header from 'app/components/Header';
import Featured from "app/components/Featured";
import { mongooseConnect } from "app/lib/mongoose";
import { Product } from "app/models/Product";
import NewProducts from "app/components/NewProducts";


export default function HomePage({ featuredProduct, newProducts }) {
  console.log(newProducts);
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} />
    </div>
  );
}

export async function getServerSideProps() {
  const featuredProductId = '66a958d3b12547f3042a96ed';
  await mongooseConnect();

  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, { sort: { '_id': -1 }, limit: 10 });
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}
