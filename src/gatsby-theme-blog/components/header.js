import React from "react"
import { Link } from "gatsby"
import { css, Styled } from "theme-ui"
import Header from "gatsby-theme-blog/src/components/header"

import styled from "@emotion/styled"

const NavigationLinks = styled.div`
  flex: 1;
`

export default props => (
  <Header {...props}>
    <NavigationLinks>
      <Styled.a
        href="https://botmation.dev"
        css={css({
          ml: 2,
          mr: `auto`,
          fontFamily: `heading`,
          fontWeight: `bold`,
          textDecoration: `none`,
          color: `inherit`,
          ":hover": {
            textDecoration: `underline`,
          },
        })}
      >
        Botmation
      </Styled.a>
      <Styled.a
        as={Link}
        to="/notes"
        css={css({
          ml: 2,
          mr: `auto`,
          fontFamily: `heading`,
          fontWeight: `bold`,
          textDecoration: `none`,
          color: `inherit`,
          ":hover": {
            textDecoration: `underline`,
          },
        })}
      >
        Notes
      </Styled.a>
    </NavigationLinks>
  </Header>
)
