# DESIGN.md · Termoidraulica Fratelli Bollente S.a.s.

Sito vetrina statico, 4 pagine, solo italiano. HTML + CSS + JS vanilla minimo.
Questo documento fissa i token, le regole d'uso, i layout pagina per pagina e la
bozza di copy per la hero della Home. Nessun codice viene scritto prima
dell'approvazione di questo documento.

Il documento è già passato da una revisione interna a cinque lenti (copy
vietato, fatti inventati, disciplina visiva, registro italiano, fattibilità
tecnica): 37 rilievi, tutti risolti qui dentro o elencati in §8 come decisioni
che spettano al cliente.

**La premessa di design.** Il nome della famiglia è Bollente e il mestiere è
l'acqua e il calore. Non serve inventare un concept: c'è già. Il sito lo dice
una sola volta per pagina, con una riga sottile che va dal colore dell'acqua
(Petrolio) al colore della fiamma (Brace), sotto l'H1. Tutto il resto sta
zitto: carta chiara, testo scuro, un solo accento che lavora (Petrolio), e il
rosso che si vede solo dove si telefona. Il layout deve sembrare quello di un
negozio ordinato, non di una startup: asimmetrico, editoriale, con l'orario e
l'indirizzo trattati come oggetti funzionali, non come riempitivo da footer.

---

## 1. Token

### 1.1 Palette (esadecimali vincolanti)

| Token | Hex | Uso consentito | Uso vietato |
|---|---|---|---|
| Ghisa | `#211D1A` | Tutto il testo, wordmark, messaggi di errore form, bordo input non valido | nessuno |
| Calce | `#F4F1EC` | Sfondo pagina, testo su Petrolio e su Brace-CTA | nessuno |
| Petrolio | `#1C4A47` | Link, overline di sezione, sfondo footer, hover, focus ring, bottone WhatsApp outline, superficie piena del bottone form (testo Calce), sottolineatura pagina corrente | nessuno |
| Brace | `#C24E30` | SOLO: estremità della riga Bollente. Come superficie CTA si usa la sfumatura scura (v. 1.2) | icone, bordi, decorazioni, testi, sfondi di sezione, stati di errore, spie di stato |
| Ottone | `#B08D57` | Filetti 1px, dettagli icona affiancati a testo | testo, elementi portatori di significato da soli |
| Cemento | `#8C857B` | Solo testo grande decorativo (24px o più) su Calce | testo corrente, didascalie piccole (v. contrasto) |
| Nebbia | `#DCD6CC` | Fondo card, fondo input, facciata mappa | nessuno |

Nessun altro colore esiste sul sito. Niente verde per "aperto", niente rosso
per gli errori: lo stato lo dicono le parole, in Ghisa.

### 1.2 Sfumature derivate (le sole quattro aggiunte ammesse, con motivo verificato)

Contrasto calcolato (WCAG 2.x, luminanza relativa):

| Coppia | Rapporto | Verdetto |
|---|---|---|
| Ghisa su Calce | 14.85:1 | AA/AAA ok |
| Ghisa su Nebbia | 11.58:1 | AA/AAA ok |
| Petrolio su Calce | 8.79:1 | AA/AAA ok |
| Petrolio su Nebbia | 6.86:1 | AA ok |
| Calce su Petrolio (footer, bottone form) | 8.79:1 | AA ok |
| **Cemento su Calce** | **3.24:1** | **fallisce AA testo normale** |
| **Cemento su Nebbia** | **2.52:1** | **fallisce anche testo grande** |
| **Calce su Brace puro** | **4.21:1** | **fallisce AA testo normale (serve 4.5)** |

Fix, come richiesto dal brief ("check Cemento on Calce and fix if it fails"):

| Token derivato | Valore | Derivazione | Contrasto | Uso |
|---|---|---|---|---|
| `--cemento-testo` | `#615B53` | Cemento scurito | 5.96:1 su Calce, 4.64:1 su Nebbia | didascalie e testo secondario, ovunque |
| `--brace-cta` | `#B04426` | Brace scurito | 5.04:1 con testo Calce | sfondo dei bottoni Chiama |
| `--brace-cta-hover` | `#9C3B20` | Brace scurito | 6.09:1 con testo Calce | hover/active dei bottoni Chiama |
| `--calce-velo` | `rgba(244,241,236,.2)` | Calce al 20% | decorativo | solo filetti interni al footer Petrolio |

Il Brace puro `#C24E30` resta l'estremità calda della riga Bollente, dove è
decorativo e non porta testo. La superficie dei bottoni telefono usa la
sfumatura `#B04426`: stesso rosso terra, un punto più scuro, AA verificata.
Se il cliente preferisce il Brace puro anche sul bottone, l'alternativa è
alzare il testo del bottone a 24px, ma la sfumatura è la scelta più pulita.

