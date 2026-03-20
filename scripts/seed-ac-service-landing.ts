/**
 * One-time script to seed the "AC-service" landing page content.
 * Run with: npx tsx scripts/seed-ac-service-landing.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLUG = "ac-service";

const landing_meta_desc =
  "AC-service i Tullinge – köldmediekontroll, evaporatorrengöring och kupéfilterbyte. Certifierade mekaniker, alla bilmärken. Ring 08-778 60 50 — boka idag.";

const landing_content = `## Tecken på att bilens AC behöver service

Luftkonditioneringen ger tydliga signaler när det är dags för service – om du vet vad du ska leta efter. Det vanligaste tecknet är **dålig lukt från ventilerna**: en instängd, kvalmig eller unken doft som beror på att **bakterier och mögel har etablerat sig på evaporatorn**, kylarelementen inne bakom instrumentbrädan. Ignoreras problemet sprider sig lukten till hela kupén och förvärras för varje vecka.

Fler varningstecken att reagera på:

- **Svag eller ingen kyleffekt** trots att AC:n är påslagen – vanligtvis låg köldmedienivå (R134a eller R1234yf)
- **Oljud vid uppstart av AC:n** – surrande, klickande eller skrapljud kan tyda på sliten kompressor eller drivrem
- **Imma på vindrutan som inte försvinner** – AC:n används för avimning; fungerar den inte stannar fukten kvar i kupén
- **Fläkten blåser luft men inte kall** – ofta ett tecken på att köldmediet är slut eller att det finns en läcka i systemet

Reagera tidigt – ett AC-system som inte servas i tid kan leda till kostsamma kompressorskador som kostar mångdubbelt mer att åtgärda.

## Vad ingår i en AC-service hos Tullinge Bilteknik?

Vi utför en **fullständig genomgång av hela klimatsystemet** – inte bara en enkel påfyllning. Här är vad som ingår, steg för steg:

1. **Läckagetest** – professionell diagnostikutrustning söker efter köldmedieläckor i slangar, kopplingar och kondensor. Läckor måste tätas innan påfyllning, annars är åtgärden kortvarig.
2. **Tömning och kontroll av köldmediemängd** – systemet töms på det gamla köldmediet (antingen **R134a** för bilar tillverkade före ca 2017, eller **R1234yf** för nyare modeller) och mängden mäts mot tillverkarspecifikation.
3. **Vakuumtest** – systemet evakueras under vakuum i minst 20–30 minuter för att avlägsna fukt och verifiera att det är tätt.
4. **Påfyllning med rätt köldmedium och kompressorolja** – exakt angiven mängd fylls på tillsammans med kompressorsmörjmedel för att förlänga livslängden.
5. **Antibakteriell behandling av evaporatorn** – med specialmedel desinficeras kylarelementen inifrån. Det dödar bakterier, mögel och svampsporer som orsakar den typiska unka lukten.
6. **Kontroll och byte av kupéfilter** – ett igentäppt **pollenfilter** reducerar luftflödet kraftigt och är ofta en orsak till allergisymptom i bilen. Vi kontrollerar filtertyp (aktivt kolfilter eller standard) och byter vid behov.
7. **Kompressor- och drivremsinspektion** – magnetkoppling, drivrem och eventuella spår av oljeläckage kontrolleras.
8. **Funktionstest** – kupétemperaturen mäts med och utan AC för att verifiera att systemet ger korrekt kyleffekt.

Alla utförda åtgärder dokumenteras och du får en tydlig rapport med resultat och eventuella rekommendationer.

## Frisk luft i kupén – hälsa och komfort

Många bilägare underskattar hur stor påverkan en dåligt underhållen luftkonditionering har på hälsan. **Evaporatorn är en fuktig, mörk miljö** – perfekt för tillväxt av bakterier, mögelsvampar och allergener. Varje gång du startar AC:n blåser fläkten dessa partiklar rakt in i kupén.

Konsekvenserna kan vara tydliga:

- **Allergireaktioner och snuva** – mögelsporer och dammkvalster triggar rhinit och astmasymptom, särskilt hos känsliga individer
- **Huvudvärk och trötthet** – dålig luftkvalitet i en bilkupé är en känd orsak till **förarströtthet** på längre resor
- **Ökad risk vid pollenperiod** – ett slitet eller igentäppt **aktivt kolfilter** skyddar inte mot pollen, vilket kan göra bilresan direkt olämplig för allergiker

På vintern är AC:n dessutom avgörande för **säker avimning av vindrutan**. Systemet torkar luften inuti kupén så att imman försvinner snabbt – fungerar det inte kan sikten försämras kritiskt.

En **AC-service** är alltså inte bara en komfortåtgärd. Det är en investering i din hälsa och din trafiksäkerhet.

## Hur ofta bör AC-systemet servas?

Rekommendationen från fordonstillverkare och branschorganisationer är **service var annat år eller var 40 000 km** – det som inträffar först. Skälet är fysikaliskt: **köldmediet läcker ut med 10–15 % per år** även i ett helt tätt system, via mikroporositet i slangar och tätningar. En bil som körts i fyra år utan service kan ha förlorat upp till 40–60 % av sin köldmedienivå.

**Bästa tidpunkten för service är på våren**, i mars–april, innan värmen och den höga belastningen på systemet sätter in. Du undviker då att stå utan fungerande kyla under de första varma veckorna och får eventuella fel åtgärdade i lugnt tempo.

Har du märkt symptom – dålig lukt, svag kylning eller oljud – bör du boka service direkt oavsett när den senast utfördes. Vissa läckor kan uppstå snabbt och tömma systemet på köldmedium på bara några månader.

## AC-service nära dig i södra Stockholm

Verkstaden på Mekanikervägen 3 i Tullinge erbjuder **AC-service** och **klimatanläggningsreparation** för bilägare i hela södra Stockholm. Från **Tumba** och **Huddinge** tar det bara några minuters bilfärd, och kunder från **Salem**, **Botkyrka** och **Flemingsberg** uppskattar den personliga servicen utan långa väntetider.

Bilägare i **Segeltorp**, **Skogås** och **Trångsund** når verkstaden enkelt via Huddingevägen. Från **Vårby** och **Kungens Kurva** ligger Tullinge precis söder om E4/E20-avfarten. Även kunder i **Rönninge** och **Södertälje** väljer regelbundet Tullinge Bilteknik för sin **AC-service** – en kort resa för frisk luft i kupén och rättvist pris.

Ring 08-778 60 50 eller boka direkt online. Öppet måndag till fredag 08:00–16:00.`;

const landing_faq = [
  {
    question: "Hur ofta ska bilens AC servas?",
    answer:
      "Rekommendationen är var annat år eller var 40 000 km – det som inträffar först. Köldmediet (R134a eller R1234yf) läcker naturligt ut med 10–15 % per år även i ett tätt system. Serverar du AC:n regelbundet undviker du både nedsatt kyleffekt och kostsamma kompressorskador. Bäst tid att boka är på våren innan sommarvärmen sätter in.",
  },
  {
    question: "Varför luktar det illa från AC:n?",
    answer:
      "Den unka eller instängda lukten beror nästan alltid på bakterier, mögelsvampar och jästsvampar som växer på bilens evaporator – kylarelementen inne bakom instrumentbrädan. Evaporatorn är fuktig och mörk, vilket skapar perfekta villkor för mikrobiell tillväxt. Problemet åtgärdas med en antibakteriell behandling och i många fall även byte av kupéfilter. Ring oss på 08-778 60 50 så bokar vi in en AC-service.",
  },
  {
    question: "Vad kostar AC-service?",
    answer:
      "Priset varierar beroende på bilens modell, vilket köldmedium systemet använder (R134a eller R1234yf) och hur omfattande service som behövs. Kontakta oss på 08-778 60 50 eller boka en tid online så ger vi dig en prisuppgift anpassad till just din bil innan arbetet påbörjas.",
  },
  {
    question: "Kan jag använda AC:n på vintern?",
    answer:
      "Ja, och det rekommenderas. Luftkonditioneringen används av bilens klimatsystem för att torka och avfukta luften inne i kupén, vilket är avgörande för snabb och effektiv avimning av vindrutan. Att använda AC:n regelbundet, även utanför sommarsäsongen, hjälper dessutom att hålla systemets tätningar och kompressor i gott skick.",
  },
  {
    question: "Hur vet jag att AC:n behöver fyllas på?",
    answer:
      "De vanligaste tecknen är att det tar längre tid för bilen att bli kall, att kylluften inte är riktigt kall ens vid full effekt, eller att AC:n slår av sig själv i värmen. En professionell tryckkontroll är det enda säkra sättet att mäta köldmedienivån. Köldmediet läcker naturligt med 10–15 % per år, så brist kan uppstå gradvis utan att du märker det förrän systemet tappar märkbart i effekt.",
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
