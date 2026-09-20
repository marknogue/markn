import { HomeGrid } from "./components/HomeGrid";
import { MotionSection } from "./motion/page";
import { AboutSection } from "./about/page";
import { ContactSection } from "./contact/page";
import { buildColumns, type Item } from "./lib/home";
import { sized } from "./lib/sanity/client";
import { getImages, getPreloader, type Media } from "./lib/sanity/queries";

function toItem(m: Media, i: number): Item {
  const id = `home-${i}`;
  const href = m.link || "#";
  const gallery = m.gallery.length
    ? m.gallery.map((g) => ({
        thumb: sized(g.src, 600, 60),
        src: sized(g.src, 1600),
        w: g.w,
        h: g.h,
      }))
    : undefined;

  if (m.type === "video") {
    return {
      type: "video",
      id,
      href,
      src: m.src,
      width: m.width,
      height: m.height,
      landscape: m.landscape,
      caption: m.caption,
      gallery,
    };
  }

  return {
    type: /\.gif($|\?)/i.test(m.src) ? "gif" : "image",
    id,
    href,
    image: sized(m.src, 900, 70),
    width: m.width,
    height: m.height,
    landscape: m.landscape,
    caption: m.caption,
    gallery,
  };
}

export default async function Home() {
  const media = await getImages();
  const items = (media || []).map(toItem);
  const [colA, colB] = buildColumns(items);

  const preloader = await getPreloader();
  const preloaderImages = (preloader?.images || []).map((i) => ({
    src: sized(i.src, 900, 60),
    w: i.w,
    h: i.h,
  }));

  return (
    <main>
      <HomeGrid
        items={items}
        colA={colA}
        colB={colB}
        preloaderImages={preloaderImages}
        secondsPerImage={preloader?.secondsPerImage ?? undefined}
        holdSeconds={preloader?.holdSeconds ?? undefined}
      />
      <MotionSection id="motion" />
      <AboutSection id="about" />
      <ContactSection id="contact" />
    </main>
  );
}