Ottone su Calce è 2.74:1: sotto la soglia 3:1 degli elementi grafici
funzionali. Regola: l'Ottone non porta mai significato da solo. Filetti
decorativi e piccole icone sempre affiancate a un'etichetta di testo.

### 1.3 Registro Brace (da verificare a ogni pagina, checklist finale)

Occorrenze massime della famiglia Brace per pagina e per viewport:

| Pagina | Riga Bollente (estremità) | Bottone hero (solo desktop) | Barra "Chiama" (solo <768px) | CTA rosse visibili insieme |
|---|---|---|---|---|
| index | 1 | 1 | 1 | sempre e solo 1 |
| servizi | 1 | 0 | 1 | 0 desktop, 1 mobile |
| chi-siamo | 1 | 0 | 1 | 0 desktop, 1 mobile |
| contatti | 1 | 0 | 1 | 0 desktop, 1 mobile |

Sotto i 768px il bottone hero della Home si nasconde: la chiamata è della
barra fissa. Sopra i 768px la barra non esiste. Risultato: in qualunque
momento, su qualunque schermo, c'è al massimo UN bottone rosso, e dice
sempre la stessa cosa: chiama.

Regole assolute, valide anche per gli stati che di solito "chiedono" il
rosso: gli errori del form e la spia aperto/chiuso NON usano mai la famiglia
Brace (v. §1.8 e §3.1). Le CTA telefono interne alle sezioni (servizi,
contatti) sono SEMPRE link testuali o bottoni outline in Petrolio. Se in
fase di build il Brace compare in un posto non previsto da questa tabella,
è un bug di design e si toglie.

### 1.4 Tipografia (woff2 self-hosted, niente CDN)

- **Fraunces** (display): H1, H2, H3, wordmark. Peso 400; 600 solo per parole
  enfatizzate dentro un titolo. Asse ottico alto (istanze statiche opsz 144).
  `letter-spacing: -0.02em` sopra i 40px. Mai per testo corrente.
- **Inter** (testo e UI): corpo 400, nav ed etichette 500, bottoni 600.
  `line-height: 1.6`, riga di 60–70 caratteri (`max-width: 34em` sul corpo).
- Nessun terzo carattere.

Produzione dei file (passo di build dichiarato): le istanze statiche di
Fraunces a opsz 144 non esistono pronte, si generano dal variable font con
`fonttools varLib.instancer` e si subsettano latin con `pyftsubset`
(licenza OFL, operazione permessa). Stesso subset latin per Inter.

| File | Peso | Stima |
|---|---|---|
| fraunces-400.woff2 | 400 opsz 144 | ~35 KB |
| fraunces-600.woff2 | 600 opsz 144 | ~35 KB |
| inter-400.woff2 | 400 | ~32 KB |
| inter-500.woff2 | 500 | ~32 KB |
| inter-600.woff2 | 600 | ~32 KB |

Caricamento: `font-display: swap`. Preload di fraunces-400 e inter-400
(con `crossorigin`, obbligatorio anche same-origin per non scaricare i file
due volte); su nav e bottoni (500/600) si accetta un FOUT breve. Contro il
CLS da swap dell'H1: fallback `Georgia` metricamente corretto via
`@font-face` locale con `size-adjust` e `ascent-override` tarati su Fraunces.

Scala tipografica (desktop / mobile):

| Ruolo | Font | Dimensione | Note |
|---|---|---|---|
| H1 | Fraunces 400 | 56px / 36px | tracking -0.02em |
| H2 | Fraunces 400 | 36px / 28px | |
| H3 (card) | Fraunces 400 | 24px / 22px | |
| Corpo | Inter 400 | 17px / 16px | lh 1.6, Ghisa |
| Sottotitolo hero | Inter 400 | 19px / 17px | Ghisa: è contenuto primario |
| Overline sezione | Inter 500 | 12px caps, +0.08em | Petrolio |
| Nav | Inter 500 | 15px | |
| Bottoni | Inter 600 | 16px | |
| Didascalie | Inter 400 | 14px | `--cemento-testo` |

### 1.5 Spaziatura, griglia, forma

- Scala a base 8: 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
- Sezioni: padding verticale minimo 96px desktop, 64px mobile.
- Contenuto max 1140px, griglia 12 colonne, gutter 24px. Nessuna eccezione:
  anche la banda fotografica della Home sta dentro i 1140px.
