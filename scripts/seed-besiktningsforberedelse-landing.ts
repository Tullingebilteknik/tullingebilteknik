/**
 * One-time script to seed the "Besiktningsförberedelse" landing page content.
 * Run with: npx tsx scripts/seed-besiktningsforberedelse-landing.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLUG = "besiktningsförberedelse";

const landing_meta_desc =
  "Undvik underkänt vid besiktningen — vi förbereder din bil i Tullinge. Samma kontrollpunkter som Opus & Dekra. Spara tid och pengar. Ring 08-778 60 50.";

const landing_content = `## Undvik underkänt — förbered bilen innan besiktningen

Varje år underkänns ungefär **en av fyra svenska bilar** vid sin första besiktning. Det är ett dyrt och frustrerande besked — ombesiktningen kostar extra (vanligtvis 300–400 kr utöver ordinarie avgift), du måste boka ny tid, ta ledigt från jobbet igen och köra dit en gång till. Värst av allt: om din **besiktningsmånad** passerar utan godkänt resultat riskerar du **körförbud** enligt Transportstyrelsens regler, vilket kan få allvarliga konsekvenser i vardagen.

Din besiktningsmånad — den kalendermånad du är skyldig att besiktiga bilen — är fastlagd utifrån ditt registreringsnummer. Det finns inget utrymme för att skjuta upp. En **besiktningsförberedelse** hos Tullinge Bilteknik kostar en bråkdel av vad ett underkänt resultat faktiskt innebär i tid, stress och extra avgifter. Tänk på det som en försäkring: ett litet utlägg nu sparar dig ett betydligt större bekymmer senare.

## Vad kontrollerar vi?

Vi går igenom **exakt samma kontrollpunkter** som besiktningsstationerna Opus, Dekra och Bilprovningen använder — ingenting hoppas över.

1. **Belysning** — helljus, halvljus, blinkers (fram, bak, sida), bromsljus, backljus, skyltbelysning, dimljus, varselljus (DRL). En enda trasig glödlampa ger anmärkning.
2. **Bromssystem** — belägg och skivtjocklek (fram och bak), bromsslangar, bromscylindrar, bromsvätskans kokpunkt, parkeringsbroms. Vi mäter bromskraft på bromsbänk.
3. **Däck och hjul** — mönsterdjup (godkänd gräns: 1,6 mm, vi rekommenderar byte vid ≤ 3 mm), synliga skador, deformationer, korrekt åtdragna hjulmuttrar.
4. **Avgassystem och utsläpp** — katalysator, lambdasond, avgasrörets skick och täthet, OBD-felkoder via fordonsdator. En **tänd motorlampa** räknas som automatiskt underkänt.
5. **Styrning och fjädring** — styrväxel, styrleder och kulledsglapp, stötdämparnas funktion och läckage, krängningshämmare och länkage.
6. **Bärande delar och rostskador** — underrede, hjulupphängningens bärande punkter, sidobalkar och trösklar. Genomrostning på bärande komponenter ger direkt körförbud.
7. **Vindrutor och torkarblad** — sprickor eller stenslag i förarens primära synfält, torkarblad som inte rengör effektivt, fungerande spolarsystem.
8. **Säkerhetsutrustning** — samtliga säkerhetsbälten (lås, infästning, retraktor), airbag-varningslampa, varningstriangel ombord.

## De vanligaste orsakerna till underkänt

Baserat på Transportstyrelsens besiktningsstatistik är dessa de sex vanligaste felen — och vi åtgärdar dem alla på plats, utan att du behöver boka en ny tid:

- **Belysning** — En trasig glödlampa är det enklaste och billigaste felet att åtgärda, men också det absolut vanligaste. Kontrollera aldrig bilen i mörkt garage — du ser dem inte förrän stationen gör det.
- **Bromsar** — Slitna bromsbelägg eller skivor under minimigräns är näst vanligast. Bromsprestanda försämras gradvis och märks knappt i vardagskörning, men syns direkt på bromsbänken.
- **Motorlampa tänd (OBD-felkoder)** — En lagrad felkod i motorstyrningen ger automatiskt underkänt, oavsett om bilen känns normal. Vi läser ut koder, utreder grundorsaken och åtgärdar felet.
- **Rostskador på bärande delar** — Underredesskador som nått bärande balkar eller hjulupphängningspunkter är allvarliga anmärkningar som kan leda till körförbud. Vi inspekterar noggrant med lyft och arbetslampa.
- **Stötdämpare** — Läckande eller utslitna stötdämpare är svåra att upptäcka utan rätt utrustning. Vi testar funktion och kontrollerar för oljeläckage vid varje hjul.
- **Styrning** — Glapp i styrleder och kulledsinfästningar är en säkerhetsrisk som besiktningsstationen alltid kontrollerar. Vi mäter och bedömer samtliga rörliga komponenter i styrningen.

## Så går besiktningsförberedelsen till

1. **Boka tid** — ring oss eller boka online, gärna **2–4 veckor** före din besiktningsmånad. Det ger tid att beställa eventuella reservdelar utan stress.
2. **Fullständig kontroll** — vi genomför en systematisk genomgång av alla besiktningspunkter, med bilen på lyft för inspektion av underrede och bromssystem.
3. **Tydlig rapport** — du får en skriftlig sammanställning med tre kategorier: **godkänt**, **anmärkning** (observera inför nästa gång) och **åtgärd krävs**.
4. **Reparation med ditt godkännande** — ingenting åtgärdas utan att vi har gått igenom fynden med dig och du har godkänt kostnaden. Inga överraskningar på fakturan.
5. **Kör direkt till stationen** — bilen lämnas besiktningsklar. Du kör till Opus, Dekra eller Bilprovningen med full kontroll — och slipper komma tillbaka.

## Besiktningsförberedelse nära dig i södra Stockholm

Tullinge Bilteknik på Mekanikervägen 3 i Tullinge är det naturliga valet för bilägare i hela södra Stockholm som vill förbereda bilen inför besiktningen. Vi betjänar regelbundet kunder från **Tullinge**, **Tumba**, **Huddinge**, **Salem**, **Botkyrka**, **Flemingsberg**, **Segeltorp**, **Skogås**, **Trångsund**, **Vårby**, **Kungens Kurva**, **Rönninge** och **Södertälje**.

Närmaste besiktningsstationer i området inkluderar Opus Bilprovning i Tumba och Huddinge, Dekra i Södertälje samt Bilprovningen i Flemingsberg — alla inom bekvämt avstånd från vår verkstad. Genomgå förberedelsen hos oss på förmiddagen och kör till stationen samma dag.

Ring **08-778 60 50** eller boka direkt online. Öppet måndag till fredag 08:00–16:00. Vi hjälper dig klara besiktningen — på första försöket.`;

const landing_faq = [
  {
    question: "När ska min bil besiktigas?",
    answer:
      "Din besiktningsmånad bestäms av Transportstyrelsen och framgår av ditt registreringsbevis. Intervallerna är: nya bilar besiktigas för första gången efter 3 år, sedan vart annat år tills bilen är 9 år gammal, och därefter en gång per år. Du kan se din exakta besiktningsmånad i Transportstyrelsens fordonsinformation. Om du missar din besiktningsmånad riskerar du körförbud.",
  },
  {
    question: "Vad händer om bilen inte klarar besiktningen?",
    answer:
      "Vid underkänt resultat med trafikfarliga brister beläggs bilen omedelbart med körförbud och måste bogseras hem. Vid anmärkning som kräver åtgärd får du köra hem men måste genomgå ombesiktning inom 2 månader. Ombesiktningen kostar extra utöver ordinarie avgift. Om du inte genomför ombesiktningen i tid kan bilen inte användas lagligt på väg.",
  },
  {
    question: "Vad kostar en besiktningsförberedelse?",
    answer:
      "Priset varierar beroende på bilens ålder, skick och hur mycket tid kontrollen tar. Kontakta oss på 08-778 60 50 för en prisuppgift — vi ger alltid en tydlig offert innan vi börjar. Det vi kan säga med säkerhet är att kostnaden för en förberedelse är betydligt lägre än summan av ombesiktningsavgift, extra ledighet och den stress ett underkänt besked innebär.",
  },
  {
    question: "Vilka är de vanligaste felen vid besiktning?",
    answer:
      "Enligt Transportstyrelsens statistik är de vanligaste orsakerna till underkänt: trasig belysning (helljus, bromsljus, blinkers), slitna bromsar under minimigräns, tänd motorlampa som indikerar lagrade OBD-felkoder, rostskador på bärande delar i underredet, utslitna eller läckande stötdämpare, samt glapp i styrleder och kulledsinfästningar. Alla dessa kontrolleras och kan åtgärdas hos oss.",
  },
  {
    question: "Hur lång tid tar en besiktningsförberedelse?",
    answer:
      "En fullständig besiktningsförberedelse tar normalt 1–2 timmar beroende på bilens skick och eventuella fynd. Om vi hittar fel som behöver åtgärdas direkt kan det ta något längre tid, men vi informerar dig alltid innan vi påbörjar arbetet. Boka gärna tidigt på dagen så att du kan köra till besiktningsstationen samma eftermiddag.",
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
