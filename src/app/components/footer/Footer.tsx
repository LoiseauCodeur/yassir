import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return <footer className=" bottom-0 left-0 right-0  bg-green-400  h-[15vh] flex">
        <div className="ml-5 w-1/2 pt-2">
            <h6 className="underline">Suivez nous sur :</h6>
            <ul className="flex w-11/12 pr-2 justify-between" >
                <li>
                    <a href=""><FontAwesomeIcon icon={faFacebook} className="h-8" /></a>
                </li>
                <li>
                    <a href=""><FontAwesomeIcon icon={faTwitter} className="h-8"/></a>
                </li>
                <li>
                    <a href=""><FontAwesomeIcon icon={faInstagram} className="h-8"/></a>
                </li>
                <li>
                    <a href=""><FontAwesomeIcon icon={faLinkedin} className="h-8"/></a>
                </li>
            </ul>
        </div>
        <ul className="w-1/3 ml-auto pt-2">
            <li><a href="#"className="" >Contact</a></li>
            <li><a href="#">Plan d'accés</a></li>
            <li><a href="#">Oiseau</a></li>
        </ul>
    </footer>
}

export default Footer