import { Catalogue } from "@/components/home/catalogue";
import { Hero } from "@/components/home/hero";
import { HomeFooter } from "@/components/home/home-footer";
import { HowItWorks } from "@/components/home/how-it-works";
import { ShopByRoom } from "@/components/home/shop-by-room";
import { getRoom } from "@/lib/catalogue";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { room } = await searchParams;
  const activeRoom = typeof room === "string" ? getRoom(room)?.slug : undefined;

  return (
    <>
      <main>
        <Hero />
        <ShopByRoom />
        <Catalogue room={activeRoom} />
        <HowItWorks />
      </main>
      <HomeFooter />
    </>
  );
}
