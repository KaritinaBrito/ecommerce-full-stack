import styled, { createGlobalStyle } from "styled-components";
import { CartContextProvider } from "app/components/CartContext"

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
  body{
    background-color: #eee;
    padding: 0;
    margin: 0;
    font-family: "Roboto", sans-serif;
  }
`;


export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <CartContextProvider>
        <Component {...pageProps} />;
      </CartContextProvider>
    </>
  )
}
