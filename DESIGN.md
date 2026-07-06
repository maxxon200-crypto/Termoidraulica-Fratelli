# DESIGN.md · Termoidraulica Fratelli Bollente S.a.s.

Sito vetrina statico, 5 pagine, solo italiano. HTML + CSS + JS vanilla, nessun
framework, deploy statico (Vercel). Questo documento fissa i token, le regole
d'uso, i componenti e i layout. È vincolante: nessun colore o font si scrive a
mano nelle pagine, tutto passa dai token di `css/style.css`.

**Redesign — la premessa.** La prima versione era corretta ma fredda e
ripetitiva: sembrava un template. Questa versione tiene la stessa sostanza
(stessi fatti, stesso copy salvo "Chi siamo") e cambia la pelle: carta più
calda, un display serif editoriale, due accenti (terracotta e ocra), forme
firma con misura (archi, cerchio di sfondo, badge "dal 1997", una fascia scura
per pagina), e gerarchia costruita con l'opacità del testo, non con dieci
dimensioni diverse. Il lusso resta il crema e il bianco: espressivo significa
accenti sicuri su base calma, non riempire ogni pixel.

**Disciplina anti-caos (vincolante).** Massimo due colori accento. Per pagina:
al massimo 1 badge rotante, 1 marquee, 1 fascia scura (`--forest`), 1
sottolineatura disegnata per sezione. Non ogni foto è un arco: si alternano
arco / rettangolo / cerchio.

---

## 1. Token

### 1.1 Palette

| Token | Hex | Uso | Vietato |
|---|---|---|---|
| `--paper` | `#F4F1EA` | Sfondo base | — |
| `--paper-2` | `#EDE8DC` | Fascia/sezione alternata | — |
| `--surface` | `#FBFAF6` | Card, superfici sollevate | — |
| `--forest` | `#16241F` | Blocchi scuri (1 per pagina) | — |
| `--ink` | `#1B2A25` | Testo primario, titoli | — |
| `--ink-70` | `rgba(27,42,37,.70)` | Testo secondario, lead, eyebrow su chiaro | testo < AA su superfici diverse da paper/surface/paper-2 |
| `--ink-30` | `rgba(27,42,37,.30)` | Hairline, bordi decorativi | testo |
| `--terracotta` | `#BC5A2E` | Accento primario: riempimento bottoni (testo bianco), numeri/forme grandi | testo di paragrafo, testo piccolo su chiaro |
| `--terracotta-600` | `#A24A22` | Hover bottoni, **link e eyebrow di testo su chiaro** | paragrafi |
| `--ochre` | `#D79B3C` | Accento secondario "felice": SOLO forme, tratti di sottolineatura, eyebrow **su fondo scuro** | qualsiasi testo su fondo chiaro |
| `--on-forest` | `#EDE8DC` | Testo su `--forest` e su bottoni terracotta (variante crema per titoli) | — |
| `--on-forest-70` | `rgba(237,232,220,.72)` | Testo secondario su `--forest` | — |

Due accenti in tutto: terracotta e ocra. Nessun verde "aperto", nessun rosso
"errore": lo stato lo dicono le parole.

### 1.2 Contrasto (WCAG 2.x, luminanza relativa calcolata, non stimata)

