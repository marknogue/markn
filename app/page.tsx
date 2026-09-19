import { HomeGrid } from "./components/HomeGrid";
import { buildColumns, HOME_ITEMS, PRELOADER_IMAGES } from "./lib/home";
import { MotionSection } from "./motion/page";
import { AboutSection } from "./about/page";
import { ContactSection } from "./contact/page";

export default function Home() {
  const [colA, colB] = buildColumns(HOME_ITEMS);

  return (
    <main>
      <HomeGrid
        items={HOME_ITEMS}
        colA={colA}
        colB={colB}
        preloaderImages={PRELOADER_IMAGES}
      />
      <MotionSection id="motion" />
      <AboutSection id="about" />
      <ContactSection id="contact" />
    </main>
  );
}
