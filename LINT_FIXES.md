# Lint-Fehler Behebungsanleitung

Stand: 25. Februar 2026
Gesamt: **88 Fehler**

## Übersicht nach Kategorie

| Kategorie                              | Anzahl | Schwierigkeit |
| -------------------------------------- | ------ | ------------- |
| `svelte/require-each-key`              | 34     | Einfach       |
| `svelte/prefer-writable-derived`       | 19     | Mittel        |
| `svelte/no-navigation-without-resolve` | 19     | Einfach       |
| `preserve-caught-error`                | 5      | Einfach       |
| Parsing errors                         | 5      | Komplex       |
| `no-useless-assignment`                | 2      | Einfach       |
| `svelte/prefer-svelte-reactivity`      | 1      | Mittel        |

---

## 1. preserve-caught-error (5 Fehler)

### Problem

Fehler werden neu geworfen ohne den ursprünglichen Fehler als `cause` anzuhängen.

### Lösung

Beim Werfen eines neuen Fehlers das `{ cause: error }` Objekt als zweites Argument übergeben.

**Vorher:**

```typescript
try {
  // code
} catch (error) {
  throw new Error('Something went wrong');
}
```

**Nachher:**

```typescript
try {
  // code
} catch (error) {
  throw new Error('Something went wrong', { cause: error });
}
```

### Betroffene Dateien

#### `src/lib/api/metadata.ts` (Zeile 27)

```typescript
// Kontext finden und das throw statement mit { cause: error } erweitern
```

#### `src/lib/auth/keycloak.ts` (Zeile 25)

```typescript
// Kontext finden und das throw statement mit { cause: error } erweitern
```

#### `src/lib/i18n/index.ts` (Zeile 30)

```typescript
// Kontext finden und das throw statement mit { cause: error } erweitern
```

#### `src/lib/util.ts` (Zeilen 100 und 125)

```typescript
// Zwei throw statements mit { cause: error } erweitern
```

---

## 2. svelte/require-each-key (34 Fehler)

### Problem

Each-Blöcke benötigen einen eindeutigen Key für optimales Rendering und Vermeidung von Bugs.

### Lösung

Key in Klammern nach dem Element hinzufügen: `{#each items as item (item.id)}`

**Vorher:**

```svelte
{#each items as item}
  <div>{item.name}</div>
{/each}
```

**Nachher:**

```svelte
{#each items as item (item.id)}
  <div>{item.name}</div>
{/each}
```

### Betroffene Dateien

- `src/lib/components/AssignmentDialog.svelte` - Zeilen 197, 233
- `src/lib/components/Breadcrumbs.svelte` - Zeile 33
- `src/lib/components/Form/CommentsPanel.svelte` - Zeile 138
- `src/lib/components/Form/Field/18_ExtentField.svelte` - Zeile 153
- `src/lib/components/Form/Field/32_Lineage.svelte` - Zeile 247
- `src/lib/components/Form/Form.svelte` - Zeile 136
- `src/lib/components/Form/Inputs/RadioInput.svelte` - Zeile 52
- `src/lib/components/Form/Inputs/SelectInput.svelte` - Zeile 64
- `src/lib/components/Form/PublishDialog.svelte` - Zeile 117
- `src/lib/components/Form/ValidationDialog.svelte` - Zeilen 151, 152, 155, 173, 174, 177, 195, 196, 199, 222
- `src/lib/components/Form/service/40_ServicesSection.svelte` - Zeile 178
- `src/lib/components/Form/service/48_LayersForm.svelte` - Zeile 133
- `src/lib/components/Form/service/56_FeatureTypeForm.svelte` - Zeile 132
- `src/lib/components/Form/service/63_ColumnsForm.svelte` - Zeile 123
- `src/lib/components/MetadataSearchField.svelte` - Zeile 76
- `src/lib/components/ReadOnly/DisplayFieldSnippets.svelte` - Zeilen 212, 391, 419, 457, 558, 579, 611

**Tipp:** Bei Arrays ohne eindeutige ID kannst du den Index verwenden: `{#each items as item, i (i)}`, aber das ist nicht optimal wenn sich die Reihenfolge ändern kann.

---

