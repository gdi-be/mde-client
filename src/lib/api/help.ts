import type { FormHelp } from "$lib/models/form";

export const getFormHelp = async (): Promise<FormHelp> => {

  // TODO: this should come from a static resource
  return {
    'isoMetadata.title': `
## Titel Datenbestand

Das Feld **"Titel Datenbestand"** beschreibt den Namen des Datensatzes oder der Ressource. Es ist ein Pflichtfeld und sollte klar, prägnant und eindeutig sein. Der Titel hilft Nutzern dabei, den Inhalt der Daten schnell zu verstehen.

#### Anforderungen an den Titel:
- **Eindeutig**: Der Titel sollte den Datensatz oder die Ressource eindeutig identifizieren.
  *Beispiel*: „Landnutzungskarte Deutschland 2025“ statt „Karte“.

- **Prägnant**: Verwenden Sie maximal 100–200 Zeichen. Überflüssige Details sollten vermieden werden.

- **Aussagekräftig**: Der Titel sollte den Inhalt oder Zweck der Ressource widerspiegeln.
  *Beispiel*: „Höhenmodell Bayerischer Wald (5 m Auflösung)“ statt „Höhenmodell“.

#### Hinweise:
- Der Titel wird oft zusammen mit der Beschreibung verwendet, um den Datensatz zu spezifizieren. Achten Sie darauf, dass beide Felder sich sinnvoll ergänzen.
- Verwenden Sie keine technischen Abkürzungen, die ohne Kontext schwer zu verstehen sind.

#### Beispiele für gültige Titel:
- **Geodaten**: „Straßennetz Nordrhein-Westfalen 2024“
- **Satellitendaten**: „Landsat 8 Multispektraldaten, Alpen, Juni 2023“
- **Fernerkundung**: „SAR-Bilder Sentinel-1, Polarisation VV, Nordsee, Januar 2024“

#### Zusätzliche Informationen:
Weitere Details zur korrekten Angabe von Metadaten finden Sie in der <a href="https://www.iso.org/standard/53798.html" target="_blank">ISO 19115 Normen</a> (englisch).
    `,
    'isoMetadata.description': `
## Kurzbeschreibung Datenbestand

Das Feld **"Kurzbeschreibung Datenbestand"** bietet eine kurze, aber prägnante Zusammenfassung des Inhalts des Datensatzes. Hier sollten die wichtigsten Informationen zu dem Datensatz zusammengefasst werden, um den Nutzern einen schnellen Überblick zu ermöglichen.

#### Anforderungen an die Kurzbeschreibung:
- **Klarheit**: Die Kurzbeschreibung sollte den Zweck und den Inhalt des Datensatzes auf den Punkt bringen.
  *Beispiel*: „Daten über die jährliche Niederschlagsmenge in Deutschland von 2000 bis 2020.“

- **Prägnanz**: Halten Sie die Kurzbeschreibung so kurz wie möglich, aber so lang wie nötig. **Die maximale Länge beträgt 500 Zeichen.**

- **Relevante Informationen**: Geben Sie an, welche Art von Daten enthalten sind (z. B. geographische Informationen, zeitliche Abdeckung, Auflösung). Vermeiden Sie zu viele technische Details.

#### Hinweise:
- Die Kurzbeschreibung wird häufig zusammen mit dem Titel angezeigt und sollte diesen ergänzen, ohne redundant zu sein.
- Verwenden Sie keine zu detaillierten oder spezifischen Informationen. Das Feld „Abstract“ soll eher einen schnellen Überblick bieten.

#### Beispiele für gültige Kurzbeschreibungen:
- **Geodaten**: „Daten zum Straßenverkehr in Berlin, mit monatlichen Zählungen der Fahrzeugdichte.“
- **Satellitendaten**: „Klimadaten basierend auf Satellitenmessungen, einschließlich Temperatur- und Luftfeuchtigkeitswerten.“
- **Fernerkundung**: „Radar-Daten der Küstenregionen in Nordamerika zur Analyse von Hochwasserereignissen.“

#### Zusätzliche Informationen:
Für detailliertere Beschreibungen und zur Erfüllung von Metadatenstandards siehe auch die <a href="https://www.iso.org/standard/53798.html" target="_blank">ISO 19115 Normen</a> (englisch).
    `,
    'isoMetadata.keywords': `
## Schlagwörter

Im Feld **"Schlagwörter"** können thematische Begriffe angegeben werden, die den Inhalt des Datenbestands präzise beschreiben. Diese Schlagwörter erleichtern das Auffinden des Datensatzes über Suchfunktionen und tragen zur besseren Kategorisierung bei.

#### Anforderungen an die Schlagwörter:
- **Relevanz**: Wählen Sie Begriffe, die den Kerninhalt des Datenbestands treffend beschreiben.
- **Verfügbarkeit**: Die Schlagwörter müssen aus dem kontrollierten Vokabular von <a href="https://sns.uba.de/umthes/de.html" target="_blank">UMTHES</a> ausgewählt werden.
- **Konsistenz**: Vermeiden Sie Begriffe, die Synonyme oder sehr ähnliche Bedeutungen haben, um Redundanz zu vermeiden.

#### Hinweise zur Eingabe:
- Beginnen Sie mit der Eingabe eines Begriffs, um Vorschläge aus dem UMTHES-Thesaurus zu erhalten.
- Wählen Sie möglichst spezifische Begriffe, um die Aussagekraft der Schlagwörter zu erhöhen.
- Es können mehrere Schlagwörter ausgewählt werden, die durch den Thesaurus miteinander verknüpft sind.

#### Beispiele für Schlagwörter:
- Für einen Datensatz zur Luftqualität könnten Schlagwörter wie „Luftverschmutzung“, „Feinstaub“ oder „Stickstoffdioxid“ verwendet werden.
- Ein Datensatz zu Klimadaten könnte Begriffe wie „Klimawandel“, „Temperatur“ oder „Niederschlag“ enthalten.

#### Zusätzliche Informationen:
- Die Schlagwörter sind ein zentraler Bestandteil der Metadaten gemäß <a href="https://www.iso.org/standard/53798.html" target="_blank">ISO 19115 Normen</a>.

> *Tipp*: Die Qualität der Schlagwörter hat direkten Einfluss auf die Auffindbarkeit Ihres Datensatzes – wählen Sie diese daher mit Bedacht.
    `
  } satisfies FormHelp;
}
