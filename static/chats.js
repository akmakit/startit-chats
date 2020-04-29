const ATJAUNOT = 500
const VERSIJA = '0.5'

let vards = getCookie('vards') || 'Viesis'
let pupinu = false
let komandas = []
let ieraksts = 0


let skanjaIeslegta = false
krasasMaina = (krasa) => document.body.className = krasa

class Chats {
  constructor() {
    this.zinjas = []
    this.garastavokli = []
  } 

  notiritZinjas = () => this.zinjas = []
  notiritGarastavoklus =() => this.garastavokli = []

  pievienotZinju = (zinja) => this.zinjas.push(zinja)
  pievienotGarastavokli = (garastavoklis) => this.garastavokli.push(garastavoklis)

  vaiSkanjaIeslegta = () => document.getElementById('skanjasPoga').value === 'up'
  atskanjoSkanju = () => new Audio('static/sounds/water_droplet.mp3').play()

  pievienotZinjas = (visasZinjas) => {
    this.notiritZinjas()
    visasZinjas.length == 0
      ? this.pievienotZinju(this.tuksaZinja(new Date().toLocaleDateString()))
      : visasZinjas.forEach(({ vards, zinja, laiks }) => this.pievienotZinju(new Zinja(vards, zinja, laiks)))
  }

  pievienotGarastavokljus = (visiGarastavokli) => {
    if (visiGarastavokli.length == 0) return
    this.notiritGarastavoklus()
    visiGarastavokli.forEach(garastavoklis => this.pievienotGarastavokli(garastavoklis))
  }

  tuksaZinja = (laiksUnDatumsTagad) => (
    new Zinja(
      'Pārlūkprogramma',
      'Čatā pašlaik ziņu nav, uzrakstiet kaut ko!',
      `${laiksUnDatumsTagad}`
    )
  )

  raadiChataRindas = () => {
    const chatUL = document.getElementById('chats')
    // novaacam ieprieksheejo saturu
    while (chatUL.firstChild) chatUL.firstChild.remove()
    // pievienojam visas zinjas
    this.zinjas.forEach((zinja, index) => chatUL.innerHTML += zinja.formateRindu(this.garastavokli))
    // noskrolleejam uz leju pie peedeejaa chata texta
    var chatScrollBox = chatUL.parentNode
    chatScrollBox.scrollTop = chatScrollBox.scrollHeight
  }

  uzstadiVaardu = (jaunaisVards) => {
    const vecaisVards = vards
    vards = jaunaisVards
    setCookie('vards', vards, 3600)
    return `${vecaisVards} kļuva par ${vards}`
  }

  uzstaditPupinu = () => {
    pupinu = !pupinu
    return `Pupinu valodas statuss: ${pupinu}!`
  }

  skanaJaNe = () => {
    skanjaIeslegta = !skanjaIeslegta
    let skanjasPogasStatuss = skanjaIeslegta ? 'off' : 'up'
    document.getElementById('ikona').className = `fa fa-volume-${skanjasPogasStatuss}`
  }

  paradiPalidzibu = () => {
    const komandas = [
      'vards JaunaisVards',
      'palidziba',
      'versija',
      'es',
      'pupas',
      'joks',
      'izcelts',
      'pazinojums'
    ]
    const visasKomandasKopa = komandas.map(komanda => `,'/${komanda}'`).join(' ')
    return `'Pieejamās komandas: ${visasKomandasKopa}`
  }

  saprotiKomandu = (zinja) => {
    const komanda = zinja.split(' ')[0]
    const saturs = zinja.split(' ').splice(1, zinja.length).join(' ')
    switch (komanda) {
      case '/joks':
        return getChuckJoke()
        break;
      case '/vards':
      case '/vaards':
        return saturs.length < 1
          ? 'Norādi jauno vārdu, piemēram: /vards MansJaunaisVards'
          : this.uzstadiVaardu(saturs)
        break
      case '/es':
        return saturs.length < 1
          ? 'Norādi savu garastavokli: /es priecīgs, noņemt garastāvokli: /es- '
          : this.pierakstitGarastavokli(saturs)
      case '/izcelts':
        return saturs.length < 1
          ? 'Norādi izceļamo tekstu, piemēram: /izcelts ziņa'
          : `**${saturs.replace('/izcelts ','')}**`
        break;
      case '/pazinojums':
        return saturs.length < 1
          ? 'Norādi paziņojuma tekstu, piemēram: /pazinojums ziņa'
          : `!${saturs.replace('/pazinojums ','')}!`
        break;
      case '/pupas':
        return this.uzstaditPupinu();
        break;
      case '/versija':
      case '/v':
        return `Javascript versija: ${VERSIJA}`
        break;
      case '/paliigaa':
      case '/paliga':
      case '/help':
      case '/?':
      default:
        return this.paradiPalidzibu()
        break
    }
  }

  suutiZinju = () => {
    let zinjasElements = document.getElementById('zinja')
    let zinja = zinjasElements.value
    zinjasElements.value = ''
    komandas.push(zinja)
    if (zinja.length < 1) {
      console.log('Tukšu ziņu nesūtām uz serveri')
      return
    }

    if (zinja.startsWith('/')) zinja = this.saprotiKomandu(zinja)
    
    const rinda = new Zinja(vards, zinja, null, pupinu)
    const parameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'chats': rinda })
    }

    this.vaiSkanjaIeslegta() && this.atskanjoSkanju()

    fetch('/chats/suuti', parameters)
      .then(r => r.json())
      .then(d => this.pievienotZinjas(d))
      .catch(e => console.error('Error:', e))
  }

  pierakstitGarastavokli = (garastavoklis) => {
    const parameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // ja atslēga un vērtība sakrīt, tad var šādi
      body: JSON.stringify({ vards, garastavoklis })
      // tas pats, kas JSON.stringify({ vards: vards, garastavoklis: garastavoklis })
    }

    fetch('/garastavoklis/pierakstit_grarastavokli', parameters)
      .then(r => r.json())
      .then(d => this.pievienotGarastavokljus(d))
      .catch(e => console.error('Error:', e))
      
    return `${vards} nomainīja garastāvokli uz: ${garastavoklis}`
  }

  async lasiChatu() {
    const atbilde = await fetch('/chats/lasi')
    const { chats, mood } = await atbilde.json()
    this.pievienotZinjas(chats)
    this.pievienotGarastavokljus(mood)
    this.raadiChataRindas()
    await new Promise(resolve => setTimeout(resolve, ATJAUNOT))
    this.lasiChatu()
  }
}
