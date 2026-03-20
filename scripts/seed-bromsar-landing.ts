/**
 * One-time script to seed the "Bromsar" landing page content.
 * Run with: npx tsx scripts/seed-bromsar-landing.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLUG = "bromsar";

const landing_meta_desc =
  "Bromsbyte i Tullinge – bromsbelägg, bromsskivor och bromsvätska. Erfarna mekaniker, alla bilmärken. Boka tid hos Tullinge Bilteknik. Ring 08-778 60 50.";

const landing_content = `## Tecken på att bromsarna behöver ses över

Slitna bromsar ger tydliga varningssignaler långt innan de blir farliga. Att känna igen dessa tecken i tid sparar pengar och förhindrar onödiga risker i trafiken. Kontakta en **bilverkstad** direkt om något av följande uppstår:

- **Bromsljus lyser** på instrumentpanelen – bromsvätska kan vara låg eller belägg slitna
- **Bromsar gnisslar** vid inbromsning – metallindikator signalerar att bromsbeläggen är utslitna
- **Bromsar skaver** eller vibrerar – ojämnt slitage på **bromsskivor** eller deformerad skiva
- **Längre bromssträcka** – bilen behöver mer avstånd för att stanna helt
- **Bilen drar åt ena sidan** vid inbromsning – ojämnt slitage eller fastnad bromsok
- **Mjuk eller svampig bromspedal** – luft i bromssystemet eller läckande bromsvätska

Ett enda ignorerat symptom kan innebära skillnaden mellan ett tryggt stopp och en olycka. Tveka aldrig att boka en **bromskontroll** om något känns annorlunda.

## Vad ingår i ett bromsbyte?

Ett bromsbyte på Tullinge Bilteknik omfattar en fullständig inspektion av hela bromssystemet, inte bara byte av den slitna komponenten. Erfarna mekaniker kontrollerar samtliga delar för att säkerställa att systemet fungerar som en enhet.

1. **Visuell inspektion** – bromsbelägg, bromsskivor, bromsslangar och bromsok kontrolleras för slitage och skador
2. **Mätning av bromsbelägg** – beläggstjocklek mäts med precisionsinstrument för att bedöma kvarvarande livslängd
3. **Kontroll av bromsskivor** – skivtjocklek och rundhet mäts mot tillverkarens minimivärden
4. **Byte av slitna delar** – uttjänta **bromsbelägg** och **bromsskivor** ersätts med kvalitetsdelar som motsvarar OE-standard
5. **Bromsvätskekontroll** – vätskans kokpunkt mäts; vid behov görs ett komplett **bromsvätskebyte**
6. **Funktionstest och provkörning** – bromskraft och pedalkänsla verifieras innan bilen lämnas tillbaka

Alla utbytta delar visas upp på begäran, och en tydlig rapport med utfört arbete samt eventuella rekommendationer medföljer alltid.

## Bromsbelägg, bromsskivor och bromsvätska

Bromssystemet består av flera samverkande komponenter som alla påverkar bilens stoppsträcka och säkerhet. Att förstå skillnaden hjälper dig att fatta rätt beslut vid **bromsservice**.

- **Bromsbelägg** – den komponent som slits snabbast. Belägg av hög kvalitet ger kortare bromssträcka, tystare drift och mindre bromsdamm. Normalt bytesbehov uppstår efter 30 000–70 000 km beroende på körstil och trafikmiljö.
- **Bromsskivor** – den roterande skivan som beläggen pressas mot. Skivor håller ofta dubbelt så länge som belägg men måste bytas när de nått minsta tillåtna tjocklek eller uppvisar sprickor.
- **Bromsvätska** – den hydrauliska vätskan som överför pedalkraft till bromsoken. Bromsvätska absorberar fukt ur luften över tid, vilket sänker kokpunkten och försämrar bromskraften. Tillverkare rekommenderar byte vartannat år oavsett körsträcka.

Tullinge Bilteknik använder enbart delar och vätska som uppfyller eller överträffar biltillverkarens specifikationer – aldrig lågprisalternativ som kompromissar med säkerheten.

## Säkerhet utan kompromiss

Bromssystemet är bilens viktigaste säkerhetssystem. Varje **bromsbyte** och **bromsservice** hos Tullinge Bilteknik utförs med samma noggrannhet oavsett om det gäller en äldre familjebil eller en nyare premiumbil.

- **Kvalitetsdelar** – bromsbelägg och skivor från ledande tillverkare som ATE, TRW, Brembo och Bosch
- **Alla bilmärken** – Volvo, Volkswagen, BMW, Toyota, Audi, Mercedes, Kia och alla övriga fabrikat
- **Transparent process** – kostnaden presenteras alltid innan arbetet påbörjas, utan överraskningar
- **Personlig kontakt** – mekanikern som utför arbetet förklarar vad som behöver göras och varför

Med över **500 nöjda kunder** och ett snittbetyg på **4.9** är verkstaden ett beprövat val för alla som värderar säkerhet och ärlig service.

## Bromsbyte nära dig i södra Stockholm

Verkstaden på Mekanikervägen 3 i Tullinge erbjuder **bromsbyte** och **bromsservice** för bilägare i hela södra Stockholm. Från **Tumba** och **Huddinge** tar det bara några minuters bilfärd, och kunder från **Salem**, **Botkyrka** och **Flemingsberg** uppskattar den personliga servicen utan långa väntetider.

Bilägare i **Segeltorp**, **Skogås** och **Trångsund** når verkstaden enkelt via Huddingevägen. Från **Vårby** och **Kungens Kurva** ligger Tullinge precis söder om E4/E20-avfarten. Även kunder i **Rönninge** och **Södertälje** väljer regelbundet att göra sitt **bromsbyte i Tullinge** – en kort resa för trygg bromskraft och rättvist pris.

Ring 08-778 60 50 eller boka direkt online. Öppet måndag till fredag 08:00–16:00.`;

const landing_faq = [
  {
    question: "Hur vet jag att bromsarna behöver bytas?",
    answer:
      "Vanliga tecken är att bromsljuset lyser, att det gnisslar eller skaver vid inbromsning, att bromspedalen känns mjuk eller att bilen drar åt sidan. Om något känns annorlunda vid bromsning bör du boka en bromskontroll. Ring oss på 08-778 60 50 så undersöker vi dina bromsar.",
  },
  {
    question: "Vad kostar ett bromsbyte?",
    answer:
      "Priset beror på bilmärke, modell och vilka komponenter som behöver bytas – bromsbelägg, bromsskivor eller bromsvätska. Kontakta oss på 08-778 60 50 eller fyll i bokningsformuläret så får du en prisuppgift anpassad till just din bil innan arbetet påbörjas.",
  },
  {
    question: "Hur lång tid tar ett bromsbyte?",
    answer:
      "Ett bromsbyte tar normalt 1–3 timmar beroende på om det gäller enbart bromsbelägg eller även bromsskivor och bromsvätska. Lämna in bilen på morgonen så är den oftast klar innan lunch. Boka tid så planerar vi in ditt besök.",
  },
  {
    question: "Är det farligt att köra med slitna bromsar?",
    answer:
      "Ja, slitna bromsar förlänger bromssträckan avsevärt och kan i värsta fall leda till att bromsförmågan helt försvinner. Metall mot metall skadar dessutom bromsskivorna, vilket gör reparationen betydligt dyrare. Boka en kontroll direkt om du märker gnisslan eller vibreringar.",
  },
  {
    question: "Hur ofta ska bromsarna bytas?",
    answer:
      "Bromsbelägg håller normalt 30 000–70 000 km och bromsskivor ungefär dubbelt så långt, beroende på körstil och trafikmiljö. Bromsvätska bör bytas vartannat år oavsett körsträcka. Ring 08-778 60 50 så hjälper vi dig att bedöma när det är dags.",
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
