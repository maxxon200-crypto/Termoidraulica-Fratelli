/* Termoidraulica Fratelli Bollente · JS unico.
   Tutto qui dentro è miglioramento progressivo: senza JS il sito resta
   completo (menu aperto, testata piena, orari statici, marquee fermo e
   leggibile, tratti già disegnati, link mappa esterno, validazione nativa
   del form). Niente cookie, niente analytics, niente terze parti. */

/* Gancio: lo stato nascosto di reveal e tratti vive solo con questa classe.
   Deve essere la prima istruzione (vedi DESIGN.md §1.6). */
document.documentElement.classList.add("js");

var riduciMoto = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- Testata sticky: fondo + blur quando si scrolla ---------- */

(function () {
  var testata = document.querySelector(".testata");
  if (!testata) return;
  function aggiorna() {
    testata.classList.toggle("scrollata", window.scrollY > 8);
  }
  aggiorna();
  window.addEventListener("scroll", aggiorna, { passive: true });
})();

/* ---------- Menu a scomparsa (mobile) ---------- */

(function () {
  var bottone = document.querySelector(".menu-bottone");
  var nav = document.getElementById("nav-principale");
  if (!bottone || !nav) return;
  nav.setAttribute("data-chiuso", "");
  bottone.addEventListener("click", function () {
    var aperto = bottone.getAttribute("aria-expanded") === "true";
    bottone.setAttribute("aria-expanded", String(!aperto));
    if (aperto) {
      nav.setAttribute("data-chiuso", "");
    } else {
      nav.removeAttribute("data-chiuso");
    }
  });
})();

/* ---------- Reveal + tratti disegnati: un IntersectionObserver condiviso,
   una volta sola per elemento, mai con motion ridotto ---------- */