- `border-radius: 2px` massimo, ovunque.
- Zero ombre. La profondità è fatta di piani di colore (Nebbia su Calce) e
  filetti Ottone 1px.

### 1.6 Elemento firma: la riga Bollente

Una sola per pagina, sotto l'H1. `height: 2px; width: 96px;`
`background: linear-gradient(90deg, #1C4A47, #C24E30);`
Dall'acqua al calore, come il nome della famiglia. È l'unico punto del sito
in cui i due accenti si toccano. Non si ripete mai come divisore generico.

### 1.7 Movimento

Un solo effetto: fade-up di 12px all'ingresso della sezione nel viewport,
200ms ease-out, via IntersectionObserver, una volta sola per elemento.

Meccanismo esplicito, per non rompere il no-JS: la prima istruzione di
`main.js` è `document.documentElement.classList.add('js')`. Lo stato
nascosto di partenza vive SOLO sotto il doppio guardiano
`html.js` + `@media (prefers-reduced-motion: no-preference)`. Quindi:
senza JS il contenuto è tutto visibile da subito; con motion ridotto,
idem; l'HTML non contiene mai classi che nascondono contenuto da sole.
Nessun parallax, contatore, blob, mesh.

### 1.8 Stati, errori, accessibilità

- Focus visibile: `outline: 2px solid #1C4A47; outline-offset: 2px` su ogni
  elemento interattivo (su footer Petrolio: outline Calce).
- Tap target minimi 44×44px (nav mobile, barra fissa, link telefono).
- Etichette form sempre visibili sopra il campo, mai placeholder come
  etichetta.
- Errori form: messaggio sotto il campo, Inter 500 14px, **Ghisa**, con il
  bordo dell'input che passa da 1px Ottone a 2px Ghisa. Niente rosso: il
  registro Brace (§1.3) vale anche qui. Testi: "Inserisci il tuo nome",
  "Inserisci un numero di telefono", "Scrivi il messaggio".
- Trattini: il trattino lungo (em-dash) è bandito da tutto il copy. Il
  trattino corto nei soli intervalli numerici e di giorni (7:00–12:00,
  Lun–Ven) è tipografia standard italiana e resta.
- Odonimi: "via per Crescenzago" minuscolo nella prosa, nei titoli e nelle
  meta description (convenzione Treccani); "Via per Crescenzago 177"
  maiuscolo solo nei blocchi indirizzo (card negozio, contatti, footer NAP).

---

## 2. Elementi globali

### 2.1 Header (tutte le pagine)

Calce, filetto Ottone 1px sotto. Wordmark a sinistra su due righe:
"TERMOIDRAULICA" in Inter 500 10px maiuscolo spaziato sopra,
"Fratelli Bollente" in Fraunces 400 22px sotto. Quattro link a destra
(Home, Servizi, Chi siamo, Contatti), Inter 500, Ghisa, hover Petrolio,
pagina corrente con sottolineatura 2px Petrolio.

Mobile (<768px): bottone "Menu" con `aria-expanded` e `aria-controls`,
che mostra/nasconde una lista verticale sotto l'header. Nessuna animazione
dell'icona, nessun overlay: un disclosure semplice e accessibile.

```
┌────────────────────────────────────────────────────────────────┐
│ TERMOIDRAULICA                 Home  Servizi  Chi siamo  Contatti
│ Fratelli Bollente                                              │
├─ ottone 1px ───────────────────────────────────────────────────┤
```

### 2.2 Barra mobile fissa (<768px, tutte le pagine)

Fondo Calce con filetto Ottone sopra, altezza 56px + safe-area. Nel CSS,
insieme alla barra: `body { padding-bottom: calc(56px +
env(safe-area-inset-bottom)) }` sotto i 768px, così la barra non copre mai
la fine del footer o il bottone del form.

```
├─ ottone 1px ──────────────────────────┤
│ [ Chiama ]            [ WhatsApp ]    │
│   brace-cta pieno       outline Petrolio
└───────────────────────────────────────┘
```

"Chiama" → `tel:+39022428426`. Il bottone WhatsApp è nel markup come da
brief ma esce con `hidden` finché il cliente non conferma un numero
WhatsApp reale: i due numeri verificati sono fissi, e un bottone che punta
a un numero segnaposto sarebbe un'affermazione falsa visibile agli utenti.
Finché è nascosto, "Chiama" occupa tutta la larghezza. Commento nel
sorgente: `<!-- VERIFICARE CON IL CLIENTE: numero WhatsApp, poi togliere
hidden -->` (decisione in §8).

### 2.3 Footer (tutte le pagine)

