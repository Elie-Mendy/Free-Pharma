import  { Providers }  from "@/providers/Providers";

export default function App({ Component, pageProps }) {
    return (
        <Providers>
            <Component {...pageProps} />
        </Providers>
    );
}
