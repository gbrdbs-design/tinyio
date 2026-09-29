# TinyIO v3.0 – HTML prototípus

A Figma **TinyIO v3.0** tervei alapján kézzel felépített, valódi HTML/CSS/JS prototípus (nem képernyőképek).
A UI teljes egészében HTML: top bar, nav bar, status bar, mezők, dropdownok, számléptetők, checkboxok, rádiók, switchek, táblák, modálok és ikonok (SVG).
Csak a tartalmi képek (esemény- és csapatlogók, játékosfotók) képek.

**Megnyitás:** GitHub Pages bekapcsolása után `https://gbrdbs-design.github.io/tinyio/`. Helyben: `npx serve .`

## Képernyők (fő flow)
| App | Képernyők |
|---|---|
| Launcher | Login → Event selection (grid/list, Create new event modal) → Main screen |
| Data Manager | General · Schedule (Save preset modal) · Dota2 (Team roster modal) |
| Database Editor | Players (élő keresés és szűrők) → Player editor (Games played modal) |
| Overlay Controller | HUB (Debug modal a top barból) → Controller → Macros → Macro editor (Save macro modal) |

A top bar menük a még nem megépített képernyőket szürkén listázzák.

## Szerkezet
- `index.html` – belépési pont
- `css/tinyio.css` – design tokenek és komponensek (Figma: Design system)
- `css/screens.css` – képernyőspecifikus elrendezés
- `css/responsive.css` – töréspontok
- `js/icons.js` – SVG ikonkészlet
- `js/ui.js` – komponens-builderek (mező, dropdown, gomb, modal, nav…)
- `js/screens-*.js` – képernyők appokra bontva
- `js/app.js` – router (`#dm.schedule` stílusú linkek), skálázás, interakciók
- `fonts/` – Nunito Sans (Avenir helyettesítő, ha az Avenir nincs telepítve)

## Reszponzivitás
Az app folyékony CSS grid layoutra épül (top bar / nav / main / status bar), töréspontok a `css/responsive.css`-ben:
- **≥1600px** – asztali nézet, a Figma 1920×1050-es frame szerint
- **≤1280px** – a top bar menük ikonosak, a Launcher oldalsáv a tartalom fölé kerül, a Macro editor egymás alá rendeződik
- **≤900px** – tablet/telefon: a nav vízszintes sávvá alakul a top bar alatt, a panel egészében görget, az akciógombok alul rögzítettek
- **≤600px** – telefon: a mezők teljes szélességűek, az eseménykártyák két oszlopban
A széles táblák (Schedule, Players, HUB) vízszintesen görgethetők, rögzített fejléccel.
