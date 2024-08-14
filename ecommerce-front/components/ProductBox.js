import styled from "styled-components";
import Button from "./Button";
import CartIcon from "./icons/CartIcon";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const ProductWrapper = styled.div`

`;

const WhiteBox = styled(Link)`
    background-color: #fff;
    padding: 20px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img {
        max-width: 100%;
        max-height: 120px;
    }
`;

const ProductInfobox = styled.div`
    margin-top: 10px;
    padding: 0 10px
`;

const Title = styled(Link)`
    font-weight: normal;
    font-size: 1rem;
    margin: 0;
    color: inherit;
    margin: 0;
`;

const PriceRow = styled.div`
    display: block;
    @media screen and (min-width: 768px){
     display: flex;
     gap: 5px;
    }
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
`;

const Price = styled.div`
    font-size: 1rem;
    font-weight: 600;
    text-align: right;
    @media screen and (min-width: 768px){
        font-size: 1.5rem;
        font-weight: 700;
        text-align: left;
    }
`;

export default function ProductBox({ _id, title, description, price, images }) {
    const { addProduct } = useContext(CartContext);
    const url = '/product/' + _id;
    return (
        <ProductWrapper>
            <WhiteBox href={url}>
                <div>
                    <img src={images[0]} alt={title} />
                </div>
            </WhiteBox>
            <ProductInfobox>
                <Title href={url}>{title}</Title>
                <PriceRow>
                    <Price>${price}</Price>
                    <Button block onClick={() => addProduct(_id)} primary outline={1}><CartIcon /></Button>
                </PriceRow>
            </ProductInfobox>
        </ProductWrapper>
    )
}