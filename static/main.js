onload = () => {
	const chataKlase = new Chats()
	chataKlase.lasiChatu()


	// Ērtības funkcionalitāte
	// var versijasLauks = document.getElementById("versija");
	// versijasLauks.innerHTML = "JS versija: " + VERSIJA;
	// Atrod ievades lauku
	var ievadesLauks = document.getElementById("zinja")
	document.addEventListener("keydown", function(event) {
	  if (event.keyCode === 38 && ieraksts < komandas.length) {
	    ieraksts += 1 
	    document.getElementById("zinja").value = komandas[ieraksts-1]
	  }
	  if (event.keyCode === 40 && ieraksts > 1) {
	    ieraksts -= 1 
	    document.getElementById("zinja").value = komandas[ieraksts-1]
	  }
	})
	// Gaida signālu no klaviatūras, ka ir nospiests Enter taustiņš
	ievadesLauks.addEventListener("keyup", function(event) {
	  // Numur 13 ir "Enter" taustiņš
	  if (event.keyCode === 13) {
	  	chataKlase.suutiZinju()
	  }
	})

	document.getElementById('skanjasPoga').addEventListener('click', () => {
		chataKlase.skanaJaNe()
	})

	document.getElementById('zinjasPoga').addEventListener('click', () => {
		chataKlase.suutiZinju()
	})
	
}
