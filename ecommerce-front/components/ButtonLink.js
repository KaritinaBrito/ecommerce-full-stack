import Link from "next/link";
import styled, { css } from "styled-components";
import { ButtonStyles } from "app/components/Button";

const StyledLink = styled(Link)`
    ${ButtonStyles}
`;
export default function ButtonLink(props) {
    return (
        <StyledLink {...props} />
    )
}