| Coppia | Rapporto | Verdetto | Regola che ne deriva |
|---|---|---|---|
| ink su paper | 13.26:1 | AAA | corpo e titoli |
| ink su paper-2 | 12.23:1 | AAA | corpo su fascia alternata |
| ink su surface | 14.32:1 | AAA | corpo su card |
| ink-70 su paper | 5.28:1 | AA | lead, testo secondario, eyebrow |
| ink-70 su surface | 5.52:1 | AA | secondario su card |
| ink-70 su paper-2 | 5.09:1 | AA | secondario su fascia |
| **ink-50 su paper** | **2.97:1** | **FALLISCE** | vietato come testo: `--ink-50` non esiste tra i token |
| bianco su terracotta | 4.53:1 | AA | **i bottoni terracotta portano testo bianco puro, non crema** |
| crema (on-forest) su terracotta | 3.70:1 | solo grande | il crema sul bottone solo per etichette ≥ 24px |
| bianco su terracotta-600 | 5.93:1 | AA | hover bottone |
| **terracotta su paper** | **4.01:1** | **solo grande (3:1)** | terracotta come testo solo ≥ 24px (numeri grandi di sezione); i link no |
| terracotta-600 su paper | 5.26:1 | AA | **link e eyebrow di testo su chiaro** |
| terracotta-600 su surface | 5.68:1 | AA | link su card |
| **ochre su paper** | **2.15:1** | **FALLISCE anche grande** | ocra mai testo su chiaro, solo forme/tratti |
| ochre su forest | 6.62:1 | AA | eyebrow e accento di testo su scuro |
| on-forest su forest | 13.15:1 | AAA | testo su fascia scura |
| on-forest-70 su forest | ~9:1 | AAA | secondario su fascia scura |
| paper su forest | 14.25:1 | AAA | titoli su scuro |
| **ink-70 su forest** | **1.05:1** | **FALLISCE** | su scuro il secondario è crema (on-forest-70), MAI ink |
| terracotta su forest | 3.55:1 | solo grande | su scuro terracotta solo per elementi grandi/bottoni |

Sintesi operativa dei colori di testo:
- **Su chiaro** (paper/paper-2/surface): corpo/titoli `--ink`; secondario e lead
  `--ink-70`; eyebrow e link `--terracotta-600`; numeri decorativi grandi
  `--terracotta`; ocra e terracotta pieno mai come testo piccolo.
- **Su scuro** (`--forest`): titoli `--on-forest`; secondario `--on-forest-70`;
  eyebrow/accento `--ochre`; bottone terracotta con testo bianco.
- `--ink-30` solo hairline. `--ochre` su chiaro solo forme e tratti di
  sottolineatura (decorativi, nessun obbligo di contrasto testo).

### 1.3 Tipografia (woff2 self-hosted, niente CDN — vedi §9 sulla scelta)

- **Fraunces** (display): H1/H2/H3, wordmark, pull-quote. Variabile
  self-hosted, assi `opsz` 9–144 e `wght` 300–700. Ottica alta sui titoli
  grandi via `font-variation-settings:"opsz"`. Pesi leggeri (330–400) sui
  titoli = registro editoriale; 560 solo per parole enfatizzate. Corsivo
  (istanza statica opsz 72) solo per la pull-quote di "Chi siamo".
- **Inter** (testo e UI): 400 corpo, 500 nav/etichette, 600 bottoni. Istanze
  statiche subset latin (già presenti). `line-height` 1.6, riga 60–70 caratteri.
- Nessun terzo carattere.

Scala fluida (clamp, root 16px):

| Ruolo | Font | Token | px (min→max) |
|---|---|---|---|
| Display (hero) | Fraunces ~330, opsz 144 | `--fs-display` | 44 → 80 |
| H2 | Fraunces ~360, opsz 96 | `--fs-h2` | 32 → 52 |
| H3 (card) | Fraunces 400, opsz 40 | `--fs-h3` | 22 → 28 |
| Pull-quote | Fraunces italic 400 | `--fs-quote` | 24 → 36 |
| Lead | Inter 400, ink-70 | `--fs-lead` | 19 → 22 |
| Corpo | Inter 400, ink | `--fs-body` | 17 → 19 |
| Eyebrow | Inter 600 caps +.12em | `--fs-eyebrow` | 13 |
| Nav / UI | Inter 500 | 15px | |
| Bottoni | Inter 600 | 16px | |

Regola dura: nessun testo sotto 17px salvo eyebrow (13px, caps, alto tracking,
colore AA) e microcopy legale. Preload di `fraunces-var` e `inter-400`.
Fallback metrico `Georgia` per l'H1 contro il CLS.

### 1.4 Spaziatura, forma, ombre, motion