Fondo Petrolio, testo Calce. Tre colonne desktop, impilate mobile:
1. Wordmark + "Termoidraulica Fratelli Bollente S.a.s." + P.IVA 02689830962
2. NAP: Via per Crescenzago 177, 20099 Sesto San Giovanni (MI),
   tel 02 2428426 e 02 89289611 (entrambi `tel:`)
3. Orari completi + link alle 4 pagine + link "Informativa privacy".
Filetti interni: `--calce-velo` (§1.2). Commento nel sorgente: niente
cookie, niente analytics in v1, quindi niente banner.

---

## 3. Pagine

### 3.1 index.html · Home

Titolo: `Termoidraulica Fratelli Bollente | Idraulica e caldaie a Sesto San Giovanni`
Meta description: "Negozio di termoidraulica in via per Crescenzago 177 a
Sesto San Giovanni. Idraulica, caldaie, climatizzazione e arredobagno dal
1997. Tel 02 2428426."

```
┌──────────────────────── HERO (Calce) ───────────────────────────┐
│                                                                 │
│  Termoidraulica a Sesto                    ┌───────────────────┐│
│  San Giovanni, dal 1997.                   │ IL NEGOZIO        ││
│  ══ riga Bollente (petrolio → brace)       │ Via per           ││
│                                            │ Crescenzago 177   ││
│  [sottotitolo: testo del brief,            │ Sesto S. Giovanni ││
│   v. §5 e decisione in §8]                 │ ─ ottone ─        ││
│                                            │ Lun–Ven 7:00–12:00││
│  [ Chiama il negozio ]   Tutti i servizi   │ e 14:00–18:00     ││
│    brace-cta, solo         link Petrolio   │ Sab 7:00–12:00    ││
│    desktop                                 │ [riga spia, JS]   ││
│                                            └── card Nebbia ────┘│
│  col 1–7                                          col 9–12      │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│ FOTO: la vetrina del negozio in via per Crescenzago, mattina,   │
│ saracinesca appena alzata (banda 21:9, dentro i 1140px, lazy)   │
└─────────────────────────────────────────────────────────────────┘
┌──────────────── I TRE SERVIZI (overline Petrolio) ──────────────┐
│ ┌── Nebbia ────────┐                      ┌── Nebbia ────────┐ │
│ │ Idraulica        │ ┌── Nebbia ────────┐ │ Climatizzazione  │ │
│ │ · voce concreta  │ │ Riscaldamento    │ │ · voce concreta  │ │
│ │ · voce concreta  │ │ e caldaie        │ │ · voce concreta  │ │
│ │ · voce concreta  │ │ · voce concreta  │ │ · voce concreta  │ │
│ │ · voce concreta  │ │ · voce concreta  │ │ · voce concreta  │ │
│ └──────────────────┘ │ · voce concreta  │ └──────────────────┘ │
│                      └──────────────────┘                      │
│  Card centrale abbassata di 32px sul desktop (stack piatto     │
│  mobile): stessa gerarchia, silhouette non da template.        │
│  Niente icone. Titolo Fraunces, filetto Ottone 1px in testa.   │
│  Sotto, la frase-link: "Il resto, dalla vendita al banco agli  │
│  impianti antincendio, è nella pagina servizi."                │
└─────────────────────────────────────────────────────────────────┘
┌──────────────── LA FAMIGLIA (2 colonne, VERIFICARE) ────────────┐
│ ┌────────────────────┐   Giovanni ha aperto il negozio nel     │
│ │ FOTO: Vitale e     │   1997. Il mestiere l'aveva imparato    │
│ │ Francesco davanti  │   dallo zio idraulico, dopo essere      │
│ │ al bancone, luce   │   arrivato ancora ragazzo da Napoli     │
│ │ naturale           │   a Milano. Oggi in negozio ci sono     │
│ └────────────────────┘   i figli, Vitale e Francesco.          │
│                          → La nostra storia (link Petrolio)    │
└─────────────────────────────────────────────────────────────────┘
┌──────────────── L'ESPOSIZIONE (2 colonne invertite) ────────────┐
│  Se il bagno è da rifare, in         ┌────────────────────────┐ │
│  esposizione si vede e si tocca      │ FOTO: l'esposizione    │ │
│  quello che verrà montato.           │ arredobagno accanto    │ │
│  L'esposizione e il deposito sono    │ al negozio, sanitari   │ │
│  accanto al negozio.                 │ e rubinetterie esposte │ │
│  → Arredobagno e ristrutturazione    └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
┌──────────────── DOVE SIAMO ─────────────────────────────────────┐
│ ┌─ facciata mappa (Nebbia) ─┐   Via per Crescenzago 177        │
│ │  indirizzo +              │   20099 Sesto San Giovanni (MI)  │
│ │  [ Apri la mappa ]        │   02 2428426 · 02 89289611       │
│ │  (iframe OSM solo al clic)│   tabella orari completa         │
│ └───────────────────────────┘                                  │
│  "Il negozio è in via per Crescenzago 177, con l'esposizione   │
│   e il deposito accanto. Si entra, si spiega il problema,      │
│   si trova il pezzo o si fissa l'intervento."                  │
└─────────────────────────────────────────────────────────────────┘
[ footer Petrolio ]
```

