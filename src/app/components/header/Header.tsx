import ButtonSearch from "./ButtonSearch";
import Menu from "./Menu";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/image/logo.png";

export default function Header() {
  return (
    <header className="z-10 fixed top-0 bg-sky-100 flex w-full justify-around  ">
        <Link href="/" className="flex">
          <Image src={logo} alt="logo" className="h-[100px] w-auto relative" />
        </Link>
      <ButtonSearch />
      <Menu />
    </header>
  );
}