(function () {
  var anima = Array.prototype.slice.call(document.querySelectorAll("[data-anima]"));
  var tratti = Array.prototype.slice.call(document.querySelectorAll(".disegnata, .evidenzia"));

  if (riduciMoto.matches || !("IntersectionObserver" in window)) {
    anima.forEach(function (el) {
      el.classList.add("vista");
    });
    tratti.forEach(function (el) {
      el.classList.add("tracciata");
    });
    return;
  }

  /* stagger: ogni elemento animato prende un ritardo in base alla sua
     posizione tra i fratelli che animano nello stesso contenitore */
  anima.forEach(function (el) {
    var indice = 0;
    var p = el.previousElementSibling;
    while (p) {
      if (p.hasAttribute("data-anima")) indice++;
      p = p.previousElementSibling;
    }
    el.style.setProperty("--ritardo", Math.min(indice, 6) * 60 + "ms");
  });

  var oss = new IntersectionObserver(
    function (voci) {
      voci.forEach(function (voce) {
        if (!voce.isIntersecting) return;
        if (voce.target.hasAttribute("data-anima")) voce.target.classList.add("vista");
        if (
          voce.target.classList.contains("disegnata") ||
          voce.target.classList.contains("evidenzia")
        ) {
          voce.target.classList.add("tracciata");
        }
        oss.unobserve(voce.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );
  anima.forEach(function (el) {
    oss.observe(el);
  });
  tratti.forEach(function (el) {
    oss.observe(el);
  });
})();

/* ---------- Marquee servizi: si duplica la traccia per lo scorrimento
   continuo, ma solo se il movimento è consentito. Senza JS o con motion
   ridotto resta una riga statica e leggibile. ---------- */

(function () {
  if (riduciMoto.matches) return;
  document.querySelectorAll(".marquee-traccia").forEach(function (traccia) {
    /* si duplicano le voci DENTRO la stessa traccia: la traccia diventa
       larga due volte e l'animazione la trasla del 50% per un ciclo continuo.
       Il marquee è già aria-hidden nel markup, la copia non serve annunciarla. */
    var voci = Array.prototype.slice.call(traccia.children);
    voci.forEach(function (voce) {
      traccia.appendChild(voce.cloneNode(true));
    });
  });
})();

/* ---------- Spia orari: evita telefonate a negozio chiuso.
   Lun–Ven 7:00–12:00 e 14:00–18:00, Sab 7:00–12:00, Dom chiuso.
   Fuso del negozio: Europe/Rome. ---------- */

(function () {
  var spia = document.querySelector("[data-spia-orari]");
  if (!spia) return;

  var ORARI = {
    1: [[420, 720], [840, 1080]],
    2: [[420, 720], [840, 1080]],
    3: [[420, 720], [840, 1080]],
    4: [[420, 720], [840, 1080]],
    5: [[420, 720], [840, 1080]],
    6: [[420, 720]],
    0: []
  };
  var GIORNI = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];

  function oraNegozio() {
    var parti = new Intl.DateTimeFormat("it-IT", {
      timeZone: "Europe/Rome",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    }).formatToParts(new Date());
    var mappa = {};
    parti.forEach(function (p) {
      mappa[p.type] = p.value;
    });
    var indice = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"].indexOf(mappa.weekday);
    return { giorno: indice, minuti: parseInt(mappa.hour, 10) * 60 + parseInt(mappa.minute, 10) };
  }

  function minutiInOra(m) {
    var h = Math.floor(m / 60);
    var min = m % 60;
    return h + ":" + (min < 10 ? "0" + min : min);
  }

  function stato() {
    var ora = oraNegozio();
    var oggi = ORARI[ora.giorno];
    for (var i = 0; i < oggi.length; i++) {
      if (ora.minuti >= oggi[i][0] && ora.minuti < oggi[i][1]) {
        return "Siamo aperti";
      }
      if (ora.minuti < oggi[i][0]) {
        return "Riapriamo alle " + minutiInOra(oggi[i][0]);
      }
    }
    for (var salto = 1; salto <= 7; salto++) {
      var g = (ora.giorno + salto) % 7;
      if (ORARI[g].length) {
        var alle = minutiInOra(ORARI[g][0][0]);
        if (salto === 1) return "Riapriamo domani alle " + alle;
        return "Riapriamo " + GIORNI[g] + " alle " + alle;
      }
    }
    return "";
  }

  var testo = stato();
  if (testo) spia.textContent = testo;
})();

/* ---------- Mappa a facciata: iframe OpenStreetMap solo al clic ---------- */

(function () {
  document.querySelectorAll("[data-mappa]").forEach(function (blocco) {
    var bottone = blocco.querySelector("[data-mappa-apri]");
    if (!bottone) return;
    bottone.addEventListener("click", function () {
      /* Coordinate approssimative del civico: VERIFICARE CON IL CLIENTE */
      var lat = blocco.getAttribute("data-lat");
      var lon = blocco.getAttribute("data-lon");
      var bbox =
        (parseFloat(lon) - 0.006) + "," + (parseFloat(lat) - 0.004) + "," +
        (parseFloat(lon) + 0.006) + "," + (parseFloat(lat) + 0.004);
      var iframe = document.createElement("iframe");
      iframe.src =
        "https://www.openstreetmap.org/export/embed.html?bbox=" +
        encodeURIComponent(bbox) +
        "&layer=mapnik&marker=" +
        encodeURIComponent(lat + "," + lon);
      iframe.title = "Mappa: Via per Crescenzago 177, Sesto San Giovanni";
      iframe.loading = "lazy";
      bottone.replaceWith(iframe);
    });
  });
})();

/* ---------- Form: messaggi di errore specifici in italiano.
   Senza JS resta la validazione nativa del browser. ---------- */

(function () {
  var form = document.querySelector("[data-form-contatti]");
  if (!form) return;
  form.setAttribute("novalidate", "");

  var MESSAGGI = {
    nome: "Inserisci il tuo nome",
    telefono: "Inserisci un numero di telefono",
    messaggio: "Scrivi il messaggio"
  };

  function controlla(campo) {
    var blocco = campo.closest(".campo");
    var errore = blocco.querySelector(".errore");
    var valido = campo.checkValidity();
    if (valido) {
      blocco.classList.remove("errato");
      if (errore) errore.hidden = true;
      campo.removeAttribute("aria-invalid");
    } else {
      blocco.classList.add("errato");
      if (errore) {
        errore.textContent = MESSAGGI[campo.name] || "Controlla questo campo";
        errore.hidden = false;
      }
      campo.setAttribute("aria-invalid", "true");
    }
    return valido;
  }

  form.addEventListener("submit", function (evento) {
    var campi = form.querySelectorAll("input, textarea");
    var primoErrato = null;
    campi.forEach(function (campo) {
      if (!controlla(campo) && !primoErrato) primoErrato = campo;
    });
    if (primoErrato) {
      evento.preventDefault();
      primoErrato.focus();
    }
  });

  form.querySelectorAll("input, textarea").forEach(function (campo) {
    campo.addEventListener("blur", function () {
      if (campo.closest(".campo").classList.contains("errato")) controlla(campo);
    });
    campo.addEventListener("input", function () {
      if (campo.closest(".campo").classList.contains("errato")) controlla(campo);
    });
  });
})();
