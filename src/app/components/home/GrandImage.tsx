import Image from "next/image";
import globe from "@/app/image/header.png";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const GrandeImage = () => {
  return (
    <section className="h-[88vh] mt-[25%] md:m-auto w-full relative md:flex">
      <div className="flex h-full m-auto md:mt-12 md:m-auto md:w-1/2 z-0">
        <div className="h-[h-2/3] m-auto align-middle">
          <p className="mb-10 ml-4 text-2xl lg:text-4xl text-left mt-12">
            Découvez <span className="text-red-500 font-bold underline underline-offset-4 decoration-red-500">
               Yassir
            </span>
            , la plateforme qui ouvre les portes du monde de l'échange universitaire, où les opportunités d'apprentissage transcendent les frontières et où les cultures se rencontrent pour enrichir votre parcours académique.
          </p>
          <Link href="#temoignage" className="mt-[35%] text-center w-full md:mt-5" passHref>
            <h2 className="text-2xl">Lire des témoignages  !</h2>
            <FontAwesomeIcon icon={faAngleDown} className=" w-full m-auto h-10 mt-2" bounce/>
          </Link>
        </div>
      </div>
      <div className="top-0 absolute md:relative h-auto m-auto w-full md:w-1/2">
        <Image
          src={globe}
          alt="Header image d'illustration"
          objectFit="cover"
          className=" opacity-50 md:opacity-100 "
        />
      </div>
    </section>
  );
};

export default GrandeImage;
