/**
 * One-time script to seed the "Felsökning & diagnostik" landing page content.
 * Run with: npx tsx scripts/seed-felsokning-diagnostik-landing.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLUG = "felsökning-diagnostik";

const landing_meta_desc =
  "Professionell felsökning och diagnostik i Tullinge. OBD-II, märkesspecifik utrustning, alla bilmärken. Vi hittar felet. Ring 08-778 60 50 — boka tid.";

const landing_content = `## Varför lyser varningslampan?

Din bils instrumentpanel är en direkt kanal mellan bilens styrsystem och dig som förare. När **motorlampan** (MIL – Malfunction Indicator Lamp), **ABS-lampan**, **ESP-varningen**, **airbag-indikatorn** eller **EPC-lampan** tänds beror det på att ett eller flera styrdon har registrerat ett avvikande värde och lagrat en **diagnostisk felkod** i minnet.

Att ignorera en varningslampa är alltid riskabelt – och ofta kostsamt:

- Ett litet **lambdasondefel** kan på några veckor slita ut en hel **katalysator**
- En felaktig **ABS-sensor** innebär att antisladdsystemet stängs av helt vid halka
- En tänd motorlampa är **automatiskt underkänt vid besiktning** – oavsett vad felet faktiskt är
- Ett **turbofel** som ignoreras kan leda till totalhaveri av motorn

En snabb **diagnostik** hos oss kan skilja mellan en billig sensorbyte och en onödigt dyr reparation. Ju tidigare felet identifieras, desto lägre blir kostnaden.

## Avancerad diagnostik med märkesspecifik utrustning

Alla verkstäder kan läsa en generisk OBD-II-kod. Det är inte där felet hittas – det är utgångspunkten för felsökningen.

**OBD-II** (On-Board Diagnostics) och den europeiska **EOBD-standarden** kräver att alla personbilar från år 2001 har ett standardiserat diagnossuttag. Men de felkoder som lagras i biltillverkarens egna styrsystem – motorstyrning, transmission, chassielektronik, komfortsystem – är **tillverkarspecifika** och kräver märkesanpassad utrustning och kompetens för att tolkas korrekt.

Vi arbetar med professionell diagnosutrustning som kommunicerar med bilens **CAN-bus-nätverk** och ger oss tillgång till:

- **Livsdataströmmar (live data)** – realtidsvärden från hundratals sensorer: insprutningsmängd, lambdavärde, laddtryck, kamaxelposition, EGR-flöde med mera
- **Freeze frame-data** – en ögonblicksbild av samtliga motorparametrar i det exakta ögonblick felkoden lagrades
- **Aktuatortester** – aktivering av enskilda komponenter direkt från diagnosverktyget för att verifiera funktion
- **Adaptering och grundinställningar** – återprogrammering av styrdon efter byte av komponenter som gasspjäll, rattvinkelsensor eller bromsbelägg
- **Oscilloskopdiagnostik** – för elektriska fel där en statisk felkod inte räcker: signalform från vevaxel-/kamaxelsensorer, insprutningspulser och glödstiftssignaler

Det är kombinationen av rätt verktyg, märkeskännedom och diagnostisk erfarenhet som gör skillnaden – inte enbart utrustningen.

## Felsökning steg för steg

Felsökning är inte gissning – det är en strukturerad process. Så här arbetar vi:

1. **Symptomintervju** – vi lyssnar. Hur beter sig bilen? Vid kallstart eller varmkörning? Vid acceleration eller på tomgång? Intermittenta fel kräver noggrann beskrivning.
2. **Visuell inspektion** – motorrum, underrede, slangar, kontaktdon och jordpunkter. Många fel syns eller luktar innan de dyker upp som en felkod.
3. **Diagnostisk scanning** – vi ansluter till OBD-uttaget och läser ut lagrade och väntande felkoder ur alla tillgängliga styrdon – inte bara motorn.
4. **Livsdataanalys** – med motorn igång analyserar vi verkliga mätvärden mot tillverkarens specifikationer. Här ser vi om en sensor rapporterar korrekta värden eller om det är ett intermittent fel.
5. **Komponenttestning** – aktuatortester, multimeter och oscilloskop används för att isolera om felet sitter i sensor, kablage, styrelement eller mekanik. Vid motorproblem kan kompressionsprov ingå.
6. **Rotorsaksanalys och åtgärdsplan** – vi förklarar vad som är orsaken, inte bara symptomen. Du får veta vad som krävs för att lösa det och om det finns relaterade risker.
7. **Felkoder raderas + verifikationskörning** – efter åtgärd raderas koderna och vi verifierar att styrdonet bekräftar att felet är åtgärdat och inte återkommer.

## Vanliga fel vi hittar och åtgärdar

Under åren har vi diagnostiserat tusentals bilar. Dessa är de vanligaste felen vi stöter på:

- **Lambdasond (syresensor)** – påverkar bränsleblandning, avgasutsläpp och katalysatorns livslängd
- **MAF-sensor (luftmassemätare)** – felaktiga luftmätvärden ger ojämn tomgång, rykighet och hög bränsleförbrukning
- **Katalysatoreffektivitet (P0420/P0430)** – vanlig kod som kan bero på katalysator, lambdasond eller glapp i avgassystemet
- **Tändspolar och tändstift – misfire (P030x)** – ryckig körning, ökad förbrukning, risk för katalysatorskada
- **Turboaktuator och laddtrycksreglering** – vanligt på dieslar och turbobensinsare; ger effektbortfall och rökiga avgaser
- **EGR-ventil** – igensatt eller fastnad ventil ger höga NOx-utsläpp och tomgångsproblem, särskilt på diesel
- **Insprutningsventiler** – felaktig insprutningspuls ger misfire, svart rök eller hög bränsleförbrukning
- **Glödstift (diesel)** – svår kallstart, vibrationer och HC-utsläpp; ofta ett åldersproblem vid 80 000–120 000 km
- **ABS-sensorer** – hjulhastighetssensorer som slits eller korroderar; påverkar ABS, ESP och ibland automatlåda
- **Rattvinkelsensor** – utlöser ESP-varning och kräver grundinställning efter byte

## Felsökning nära dig i södra Stockholm

Verkstaden på Mekanikervägen 3 i Tullinge erbjuder **felsökning och diagnostik** för bilägare i hela södra Stockholm. Från **Tumba** och **Huddinge** tar det bara några minuters bilfärd, och kunder från **Salem**, **Botkyrka** och **Flemingsberg** uppskattar den personliga servicen utan långa väntetider.

Bilägare i **Segeltorp**, **Skogås** och **Trångsund** når verkstaden enkelt via Huddingevägen. Från **Vårby** och **Kungens Kurva** ligger Tullinge precis söder om E4/E20-avfarten. Även kunder i **Rönninge** och **Södertälje** väljer regelbundet att felsöka sin bil hos oss – oavsett om det gäller Volvo, BMW, Toyota, Volkswagen, Audi, Mercedes, Kia eller något annat fabrikat.

Ring 08-778 60 50 eller boka direkt online. Öppet måndag till fredag 08:00–16:00.`;

const landing_faq = [
  {
    question: "Vad betyder check engine-lampan?",
    answer:
      "Check engine-lampan (motorlampan/MIL) betyder att bilens motorstyrning har registrerat ett avvikande värde och lagrat en felkod. Det kan vara allt från en lös tanklock till en felaktig lambdasond, ett missfirande tändstift eller ett turbofel. Lampan i sig berättar inte vilket fel det är – bilen behöver anslutas till en diagnosapparat. En tänd motorlampa är dessutom automatiskt underkänt vid besiktning.",
  },
  {
    question: "Hur går en felsökning till?",
    answer:
      "En professionell felsökning börjar med en symptomintervju, följt av visuell inspektion och diagnostisk scanning av alla styrdon via OBD-uttaget. Vi analyserar livsdataströmmar med motorn igång och jämför mot tillverkarens specifikationer. Vid behov testar vi enskilda komponenter med aktuatortester, multimeter eller oscilloskop. När rotorsaken är fastställd presenterar vi en tydlig åtgärdsplan innan arbetet påbörjas.",
  },
  {
    question: "Vad kostar felsökning av bil?",
    answer:
      "Kostnaden beror på felets komplexitet och hur lång tid det tar att isolera rotorsaken. En enkel kodläsning tar kortare tid, medan ett intermittent elektriskt fel kan kräva djupare analys med livsdataströmmar och komponenttestning. Vi är alltid transparenta med kostnaden innan vi börjar. Ring 08-778 60 50 så ger vi dig en prisuppgift.",
  },
  {
    question: "Kan ni felsöka alla bilmärken?",
    answer:
      "Ja. Vi arbetar med professionell diagnosutrustning som täcker europeiska, asiatiska och amerikanska bilmärken – Volvo, BMW, Mercedes, Audi, VW, Toyota, Honda, Kia, Hyundai, Ford, Opel, Renault, Peugeot med flera. Vår utrustning kommunicerar med tillverkarspecifika protokoll och ger tillgång till samtliga styrdon, inte bara det standardiserade OBD-II-systemet.",
  },
  {
    question: "Går det att köra med motorlampan tänd?",
    answer:
      "Det beror på hur lampan lyser och hur bilen beter sig. Lyser lampan stadigt och bilen körs normalt kan det ofta vänta till nästa bokade besök – men ignorera det aldrig länge. Blinkar lampan, rycker bilen eller sjunker effekten märkbart bör du stanna och kontakta oss direkt. Att köra med ett oåtgärdat fel riskerar följdskador – ett missfirande cylinder kan förstöra katalysatorn, och ett turbofel kan leda till totalhaveri.",
  },
];

async function main() {
  console.log(`Updating landing page for "${SLUG}"...`);

  const { data, error } = await supabase
    .from("services")
    .update({
      landing_meta_desc,
      landing_content,
      landing_faq,
    })
    .eq("slug", SLUG)
    .select("id, title, slug");

  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.error(`No service found with slug "${SLUG}".`);
    process.exit(1);
  }

  console.log(`✓ Updated: ${data[0].title} (${data[0].slug})`);
  console.log(`  Meta desc: ${landing_meta_desc.length} chars`);
  console.log(`  Content: ${landing_content.length} chars`);
  console.log(`  FAQ: ${landing_faq.length} questions`);
  console.log(`\nView at: /tjanster/${SLUG}`);
}

main();
