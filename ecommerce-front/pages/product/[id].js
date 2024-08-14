import Header from 'app/components/Header';
import Center from 'app/components/Center';
import Title from 'app/components/Title';
import WhiteBox from 'app/components/WhiteBox';
import ProductImages from 'app/components/ProductImages';
import { mongooseConnect } from "app/lib/mongoose";
import { Product } from "app/models/Product";
import styled from 'styled-components';
import Button from 'app/components/Button';
import CartIcon from 'app/components/icons/CartIcon';
import { useContext } from 'react';
import { CartContext } from 'app/components/CartContext';

const ColWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin: 40px 0;
    @media screen and (min-width: 768px){
        grid-template-columns: 0.8fr 1.2fr;        
    }
`;

const PriceRow = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`;
const Price = styled.span`
    font-size: 1.4rem
`;

export default function ProductPage({ product }) {
    const { addProduct } = useContext(CartContext);

    return (
        <>
            <Header />
            <Center>
                <ColWrapper>
                    <WhiteBox>
                        <ProductImages images={product.images} />
                    </WhiteBox>
                    <div>
                        <Title>{product.title}</Title>
                        <p>{product.description}</p>
                        <PriceRow>
                            <div>
                                <Price>${product.price}</Price>
                            </div>
                            <div>
                                <Button onClick={() => addProduct(product._id)} primary>
                                    <CartIcon /> Add to cart
                                </Button>
                            </div>
                        </PriceRow>
                    </div>
                </ColWrapper>
            </Center>
        </>
    )
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;
    const product = await Product.findById(id);
    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
        }
    }
}   