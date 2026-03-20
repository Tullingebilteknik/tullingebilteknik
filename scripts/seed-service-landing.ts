/**
 * One-time script to seed the "Service & underhåll" landing page content.
 * Run with: npx tsx scripts/seed-service-landing.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLUG = "service-underhall";

const landing_meta_desc =
  "Bilservice i Tullinge – erfarna mekaniker, alla bilmärken, kvalitetsdelar. Boka din service hos Tullinge Bilteknik idag. Ring 08-778 60 50.";

const landing_content = `## Så går en bilservice till – steg för steg

En bilservice på Tullinge Bilteknik följer en strukturerad process som säkerställer att varje kontrollpunkt hanteras noggrant. Från bokning till färdig bil tar hela processen normalt en arbetsdag, och bilen lämnas alltid tillbaka med uppdaterad **servicebok**.

1. **Boka tid** – ring 08-778 60 50 eller använd bokningsformuläret online. Ange gärna bilmärke, modell och miltal så förbereder mekanikern rätt delar.
2. **Lämna in bilen** – verkstaden på Mekanikervägen 3 i Tullinge har öppet måndag till fredag 08:00–16:00.
3. **Genomgång och diagnos** – med modern diagnostikutrustning läses eventuella felkoder av och bilens skick dokumenteras.
4. **Service enligt tillverkarens schema** – oljebyte, filterbyten, nivåkontroller och övriga punkter utförs med godkända oljor och kvalitetsdelar.
5. **Provkörning och slutkontroll** – bilen provkörs för att verifiera att allt fungerar felfritt.
6. **Återlämning med rapport** – du får en tydlig sammanfattning av utfört arbete och eventuella rekommendationer inför framtiden.

## Vad ingår i en service?

Regelbunden bilservice är den enskilt viktigaste åtgärden för att förlänga bilens livslängd och bibehålla dess marknadsvärde. Omfattningen beror på **serviceintervall** och tillverkarens specifikationer, men en typisk service inkluderar följande moment:

- **Oljebyte** – gammal motorolja tappas ur och ersätts med fabrikatgodkänd olja (helsyntetisk, halvsyntetisk eller mineralbaserad beroende på motortyp)
- **Oljefilter** – byts alltid vid oljebyte för att säkerställa ren smörjning
- **Luftfilter** – ett igensatt luftfilter ökar bränsleförbrukningen och minskar motoreffekten
- **Kupéfilter** – renar luften i kupén från pollen, damm och avgaser
- **Bromskontroll** – bromsbelägg, bromsskivor och bromsvätska kontrolleras
- **Däckkontroll** – mönsterdjup, lufttryck och slitage bedöms
- **Avgaskontroll** – avgasutsläpp mäts för att säkerställa att bilen uppfyller miljökraven
- **Nivåkontroller** – kylvätska, bromsvätska, servostyrningsolja och spolarvätska fylls på vid behov
- **Belysning och torkarblad** – samtliga lampor och vindrutetorkare kontrolleras
- **Underredesinspektion** – visuell kontroll av bärande delar, styrled och drivknutar

Beroende på bilens ålder och miltal kan även **kamremsbyten**, **tändstiftsbyten** och **växellådsolja** vara aktuellt. Mekanikerna informerar alltid innan tilläggsarbete utförs.

## Varför välja Tullinge Bilteknik?

Med över **500 nöjda kunder** och ett snittbetyg på **4.9** har verkstaden etablerat sig som ett pålitligt val för bilservice i södra Stockholm. Erfarna bilmekaniker arbetar med modern utrustning och håller sig uppdaterade på de senaste fordonsteknikerna.

- **Alla bilmärken** – oavsett om du kör Volvo, Volkswagen, BMW, Toyota, Kia eller något annat märke genomförs service enligt tillverkarens rekommendationer
- **Kvalitetsdelar** – enbart originaldelar eller likvärdiga delar av hög kvalitet används, aldrig billiga kopior som riskerar livslängden
- **Godkända oljor** – motorolja som uppfyller bilens specifikationer, exempelvis VW 504.00/507.00, MB 229.51 eller Volvo VCC RBS0-2AE
- **Personlig kontakt** – du pratar direkt med mekanikern som arbetar på din bil, inga mellanhänder eller callcenter
- **Transparent prissättning** – kostnaden presenteras tydligt innan arbetet påbörjas, utan dolda avgifter

## Bilverkstad för hela södra Stockholm

Tullinge Bilteknik ligger centralt på Mekanikervägen 3, med enkel tillgänglighet för bilägare i hela området. Många kunder kommer från **Tumba** och **Huddinge** tack vare det korta avståndet och den personliga servicen. Verkstaden betjänar även bilägare i **Salem**, **Botkyrka**, **Flemingsberg** och **Segeltorp** som söker en pålitlig bilverkstad utan storstadspriser.

Från **Skogås** och **Trångsund** tar det bara 15 minuter med bil, och för kunder i **Vårby** och **Kungens Kurva** ligger verkstaden precis söder om E4/E20. Även bilägare i **Rönninge** och **Södertälje** väljer regelbundet Tullinge Bilteknik för sin bilservice. Oavsett var i södra Stockholm du befinner dig finns en bilmekaniker med rätt kompetens nära till hands.

## Kostnad och värde – service som lönar sig

Priset för en bilservice varierar beroende på bilmärke, modell, årsmodell och vilken typ av service som ska utföras. Kontakta Tullinge Bilteknik på 08-778 60 50 eller fyll i bokningsformuläret för en prisuppgift anpassad till just din bil — kostnaden presenteras alltid tydligt innan arbetet påbörjas.

Att följa bilens **serviceintervall** är en investering som betalar sig. Regelbunden service minskar risken för kostsamma haverier, sänker bränsleförbrukningen och bevarar bilens andrahandsvärde. En bortprioriterad service idag kan bli en reparation på tiotusentals kronor imorgon.`;

const landing_faq = [
  {
    question: "Vad kostar en bilservice hos Tullinge Bilteknik?",
    answer:
      "Priset beror på bilmärke, modell och typ av service. Ring oss på 08-778 60 50 eller fyll i bokningsformuläret så ger vi dig ett exakt pris baserat på din bil. Kostnaden presenteras alltid tydligt innan arbetet påbörjas.",
  },
  {
    question: "Hur lång tid tar en bilservice?",
    answer:
      "En vanlig service tar normalt 2–4 timmar beroende på omfattning. Lämna in bilen på morgonen så är den oftast klar samma eftermiddag. Vid större serviceåtgärder, som kamremsbyte, kan det ta en hel arbetsdag. Kontakta oss så planerar vi in en tid som passar dig.",
  },
  {
    question: "Vad ingår i en bilservice?",
    answer:
      "En bilservice inkluderar oljebyte, byte av oljefilter och luftfilter, bromskontroll, däckkontroll, nivåkontroller av vätskor samt en genomgång av belysning och underrede. Omfattningen anpassas efter tillverkarens serviceschema för just din bil. Boka tid så går vi igenom vad just din bil behöver.",
  },
  {
    question: "Hur ofta ska bilen servas?",
    answer:
      "De flesta biltillverkare rekommenderar service var 15 000–30 000 km eller en gång per år, beroende på vad som inträffar först. Serviceintervallet varierar mellan bilmärken och modeller. Är du osäker kan du ringa oss på 08-778 60 50 så hjälper vi dig att kontrollera vad som gäller för din bil.",
  },
  {
    question: "Kan ni serva alla bilmärken?",
    answer:
      "Ja, Tullinge Bilteknik utför service på alla bilmärken – Volvo, Volkswagen, BMW, Audi, Toyota, Kia, Hyundai, Mercedes och alla andra. Servicen utförs enligt tillverkarens specifikationer med godkända oljor och kvalitetsdelar, vilket innebär att nybilsgarantin bevaras.",
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
    console.error(`No service found with slug "${SLUG}". Has the SQL migration been run?`);
    process.exit(1);
  }

  console.log(`✓ Updated: ${data[0].title} (${data[0].slug})`);
  console.log(`  Meta desc: ${landing_meta_desc.length} chars`);
  console.log(`  Content: ${landing_content.length} chars`);
  console.log(`  FAQ: ${landing_faq.length} questions`);
  console.log(`\nView at: /tjanster/${SLUG}`);
}

main();