## 3. svelte/no-navigation-without-resolve (19 Fehler)

### Problem

Navigation mit `goto()` oder `href` sollte `resolve()` verwenden, um Pfade relativ zur Basis-URL aufzulösen.

### Lösung für goto()

**Vorher:**

```typescript
import { goto } from '$app/navigation';
goto('/some-path');
```

**Nachher:**

```typescript
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
goto(resolve('/some-path'));
```

**WICHTIG:** `goto()` funktioniert auch mit Strings, aber der Linter bevorzugt `resolve()` für Konsistenz.

### Lösung für href

**Vorher:**

```svelte
<a href="/some-path">Link</a>
```

**Nachher:**

```svelte
<script>
  import { resolve } from '$app/paths';
</script>

<a href={resolve('/some-path')}>Link</a>
```

### Betroffene Dateien

#### goto() Aufrufe:

- `src/lib/i18n/changeLocale.ts` - Zeile 6
- `src/lib/components/Form/Form.svelte` - Zeile 105
- `src/lib/components/Overview/MetadataCard.svelte` - Zeilen 80, 89, 93, 97, 101
- `src/lib/components/Overview/MetadataToolbar.svelte` - Zeile 17
- `src/lib/components/Overview/Pagination.svelte` - Zeilen 30, 39
- `src/lib/components/Overview/SearchPagination.svelte` - Zeilen 29, 36
- `src/lib/components/Overview/StatusFilterField.svelte` - Zeile 23
- `src/lib/components/Overview/TextFilterField.svelte` - Zeile 19
- `src/routes/+page.svelte` - Zeile 11

#### href Links:

- `src/lib/components/Breadcrumbs.svelte` - Zeilen 31, 38
- `src/lib/components/Form/PublishDialog.svelte` - Zeile 122
- `src/lib/components/ValidationPopup.svelte` - Zeile 37
- `src/lib/components/Welcome.svelte` - Zeile 22

---

## 4. svelte/prefer-writable-derived (19 Fehler)

### Problem

Das Pattern `$state` + `$effect` sollte durch writable `$derived` ersetzt werden (Svelte 5 Best Practice).

### Lösung

**Vorher:**

```typescript
let derivedValue = $state(initialValue);

$effect(() => {
  derivedValue = computeValue(sourceValue);
});
```

**Nachher:**

```typescript
let derivedValue = $derived.by(() => computeValue(sourceValue));
```

Oder für einfache Ableitungen:

```typescript
let derivedValue = $derived(sourceValue * 2);
```

### Betroffene Dateien

Alle Field-Komponenten mit diesem Pattern:

- `src/lib/components/Form/Field/01_TitleField.svelte` - Zeile 13
- `src/lib/components/Form/Field/02_DescriptionField.svelte` - Zeile 14
- `src/lib/components/Form/Field/04_PrivacyField.svelte` - Zeile 18
- `src/lib/components/Form/Field/05_MetadataProfileField.svelte` - Zeile 33
- `src/lib/components/Form/Field/06_HighValueDatasetField.svelte` - Zeilen 21, 26
- `src/lib/components/Form/Field/07_AnnexThemeField.svelte` - Zeile 32
- `src/lib/components/Form/Field/14_MaintenanceFrequencyField.svelte` - Zeile 32
- `src/lib/components/Form/Field/15_KeywordsField.svelte` - Zeile 26
- `src/lib/components/Form/Field/16_DeliveredCoordinateSystemField.svelte` - Zeile 14
- `src/lib/components/Form/Field/17_CoordinateSystemField.svelte` - Zeile 22
- `src/lib/components/Form/Field/26_TermsOfUseSourceField.svelte` - Zeile 17
- `src/lib/components/Form/Field/29_PreviewField.svelte` - Zeile 14
- `src/lib/components/Form/Field/37_QualityReportCheckField.svelte` - Zeile 30
- `src/lib/components/Form/Field/38_InspireAnnexVersionField.svelte` - Zeile 27
- `src/lib/components/Form/Field/39_SpatialRepresentationField.svelte` - Zeile 19
- `src/lib/components/Form/Field/70_InspireFormatName.svelte` - Zeile 39
- `src/lib/components/Form/FormFooter.svelte` - Zeilen 40, 41, 42
- `src/lib/components/Form/service/48_LayersForm.svelte` - Zeile 43
- `src/lib/components/Form/service/56_FeatureTypeForm.svelte` - Zeile 39
- `src/lib/components/Form/service/63_ColumnsForm.svelte` - Zeile 38

