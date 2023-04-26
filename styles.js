import { createGlobalStyle } from "styled-components";
import { Roboto } from "@next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :root{
    --1: #6E85B7;
    --2: #14244E;
    --3: #F8F9D7;
    --4: #191A1C;
    --5: ghostwhite;
    --6: aquamarine;
    --7: lightcoral;
    --8: #c4d7e0;
    --9: #00A36C;
    --10: crimson;

    --font1: ${roboto.style.fontFamily}, serif;
  }

  body {
    margin: 0;
    font-family: var(--font1), sans-serif, system-ui;
    background-color: var(--1);
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  ::placeholder {
  color: lightsteelblue;
  text-align: center;
}

`;
