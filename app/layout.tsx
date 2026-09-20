import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { INSTAGRAM_URL, SITE_EMAIL, SITE_LOCATION, SITE_NAME, SITE_URL } from "./lib/site";
import "./globals.css";

const timesTen = localFont({
  variable: "--font-times",
  display: "swap",
  src: [{ path: "./fonts/TimesTenLTStd-Roman.woff2", weight: "400", style: "normal" }],
});

const DESCRIPTION = `${SITE_NAME} is a London based photographer and director. His images explore themes surrounding intimacy and connection, and celebrate inclusivity and diversity.`;
const DEFAULT_TITLE = `${SITE_NAME} — Photographer & Director, London`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  keywords: [
    SITE_NAME,
    "photographer",
    "director",
    "London photographer",
    "fashion photography",
    "documentary photography",
    "editorial photography",
    "moving image",
  ],
  alternates: { canonical: "/" },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE_NAME,
      jobTitle: "Photographer & Director",
      url: SITE_URL,
      description: DESCRIPTION,
      email: SITE_EMAIL,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE_LOCATION,
        addressCountry: "GB",
      },
      sameAs: [INSTAGRAM_URL],
      knowsAbout: [
        "Fashion photography",
        "Documentary photography",
        "Editorial photography",
        "Moving image",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

const scrollScript = `(function(){
  var s=false;
  function gy(){return window.visualViewport?window.visualViewport.pageTop:(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0);}
  var anchorY=gy();
  var touch=window.matchMedia('(hover: none)');
  function upd(){
    var y=gy();
    var b=document.body.classList;
    if(!s && y>40){s=true;b.add('is-scrolled');}
    else if(s && y<10){s=false;b.remove('is-scrolled','nav-reveal','nav-open');}
    var dy=y-anchorY;
    if(dy<-12){if(touch.matches)b.add('nav-reveal');anchorY=y;}
    else if(dy>12){b.remove('nav-reveal','nav-open');anchorY=y;}
  }
  window.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('touchmove',upd,{passive:true});
  window.addEventListener('touchend',upd,{passive:true});
  if(window.visualViewport)window.visualViewport.addEventListener('scroll',upd);
})();`;

const preloaderScript = `(function(){
  function go(){
    var p=document.getElementById('preloader');
    var t=p?parseInt(p.getAttribute('data-timeout')||'5500',10)+800:5500;
    setTimeout(function(){
      var el=document.getElementById('preloader');
      if(el){el.style.transition='opacity .5s ease';el.style.opacity='0';setTimeout(function(){if(el)el.style.display='none';},520);}
      document.body.style.overflow='';
    },t);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);
  else go();
})();`

const lazyVideoScript = `(function(){
  function setup(){
    var vids=document.querySelectorAll('video[data-grid-video]');
    if(!('IntersectionObserver' in window)){for(var i=0;i<vids.length;i++){var p=vids[i].play();if(p&&p.catch)p.catch(function(){});}return;}
    var io=new IntersectionObserver(function(entries){
      for(var i=0;i<entries.length;i++){
        var v=entries[i].target;
        if(entries[i].isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){});}
        else{v.pause();}
      }
    },{rootMargin:'300px 0px'});
    for(var i=0;i<vids.length;i++){io.observe(vids[i]);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);
  else setup();
})();`;

const galleryPreloadScript = `(function(){
  function preload(base,idx){
    [idx-1,idx+1].forEach(function(j){
      var el=document.getElementById(base+'-'+j);
      if(el){var img=el.querySelector('img');if(img){var u=img.getAttribute('src');if(u){var im=new Image();im.src=u;}}}
    });
  }
  function onHash(){
    var hash=location.hash.slice(1);
    if(hash.indexOf('home-lb-')!==0)return;
    var el=document.getElementById(hash);
    if(!el||!el.classList.contains('hlb-one'))return;
    var m=hash.match(/-(\\d+)$/);if(!m)return;
    preload(hash.replace(/-\\d+$/,''),parseInt(m[1],10));
  }
  window.addEventListener('hashchange',onHash);
  onHash();
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={timesTen.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: scrollScript }} />
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
        <script dangerouslySetInnerHTML={{ __html: lazyVideoScript }} />
        <script dangerouslySetInnerHTML={{ __html: galleryPreloadScript }} />
        <Nav />
        <div>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
