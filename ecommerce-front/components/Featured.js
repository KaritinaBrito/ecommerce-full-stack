import styled from "styled-components";
import Center from "./Center";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import { useContext } from "react";
import { CartContext } from "app/components/CartContext"

const Bg = styled.div`
    background-color: #222;
    color: #fff;
    padding: 50px 0;
`;

const Title = styled.h1`
    margin: 0;
    font-weight: normal;
    font-size: 1.5rem;
    @media screen and (min-width: 768px){
        font-size: 3rem;
    }
`;

const Desc = styled.p`
    color: #aaa;
    font-size: 0.8rem;
`;

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    img{
        max-width: 100%;
        max-height: 200px;
        display: block;
        margin: 0 auto;
    }
    div:nth-child(1){
        order: 2;
    }
    @media screen and (min-width: 768px){
        grid-template-columns: 0.8fr 1.2fr; 
        div:nth-child(1){
            order: 0;
        }
        img{
            max-width: 100%
        }       
    }
`;

const Column = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 25px;
`;


export default function Featured({ product }) {
    const { addProduct } = useContext(CartContext);

    function addFeaturedToCart() {
        addProduct(product._id);
    }
    return (
        <Bg>
            <Center>
                <Wrapper>
                    <Column>
                        <Title>{product.title}</Title>
                        <Desc>{product.description}</Desc>
                        <ButtonsWrapper>
                            <ButtonLink href={'/product/' + product._id} white={1} outline={1} >Read more...</ButtonLink>
                            <Button white={1} onClick={addFeaturedToCart}>
                                <CartIcon />
                                Add to cart
                            </Button>
                        </ButtonsWrapper>
                    </Column>
                    <div>
                        <img src="https://karitina-nextjs-ecommerce.s3.amazonaws.com/1722374940294.png" alt="Mac 14 pro" />
                    </div>
                </Wrapper>
            </Center>
        </Bg>
    )
}