```
--section-pad: clamp(4rem, 8vw, 8rem);   /* padding-block sezioni */
--maxw: 1200px;                          /* larghezza contenuto */
--r-sm:6px; --r-md:14px; --r-lg:28px;    /* raggi */
--arch: 999px 999px 0 0;                 /* frame ad arco */
--shadow-sm: 0 2px 8px rgba(27,42,37,.06);
--shadow-md: 0 12px 32px -8px rgba(27,42,37,.12);
--ease: cubic-bezier(.22,1,.36,1);
--dur-1:200ms; --dur-2:350ms; --dur-3:600ms;
```

Scala spazi base 8: 4/8/12/16/24/32/48/64/96/128. Ombre sempre basse e morbide.
Hairline `1px solid var(--ink-30)`.

**Regole MUST (non negoziabili).**
- **Bottoni**: `min-height: 48px`, padding `16px 28px` (`1rem 1.75rem`), testo
  Inter 600 ≥ 16px (default 17px). Vale per primario, ghost e barra mobile. Il
  "Chiama" in testata è l'unica variante compatta: padding-block 0 ma
  `min-height: 48px` e area tap piena. Nessun bottone più piccolo di così.
- **Link-azione** (link testuali con funzione: "Tutti i servizi", "Mappa e
  orari", "Apri la mappa", "Apri in OpenStreetMap", "Chiama"): area tap
  **≥ 44px** (`.link-freccia`/`.link-azione`, `min-height: 44px`),
  sottolineatura chiara in hover.
- **Padding-block verticale delle sezioni**: il bordo SUPERIORE delle sezioni
  titolo/hero è **dimezzato** rispetto a `--section-pad` (hero top ≤ ~2.75rem su
  desktop; `.hero--compatto` per le pagine interne; `.senza-sopra` top ≤ ~1.5rem).
  Vietato lo spazio morto tra un titolo e il suo primo contenuto: il whitespace
  è lusso solo se intenzionale, mai un buco accidentale. Le due colonne editoriali
  (contatti, chi siamo) partono dalla stessa linea in alto (`.striscia-alto`).

### 1.5 Elementi firma (con misura)

1. **Frame foto** (arco `--arch`, rettangolo `--r-md`, cerchio 50%): stesso
   trattamento curato su TUTTE le varianti, mai un box grigio. Placeholder come
   elemento grafico vero: due tinte + **luce interna** con sorgente in alto a
   sinistra, **grana diagonale** sottile, **ring interno 1px** (`--ink-30`),
   **ombra morbida** (`--shadow-md`), chip-etichetta con icona camera +
   didascalia. Hover: sollevamento leggerissimo (solo con motion consentito).
   Mai testo in corsivo "FOTO: ...".
2. **Sottolineatura disegnata** (SVG, tratto terracotta o ocra) su UNA frase
   chiave per sezione; si "disegna" al reveal (stroke-dashoffset), disattivata
   con motion ridotto.
3. **Cerchio di sfondo** morbido (ocra/terracotta a bassa opacità) dietro il
   frame dell'hero: dà profondità e riempie il vuoto a destra.
4. **Badge circolare "dal 1997"** con testo su tracciato e rotazione lenta.
   Uno solo, nell'hero della Home.
5. **Fascia scura** (`--forest`) una per pagina: spezza il crema, testo crema +
   accento ocra. Alto contrasto = premium.
6. **Marquee** lento (una sola striscia, Home): i servizi che scorrono. In
   pausa con motion ridotto.
7. **Movimento base**: reveal-on-scroll (fade + translateY 16px, stagger 60ms),
   hover-lift sulle card, underline animato sui link nav.

### 1.6 Motion e no-JS (meccanismo)

Prima istruzione di `main.js`: `document.documentElement.classList.add('js')`.
Lo stato nascosto del reveal e i tratti non disegnati vivono SOLO sotto il
doppio guardiano `html.js` + `@media (prefers-reduced-motion: no-preference)`.
Senza JS: tutto visibile subito. Con motion ridotto: niente reveal, niente
marquee, niente rotazione badge, niente draw-on. L'HTML non contiene mai classi
che nascondono contenuto da sole.

### 1.7 Stati, errori, accessibilità

- Focus: `outline: 2px solid var(--terracotta-600); outline-offset: 2px`
  (su `--forest`: outline `--on-forest`).
- Tap target ≥ 44×44px: nav mobile, barra fissa, card servizio (l'intera card è
  cliccabile), link telefono, bottoni.
- Etichette form sempre visibili sopra il campo. Errori: sotto il campo, Inter
  500, colore `--ink`, bordo input da 1px `--ink-30` a 2px `--ink`. Niente rosso.
- Trattini: em-dash bandito dal copy. Trattino corto solo negli intervalli
  numerici/giorni (7:00–12:00, Lun–Ven).
- Odonimi: "via per Crescenzago" minuscolo nella prosa; "Via per Crescenzago
  177" maiuscolo nei blocchi indirizzo.

---

## 2. Componenti globali

- **Header sticky**: `--paper` trasparente in cima, con leggero fondo + blur +
  hairline quando si scrolla (`.scrollata`, aggiunta dal JS). Altezza costante
  (`min-height: 72px`), lockup allineato al centro. **Lockup logo** a sinistra:
  slot segno (`id="logo-mark"`, ~40×40, segnaposto pronto a ricevere il file
  reale) + wordmark (eyebrow grotesque uppercase "TERMOIDRAULICA" sopra +
  "Fratelli Bollente" in Fraunces), tutto cliccabile verso la home. A destra i 4
  link (underline animato in hover, pagina corrente sottolineata) + un bottone
  **"Chiama"** (tel:, terracotta) per la conversione. Mobile: bottone "Menu"
  (`aria-expanded`/`aria-controls`), disclosure verticale. Il badge circolare
  "B / dal 1997" resta SOLO come sigillo decorativo (hero o footer), mai come
  logo di navigazione.
- **Barra mobile fissa** (<768px): `--paper`, hairline sopra, "Chiama"
  (terracotta pieno) + "WhatsApp" (outline, `hidden` finché non c'è il numero).
  `body { padding-bottom }` per non coprire il footer.
- **Fascia CTA pre-footer** (`--forest`, una per pagina): riga serif grande
  "Passa in negozio o chiamaci", bottone terracotta, orari + indirizzo + link
  mappa. È anche la "sezione scura" della pagina.
- **Footer**: `--paper-2`, hairline `--ink-30`, wordmark, NAP, orari, link alle
  5 pagine. Essenziale, accenti ocra sui filetti.

---

## 3. Pagine

### 3.1 index.html — Home
Hero (display + lead + bottone terracotta + link ghost, frame ad arco con card
"IL NEGOZIO" sovrapposta, cerchio di sfondo, badge "dal 1997") → strip trust
(`Dal 1997 · 29 anni al banco · Via per Crescenzago 177`) → marquee servizi →
griglia 6 card servizio (cliccabili, **icona a linea** per servizio in alto a
sinistra — goccia, fiamma, fiocco, rubinetto, etichetta, estintore — hover-lift,
freccia) →
feature "il banco" (2 colonne, frame) → fascia scura CTA → footer.

### 3.2 servizi.html
Hero "Cosa facciamo" → griglia 6 card in alto (le stesse della Home, non link
minuscoli) → 6 sezioni per-servizio alternate sinistra/destra e paper/paper-2,
un frame per sezione (archi/rett/cerchio alternati), bullet a trattino ocra →
fascia scura CTA. Copy invariato rispetto alla v1 (liste da confermare).

### 3.3 chi-siamo.html — testo accorciato (vedi §7 del brief)
Layout editoriale compatto (hero `.hero--compatto`, colonna testo e frame che
partono dalla stessa linea in alto): eyebrow "LA NOSTRA STORIA", storia
accorciata con 3 parole
chiave sottolineate a mano (`1997`, `un posto dove la gente entra`,
`prima si ascolta, poi si vende`), pull-quote grande Fraunces italic, 1–2 frame
ad arco a fianco, una stat "29 anni al banco" e un piccolo "1997 → oggi". Fascia
scura CTA. Tutto il racconto resta dentro `<!-- VERIFICARE CON IL CLIENTE -->`.

### 3.4 contatti.html
Hero (compatto) → due colonne allineate in alto, stesso peso (recapiti + tabella
orari | facciata mappa a peso zero), la pagina sta quasi in un viewport →
form (etichette visibili, validazione nativa + messaggi it, bottone terracotta)
→ fascia scura CTA. Funzione invariata.

### 3.5 privacy.html (servizio, fuori nav)
Stessa gabbia, H1, testo segnaposto strutturato dentro VERIFICARE. In sitemap,
esclusa dal sommario.

---

## 4. SEO e tecnica (invariato dalla v1)
`<html lang="it">`, charset, viewport, title, description, canonical su ogni
pagina. Un H1 per pagina, gerarchia semantica, `address` per il NAP. JSON-LD
`Plumber` completo (name, address, geo approssimato, telefoni internazionali,
openingHoursSpecification, foundingDate 1997), niente aggregateRating né
priceRange. Sitemap + robots. Mappa a facciata (iframe OSM solo al clic; link
esterno senza JS). Niente cookie, niente analytics → niente banner.

---

## 5. Budget peso (prima pagina, esclusi scatti reali)

| Voce | Stima |
|---|---|
| HTML | ~16 KB |
| CSS unico | ~24 KB |
| JS unico | ~5 KB |
| Font (home: fraunces-var 62 + 3× inter 52) | ~116 KB |
| Mappa | 0 KB fino al clic |
| **Totale** | **~165 KB** (fraunces-italic 21 KB solo su chi-siamo) |

---

## 6. Checklist anti-slop (dopo ogni pagina)
1. Accenti: solo terracotta e ocra? Ocra mai testo su chiaro? Correggere.
2. Ogni frase di contenuto supera il "test del concorrente"? Il microcopy
   funzionale è esente ma deve dire cosa succede.
3. Zero em-dash, zero punti esclamativi, zero frasi della lista proibita, zero
   triadi di aggettivi.
4. Ogni fatto è verificato, oppure sta dentro VERIFICARE, oppure si taglia.
5. Testo ≥ 17px (salvo eyebrow/legale)? Tap target ≥ 44px? Contrasto AA?
6. Screenshot 375 e 1440: nominare una cosa da togliere, e toglierla.

---

## 7. Fatti verificati vs da confermare
Verificati: ragione sociale, P.IVA 02689830962, indirizzo Via per Crescenzago
177 / 20099 Sesto San Giovanni (MI), telefoni 02 2428426 e 02 89289611, orari,
fondazione 1997, nomi Giovanni/Vitale/Francesco. Da confermare (in NOTES.md e
nei commenti VERIFICARE): dominio, coordinate esatte, dettagli storia,
"dal 1997 in via per Crescenzago", liste lavori, WhatsApp, numero principale,
parcheggio, titolare privacy + Formspree.

---

## 8. Scelte che chiedono conferma del cliente
Come v1 (WhatsApp nascosto, mappa a facciata, dominio segnaposto, privacy da
completare), più: sottotitolo hero (testo del brief verbatim, default).

---

## 9. Deviazioni motivate dal brief
1. **Font self-hosted invece di Google Fonts CDN.** Il brief indica Google
   Fonts, ma l'identità del sito è "niente cookie, niente terze parti, niente
   banner" (venduta al cliente in NOTES.md). Caricare i font da
   `fonts.gstatic.com` invierebbe l'IP di ogni visitatore a Google (profilo
   GDPR problematico, già sanzionato in UE). Si self-hostano gli stessi
   caratteri (Fraunces variabile + Inter), OFL: stessa resa, zero terze parti.
2. **`opsz` invece di `SOFT`/`WONK`.** Il file variabile ottenibile espone gli
   assi `opsz` e `wght` (non `SOFT`/`WONK`, che restano ai default SOFT 0,
   WONK 0 richiesti dal brief). Si usa l'ottica (`opsz`) — la leva tipografica
   più forte — per la resa calda dei titoli grandi.
3. **Inter statico, Fraunces variabile.** Inter serve solo a 3 pesi fissi
   (400/500/600): si tengono le istanze statiche leggere. La variabilità serve
   al display (Fraunces): pesi leggeri, ottica, corsivo.