Mobile: tutto impilato nello stesso ordine, card orari subito sotto l'H1 e
il sottotitolo (chi cerca un idraulico da telefono vuole orario e numero,
non scroll). Il bottone hero rosso è nascosto: chiama la barra fissa.

**La spia orari.** La card mostra staticamente gli orari completi (testo
sopra, indipendente dal giorno: vero sempre, anche senza JS). Un elemento
con `min-height` di una riga è riservato nel markup; il JS lo riempie senza
spostare nulla (zero CLS) con lo stato del momento, voce di famiglia, prima
persona plurale:

- "Siamo aperti"
- "Riapriamo alle 14:00"
- "Riapriamo domani alle 7:00"
- "Riapriamo lunedì alle 7:00"

Niente pallino colorato: lo stato lo dicono le parole, in Ghisa. È l'unico
"widget" del sito e serve a una cosa sola: evitare telefonate a negozio
chiuso. Orari cablati nel JS: Lun–Ven 7–12 e 14–18, Sab 7–12, Dom chiuso.

### 3.2 servizi.html

Titolo: `Servizi | Termoidraulica Fratelli Bollente, Sesto San Giovanni`
Meta description: "Idraulica, assistenza caldaie, climatizzazione,
ristrutturazione bagno, vendita al banco e impianti antincendio a Sesto
San Giovanni. Negozio aperto dal 1997."

H1: "Cosa facciamo". Sotto la riga Bollente, una riga di testo:
"Sei servizi e un banco dove chiedere, in via per Crescenzago 177."
Poi un sommario di ancore (lista testuale Petrolio, niente pill).

Sei sezioni identiche nella struttura, separate da filetti Ottone,
overline Petrolio "SERVIZIO", nell'ordine:

| # | H2 (SEO locale, senza stuffing) |
|---|---|
| 1 | Idraulico a Sesto San Giovanni |
| 2 | Assistenza caldaie a Sesto San Giovanni |
| 3 | Climatizzazione: installazione e manutenzione |
| 4 | Ristrutturazione bagno a Sesto San Giovanni |
| 5 | Vendita al banco di materiale termoidraulico |
| 6 | Impianti antincendio |

Solo i tre H2 con più ricerca locale portano il nome della città; gli altri
tre restano puliti, per non trasformare la pagina in una litania.

Struttura di ogni sezione:

```
─ ottone 1px ─────────────────────────────────────────────
SERVIZIO (overline Petrolio)
H2 Fraunces
Paragrafo: quando chiamarci, in concreto (2–3 frasi).
· elenco puntato di lavori specifici (4–6 voci)
Tel: 02 2428426 (link testuale Petrolio, Inter 600)
```

Esempi del livello di concretezza richiesto (bozza, da rifinire in build):
sezione caldaie → "manutenzione annuale e prova fumi", "sostituzione della
caldaia", "compilazione del libretto di impianto", "radiatori e valvole
termostatiche". Sezione idraulica → "ricerca perdite", "sostituzione dello
scaldabagno", "rifacimento dell'impianto idrico", "sostituzione di sanitari
e rubinetteria". La sezione antincendio resta volutamente breve: il servizio
è verificato ma i dettagli no, quindi due frasi e il telefono, e una riga in
NOTES.md per farci dire dal cliente cosa comprende esattamente. Tutte le
liste lavori passano da NOTES.md per conferma.

Una foto placeholder a metà pagina: "FOTO: gli scaffali del banco con la
minuteria e i ricambi, una mano che appoggia un raccordo sul bancone".

### 3.3 chi-siamo.html

Titolo: `Chi siamo | Termoidraulica Fratelli Bollente`
Meta description: "La famiglia Bollente: Giovanni, arrivato a Milano da
Napoli, e i figli Vitale e Francesco. Il negozio di Sesto San Giovanni
aperto nel 1997."

H1: "La famiglia Bollente". Riga Bollente. Sottotitolo:
"Da Napoli a Milano, e dal 1997 il negozio a Sesto San Giovanni."

