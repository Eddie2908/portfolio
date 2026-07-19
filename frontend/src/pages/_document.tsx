import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr" className="dark">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0d0f18" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
  try {
    var isAdmin = window.location.pathname.indexOf('/admin') === 0;
    var stored = localStorage.getItem('theme');
    var isDark = isAdmin ? true : (stored ? stored === 'dark' : true);
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {}
})();`,
          }}
        />
      </Head>
      <body className="bg-dark-950 text-slate-200 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
