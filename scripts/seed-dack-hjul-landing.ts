/**
 * One-time script to seed the "Däck & hjul" landing page content.
 * Run with: npx tsx scripts/seed-dack-hjul-landing.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLUG = "dack-hjul";

const landing_meta_desc =
  "Däckbyte i Tullinge – vinterdäck, sommardäck, hjulinställning och däckhotell. Alla bilmärken. Boka tid hos Tullinge Bilteknik. Ring 08-778 60 50.";

const landing_content = `## När ska däcken bytas? Datum och lagkrav

Enligt **Trafikförordningen (4 kap. 18 §)** är vinterdäck obligatoriska i Sverige från **1 december till 31 mars** när det råder vinterväglag. Att köra med sommardäck under denna period kan ge böter på **1 200 kronor** – och i värsta fall ogiltigt försäkringsskydd vid olycka.

En enkel minnesregel: byt till vinterdäck runt **O-datum** (sista oktober) och tillbaka till sommardäck runt **P-datum** (påsk). Byt gärna redan när temperaturen sjunker under **+7 °C** – det är vid den gränsen sommardäckens gummiblandning blir hård och tappar grepp, oavsett om det finns snö på vägen eller inte.

Tullinge Bilteknik tar emot **däckbytesbokningar** hela säsongen, men platserna i oktober och mars fyller sig snabbast. Boka tidigt för att säkra en tid som passar dig.

## Så väljer du rätt däck

Rätt däck gör skillnad för säkerhet, bränsleförbrukning och komfort. Här är de tre huvudtyperna:

- **Sommardäck** – optimerade för temperaturer över +7 °C. Ger kortast bromssträcka och bäst kurvstabilitet på torr och våt asfalt. Hårdare gummiblandning ger längre livslängd i sommarhalvåret.
- **Vinterdäck** (dubb eller friktion) – mjukare gummiblandning och lamellmönster som biter på is och snö. Dubbdäck ger bäst grepp på blank is, medan friktionsdäck är tystare och tillåtna i hela Europa.
- **Allroundsdäck** (helårsdäck) – en kompromiss som klarar milda vintrar men aldrig matchar specialdäckens prestanda. Lagliga som vinterdäck i Sverige förutsatt att de är märkta med **3PMSF-symbolen** (alptoppen med snöflingan).

Vid köp av nya däck, titta på **EU-däckmärkningen** som visar tre värden: bränsleeffektivitet (A–E), våtgrepp (A–E) och externt däckbuller (dB). Vi hjälper dig att välja ett däck som balanserar säkerhet och ekonomi för just ditt fordon och din körstil.

## Mer än bara däckbyte

Ett **däckbyte** hos Tullinge Bilteknik är mer än att skruva av och på hjul. Vi erbjuder en komplett uppsättning däck- och hjulrelaterade tjänster:

1. **Däckbyte och montering** – professionell av- och påmontering med momentnyckel enligt biltillverkarens specifikation
2. **Hjulbalansering** – eliminerar vibrationer i ratten och förlänger däckens livslängd genom jämn viktfördelning
3. **Hjulinställning (fyrhjulsmätning)** – korrigerar hjulvinklar så att däcken slits jämnt och bilen går rakt
4. **TPMS-kalibrering** – återställning av bilens däcktryckssensorer efter hjulbyte, så att varningslampan inte lyser i onödan
5. **Fälgreparation** – kosmetisk och strukturell reparation av skadade aluminiumfälgar
6. **Däckhotell** – säsongsförvaring i klimatstyrt utrymme, inklusive tvätt och kontroll vid in- och uttag

Allt arbete utförs av erfarna mekaniker med rätt utrustning för alla bilmärken – från Volvo och Volkswagen till BMW, Toyota, Audi och Mercedes.

## Kontrollera själv: 5-kronorstricket

Du kan snabbt kontrollera dina däcks mönsterdjup med ett vanligt **5-kronorsmynt**:

1. Sätt myntet i däckmönstrets spår med siffran **5** nedåt
2. Om hela siffran **5** är synlig är mönsterdjupet under **3 mm** – dags att planera byte
3. Om den nedre kanten av femman försvinner i mönstret har du tillräckligt djup kvar

**Lagkravet** i Sverige är minst **1,6 mm** mönsterdjup, men expertrekommendationen för vinterdäck är minst **3 mm** för att behålla tillräckligt grepp på snö och is. Under 3 mm ökar bromssträckan markant.

Kontrollera också om slitaget är **ojämnt** – mer slitage på ytter- eller innerkanten tyder på felaktig **hjulinställning**, medan fläckvis slitage kan bero på dålig **hjulbalansering**. Båda problemen ökar däckförbrukningen och bör åtgärdas vid nästa verkstadsbesök.

## Däckbyte nära dig i södra Stockholm

Verkstaden på Mekanikervägen 3 i Tullinge erbjuder **däckbyte**, **hjulbalansering** och **däckhotell** för bilägare i hela södra Stockholm. Från **Tumba** och **Huddinge** är det bara några minuters bilfärd, och kunder från **Salem**, **Botkyrka** och **Flemingsberg** uppskattar den personliga servicen utan långa väntetider.

Bilägare i **Segeltorp**, **Skogås** och **Trångsund** når verkstaden enkelt via Huddingevägen. Från **Vårby** och **Kungens Kurva** ligger Tullinge precis söder om E4/E20-avfarten. Även kunder i **Rönninge** och **Södertälje** väljer regelbundet att göra sitt **däckbyte i Tullinge** – en kort resa för tryggt väggrepp och rättvist pris.

Ring 08-778 60 50 eller boka direkt online. Öppet måndag till fredag 08:00–16:00.`;

const landing_faq = [
  {
    question: "När måste jag byta till vinterdäck?",
    answer:
      "Vinterdäck är lagkrav i Sverige från 1 december till 31 mars vid vinterväglag. Vi rekommenderar att byta redan i oktober när temperaturen sjunker under +7 °C, eftersom sommardäckens gummi då blir hårt och tappar grepp. Boka tid i god tid – platserna fyller sig snabbt inför säsongen. Ring 08-778 60 50.",
  },
  {
    question: "Hur vet jag att däcken är utslitna?",
    answer:
      "Lagkravet är minst 1,6 mm mönsterdjup, men för vinterdäck rekommenderas minst 3 mm. Ett enkelt test: sätt ett 5-kronorsmynt i mönsterspåret med femman nedåt. Om hela siffran 5 syns är mönsterdjupet under 3 mm och det är dags att planera byte. Ojämnt slitage kan tyda på behov av hjulinställning.",
  },
  {
    question: "Vad kostar ett däckbyte?",
    answer:
      "Priset beror på bilmärke, däckstorlek och om det behövs hjulbalansering eller andra tilläggstjänster. Kontakta oss på 08-778 60 50 eller fyll i bokningsformuläret så får du en prisuppgift anpassad till just din bil innan arbetet påbörjas.",
  },
  {
    question: "Erbjuder ni däckhotell och säsongsförvaring?",
    answer:
      "Ja, vi erbjuder däckhotell med klimatstyrd förvaring. Dina däck tvättas och kontrolleras vid intag, och vid uttag monterar vi dem direkt på bilen. Du slipper lagra tunga hjul hemma och kan vara säker på att däcken förvaras under optimala förhållanden.",
  },
  {
    question: "Behöver jag hjulinställning vid däckbyte?",
    answer:
      "Det är inte alltid nödvändigt, men vi rekommenderar hjulinställning om du märker ojämnt däckslitage, om bilen drar åt ena sidan, eller om du kört på en trottoarkant eller djupt gupp. Felaktig hjulinställning förkortar däckens livslängd avsevärt och kan påverka körsäkerheten.",
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
