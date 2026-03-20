/**
 * One-time script to seed the "Utvändig tvätt med lätt städ" landing page content.
 * Run with: npx tsx scripts/seed-utvandig-tvatt-latt-stad-landing.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLUG = "utvandig-tvatt-latt-stad";

const landing_meta_desc =
  "Utvändig biltvätt med lätt invändig städ i Tullinge — högtryckstvätt, schamponering, dammsugning och avtorkning. Ingen kontakt med lacken. Ring 08-778 60 50.";

const landing_content = `## Ren utvändigt och fräsch invändigt — i ett besök

Ibland räcker inte bara en utvändig tvätt. Sand i fotbrunnarna, smulor i sätena, dammiga dörrhål — det där som inte syns utifrån men som du märker varje gång du sätter dig i bilen. Vår **utvändig tvätt med lätt städ** kombinerar en komplett kontaktlös utvändig behandling med en snabb men noggrann invändig uppfräschning. Resultatet är en bil som känns ny att kliva in i — utan att du behöver boka en heldags detailing.

Det här är vårt mest populära tvättpaket, och det är lätt att förstå varför: du får det bästa av två världar i ett enda besök.

## Vad ingår — utvändigt

Samma **kontaktlösa metod** som vår grundtvätt — vi berör aldrig lackytan med trasor eller borstar:

1. **Högtrycksspolning** — grov smuts, sand och vägsalt spolas bort utan lackkontakt
2. **Avfettning** — professionellt avfettningsmedel på nedre partier, hjulbrunnar och trösklar bryter ner fett, tjära och asfaltrester kemiskt
3. **Fälgtvätt** — bromsbeläggsdamm och vägsmuts löses och spolas bort från fälgarna
4. **Schamponering** — tjockt skum appliceras över hela bilen, lyfter kvarvarande smuts kemiskt utan mekanisk kontakt
5. **Avspolning** — allt spolas bort grundligt uppifrån och ner

## Vad ingår — invändigt

Den invändiga delen är inte en fullskalig rengöring, utan en **smart uppfräschning** av de ytor som gör störst skillnad:

- **Dammsugning av sittbrunnsgolven** — fotbrunnar fram och bak, under mattorna där grus och smuts samlas
- **Avspolning av gummimattor** — mattorna tas ut, spolas rena och torkas av innan de läggs tillbaka
- **Avtorkning av dörrhål och trösklar** — smuts och salt som samlas i dörrkarmar torkas bort, det området som syns varje gång du öppnar dörren
- **Torpeden och instrumentpanelen** — en snabb avtorkning av de synliga ytorna ger ett rent helhetsintryck

Det tar bara **15–20 minuter extra** utöver den utvändiga tvätten, men skillnaden i hur bilen upplevs är enorm.

## Det lilla extra som faktiskt märks

Den här tjänsten fyller glappet mellan "bara tvätta utvändigt" och "fullständig invändig rengöring". Du kanske inte behöver kemtvätt av klädseln eller fönsterputsning varje gång — men att kliva in i en dammsugen bil med rena mattor och torra dörrkanter gör att bilen **känns omhändertagen**.

Det är skillnaden mellan att köra iväg i en bil som *ser* ren ut utifrån och att köra iväg i en bil som verkligen *är* fräsch. Många av våra kunder bokar **lätt städ som standard** vid varje verkstadsbesök — det har blivit en vana som de inte vill vara utan.

Behöver bilen en djupare invändig rengöring? Vi erbjuder även [utvändig tvätt med invändig städ](/tjanster/utvandig-tvatt-invandig-stad) som inkluderar klädsel, alla ytor och fönster.

## Perfekt att kombinera med service eller reparation

Står bilen redan hos oss för **service**, **oljebyte** eller **besiktningsförberedelse**? Lägg till utvändig tvätt med lätt städ och hämta en bil som är mekaniskt kontrollerad, skinande ren och fräsch inuti. Du sparar en separat tur till biltvätten och får mer gjort på samma dag.

Tipsa oss vid bokning eller inlämning — vi fixar det medan bilen ändå väntar.

## Biltvätt med städ nära dig i södra Stockholm

Vi finns på Mekanikervägen 3 i Tullinge, mitt i södra Stockholm med snabb access från alla håll. Pendlar du från **Flemingsberg** eller **Segeltorp**? Lämna bilen på morgonen, ta pendeltåget till jobbet och hämta en nyttvättad och fräsch bil på vägen hem. Från **Tumba**, **Huddinge** och **Salem** tar det under tio minuter hit.

Bor du i **Botkyrka**, **Skogås** eller **Trångsund** når du oss enkelt via Huddingevägen. Kunder i **Vårby** och **Kungens Kurva** svänger av E4/E20 söderut — vi ligger strax efter avfarten. Och för dig i **Rönninge** eller **Södertälje** är Tullinge en kort sväng från riksväg 226.

Ring **08-778 60 50** eller boka online. Öppet måndag–fredag 08:00–16:00.`;

const landing_faq = [
  {
    question: "Vad är skillnaden mellan utvändig tvätt och utvändig tvätt med lätt städ?",
    answer:
      "Utvändig tvätt inkluderar enbart den kontaktlösa utvändiga behandlingen — högtryck, avfettning, schamponering och avspolning. Utvändig tvätt med lätt städ lägger till en invändig uppfräschning: dammsugning av sittbrunnsgolven, avspolning av gummimattor, och avtorkning av dörrhål och instrumentpanel. Det tar ungefär 15–20 minuter extra men gör stor skillnad i hur bilen upplevs.",
  },
  {
    question: "Hur lång tid tar utvändig tvätt med lätt städ?",
    answer:
      "Hela behandlingen tar normalt 40–60 minuter beroende på bilens storlek och skick. Lämnar du bilen för service eller reparation samtidigt behöver du inte vänta — vi utför tvätten och städningen medan övrigt arbete pågår och bilen är klar vid hämtning.",
  },
  {
    question: "Ingår dammsugning av hela kupén?",
    answer:
      "Den lätta städen fokuserar på sittbrunnsgolven — fotbrunnarna fram och bak samt under mattorna, där det samlas mest grus och smuts. Säten, bagageutrymme och svåråtkomliga ytor ingår i vår mer omfattande tjänst utvändig tvätt med invändig städ. Ring 08-778 60 50 så hjälper vi dig välja rätt paket.",
  },
  {
    question: "Använder ni trasor eller borstar på lacken?",
    answer:
      "Nej, aldrig. All utvändig tvätt sker kontaktlöst med högtrycksspolning, kemisk avfettning och skumschamponering. Ingenting fysiskt berör lackytan, vilket eliminerar risken för de mikrorepor som trasor, svampar och automattvättens borstar orsakar. Den invändiga städen sker såklart med dukar och dammsugare, men dessa berör bara interiören — aldrig lacken.",
  },
  {
    question: "Kan jag lägga till lätt städ när bilen redan är inbokad för service?",
    answer:
      "Absolut. Nämn det vid bokningen eller säg till vid inlämning så lägger vi till det. Eftersom bilen redan står hos oss behöver vi ingen extra bokningstid — vi fixar tvätten och städningen parallellt med det mekaniska arbetet. Många kunder gör det vid varje besök.",
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
