/**
 * One-time script to seed the "Utvändig tvätt" landing page content.
 * Run with: npx tsx scripts/seed-utvandig-tvatt-landing.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLUG = "utvandig-tvatt";

const landing_meta_desc =
  "Utvändig biltvätt i Tullinge — högtryckstvätt, avfettning, schamponering och fälgtvätt utan borstar eller trasor. Skonsamt för lacken. Ring 08-778 60 50.";

const landing_content = `## Professionell tvätt utan att röra lacken

Vi tvättar din bil **utan trasor, svampar eller borstar** — aldrig något som fysiskt gnider mot lackytan. Istället använder vi en beprövad metod med **högtrycksspolning**, **avfettning** och **skonsam schamponering** som löser och spolar bort smutsen utan kontakt. Det är den enda tvättmetoden som garanterat inte skapar mikrorepor i lacken.

Varför är det viktigt? Varje gång en trasa, svamp eller roterande borste dras över lacken riskerar den att fånga sandkorn och grus som ripar ytan. Över tid blir lacken matt och livlös — särskilt på mörka bilar. Vår metod undviker det helt.

## Så tvättar vi din bil — steg för steg

1. **Högtrycksspolning** — vi spolar av grov smuts, sand, salt och löst sittande partiklar med högtrycksvatten. Det avlägsnar det mesta utan att lacken berörs.
2. **Avfettning** — ett professionellt avfettningsmedel appliceras på nedre partier, hjulbrunnar och andra ytor där vägsalt, olja och tjära samlas. Medlet bryter ner fett och asfalt kemiskt.
3. **Fälgtvätt** — fälgrengöring som löser **bromsbeläggsdamm** och vägsmuts från fälgytan utan syra eller hårda borstar. Fälgarna spolas rena med högtryck.
4. **Schamponering** — bilschampo appliceras som tjockt skum som omsluter och lyfter kvarvarande smuts från lackytan. Skummet jobbar kemiskt istället för mekaniskt — ingen kontakt med lacken.
5. **Avspolning** — allt schampo och lösgjord smuts spolas bort grundligt med högtrycksvatten, uppifrån och ner, så att inget smutshaltigt vatten torkar in på redan rena ytor.

Resultatet: en **ren, glansig bil utan en enda ny repa**.

## Mer än bara en snabb spolning

Det här är ingen bensinstationstvätt där du kör igenom på tre minuter. Vi tar oss tid att göra jobbet ordentligt:

- **Hjulbrunnar och underrede** — salt, grus och lera som sätter sig i hjulbrunnarna spolas bort, särskilt viktigt under vintersäsongen när vägsalt accelererar rost
- **Dörrkanter och trösklar** — vi öppnar dörrarna och spolar bort smuts som samlas i kanterna, ett område som automattvätten aldrig når
- **Tanklock och lister** — detaljer som gör skillnad mellan "spolad" och "tvättad"
- **Rutor** — utvändig glastvätt för bättre sikt och ett renare intryck

Vill du ha bilen fräsch invändigt också? Vi erbjuder även [utvändig tvätt med lätt städ](/tjanster/utvandig-tvatt-latt-stad) och [utvändig tvätt med invändig städ](/tjanster/utvandig-tvatt-invandig-stad).

## Kombinera tvätt med ditt verkstadsbesök

Lämnar du in bilen för **service**, **besiktningsförberedelse** eller en **reparation**? Lägg till en utvändig tvätt så slipper du en extra tur till biltvätten. Bilen står ändå hos oss — vi tvättar den medan arbetet pågår och du får tillbaka den skinande ren.

Många kunder har gjort det till en vana: varje verkstadsbesök avslutas med en **professionell utvändig tvätt**. Det sparar tid och du kör alltid hem i en bil som ser ut som den borde.

## Biltvätt i Tullinge — snabbt, skonsamt och utan köer

Trött på att köa vid automattvättar som ändå repar lacken? Hos oss bokar du en tid som passar dig — ingen kö, ingen väntan, och ingen kompromiss med kvaliteten.

Vi finns på Mekanikervägen 3 i Tullinge och tar emot bilägare från hela området. Kör du från **Tumba** eller **Huddinge** är du här på fem minuter. Från **Salem** och **Rönninge** tar det bara lite längre via Södertäljevägen. Bor du i **Botkyrka**, **Flemingsberg** eller **Segeltorp** behöver du inte åka till en trång tvätthall i ett köpcentrum — vi har gott om plats och personlig service.

Kunder i **Skogås**, **Trångsund** och **Vårby** uppskattar att vi ligger nära E4/E20, lätt att svänga förbi. Och för dig i **Kungens Kurva** eller **Södertälje** — boka en tid och kombinera med ett ärende i Tullinge.

Ring **08-778 60 50** eller boka online. Öppet måndag–fredag 08:00–16:00.`;

const landing_faq = [
  {
    question: "Varför tvättar ni utan trasor och borstar?",
    answer:
      "Varje gång en trasa, svamp eller borste dras över bilens lack riskerar den att fånga mikroskopiska sandkorn som ripar ytan. Över tid ger det hundratals mikrorepor som gör lacken matt, särskilt synligt på mörka bilar. Vår metod — högtrycksspolning, kemisk avfettning och skumschamponering — löser och spolar bort smutsen utan att något fysiskt berör lackytan. Det är den mest lackskonsamma tvättmetoden som finns.",
  },
  {
    question: "Blir bilen lika ren utan att ni gnuggar?",
    answer:
      "Ja. Moderna avfettningsmedel och bilschampon är utvecklade för att kemiskt lösa smuts, fett, insekter och vägsalt utan mekanisk bearbetning. Kombinerat med högtrycksspolning i rätt vinkel och temperatur får vi bort allt utom de mest inbrända föroreningarna. För extrema fall som tjärfläckar eller kåda erbjuder vi riktad behandling med specialmedel.",
  },
  {
    question: "Hur lång tid tar en utvändig tvätt?",
    answer:
      "En utvändig tvätt tar normalt 20–40 minuter beroende på bilens storlek och hur smutsig den är. Lämnar du bilen för service eller reparation samtidigt behöver du inte vänta — vi tvättar den medan andra arbeten utförs och den är klar vid hämtning.",
  },
  {
    question: "Kan jag boka tvätt samtidigt som service?",
    answer:
      "Absolut, det är något vi rekommenderar. Du slipper en extra tur till biltvätten och får tillbaka bilen nyttvättad efter ditt verkstadsbesök. Nämn det när du bokar eller säg till vid inlämning så lägger vi till det. Många av våra kunder gör det vid varje besök.",
  },
  {
    question: "Erbjuder ni invändig städning också?",
    answer:
      "Ja, vi har tre nivåer: utvändig tvätt (denna tjänst), utvändig tvätt med lätt städ (dammsugning och torkning av invändiga ytor), och utvändig tvätt med invändig städ (grundlig rengöring av klädsel, mattor, paneler och glas). Vi erbjuder även specialrengöring av hundbil eller extra smutsiga fordon. Ring 08-778 60 50 så hittar vi rätt paket för dig.",
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
