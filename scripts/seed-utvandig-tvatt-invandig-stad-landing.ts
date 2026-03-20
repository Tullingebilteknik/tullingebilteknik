/**
 * One-time script to seed the "Utvändig tvätt med invändig städ" landing page content.
 * Run with: npx tsx scripts/seed-utvandig-tvatt-invandig-stad-landing.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLUG = "utvandig-tvatt-invandig-stad";

const landing_meta_desc =
  "Komplett in- och utvändig biltvätt i Tullinge. Kontaktlös tvätt, dammsugning, klädsel, paneler, fönsterputsning. Boka: 08-778 60 50.";

const landing_content = `## Din bil förtjänar mer än en snabb spolning

Det här är vår mest heltäckande tvättbehandling — en komplett **utvändig och invändig genomgång** som ger bilen tillbaka den där känslan av att kliva in i något nytt. Utvändig avfettning, fälgtvätt och schamponering kombineras med grundlig invändig städning av golv, säten, paneler, baklucka och fönster. Allt i ett besök.

Perfekt inför **försäljning**, efter en lång semester, som present till dig själv — eller helt enkelt för att du tycker att din bil förtjänar det.

## Utvändig behandling — kontaktlös och lackskonsam

Samma beprövade metod som i alla våra tvättpaket — **ingen trasa, borste eller svamp berör lacken**:

1. **Högtrycksspolning** — sand, salt och löst sittande smuts spolas bort utan lackkontakt
2. **Avfettning** — nedre partier, hjulbrunnar och trösklar behandlas med professionellt avfettningsmedel
3. **Fälgtvätt** — bromsbeläggsdamm och inbränd vägsmuts löses kemiskt från fälgytan
4. **Schamponering** — tjockt skum omsluter hela bilen och lyfter kvarvarande smuts utan mekanisk kontakt
5. **Avspolning** — allt spolas bort grundligt uppifrån och ner

## Invändig städning — varje yta, varje vrå

Det är den invändiga delen som gör den här tjänsten speciell. Vi tar oss tid att göra hela kupén fräsch:

- **Grundlig dammsugning** — golv, sittbrunnar, under säten, mellan säten och mittkonsol, bagageutrymme. Vi lyfter på mattor och kommer åt det grus och smuts som samlas under dem.
- **Avspolning av gummimattor** — mattorna tas ut, spolas rena och torkas av innan de läggs tillbaka
- **Säten och klädsel** — textilsäten dammsugs noggrant i sömmar och veck. Lädersäten torkas av med lämpligt rengöringsmedel som inte torkar ut materialet.
- **Paneler och dörrsidor** — instrumentpanel, rattstång, dörrpaneler, mittkonsol och handtag torkas av och rengörs. Smuts i knappar, reglage och ventilationsgaller tas bort.
- **Dörrhål och trösklar** — kanterna som syns varje gång du öppnar dörren rengörs från salt och smuts
- **Baklucka och lasttröskel** — ett område som ofta glöms bort men som samlar mycket skräp
- **Kristallklar fönsterputsning** — alla rutor invändigt putsas för klar sikt och ett rent helhetsintryck. Invändigt fettfilm från avdunstning och fingeravtryck försvinner.

## En bilupplevelse som ny

Skillnaden före och efter en komplett in- och utvändig behandling är dramatisk. Det handlar inte bara om att bilen *ser* ren ut — det handlar om att den **luktar fräscht**, att ratten känns ren i handen, att sikten genom rutorna är kristallklar och att du inte har sand under skorna när du kör.

Det här är den tjänst vi rekommenderar:

- **Inför försäljning eller visning** — en ren bil säljer snabbare och till ett bättre pris. Första intrycket avgör.
- **Efter vintersäsongen** — salt, grus och fukt har tagit sin rätt. En vårgenomgång fräschar upp bilen helt.
- **Vid byte av ägare** — ge din nya bil en ren start.
- **Som regelbunden omsorg** — många kunder bokar en komplett behandling var tredje till var sjätte månad.

Behöver bilen inte en fullständig invändig genomgång? Vi erbjuder även [utvändig tvätt](/tjanster/utvandig-tvatt) och [utvändig tvätt med lätt städ](/tjanster/utvandig-tvatt-latt-stad).

## Komplett biltvätt i Tullinge — boka din tid

Vi finns på Mekanikervägen 3 i Tullinge och utför alla tre tvättnivåerna på plats. Den här tjänsten tar lite längre tid än våra snabbare paket, så **boka gärna i förväg** så reserverar vi rätt tid åt dig.

Kunder från **Tumba** och **Huddinge** lämnar ofta bilen på morgonen och hämtar på eftermiddagen. Från **Salem**, **Rönninge** och **Södertälje** kommer många via Södertäljevägen — en kort resa för en bil som känns fabriksny. Bor du i **Botkyrka**, **Flemingsberg** eller **Segeltorp** kan du kombinera med ett verkstadsbesök och spara en hel dag.

Kunder i **Skogås**, **Trångsund**, **Vårby** och **Kungens Kurva** når oss snabbt via E4/E20. Och oavsett var du bor — du kör hem i en bil som inte liknar den du lämnade.

Ring **08-778 60 50** eller boka online. Öppet måndag–fredag 08:00–16:00.`;

const landing_faq = [
  {
    question: "Vad ingår i utvändig tvätt med invändig städ?",
    answer:
      "Utvändigt: kontaktlös högtryckstvätt, avfettning, fälgtvätt, schamponering och avspolning — utan att något berör lacken. Invändigt: grundlig dammsugning av hela kupén inklusive under säten och i bagageutrymmet, avspolning av gummimattor, avtorkning av paneler, dörrsidor, mittkonsol och rattstång, rengöring av klädsel, samt fönsterputsning av alla rutor invändigt. Det är vår mest heltäckande tvättbehandling.",
  },
  {
    question: "Hur lång tid tar en komplett in- och utvändig behandling?",
    answer:
      "Räkna med 1,5–2,5 timmar beroende på bilens storlek och skick. En SUV med hundpäls och barnstolar tar längre tid än en ren personbil. Vi rekommenderar att boka i förväg så att vi kan reservera tillräckligt med tid. Lämna gärna bilen på morgonen och hämta på eftermiddagen.",
  },
  {
    question: "Vad är skillnaden mot utvändig tvätt med lätt städ?",
    answer:
      "Lätt städ inkluderar dammsugning av sittbrunnsgolven, avspolning av gummimattor och avtorkning av dörrhål. Invändig städ går betydligt djupare: hela kupén dammsugs inklusive under säten och bagageutrymme, säten och klädsel rengörs, alla paneler och ytor torkas av, och samtliga rutor putsas invändigt. Det är skillnaden mellan en uppfräschning och en grundlig genomgång.",
  },
  {
    question: "Är det värt att tvätta bilen inför försäljning?",
    answer:
      "Absolut. En ren och välskött bil ger ett betydligt bättre första intryck vid visning och kan påverka priset positivt. Köpare associerar en ren bil med en omhändertagen bil. Vår kompletta in- och utvändiga behandling är den mest kostnadseffektiva åtgärden du kan göra för att maximera andrahandsvärdet.",
  },
  {
    question: "Hanterar ni husdjurspäls och svåra fläckar?",
    answer:
      "Den här tjänsten hanterar normal till måttlig smuts och päls. För bilar med mycket hundpäls, kraftiga fläckar eller extra smutsiga fordon erbjuder vi en separat specialrengöring — hundbil/extra smutsig — som inkluderar intensivare rengöring med specialverktyg. Ring 08-778 60 50 så rekommenderar vi rätt behandling.",
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
