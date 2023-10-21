"use client"
import Image from "next/image";
import random1 from "@/app/image/temoins/random1.jpeg"
import random2 from "@/app/image/temoins/random2.jpeg"
import random3 from "@/app/image/temoins/random3.jpeg"
import { useState } from "react";

const Temoignage = () => {
  const [lirePlus, setLirePlus] = useState(false)
  let temoin1 :string = "J'ai eu la chance de participer au programme offert par Yassir, et cela a été une expérience incroyable. Leur approche unique pour faciliter les échanges universitaires m'a permis de découvrir de nouvelles cultures, d'acquérir de nouvelles compétences et de tisser des liens précieux avec des étudiants du monde entier. Leur équipe dévouée m'a guidé à chaque étape du processus, de la candidature à l'immersion dans un nouvel environnement académique. Je recommande vivement Yassir à tous ceux qui souhaitent enrichir leur parcours académique grâce à des opportunités d'échange universitaire exceptionnelles."
  let temoin2 :string= "Yassir a révolutionné la façon dont je perçois les échanges universitaires. Leur plateforme m'a ouvert les portes d'opportunités éducatives que je n'aurais jamais cru possibles. Grâce à Yassir, j'ai pu étudier dans des institutions prestigieuses à l'étranger, élargir mes horizons et développer des compétences interculturelles précieuses. Leur équipe dévouée a simplifié tout le processus, de la recherche d'un programme à la préparation de mon voyage. Yassir a vraiment changé la donne pour les étudiants en quête d'aventures académiques uniques."
  let temoin3 :string= "Yassir a transformé mon expérience universitaire de manière extraordinaire. Grâce à leur plateforme, j'ai eu l'opportunité de voyager, d'apprendre et de grandir en tant qu'étudiant. Leur approche innovante a ouvert un monde de possibilités éducatives pour moi, me permettant de vivre des aventures académiques inoubliables. Le processus a été fluide et transparent, grâce à l'équipe dévouée de Yassir qui m'a accompagné à chaque étape. Je suis reconnaissant d'avoir découvert Yassir, car cela a vraiment enrichi mon parcours universitaire."

  return (
    <section id="temoignage" className="mb-5">
      <h2 className="text-2xl text-center font-bold m-5">Témoignages</h2>
      <div className="flex flex-col gap-5">
        <article className="p-5 flex gap-[2%] bg-green-200  rounded-r-full">
          <div>
            <h3 className="font-bold">Bernard Loiseau</h3>
            <p className=""> {temoin1} </p> 
          </div>
          <Image src={random1} alt="" objectFit="contain" className="w-auto h-[200px] align-middle m-auto rounded-r-full" />
        </article>
        <article className="p-5 flex gap-5 flex-row-reverse  bg-violet-300 rounded-l-full">
          <div>
            <h3 className="font-bold">Fabrice Hirondelle</h3>
            <p>{temoin2}</p>
          </div>
          <Image src={random2} alt="" objectFit="contain"  className="w-auto h-[200px] align-middle m-auto rounded-l-full" />
        </article>
        <article className="p-5 flex gap-5 bg-yellow-200 rounded-r-full h-200">
          <div>
            <h3 className="font-bold">Moine Sublime</h3>
            <p>{temoin3}</p>
          </div>
          <Image src={random3} alt="" objectFit="contain"  className="w-auto h-[200px] align-middle m-auto rounded-r-full"/>
        </article>
      </div>
    </section>
  );
};

export default Temoignage;
