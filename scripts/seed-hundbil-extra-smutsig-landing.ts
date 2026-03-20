/**
 * One-time script to seed the "Hundbil / extra smutsig" landing page content.
 * Run with: npx tsx scripts/seed-hundbil-extra-smutsig-landing.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLUG = "hundbil-extra-smutsig";

const landing_meta_desc =
  "Rengöring av hundbil i Tullinge — päls, lukt, lera och ingrodd smuts. Specialverktyg och djuprengöring. Alla bilar. Boka tid: 08-778 60 50.";

const landing_content = `## Hundägare vet — vanlig tvätt räcker inte

Du älskar din hund. Du älskar att ta med den på utflykter, till skogen, till stranden, till farmor. Men du vet också exakt vad kupén ser ut som efteråt: **päls i varje söm**, lera i lastutrymmets alla hörn, tassavtryck på baksätet och den där *doften* som aldrig riktigt försvinner med en vanlig dammsugare.

Standardtvätt löser det inte. Inte ens vår kompletta in- och utvändiga behandling är byggd för den här nivån av smuts. **Hundbil / extra smutsig** är en separat tjänst med extra tid, specialverktyg och rengöringsmetoder anpassade för just dessa utmaningar — oavsett om det handlar om en golden retriever som badat i en lerig sjö eller en arbetsfordon som inte sett insidan av en dammsugare på sex månader.

## Vad vi gör som ingen vanlig tvätt klarar

Det här är inte en snabb genomgång. Vi tar oss den tid som krävs — varje bil är unik och behandlingstiden anpassas efter hur mycket arbete som behövs.

### Pälsborttagning — systematiskt och grundligt

Hundhår sätter sig i textilfibrerna på ett sätt som en vanlig dammsugare inte klarar. Vi använder:

- **Gummiborstar och pälsrullar** — drar ut päls ur klädsel, mattor och takhimmel med elektrostatisk effekt
- **Specialmunstycken** — turbodrivna borstmunstycken som lossar inbäddat hår från djupa textilstrukturer
- **Sömmar och veck** — vi går igenom varje söm i sätena, kardborrebanden på sätesöverdrag och skarvarna vid nackstöd där päls fastnar och aldrig lossnar av sig självt

### Luktbehandling

Hundlukt sitter inte på ytan — den finns **i textilfibrerna, i skummet under klädseln och i ventilationssystemet**. En vanlig fräschare maskerar bara lukten tillfälligt. Vi angriper källan:

- **Djuprengöring av textilklädsel** — rengöringsmedel som bryter ner organiskt material (saliv, hudolja, svett) på molekylnivå
- **Ozongenerering vid behov** — ozon oxiderar luktmolekyler i material och luft som inte nås av konventionell rengöring
- **Ventilationssystem** — lukt som kommit in i fläktsystemet sitter kvar länge. Vi behandlar kupéfiltret och ventilationskanalerna vid behov.

### Lera, sand och ingrodd smuts

Lastutrymmet i en hundbil utsätts för en helt annan typ av smuts än resten av bilen:

- **Lerklumpar och sand** — avlägsnas mekaniskt före dammsugning, annars sprids smutsen bara runt
- **Plastpaneler och dörrfack** — leriga tassavtryck på dörrsidor och lasttröskel rengörs med allrengöring
- **Golvmattor och lastutrymmesinlägg** — tas ut, spolas, borstar av och torkar separat

## Inte bara hundbilar — alla extra smutsiga fordon

Tjänsten passar lika bra för:

- **Arbetsbussar och skåpbilar** — byggdamm, sågspån, betong och månader av eftersatt städning
- **Barnfamiljens bil** — kletigt i barnstolar, smulor i varje springa, juicefläckar i klädseln
- **Bilar efter flytt** — damm, smuts och trasslighet efter lastning och urlastning
- **Köpta begagnade bilar** — ge din nyköpta bil en ren start med en djupgående behandling

Gemensamt för alla: de kräver **mer tid, starkare rengöringsmedel och tålamod** — och det är precis det vi erbjuder.

## Så bokar du — och vad du kan förvänta dig

1. **Ring oss eller boka online** — beskriv gärna bilens skick så kan vi uppskatta tidsåtgången. Foton via SMS eller mejl hjälper.
2. **Lämna bilen** — räkna med att behandlingen tar **2–4 timmar** beroende på omfattning. Lämna gärna på morgonen.
3. **Resultat** — du hämtar en bil med pälsfri klädsel, rena ytor och en kupé som luktar neutralt — inte parfymerat, utan genuint fräscht.

Priset baseras på **omfattning och tidsåtgång** (200–500 kr som tillägg), inte en fast paketering. Varje bil bedöms individuellt — en bil med lite päls och lera kostar mindre än en som inte rengjorts på ett år.

## Hundbilstvätt i Tullinge — för dig och din fyrfota passagerare

Hundägare i södra Stockholm har äntligen ett alternativ till att kämpa med dammsugaren hemma i garaget. Vi finns på Mekanikervägen 3 i Tullinge — samma verkstad som sköter din bils mekanik, nu även specialiserad på de bilar som har det tuffast i vardagen.

Hundrastplatser, skogsområden och badplatser kring **Tullinge**, **Tumba** och **Salem** gör att vi ser många hundbilar — vi vet precis vad som krävs. Kunder från **Huddinge**, **Flemingsberg** och **Botkyrka** bokar regelbundet efter helgens hundpromenader. Bor du i **Segeltorp**, **Skogås** eller **Trångsund**? Det är en kort resa hit efter en runda i Flottsbro eller Paradiset.

Från **Vårby**, **Kungens Kurva** och **Rönninge** ligger vi längs E4/E20 — sväng av efter utflykten och lämna bilen hos oss. Även hundägare i **Södertälje** kör gärna den korta sträckan för en rengöring som verkligen gör skillnad.

Ring **08-778 60 50** eller boka online. Öppet måndag–fredag 08:00–16:00.`;

const landing_faq = [
  {
    question: "Hur tar ni bort all hundpäls från bilen?",
    answer:
      "Vi använder en kombination av gummiborstar, pälsrullar och specialmunstycken med turboborste som drar ut päls ur textilfibrerna elektrostatiskt och mekaniskt. Varje söm, veck och kardborreband i klädsel och sätesöverdrag gås igenom separat. Det är betydligt mer effektivt än en vanlig dammsugare och tar bort även djupt inbäddad päls som sitter fast i textilstrukturen.",
  },
  {
    question: "Kan ni få bort hundlukten helt?",
    answer:
      "I de allra flesta fall ja. Hundlukt sitter i textilfibrerna, skummet under klädseln och ibland i ventilationssystemet. Vi använder rengöringsmedel som bryter ner organiskt material på molekylnivå, och vid behov ozongenerering som oxiderar luktmolekyler i material och luft som inte nås av konventionell rengöring. Resultatet är en kupé som luktar neutralt — inte maskerat med parfym, utan genuint fräscht.",
  },
  {
    question: "Hur lång tid tar rengöring av en hundbil?",
    answer:
      "Räkna med 2–4 timmar beroende på bilens storlek och skick. En bil med lite päls och lera tar kortare tid, medan en bil som inte rengjorts på länge kan kräva en hel förmiddag. Beskriv gärna bilens skick vid bokning eller skicka foton så kan vi ge en bättre uppskattning. Lämna gärna bilen på morgonen och hämta på eftermiddagen.",
  },
  {
    question: "Fungerar tjänsten även för bilar som inte är hundbilar?",
    answer:
      "Absolut. Tjänsten passar alla fordon som behöver extra omsorg — arbetsbussar med byggdamm, barnfamiljens bil med klet i barnstolar, bilar efter flytt, eller begagnade bilar som behöver en nystart. Gemensamt är att de kräver mer tid och starkare metoder än en standardtvätt, och det är precis vad vi erbjuder.",
  },
  {
    question: "Vad kostar rengöring av hundbil?",
    answer:
      "Priset baseras på omfattning och tidsåtgång — varje bil är unik. Det är en tilläggstjänst från 200 kr som läggs ovanpå vald tvättnivå. En bil med lite päls kostar mindre än en som inte rengjorts på ett år. Ring 08-778 60 50 och beskriv bilens skick så ger vi en uppskattning innan du bokar.",
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