Corpo: 250–350 parole in prima persona plurale, tono piano, struttura:
1. Giovanni arriva ancora ragazzo da Napoli a Milano.
2. Lo zio idraulico e il mestiere imparato sul campo.
3. L'apertura del negozio nel 1997.
4. Vitale e Francesco oggi.
5. Perché il negozio fisico conta: si entra col problema e si esce col
   pezzo, o con l'intervento fissato.

L'INTERO racconto è avvolto in `<!-- VERIFICARE CON IL CLIENTE -->` come da
brief: i dettagli biografici vanno confermati prima di andare online.

```
H1 + riga + sottotitolo
┌──────────────────────────────────────────────┐
│ FOTO: la facciata del negozio in via per     │
│ Crescenzago con l'insegna, ora d'oro         │
└──────────────────────────────────────────────┘
  [racconto, colonna 60–70 caratteri, col 3–9]
┌──────────────────┐  ┌──────────────────┐
│ FOTO: il bancone │  │ FOTO: Vitale e   │
│ con i cataloghi  │  │ Francesco in     │
│ e il telefono    │  │ negozio, luce    │
│ fisso            │  │ naturale         │
└──────────────────┘  └──────────────────┘
  Riga finale di fatti asciutti (testo, non contatori):
  "Il negozio è aperto dal 1997. Oggi in azienda ci sono
   Vitale e Francesco, i figli di Giovanni."
  CTA: link Petrolio "Vieni in negozio: orari e mappa" → contatti
```

### 3.4 contatti.html

Titolo: `Contatti e orari | Termoidraulica Fratelli Bollente`
Meta description: "Siamo in via per Crescenzago 177 a Sesto San Giovanni.
Tel 02 2428426 e 02 89289611. Lun–Ven 7–12 e 14–18, sabato mattina. Mappa
e modulo di contatto."

H1: "Dove siamo, quando ci siamo". Riga Bollente.

```
┌───────────────────────────────┬─────────────────────────────┐
│ Via per Crescenzago 177       │  facciata mappa (Nebbia):   │
│ 20099 Sesto San Giovanni (MI) │  indirizzo, bottone         │
│                               │  [ Apri la mappa ] che      │
│ 02 2428426     (tel:, grande) │  inietta l'iframe OSM al    │
│ 02 89289611    (tel:, grande) │  clic, e link esterno       │
│                               │  "Apri in OpenStreetMap"    │
│ ┌─ tabella orari (Nebbia) ──┐ │                             │
│ │ Lun–Ven 7:00–12:00        │ │                             │
│ │         14:00–18:00       │ │                             │
│ │ Sabato  7:00–12:00        │ │                             │
│ │ Domenica  chiuso          │ │                             │
│ └───────────────────────────┘ │                             │
└───────────────────────────────┴─────────────────────────────┘
┌──────────────── SCRIVICI (form) ────────────────────────────┐
│ Se non è urgente, lascia un messaggio. Per un guasto,       │
│ telefona al negozio: si fa prima.                           │
│ Nome [________________]  (etichetta sopra, input Nebbia)    │
│ Telefono [_____________]                                    │
│ Messaggio [                    ]                            │
│ [ Invia il messaggio ]  (bottone Petrolio pieno)            │
│ Inviando il modulo accetti l'informativa privacy. (link)    │
└─────────────────────────────────────────────────────────────┘
```

- Nessuna riga "A due passi da...": non abbiamo un riferimento verificabile,
  quindi si omette (come da brief). Stesso trattamento per il parcheggio:
  non è tra i fatti verificati, non si nomina (domanda in §8).
- Form: `action` su endpoint Formspree segnaposto con commento
  `<!-- SOSTITUIRE con endpoint Formspree del cliente o mailto -->`.
  Validazione nativa + messaggi specifici in italiano (§1.8), etichette
  visibili.
- Il bottone del form è Petrolio: il Brace resta ai soli bottoni telefono.
- Il form raccoglie dati personali (nome, telefono): serve l'informativa
  privacy ex art. 13 GDPR. Si aggiunge `privacy.html`, pagina di servizio
  fuori nav (link nel footer e sotto il form), con testo segnaposto marcato
  VERIFICARE: titolare del trattamento e finalità li deve confermare il
  cliente, e Formspree va citato come responsabile del trattamento.

### 3.5 privacy.html (pagina di servizio, fuori nav)

