import { useState } from "react";
import styled from "styled-components";

const BigImageWrapper = styled.div`
    text-align: center;
`;

const Image = styled.img`
    max-width: 100%;
    max-height: 100%; 
`;

const BigImage = styled.img`
    max-width: 100%;
    max-height: 100%; 
`;

const ImageButtons = styled.div`
    display: flex;
    gap: 10px;
    flex-grow: 0;
    margin-top: 10px;
`;
const ImageButton = styled.div`
    ${props => props.active ? `
        border-color: #ccc;
    `: `
        border-color: transparent;
        opacity: 0.7;
    `}
    border: 1px solid #aaa;
    border-radius: 5px;
    height: 40px;
    padding: 3px;
    cursor: pointer;
    
`;


export default function ProductImages({ images }) {
    const [activeImage, setActiveImage] = useState(images?.[0]);

    return (
        <>
            <BigImageWrapper>
                <BigImage src={activeImage} />
            </BigImageWrapper>
            <ImageButtons>
                {images.map((image, index) => (
                    <ImageButton
                        active={image === activeImage}
                        key={index}
                        onClick={() => setActiveImage(image)}
                    >
                        <Image src={image} />
                    </ImageButton>
                ))}
            </ImageButtons>
        </>
    );
}