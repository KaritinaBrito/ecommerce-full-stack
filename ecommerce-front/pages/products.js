import Header from 'app/components/Header';
import Center from 'app/components/Center';
import Title from 'app/components/Title';
import { mongooseConnect } from "app/lib/mongoose";
import { Product } from "app/models/Product";
import ProductsGrid from "app/components/ProductsGrid";


export default function ProductsPage({ products }) {
    return (
        <>
            <Header />
            <Center>
                <Title>All products</Title>
                <ProductsGrid products={products} />
            </Center>
        </>
    )
}

export async function getServerSideProps() {
    await mongooseConnect();
    const products = await Product.find({}, null, { sort: { '_id': -1 } });

    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
        }
    }
}