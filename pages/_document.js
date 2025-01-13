import Document, { Html, Head, Main, NextScript } from 'next/document';
//comsole
class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <script
                        async type="text/javascript"
                        src="//static.klaviyo.com/onsite/js/klaviyo.js?company_id=VZdSUY"
                    ></script>
                    <script
                        async type="text/javascript"
                        src="https://cdn.kaypush.com/js/script.js?company_id=Op1vnuw&site=app4"
                    ></script>
                    <link
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;