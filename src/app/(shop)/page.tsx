import { Catalogue } from "@/components/home/catalogue";
import { Hero } from "@/components/home/hero";
import { HomeFooter } from "@/components/home/home-footer";
import { HowItWorks } from "@/components/home/how-it-works";
import { MadeByHand } from "@/components/home/made-by-hand";
import { ShopByRoom } from "@/components/home/shop-by-room";
import { getRoom } from "@/lib/catalogue";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { room, show } = await searchParams;
  const activeRoom = typeof room === "string" ? getRoom(room)?.slug : undefined;
  const visible = typeof show === "string" ? Number.parseInt(show, 10) : NaN;

  return (
    <>
      <main>
        <Hero />
        <ShopByRoom />
        <Catalogue room={activeRoom} show={visible} />
        <MadeByHand />
        <HowItWorks />
      </main>
      <HomeFooter />
    </>
  );
}
