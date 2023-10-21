import Image from "next/image";
import medine from "@/app/image/universities/medine.jpg";
import delhi from  "@/app/image/universities/delhi.jpg";
import nid from    "@/app/image/universities/nest.jpg";
import chine from "@/app/image/universities/chine.jpg";

const University = () => {
  return (
    <section className="mt-12" id="partenaire">
      <h1 className="text-3xl text-center text-red-500 overline">
        Nos universités partenaires 
      </h1>
        <div className="grid  gird-cols-1 md:grid-cols-2 gap-2 m-5"> 
          <div className="bg-white h-full rounded-lg p-2 m-auto">
            <h3 className="text-lg font-semibold">Université de Bouzinl</h3>
            <p className="text-sm font-semibold text-gray-400">Bouzil, Kirliko</p>
            <Image
              src={medine}
              alt="medine"
              className="w-full h-auto right-0 top-0"
            />
            <p className="mt-2">
              L'Université de Bouzil, située dans le pittoresque pays de Kirliko,
              est un établissement d'enseignement supérieur renommé qui incarne une
              fusion fascinante de tradition et de modernité. Fondée au cœur de la
              charmante ville de Bouzil, cette institution académique est le joyau
              de l'éducation kirlikienne.
            </p>
          </div>
          <div className=" bg-white h-full rounded-lg p-2 m-auto">
            <h3 className="text-lg font-semibold">Université de Bicha</h3>
            <p className="text-sm font-semibold text-gray-400">Bicha, Bichnoudie du Nord</p>
            <Image
              src={delhi}
              alt="medine"
              className="w-full h-auto right-0 top-0"
            />
            <p className="mt-2">
                Le campus de l'Université de Bichnoudie est un véritable chef-d'œuvre architectural, mélangeant des styles modernes et anciens de manière harmonieuse. Des bâtiments élégants aux jardins luxuriants, chaque coin du campus respire l'inspiration. Les étudiants peuvent se perdre dans un labyrinthe de bibliothèques impressionnantes, de laboratoires high-tech et de salles de classe innovantes.
            </p>
          </div>
          <div className=" bg-white h-full rounded-lg p-2 m-auto">
            <h3 className="text-lg font-semibold">Grande Ecole des Oiseaux</h3>
            <p className="text-sm font-semibold text-gray-400">Le Nid, Cuicuiland</p>
            <Image
              src={nid}
              alt="medine"
              className="w-full h-auto right-0 top-0"
            />
            <p className="mt-2">
            La Grande École des Oiseaux est une institution éducative extraordinaire, située au cœur d'une vaste forêt enchantée, où les oiseaux règnent en maîtres. Cette école unique en son genre offre une formation exceptionnelle pour les futurs plumes érudites, et son campus est une véritable merveille de la nature.
            </p>
          </div>
          <div className=" bg-white h-full rounded-lg p-2 m-auto">
            <h3 className="text-lg font-semibold">Haut lycée de Chine</h3>
            <p className="text-sm font-semibold text-gray-400">Wou-ho, firlina</p>
            <Image
              src={chine}
              alt="medine"
              className="w-full h-auto right-0 top-0"
            />
            <p className="mt-2">
            Le Haut Lycée de Chine est une institution éducative exceptionnelle située au cœur d'une métropole futuriste, entourée de gratte-ciel scintillants et de technologies de pointe. Cette école révolutionnaire est à la pointe de l'éducation et offre un environnement d'apprentissage qui défie les limites de l'imagination.
            </p>
          </div>
        </div>
    </section>
  );
};

export default University;
