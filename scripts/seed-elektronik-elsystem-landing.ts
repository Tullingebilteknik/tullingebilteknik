/**
 * One-time script to seed the "Elektronik & elsystem" landing page content.
 * Run with: npx tsx scripts/seed-elektronik-elsystem-landing.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLUG = "elektronik-elsystem";

const landing_meta_desc =
  "Bilens elsystem i Tullinge — generator, startmotor, batteri, CAN-bus, belysning och felsökning. Oscilloskop och märkesdata. Boka: 08-778 60 50.";

const landing_content = `## Moderna bilar är datorer på hjul

Dagens fordon innehåller **40–100 styrenheter** (ECU:er) som kommunicerar via bilens **CAN-bus-nätverk** — från motorstyrning och ABS till centrallås, klimatsystem och parkeringsassistans. Ett enda kabelfel, en dålig jordpunkt eller en korroderad kontakt kan orsaka kedjefel som dyker upp på helt andra ställen i bilen. Traditionell mekanik räcker inte längre — **elektronikfelsökning** kräver en kombination av elkunskap, diagnostikverktyg och systemförståelse.

Tullinge Bilteknik har investerat i avancerad mätutrustning och uppdaterad märkesdata för att hantera just dessa utmaningar. Vi felsöker elsystem på alla bilmärken — från enkla lampbyten till komplexa CAN-bus-störningar.

## Vanliga elsystemproblem och vad de beror på

Elektriska fel är ofta intermittenta och frustrerande att spåra. Här är de vanligaste problemen vi ser:

- **Bilen startar inte eller startar trögt** — svagt **batteri**, sliten **startmotor** eller korroderade batteripoler. Vi testar batteri och laddkrets med analysator som visar verklig kapacitet, inte bara spänning.
- **Batterilampa lyser / batteriet laddas inte** — oftast en defekt **generator** (dynamo) eller sliten drivrem. Kan även bero på spänningsregulator eller kablagefel.
- **Belysningsproblem** — strålkastare, bakljus, blinkers, LED-konverteringar, xenon/bi-xenon ballast, adaptiva kurvljus. Vi åtgärdar allt från trasiga glödlampor till felaktiga styrenheter för ljusautomatik.
- **Centrallås, elfönsterhissar, speglar** — slutar fungera intermittent eller permanent. Vanligtvis slitna motorstyrkort, trasiga kablar i dörrpassager eller defekta kontakter.
- **Instrumentpanelen visar felmeddelanden eller nollställs** — CAN-bus-kommunikationsfel, defekt instrumentkluster eller störningar från eftermonterad utrustning.
- **Elvärme, stolsvärme, backspegel** — avbrutna värmeelement eller trasiga relän.
- **Dragkroksel och släpvagnsbelysning** — felaktigt monterade dragkrokssatser som stör bilens CAN-bus, underkänd belysning vid besiktning med släp.

## Så felsöker vi elektriska problem

Elektriska fel kräver metodisk felsökning — inte gissningar eller att byta delar på måfå. Vår process:

1. **Symptombeskrivning** — vi frågar noggrant: när uppstår felet? Alltid eller sporadiskt? Vid kyla, fukt, vibrationer? Detaljer som "bara när det regnar" eller "efter 20 minuters körning" är avgörande ledtrådar.
2. **Batteridiagnostik** — ett svagt batteri kan orsaka en kaskad av konstiga symtom. Vi mäter batterihälsa, kallstartskapacitet (CCA) och laddspänning med professionell analysator.
3. **OBD- och märkesspecifik scanning** — felkoder läses ur samtliga styrenheter via **CAN-bus**, inte bara motorstyrningen. Ofta finns ledtrådar i styrenheter som verkar orelaterade.
4. **Oscilloskopmätning** — för intermittenta fel och signalanalys: vi mäter **signalformer** från sensorer, spänningsfall i kretsar, injektorpulser och CAN-bus-signalkvalitet. Oscilloskopet ser saker som en multimeter missar.
5. **Kopplingsschema och märkesdata** — vi arbetar med aktuella kopplingsscheman och teknisk data för att spåra kablar, säkringar, relän och jordpunkter systematiskt.
6. **Reparation och verifiering** — felet åtgärdas vid källan. Vi verifierar att problemet är löst genom att reproducera de ursprungliga förhållandena och bekräfta att inga nya felkoder lagras.

## Batteri, generator och startmotor — hjärtat i elsystemet

Tre komponenter utgör grunden för bilens elförsörjning. Om en av dem sviktar påverkas allt annat:

- **Batteriet** — förser startmotorn med kraft och stabiliserar spänningen i elnätet. Moderna AGM- och EFB-batterier (vanliga i bilar med start/stopp-automatik) kräver korrekt **laddstrategi** och får aldrig ersättas med ett billigare konventionellt batteri utan omprogrammering av BMS (Battery Management System).
- **Generatorn** — laddar batteriet och driver elsystemet under körning. En sviktande generator ger gradvis sjunkande spänning som kan orsaka allt från svag belysning till felmeddelanden och motorstopp. Vi testar generatorns uteffekt och ripple (diodkontroll) med oscilloskop.
- **Startmotorn** — drar maximal ström vid varje start. Slitage på kol och solenoid ger sig till känna som trög eller ojämn start. Vi kontrollerar strömförbrukning och jämför med referensvärden.

Vi lagerhåller vanliga batterier, generatorer och startmotorer för snabba byten — ofta klart samma dag.

## Bilelektriker nära dig — hela södra Stockholm

Att hitta en verkstad som verkligen behärskar **elektriska felsökningar** är inte lätt — de flesta hänvisar dig vidare till en märkesverkstad. Vi gör inte det. Med oscilloskop, märkesspecifik programvara och erfarenhet av allt från **Volvo CEM-problem** till **VW Gateway-fel** tar vi oss an de jobb som andra inte kan eller vill göra.

Oavsett om du bor i **Tullinge**, **Tumba** eller **Huddinge** — eller pendlar genom **Kungens Kurva** och **Vårby** på väg till jobbet — ligger vi bara minuter bort längs E4/E20. Kunder från **Salem**, **Rönninge** och **Södertälje** når oss snabbt söderut via riksväg 226. Och för dig i **Flemingsberg**, **Segeltorp**, **Skogås**, **Trångsund** eller **Botkyrka** är vi ofta det närmaste alternativet med riktig eldiagnostik.

Har du ett elfel som ingen hittar? Ring **08-778 60 50** eller boka online. Mekanikervägen 3, Tullinge — öppet måndag–fredag 08:00–16:00.`;

const landing_faq = [
  {
    question: "Varför startar inte min bil?",
    answer:
      "De vanligaste orsakerna är ett svagt eller dött batteri, en defekt startmotor eller korroderade batteripoler. Det kan även bero på ett säkringsfel, ett trasigt startrelä eller — i moderna bilar — ett kommunikationsfel mellan startspärr och nyckel/transponder. Vi testar hela startkedjan systematiskt för att hitta den verkliga orsaken, inte bara symptomen.",
  },
  {
    question: "Hur vet jag om generatorn är trasig?",
    answer:
      "Typiska tecken är att batterivarningslampan lyser, att strålkastarna blinkar eller dimmas vid tomgång, att batteriet ständigt laddas ur, eller att bilen får konstiga felmeddelanden. En generator kan fungera delvis — den kanske laddar tillräckligt vid högt varvtal men inte vid tomgång. Vi mäter uteffekt, spänningsstabilitet och diodkontroll med oscilloskop för att ge en exakt diagnos.",
  },
  {
    question: "Vad kostar det att felsöka elsystemet?",
    answer:
      "Kostnaden beror på felets komplexitet. Enkla problem som ett batteritest eller lampbyte tar kort tid, medan intermittenta CAN-bus-fel kan kräva djupare analys med oscilloskop och kopplingsscheman. Vi ger alltid en tydlig prisuppgift innan arbetet påbörjas. Ring 08-778 60 50 så diskuterar vi ditt specifika problem.",
  },
  {
    question: "Kan ni felsöka CAN-bus-fel?",
    answer:
      "Ja, det är en av våra specialiteter. CAN-bus är det kommunikationsnätverk som binder samman bilens alla styrenheter. Ett CAN-bus-fel kan orsaka till synes orelaterade problem i flera system samtidigt — exempelvis att motorlampan tänds, centrallåset slutar fungera och instrumentpanelen visar felmeddelanden. Vi mäter CAN-signaler med oscilloskop och spårar felet till rätt nod, kabel eller kontakt.",
  },
  {
    question: "Behöver jag AGM-batteri om bilen har start/stopp?",
    answer:
      "Ja, bilar med start/stopp-automatik kräver antingen AGM- eller EFB-batteri som tål frekventa laddcykler. Att montera ett vanligt blybatteri kan orsaka förtidig batterisvikt, felmeddelanden och att start/stopp-funktionen stängs av. Vid batteribyte måste dessutom bilens BMS (Battery Management System) oftast registreras om — något vi hanterar med rätt diagnosutrustning.",
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
