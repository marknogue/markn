import { Preloader } from "./components/Preloader";
import { ProjectGrid } from "./components/ProjectGrid";
import { MotionSection } from "./motion/page";
import { AboutSection } from "./about/page";
import { ContactSection } from "./contact/page";
import { type Item } from "./lib/home";
import { sized } from "./lib/sanity/client";
import {
  getPortfolio,
  getPreloader,
  getSelectedWorks,
  type Media,
} from "./lib/sanity/queries";

const toItems = (section: string, media: Media[] | null) =>
  (media || []).map((m, i) => toItem(m, `${section}-${i}`));

function toItem(m: Media, id: string): Item {
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
  const [selectedWorks, portfolio, preloader] = await Promise.all([
    getSelectedWorks(),
    getPortfolio(),
    getPreloader(),
  ]);

  const preloaderImages = (preloader?.images || []).map((i) => ({
    src: sized(i.src, 900, 60),
    w: i.w,
    h: i.h,
  }));

  return (
    <main>
      <Preloader
        images={preloaderImages}
        secondsPerImage={preloader?.secondsPerImage ?? undefined}
        holdSeconds={preloader?.holdSeconds ?? undefined}
      />
      <ProjectGrid
        id="selected-works"
        title="Selected Works"
        items={toItems("selected", selectedWorks)}
        first
      />
      <ProjectGrid id="portfolio" title="Portfolio" items={toItems("portfolio", portfolio)} />
      <MotionSection id="motion" />
      <AboutSection id="about" />
      <ContactSection id="contact" />
    </main>
  );
}
