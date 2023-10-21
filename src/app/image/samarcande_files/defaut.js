/* 
	ED - 12.07.2006
	Fonction AddEvent de John Resig 
	http://ejohn.org/projects/flexible-javascript-events/
*/
 function addEvent( obj, type, fn ) {
   if ( obj.attachEvent ) {
     obj['e'+type+fn] = fn;
     obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
     obj.attachEvent( 'on'+type, obj[type+fn] );
   } else
     obj.addEventListener( type, fn, false );
 }
 
 function removeEvent( obj, type, fn ) {
  if ( obj.detachEvent ) {
    obj.detachEvent( 'on'+type, obj[type+fn] );
    obj[type+fn] = null;
  } else
    obj.removeEventListener( type, fn, false );
}

/* Affichage d'un calendrier pour les formulaires avec recherche par date */
function affiche_calendrier(nom, form) {
	if (document.getElementById) {
		document.write("<a href=\"#\" onclick=\"window.open('/adminsite/calendrier/calendrierjs.html?champ=" + nom + "&form=" + form +"', 'calendrier', 'width=135, height=138, toolbar=no, location=no, status=yes, resizable=yes'); return false;\"><img src=\"/images/calendrier.png\" border=\"0\"  alt=\"choisir une date\"></a>");
	}
}

/* Affichage d'une image dans une popup */
function afficheImage(source) {
	// Ouverture du pop-up
	window.open(source,'pop','status=no,directories=no,toolbar=no,location=no,menubar=no,scrollbars=yes,resizable=yes');
}

function atteindreAncre(ancre) {
	if (ancre != 'null'){
		window.location.href += '#' + ancre;
	}
}

/* Fonction utilisée dans la recherche avancée pour réinitialiser les formulaires */
function viderFormulaire(criteres) {
	criteres = criteres.split(";");
	var champReinit = "";
	var valeurChamp = "";
	
	for (var i=0; i < (criteres.length); i++) {
		champReinit = eval("document.forms['recherche_avancee']." + criteres[i].substring(0, criteres[i].indexOf("=")));
		valeurChamp = criteres[i].substring(criteres[i].indexOf("=")+1);
		
		if (champReinit) {
			
			var sType = champReinit.type;
			//bouton radio
			if (!sType) {
				for (var i = 0; i < champReinit.length; i++)
					champReinit[i].checked = false;
			} 
			//checkbox
			else if(sType == 'checkbox')
				champReinit.checked = false;
			//autres
			else
			champReinit.value = valeurChamp;
		}
	}
}


/* Fonction permettant d'afficher le bouton imprimer (donc uniquement si javascript est actif) */
function afficherBoutonImprimer(intitule) {
	document.write('<li id="imprimer">');
	document.write('<span onclick="window.print(); return false;">' + intitule + '</span>');
	document.write('</li>');
}


/* Fonction permettant d'intervertir l'id d'un élément avec un autre */
function switchId(ancienIdItem, nouvelIdItem) {
	var itemSwitch = window.document.getElementById(ancienIdItem);
	
	if (itemSwitch != null) {
		itemSwitch.id = nouvelIdItem;
	}
}
