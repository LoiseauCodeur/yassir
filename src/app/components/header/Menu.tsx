"use client";
import { useState } from "react";
import Link from "next/link";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Menu = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const menuDefile = menuOpen ? " md:inline h-screen w-screen fixed top-0 left-0 bg-white z-50 pt-10" : "hidden md:flex space-x-4";

    return (
        <nav className="flex md:w-[80%]">
            <button onClick={toggleMenu} className="h-full md:hidden w-auto justify-center mr-5">
                <FontAwesomeIcon className="w-6 h-full m-auto" icon={faBars} /> 
            </button>
            <ul className={`${menuDefile} items-center justify-end w-full`} >
                <li className=" h-auto w-[200px] md:w-full text-center md:mb:0 hover:font-semibold">
                    <Link href="/login"> S'inscrire</Link>
                </li>
                <li className="m-auto w-[200px] md:w-full text-center md:mb:0 hover:font-semibold">
                    <Link href="/#partenaire">Partenaire</Link>
                </li>
                <li className=" w-[200px] md:w-full text-center md:mb:0 hover:font-semibold">
                    <Link href="/#temoignage" passHref>Témoignages</Link>
                </li>
                <li className={`inblockline md:hidden m-auto w-[100px] md:w-full text-center mt-10 md:mb:0 bg-red-600 rounded-full`} onClick={toggleMenu}> 
                    <Link href="/"><FontAwesomeIcon className="w-6 h-full m-auto pt-2" icon={faLeftLong} /> </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;
