/**
 * One-time script to seed the "Koppling & växellåda" landing page content.
 * Run with: npx tsx scripts/seed-koppling-vaxellada-landing.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLUG = "koppling-vaxellada";

const landing_meta_desc =
  "Kopplingsbyte och växellådsreparation i Tullinge. Manuell, automat, DSG — alla bilmärken. Erfarna mekaniker. Boka tid: 08-778 60 50.";

const landing_content = `## Symptom på sliten koppling eller växellådsproblem

Koppling och växellåda överför motorns kraft till hjulen. När de börjar svikta märker du det direkt i körupplevelsen — och att ignorera symptomen leder snabbt till dyrare reparationer.

- **Kopplingen slirer** — varvtalet stiger vid acceleration men bilen hänger inte med, särskilt uppför eller under last. Det vanligaste tecknet på en utsliten **kopplingslamell**.
- **Bränd lukt** — en skarp, stickande lukt från friktionsmaterialet som överhettas. Kör du vidare riskerar du att skada **tryckplattan** och **svänghjulet**.
- **Kopplingspedalens anslag förändras** — bitpunkten kryper uppåt eller pedalen känns onormalt lätt/tung. Kan bero på slitage eller en läckande **kopplingscylinder**.
- **Vibrationer vid tomgång eller start** — skakningar som försvinner när du trampar in kopplingen tyder ofta på ett slitet **dubbelmassesvänghjul (DMF)**.
- **Svårt att lägga i växel eller knakar vid växling** — slitna **synkronringar** eller för lite **växellådsolja** gör att kugghjulen inte synkroniseras korrekt.
- **Automatlådan rycker eller reagerar sent** — fördröjd växling, ryck mellan växlarna eller att lådan stannar i en växel kan tyda på problem med **DSG-mechatronik**, momentomvandlare eller solenoidventiler.
- **Läckage under bilen** — olja vid växellådan kan komma från en läckande **kopplingscylinder**, packning eller växellådans tätning.

Upplever du något av ovanstående bör du boka tid direkt — att köra vidare med en slirande koppling eller en växellåda som inte fungerar korrekt riskerar allvarliga följdskador.

## Kopplingsbyte — vad ingår och varför det är komplext

Ett **kopplingsbyte** är en av bilverkstadens mest arbetsintensiva reparationer. Hela växellådan måste demonteras för att komma åt kopplingen — ett jobb som kräver erfarenhet, rätt verktyg och flera timmars arbete.

Vid ett professionellt kopplingsbyte hos Tullinge Bilteknik ingår:

1. **Kopplingslamell** — friktionsskivan som slits och till slut börjar slira
2. **Tryckplatta** — fjädermekanismen som pressar lamellen mot svänghjulet; byts alltid samtidigt
3. **Utrampningslager (release bearing)** — det lager som aktiveras varje gång du trampar in kopplingen; byts alltid vid kopplingsjobb
4. **Kopplingscylinder** — om bilen har hydraulisk koppling inspekteras och byts vid behov, för att undvika framtida läckage
5. **Dubbelmassesvänghjul (DMF)** — inspekteras alltid och byts om det visar tecken på slitage (se nedan)
6. **Pilotlager och tätningar** — kontrolleras och ersätts vid behov

Att byta enbart lamellen och återanvända en tveksam tryckplatta eller ett slitet svänghjul är falsk ekonomi — du riskerar att behöva göra om hela jobbet inom kort. Vi rekommenderar alltid att byta hela kopplingssatsen som en enhet.

## Manuell och automatisk växellåda — vi hanterar alla typer

Moderna bilar har vitt skilda drivlineupplägg. Vi arbetar med samtliga:

- **Manuell växellåda** — synkronringar, lager, axeltätningar, **växellådsolja** och komplett **kopplingssystem**. Vi felsöker svårväxlade eller bullriga lådor och utför byte eller renovering.
- **Traditionell automat (momentomvandlare)** — oljebyte med filterservice, solenoidproblem, momentomvandlardiagnostik. Regelbundet **automatlådsolja-byte** förlänger livslängden avsevärt.
- **DSG/dubbelkoppling (VW, Audi, Skoda, Seat)** — mechatronik-felsökning, kopplingssatsbyte, oljeservice var 60 000 km. DSG-lådor kräver specifik olja och korrekt adaptionsprocedur efter service.
- **CVT (stegslös automat)** — rembyte, oljebyte och kalibrering. Vanligt på Honda, Toyota, Nissan och Subaru.

Oavsett om din bil har fem manuella växlar eller en sjuväxlad DSG — vi har utrustningen och kompetensen att diagnostisera och reparera den.

## Dubbelmassesvänghjul (DMF) — den dolda kostnaden

De flesta moderna bilar, särskilt dieslar och turbobensinsare, har ett **dubbelmassesvänghjul** istället för ett traditionellt fast svänghjul. DMF:et dämpar motorns vridvibrationer för mjukare gång och tystare drift — men det är en slitagedel som förr eller senare behöver bytas.

**Vanliga symptom på slitet DMF:**
- Vibrerande eller skakande motor vid tomgång
- Skramlande ljud i neutralläge som försvinner när kopplingen trampas in
- Ryckig start från stillastående

**Varför DMF bör inspekteras vid varje kopplingsbyte:** Eftersom växellådan redan är demonterad vid ett kopplingsbyte är arbetskostnaden för att byta DMF minimal om det görs samtidigt. Att hoppa över ett tveksamt svänghjul för att spara pengar innebär risk att den nya kopplingen skadas — och att hela jobbet måste göras om. Vi mäter alltid DMF:ets kringelhatt och vinkelspel och rekommenderar byte om värdena ligger utanför tolerans.

## Kopplingsbyte och växellådsservice i södra Stockholm

Med en slirande koppling vill du inte köra längre än nödvändigt — varje kilometer sliter på komponenter som redan är på gränsen. Bor du i **Tumba** eller **Huddinge** tar det under tio minuter till oss längs Huddingevägen. Från **Salem** och **Rönninge** når du verkstaden snabbt via Södertäljevägen, och kunder i **Botkyrka**, **Flemingsberg** och **Segeltorp** har ofta kortare till oss än till en märkesverkstad inne i Stockholm.

Kör du från **Skogås**, **Trångsund** eller **Vårby** ligger vi precis söder om E4/E20 — enkelt att hitta, med fri parkering direkt utanför. Bilägare i **Kungens Kurva** och **Södertälje** väljer oss för kombinationen av märkesverkstadskompetens och oberoende verkstadspris.

Ring **08-778 60 50** eller boka online. Vi finns på Mekanikervägen 3 i Tullinge, öppet måndag–fredag 08:00–16:00.`;

const landing_faq = [
  {
    question: "Hur vet jag att kopplingen behöver bytas?",
    answer:
      "De vanligaste tecknen är att kopplingen slirer (varvtalet stiger utan att bilen accelererar), att det luktar bränt vid körning, att kopplingspedalens bitpunkt har ändrats, eller att du känner vibrationer vid tomgång. Om du upplever något av detta bör du boka en kontroll. Att fortsätta köra med en sliten koppling riskerar att skada svänghjul och tryckplatta, vilket gör reparationen betydligt dyrare.",
  },
  {
    question: "Vad kostar ett kopplingsbyte?",
    answer:
      "Priset varierar kraftigt beroende på bilmärke, modell och om dubbelmassesvänghjulet behöver bytas samtidigt. Kopplingsbyte är en arbetsintensiv reparation eftersom hela växellådan måste demonteras. Kontakta oss på 08-778 60 50 för en prisuppgift baserad på just din bil — vi ger alltid en tydlig offert innan arbetet påbörjas.",
  },
  {
    question: "Hur länge håller en koppling?",
    answer:
      "En koppling håller normalt 100 000–200 000 km beroende på körstil och trafikmiljö. Stadskörning med mycket stopp-och-start sliter betydligt mer än landsvägskörning. Tunga bilar och bilar med kraftiga motorer sliter också hårdare på kopplingen. Dubbelmassesvänghjulet har ofta liknande livslängd och bör inspekteras vid varje kopplingsbyte.",
  },
  {
    question: "Behöver dubbelmassesvänghjulet bytas samtidigt som kopplingen?",
    answer:
      "Det bör alltid inspekteras, och i många fall rekommenderar vi byte. Eftersom växellådan redan är demonterad vid ett kopplingsbyte tillkommer ingen extra arbetskostnad för att byta svänghjulet — du betalar bara för delen. Att återanvända ett slitet DMF riskerar att den nya kopplingen skadas, och då måste hela jobbet göras om.",
  },
  {
    question: "Kan ni reparera automatväxellådor?",
    answer:
      "Ja, vi arbetar med alla typer av automatväxellådor — traditionella med momentomvandlare, DSG/dubbelkoppling (VW, Audi, Skoda), och CVT-lådor. Vi utför diagnostik, oljeservice, filterbyten och reparationer. DSG-lådor kräver specialolja och korrekt adaptionsprocedur efter service, vilket vi hanterar med rätt utrustning.",
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
