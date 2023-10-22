import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return <footer className="p-5 bottom-0 right-0 left-0 bg-green-400  lg:flex">
        <div className="ml-5 w-full md:w-1/3 pt-2">
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
        <div className="w-full m-auto md:w-1/3 pt-2 flex">
            <ul className="m-auto">
                <li><a href="#" className="pl-5" >Contact</a></li>
                <li><a href="#" className="pl-5">Plan d'accés</a></li>
                <li><a href="#" className="pl-5">Oiseau</a></li>
            </ul>
            <ul className="m-auto">
                <li><a href="#" className="pl-5" >Medias</a></li>
                <li><a href="#" className="pl-5">Alumni</a></li>
                <li><a href="#" className="pl-5">Top destinations</a></li>
            </ul>
        </div>
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11124.004110489066!2d4.8229951021187425!3d45.811237811119945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sfr!4v1697990268861!5m2!1sfr!2sfr" width="200" className="mt-2 w-1/3 mr-5 w-full m-auto" height="110" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </footer>
}

export default Footer