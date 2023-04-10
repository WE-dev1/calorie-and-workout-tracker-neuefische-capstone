import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Roboto", sans-serif, system-ui;
    background-color: #6E85B7;
  }
  ::placeholder {
  color: lightsteelblue;
}
`;