**Hinweis:** Prüfe jeden Fall einzeln, ob die Logik wirklich eine einfache Ableitung ist oder ob komplexere Seiteneffekte vorliegen.

---

## 5. no-useless-assignment (2 Fehler)

### Problem

Variablen werden Werte zugewiesen, die danach nicht verwendet werden.

### Lösung

Entferne die Zuweisung oder verwende den Wert.

### Betroffene Dateien

#### `src/lib/components/Form/Inputs/MultiSelectInput.svelte` (Zeile 65)

```typescript
// Finde die Zuweisung und prüfe, ob sie benötigt wird
// Falls nicht: entfernen
// Falls doch: verwenden
```

#### `src/lib/services/MetadataUpdateService.ts` (Zeile 475)

```typescript
// Finde die Zuweisung und prüfe, ob sie benötigt wird
// Falls nicht: entfernen
// Falls doch: verwenden
```

---

## 6. svelte/prefer-svelte-reactivity (1 Fehler)

### Problem

Die native `Set`-Klasse ist nicht reaktiv in Svelte. Verwende `SvelteSet` stattdessen.

### Lösung

**Vorher:**

```typescript
let mySet = new Set<string>();
```

**Nachher:**

```typescript
import { SvelteSet } from 'svelte/reactivity';

let mySet = new SvelteSet<string>();
```

### Betroffene Datei

#### `src/lib/components/Form/service/40_ServicesSection.svelte` (Zeile 53)

```typescript
// Importiere SvelteSet und ersetze die Set-Instanz
```

---

## 7. Parsing Errors (5 Fehler)

### Problem

ESLint kann die Svelte 5 Rune-Syntax in `.svelte.ts` Dateien nicht parsen.

### Mögliche Lösungen

#### Option 1: ESLint-Konfiguration anpassen

Prüfe ob `eslint-plugin-svelte` korrekt für Svelte 5 konfiguriert ist.

In `eslint.config.js`:

```javascript
import svelteParser from 'svelte-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.svelte.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        project: './tsconfig.json'
      }
    }
  }
  // ... rest of config
];
```

#### Option 2: Dateien temporär von Linting ausschließen

In `eslint.config.js`:

```javascript
export default [
  {
    ignores: ['**/*.svelte.ts']
  }
  // ... rest of config
];
```

### Betroffene Dateien

- `src/lib/context/FormContext.svelte.ts` - Zeile 2
- `src/lib/context/PopConfirmContext.svelte.ts` - Zeile 5
- `src/lib/context/ServerEventContext.svelte.ts` - Zeile 7
- `src/lib/context/StatusesContext.svelte.ts` - Zeile 2
- `src/lib/context/TokenContext.svelte.ts` - Zeile 2

**Hinweis:** Dies könnte ein Bug in der aktuellen Version von `eslint-plugin-svelte` sein. Prüfe auf Updates.

---

## Empfohlene Reihenfolge

1. **Parsing Errors zuerst beheben** - ESLint-Konfiguration anpassen
2. **preserve-caught-error** - Schnell und einfach (5 Dateien)
3. **svelte/require-each-key** - Repetitiv aber einfach (34 Stellen)
4. **svelte/no-navigation-without-resolve** - Import hinzufügen + resolve() wrappen (19 Stellen)
5. **no-useless-assignment** - Prüfen und entfernen (2 Stellen)
6. **svelte/prefer-svelte-reactivity** - SvelteSet verwenden (1 Stelle)
7. **svelte/prefer-writable-derived** - Komplex, jede Stelle einzeln prüfen (19 Dateien)

---

## Testing nach Änderungen

Nach jeder Änderung:

```bash
bun run lint
bun run check
bun test
```

## Nützliche Befehle

```bash
# Lint-Fehler anzeigen
bun run lint

# TypeScript-Fehler prüfen
bun run check

# Automatisches Formatting
bun run format

# Tests ausführen
bun test
```
