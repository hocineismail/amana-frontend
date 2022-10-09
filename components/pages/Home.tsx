import Head from "next/head";
import Footer from "../footer/footer";
import HeaderHome from "../headers/HeaderHomePage";
import ClientOpinion from "../informations/ClientOpinion";
import Team from "../informations/Team";
import WhyShooseIWallet from "../informations/WhyShooseIWallet";
import Menu from "../menu/Menu";
export default function Home() {
  return (
    <>
      <Head>
        <title>Amana transfers | Home page</title>
      </Head>
      <main>
        <HeaderHome />
        <WhyShooseIWallet />
        {/* <ClientOpinion /> */}

        <Menu />
      </main>
      <Footer />
    </>
  );
}
