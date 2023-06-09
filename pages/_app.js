import GlobalStyle from "../styles";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Calorie & Workout Tracker</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <ThemeProvider
        defaultTheme="theme0"
        themes={["theme0", "theme1", "theme2"]}
      >
        <GlobalStyle />

        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