Stessa gabbia delle altre pagine, H1 "Informativa privacy", riga Bollente,
testo segnaposto strutturato (titolare, dati raccolti dal form, finalità,
conservazione, Formspree come responsabile, diritti dell'interessato) tutto
dentro `<!-- VERIFICARE CON IL CLIENTE -->`. Niente meta description
elaborata, `robots` normale, esclusa dal sommario ma presente in sitemap.

---

## 4. SEO e struttura tecnica

- Scheletro obbligatorio per ogni pagina: `<html lang="it">`,
  `<meta charset="utf-8">`, `<meta name="viewport"
  content="width=device-width, initial-scale=1">`, poi title, description,
  canonical.
- Un H1 per pagina, gerarchia H2/H3 logica, HTML semantico
  (header/nav/main/section/footer, `address` per il NAP).
- JSON-LD `Plumber` (sottotipo LocalBusiness) su ogni pagina: name, address,
  geo (coordinate approssimative, da verificare in NOTES.md), telefoni in
  formato internazionale (`+39 02 2428426`, `+39 02 89289611`),
  openingHoursSpecification completa, foundingDate "1997". `url` e `image`
  con lo stesso trattamento da-confermare del geo (dominio e foto non
  esistono ancora), tracciati in NOTES.md. NIENTE aggregateRating,
  NIENTE priceRange (non verificato).
- Canonical su ogni pagina, sitemap.xml e robots.txt. Il dominio non è tra i
  fatti verificati: segnaposto `https://DOMINIO-DA-CONFERMARE.example/` con
  commento e riga in NOTES.md.
- Alt text in italiano su ogni placeholder foto, descrittivo dello scatto
  futuro.
- Mappa: facciata a peso zero (blocco Nebbia con indirizzo e bottone), iframe
  OpenStreetMap iniettato solo al clic, con `loading="lazy"` di riserva
  sull'iframe iniettato. Motivo: `loading="lazy"` da solo non basta, Chrome
  carica gli iframe entro 1250–2500px dal viewport, e su contatti la mappa
  è praticamente above the fold: Leaflet + tile (300 KB e più di terze
  parti) entrerebbero nel tracciato Lighthouse. Il link esterno "Apri in
  OpenStreetMap" funziona anche senza JS. Coerente anche con zero cookie.
- Niente cookie, niente analytics in v1: commento nel sorgente di ogni
  pagina.

### Budget peso (esclusi i futuri scatti fotografici)

| Voce | Stima |
|---|---|
| HTML per pagina | ~14 KB |
| CSS unico | ~16 KB |
| JS unico | ~3 KB |
| 5 woff2 | ~165 KB |
| Mappa | 0 KB fino al clic |
| **Totale prima pagina** | **~200 KB** (target <600 KB: ampio margine) |

I placeholder foto sono div con bordo Ottone e didascalia: peso zero. Quando
arriveranno gli scatti: webp, `width`/`height` espliciti, `loading="lazy"`,
`decoding="async"`, LCP = H1 testuale (nessuna immagine hero bloccante).

### File

```
/
├── index.html
├── servizi.html
├── chi-siamo.html
├── contatti.html
├── privacy.html        (pagina di servizio, fuori nav)
├── css/style.css
├── js/main.js          (hook .js, menu, fade-up, spia orari, mappa, form)
├── fonts/*.woff2       (5 file)
├── favicon.svg         (B su Petrolio, niente Brace)
├── sitemap.xml
├── robots.txt
├── DESIGN.md
└── NOTES.md            (per il cliente, in italiano)
```

---

## 5. Bozza copy: hero della Home

```
H1:  Termoidraulica a Sesto San Giovanni, dal 1997.

     [riga Bollente]

Sub (testo del brief, verbatim):
     Idraulica, caldaie e climatizzazione. Un negozio vero,
     una famiglia vera, in Via per Crescenzago da ventinove anni.

CTA: [ Chiama il negozio ]        Tutti i servizi
      → tel:+39022428426           → servizi.html
      (solo desktop; su mobile chiama la barra fissa)

Card negozio (Nebbia):
     IL NEGOZIO
     Via per Crescenzago 177
     Sesto San Giovanni
     ─────────────────────
     Lun–Ven 7:00–12:00 e 14:00–18:00
     Sab 7:00–12:00
     [riga spia, riempita dal JS: "Siamo aperti" ecc., §3.1]
```

**Nota di studio sul sottotitolo** (decisione in §8): il testo è quello
indicato nel brief e resta la base. Due osservazioni oneste, da bottega:
1. "da ventinove anni" è vero solo nel 2026: su un sito statico invecchia
   in silenzio, e nessuno lo aggiornerà ogni gennaio. "dal 1997" nell'H1
   dice già la stessa cosa, per sempre.
2. "Un negozio vero, una famiglia vera" non passerebbe il test del
   concorrente che il brief stesso impone al resto del copy.
Proposta alternativa, stessi fatti, stessa lunghezza:
"Idraulica, caldaie e climatizzazione. Il negozio della famiglia Bollente,
in via per Crescenzago 177, con l'esposizione accanto."
Decide il cliente: si costruisce con il testo del brief salvo indicazione
contraria.

Bozze di registro per le sezioni successive (da rifinire in build, stesse
regole: ogni frase deve contenere qualcosa che è vero solo di questo
negozio):

- Tre servizi, intro: "Il grosso del lavoro è questo. Il resto, dalla
  vendita al banco agli impianti antincendio, è nella pagina servizi."
- Famiglia (Home, dentro VERIFICARE): "Giovanni ha aperto il negozio nel
  1997. Il mestiere l'aveva imparato dallo zio idraulico, dopo essere
  arrivato ancora ragazzo da Napoli a Milano. Oggi in negozio ci sono i
  figli, Vitale e Francesco."
- Esposizione: "Se il bagno è da rifare, in esposizione si vede e si tocca
  quello che verrà montato. L'esposizione e il deposito sono accanto al
  negozio."
- Dove siamo: "Il negozio è in via per Crescenzago 177, con l'esposizione e
  il deposito accanto. Si entra, si spiega il problema, si trova il pezzo o
  si fissa l'intervento."

La cadenza con il "si" impersonale è la voce del sito ma compare UNA volta
sola, qui in "Dove siamo" (è l'esempio del brief). Ripetuta diventerebbe
formula: le altre sezioni usano frasi dichiarative piane.

---

## 6. Checklist anti-slop (da eseguire e dichiarare dopo ogni pagina)

1. Il Brace compare oltre il registro di §1.3 (anche in errori e spie)?
   Correggere.
2. Ogni frase di contenuto supera il test del concorrente? Se una frase può
   stare sul sito di un altro idraulico senza modifiche, si riscrive. Il
   microcopy funzionale (etichette, errori, bottoni) è esente dal test ma
   deve dire esattamente cosa succede.
3. Zero em-dash, zero punti esclamativi, zero frasi della lista proibita,
   zero domande retoriche in apertura, zero triadi di aggettivi, massimo
   una cadenza col "si" impersonale per sito.
4. Ogni affermazione fattuale è nella lista dei fatti verificati, oppure
   sta dentro un commento VERIFICARE, oppure si taglia.
5. La pagina sa di "template AI color crema"? Se sì: più Petrolio, più
   bianco, meno decorazione.
6. Screenshot a 375px e 1440px: nominare una cosa da togliere, e toglierla.

---

## 7. Domande aperte per il cliente (finiranno anche in NOTES.md)

1. **Numero WhatsApp**: i due numeri verificati sono fissi. Il bottone
   WhatsApp resta nascosto finché il cliente non conferma il numero.
2. **Dominio** definitivo per canonical, sitemap e `url` dello Schema.org.
3. **Coordinate esatte** del civico 177 per la mappa e il geo di Schema.org.
4. **Racconto di famiglia**: date e dettagli da confermare (commento
   VERIFICARE già previsto nel sorgente).
5. **Negozio sempre in via per Crescenzago?** L'attività è del 1997;
   se il negozio è sempre stato a questo indirizzo si può dirlo, altrimenti
   il copy resta com'è (che è già corretto in entrambi i casi).
6. **Antincendio e liste lavori**: confermare cosa comprende ogni servizio.
7. **Quale dei due numeri** come principale per i bottoni Chiama
   (in bozza: 02 2428426, il primo indicato).
8. **Parcheggio davanti al negozio?** Se sì, una riga in contatti; finché
   non è confermato non si nomina.
9. **Informativa privacy**: nome del titolare del trattamento e conferma
   dell'uso di Formspree (o preferenza per il solo mailto).

---

## 8. Scelte che chiedono conferma esplicita del cliente

1. **Sottotitolo hero**: testo del brief verbatim (default) oppure
   l'alternativa proposta in §5. Si costruisce col testo del brief salvo
   indicazione contraria.
2. **Bottone CTA**: superficie `#B04426` (Brace scurito, AA verificata)
   invece del Brace puro `#C24E30` che con testo Calce si ferma a 4.21:1.
3. **WhatsApp nascosto** finché non c'è un numero reale (il markup c'è già).
4. **Mappa a facciata** (iframe solo al clic) invece dell'embed diretto,
   per il target Lighthouse 95+ e la coerenza zero-cookie.
5. **Bottone hero rosso nascosto su mobile** sulla Home: sotto i 768px la
   chiamata è della barra fissa, così non ci sono mai due bottoni rossi
   nello stesso schermo.
6. **privacy.html in più** rispetto alle 4 pagine: obbligo di legge per il
   form, fuori nav, testo da completare col cliente.
