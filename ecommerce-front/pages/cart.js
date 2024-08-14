import axios from "axios";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../components/CartContext";
import Header from "app/components/Header";
import Center from "app/components/Center";
import Button from "app/components/Button";
import Table from "app/components/Table";
import Input from "app/components/Input";
import WhiteBox from "app/components/WhiteBox";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-top: 40px;
    @media screen and (min-width: 768px){
        grid-template-columns: 1.3fr 0.7fr;
    }
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 70px;
    height: 100px;
    padding: 3px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
        max-width: 40px;
        max-height: 40px;
    }
    @media screen and (min-width: 768px){
        padding: 10px;
        width: 100px;
        height: 100px;
        img{
        max-width: 80px;
        max-height: 80px;
    }
    }
`;
const QuantityLabel = styled.span`
    padding: 0 15px;
    display: block;
    @media screen and (min-width: 768px){
        display: inline-block;
        padding: 0 10px;
    }
`;

const Cityholder = styled.div`
    display: flex;
    gap: 5px;
`;


export default function CartPage() {
    const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/cart', { ids: cartProducts })
                .then(response => {
                    setProducts(response.data);
                });
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        if (window?.location.href.includes('success')) {
            setIsSuccess(true);
            clearCart();
        }
    }, []);


    function moreOfThisProduct(id) {
        addProduct(id);
    }

    function lessOfThisProduct(id) {
        removeProduct(id);
    }

    async function goToPayment() {
        const response = await axios.post('/api/checkout', {
            name, email, city, postalCode, streetAddress, country,
            cartProducts
        });

        if (response.data.url) {
            window.location = response.data.url;
        }
    }

    let total = 0;
    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0;
        total += price;
    }

    if (isSuccess) {
        return (
            <>
                <Header />
                <Center>
                    <ColumnsWrapper>
                        <WhiteBox>
                            <h1>Thanks for your order!</h1>
                            <p>We will email you when your order will be sent.</p>
                        </WhiteBox>
                    </ColumnsWrapper>
                </Center>
            </>
        );
    }

    return (
        <>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <WhiteBox>
                        <h2>Cart</h2>
                        {!cartProducts.length && (
                            <div>Your cart is empty!</div>
                        )}
                        {products?.length > 0 && (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products?.map(product => (
                                        <tr>
                                            <ProductInfoCell>
                                                <ProductImageBox>
                                                    <img src={product.images[0]} />
                                                </ProductImageBox>
                                                {product.title}
                                            </ProductInfoCell>
                                            <td>
                                                <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                                                <QuantityLabel>
                                                    {cartProducts.filter(id => id === product._id).length}
                                                </QuantityLabel>
                                                <Button onClick={() => moreOfThisProduct(product._id)}>+</Button>
                                            </td>
                                            <td>
                                                ${cartProducts.filter(id => id === product._id).length * product.price}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>${total}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        )}
                    </WhiteBox>
                    {!!cartProducts.length && (
                        <WhiteBox>
                            <h2>Order information</h2>
                            <Input
                                type="text"
                                placeholder="Name"
                                value={name}
                                name="name"
                                onChange={e => setName(e.target.value)} />
                            <Input
                                type="text"
                                placeholder="Email"
                                value={email}
                                name="email"
                                onChange={e => setEmail(e.target.value)} />
                            <Input
                                type="text"
                                placeholder="Country"
                                value={country}
                                name="country"
                                onChange={e => setCountry(e.target.value)} />
                            <Cityholder>
                                <Input
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    name="city"
                                    onChange={e => setCity(e.target.value)} />
                                <Input
                                    type="text"
                                    placeholder="Postal Code"
                                    value={postalCode}
                                    name="postalCode"
                                    onChange={e => setPostalCode(e.target.value)} />
                            </Cityholder>
                            <Input
                                type="text"
                                placeholder="Street Address"
                                value={streetAddress}
                                name="streetAddress"
                                onChange={e => setStreetAddress(e.target.value)} />
                            <Button onClick={goToPayment} block black size={'l'}>Continue to payment</Button>
                        </WhiteBox>
                    )}
                </ColumnsWrapper>
            </Center>
        </>
    );
}