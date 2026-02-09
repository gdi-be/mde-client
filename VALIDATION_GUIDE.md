# Validierungs-Architektur und Implementierungsanleitung

## Überblick

Die Validierungs-Architektur besteht aus drei Hauptkomponenten:

1. **ValidationService** (`src/lib/services/ValidationService.ts`): Zentrale Service für Validierungslogik
2. **ValidatorHelpers** (`src/lib/services/ValidatorHelpers.ts`): Wiederverwendbare Validator-Funktionen
3. **FieldsConfig** (`src/lib/components/Form/FieldsConfig.ts`): Feld-Konfigurationen mit Validatoren

## Architektur-Übersicht

```
┌─────────────────────────────────────────┐
│   Svelte Components (Form, Inputs)      │
│   - Kleine, fokussierte Validierung     │
│   - Kurze getFieldConfig() Aufrufe      │
└────────────┬────────────────────────────┘
             │
             │ Nutzt
             ▼
┌─────────────────────────────────────────┐
│   ValidationService (zentral)           │
│   - Role-basierte Validierung           │
│   - Progress-Berechnung                 │
│   - Parameter-Auflösung                 │
│   - Aggregations-Logik                  │
└────────────┬────────────────────────────┘
             │
             │ Nutzt
             ▼
┌─────────────────────────────────────────┐
│   FieldsConfig + ValidatorHelpers       │
│   - Validator-Definitionen              │
│   - Wiederverwendbare Helper            │
└─────────────────────────────────────────┘
```

## Verwendung in Komponenten

### Standard: Einfaches Validator-Aufrufen

```typescript
// In einer Svelte-Komponente
import { getFieldConfig } from '$lib/context/FormContext.svelte';

const fieldConfig = getFieldConfig(1); // profileId
const value = 'Benutzereingabe';

// Einfacher Validator-Aufruf
const result = fieldConfig.validator(value);
if (!result.valid) {
  console.log(result.helpText);
}
```

### Erweitertes: Mit ValidationService und Rollen

```typescript
import { ValidationService } from '$lib/services/ValidationService';
import { getFieldConfig } from '$lib/context/FormContext.svelte';
import type { ValidationContext } from '$lib/services/ValidationService';

const fieldConfig = getFieldConfig(1);
const value = 'Benutzereingabe';
const highestRole = 'MdeEditor';
const metadata = /* ... */;

// Mit HIGHEST_ROLE und Metadata-Kontext
const context: ValidationContext = {
  HIGHEST_ROLE: highestRole,
  metadata: metadata
};

const result = ValidationService.validateField(fieldConfig, value, context);
if (!result.valid) {
  console.log(result.helpText);
}
```

### Progress-Berechnung (FormContext)

```typescript
import { ValidationService } from '$lib/services/ValidationService';
import type { MetadataCollection } from '$lib/models/metadata';

const metadata: MetadataCollection = /* ... */;
const highestRole = 'MdeEditor';

// Gesamt-Progress
const progress = ValidationService.getProgress(highestRole, undefined, metadata);
console.log(`Progress: ${Math.round(progress.progress * 100)}%`);
console.log('Ungültige Felder:', progress.invalidFields);

// Progress für eine bestimmte Section
const sectionProgress = ValidationService.getProgress(
  highestRole,
  'basedata',
  metadata
);
```

## ValidatorHelpers - Wiederverwendbare Funktionen

### Built-in Helpers

```typescript
import {
  isDefined,
  requiredValidator,
  emailValidator,
  maxLengthValidator,
  minArrayLengthValidator,
  compositeValidator,
  customValidator,
  formatDate,
  roleBasedValidator
} from '$lib/services/ValidatorHelpers';

// Beispiel 1: Einfacher Required Validator
const validator1 = requiredValidator('Dieses Feld ist erforderlich');
validator1('value'); // { valid: true }
validator1(undefined); // { valid: false, helpText: '...' }

// Beispiel 2: Email Validierung
const result = emailValidator('test@example.com');
// { valid: true }

// Beispiel 3: Längen-Validierung
const maxLenValidator = maxLengthValidator(250);
maxLenValidator('ein langer text'); // { valid: true oder false }

// Beispiel 4: Rollen-basierte Validierung
const roleValidator = roleBasedValidator(
  ['MdeEditor', 'MdeAdministrator'],
  'MdeEditor',
  'Nur für Editoren erforderlich'
);
roleValidator('value'); // { valid: true }

// Beispiel 5: Composite Validators
const validator5 = compositeValidator([
  requiredValidator('Field required'),
  maxLengthValidator(100)
]);
validator5('valid'); // { valid: true }
validator5(''); // { valid: false, helpText: 'Field required' }
validator5('too many chars...'); // { valid: false, helpText: '...' }

// Beispiel 6: Custom Validator
const customVal = customValidator(
  (val) => val && val.length > 5,
  'Mindestens 6 Zeichen erforderlich'
);
customVal('hello'); // { valid: false }
customVal('hello world'); // { valid: true }
```

## Neue Validator in FieldsConfig schreiben

### Mit extraParams und HIGHEST_ROLE

```typescript
// In FieldsConfig.ts
{
  profileId: 100,
  key: 'isoMetadata.customField',
  section: 'basedata',
  required: true,
  editingRoles: ['MdeEditor', 'MdeAdministrator'],
  extraParams: ['HIGHEST_ROLE', 'isoMetadata.title'],
  validator: (val: any, extraParams) => {
    const highestRole = extraParams?.['HIGHEST_ROLE'];
    const title = extraParams?.['isoMetadata.title'];

    // Nur für Editor erforderlich, wenn Titel länger als 50 Zeichen
    if (highestRole === 'MdeEditor' && title?.length > 50) {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Dieses Feld ist für lange Titel erforderlich'
        };
      }
    }

    return { valid: true };
  }
}
```

### Mit PARENT_VALUE für Collection Items

```typescript
{
  profileId: 62,
  key: 'isoMetadata.services.featureTypes.name',
  section: 'services',
  required: true,
  collectionKey: 'isoMetadata.services.featureTypes',
  extraParams: ['PARENT_VALUE'],
  validator: (val: string, extraParams) => {
    const featureType = extraParams?.['PARENT_VALUE'];

    // Custom Logik basierend auf Parent-Objekt
    if (!isDefined(val)) {
      return {
        valid: false,
        helpText: 'Feature Type Name ist erforderlich'
      };
    }

    // Naming Convention Check
    if (!/^[a-zA-Z0-9_]+$/.test(val)) {
      return {
        valid: false,
        helpText: 'Nur Alphanumerisch und Unterstrich erlaubt'
      };
    }

    return { valid: true };
  }
}
```

## FormContext Integration

FormContext.svelte.ts bietet Getter-Funktionen für Formulardaten:

```typescript
import { getFormContext } from '$lib/context/FormContext.svelte';

const {
  getValue, // Einzelnen Wert abrufen
  getAllValues, // Alle Werte aus Collection abrufen
  getProgress, // Progress berechnen (auch in ValidationService)
  clearActiveHelp,
  toggleActiveHelp
} = getFormContext();

// Beispiel
const title = getValue<string>('isoMetadata.title');
const allServiceTitles = getAllValues<string>('isoMetadata.services.title');
```

## Häufige Validierungs-Muster

### Konditionale Validierung

```typescript
import { conditionalValidator } from '$lib/services/ValidatorHelpers';

// Validiere nur wenn Bedingung erfüllt
const validator = conditionalValidator(
  isHighValueDataset === true,
  'Kategorie ist für HVD erforderlich'
);
validator(value); // Validiert nur wenn konditional true
```

### Datum-Bereichs-Validierung

```typescript
import { dateRangeValidator } from '$lib/services/ValidatorHelpers';

const result = dateRangeValidator('2024-01-01', '2024-12-31');
// { valid: true }

const result2 = dateRangeValidator('2024-12-31', '2024-01-01');
// { valid: false, helpText: 'Das Startdatum muss vor dem Enddatum liegen.' }
```

### Array-Längen-Validierung

```typescript
import { minArrayLengthValidator } from '$lib/services/ValidatorHelpers';

const validator = minArrayLengthValidator(1, 'Mindestens ein Kontakt erforderlich');
validator([]); // { valid: false }
validator(['contact1']); // { valid: true }
```

## ValidationService API

```typescript
import { ValidationService, type ValidationContext } from '$lib/services/ValidationService';

// 1. getValue - Wert aus Metadata abrufen
const value = ValidationService.getValue<string>('isoMetadata.title', metadata);

// 2. getAllValues - Alle Werte aus Collection abrufen
const titles = ValidationService.getAllValues<string>('isoMetadata.services.title', metadata);

// 3. canEditField - Prüfen ob Rolle ein Feld bearbeiten darf
const canEdit = ValidationService.canEditField(highestRole, fieldConfig);

// 4. shouldValidateField - Prüfen ob Feld validiert werden soll
const shouldValidate = ValidationService.shouldValidateField(highestRole, fieldConfig);

// 5. getExtraParams - Parameter für Validator auflösen
const params = ValidationService.getExtraParams(fieldConfig, context);

// 6. validateField - Einzelnes Feld validieren
const result = ValidationService.validateField(fieldConfig, value, context);

// 7. getProgress - Progress berechnen
const progress = ValidationService.getProgress(highestRole, section, metadata);

// 8. allFieldsValid - Prüfen ob alle Felder gültig sind
const allValid = ValidationService.allFieldsValid(highestRole, metadata);
```

## Migrations-Anleitung für bestehende Validatoren

### Vorher (Direkter Validator-Aufruf)

```typescript
const fieldConfig = getFieldConfig(7);
const result = fieldConfig.validator(value);
```

### Nachher (Mit ValidationService und Role-Support)

```typescript
import { ValidationService } from '$lib/services/ValidationService';

const fieldConfig = getFieldConfig(7);
const result = ValidationService.validateField(fieldConfig, value, {
  HIGHEST_ROLE: highestRole,
  metadata: formMetadata
});
```

## Tests schreiben

### Unit Test für Validator

```typescript
import { describe, test, expect } from 'bun:test';
import { getFieldConfig } from '$lib/context/FormContext.svelte';
import { ValidationService } from '$lib/services/ValidationService';

describe('Field Validator', () => {
  test('should validate field with role context', () => {
    const fieldConfig = getFieldConfig(100);
    const result = ValidationService.validateField(fieldConfig, 'value', {
      HIGHEST_ROLE: 'MdeEditor',
      metadata: testMetadata
    });
    expect(result.valid).toBe(true);
  });

  test('should fail when required and empty', () => {
    const fieldConfig = getFieldConfig(1);
    const result = fieldConfig.validator(undefined);
    expect(result.valid).toBe(false);
    expect(result.helpText).toBeDefined();
  });
});
```

### Integration Test für Progress

```typescript
import { ValidationService } from '$lib/services/ValidationService';

test('should calculate correct progress', () => {
  const progress = ValidationService.getProgress('MdeEditor', undefined, metadata);
  expect(progress.progress).toBeGreaterThanOrEqual(0);
  expect(progress.progress).toBeLessThanOrEqual(1);
  expect(Array.isArray(progress.invalidFields)).toBe(true);
});
```

## Best Practices

1. **Validators einfach halten**: Nutze ValidatorHelpers für häufige Muster
2. **Rollen-Checks in Validatoren**: Nutze `HIGHEST_ROLE` statt separaten Checks
3. **Aussagekräftige Fehlermeldungen**: Stelle hilfreiche helpText Meldungen bereit
4. **Tests schreiben**: Für alle Validierungs-Logik, besonders bei komplexen Bedingungen
5. **ValidationService nutzen**: Für zentrale Progress-Berechnung und konsistente Validierung
6. **Komponenten schlank halten**: Validator-Aufrufe sollten kurz und fokussiert sein

## Troubleshooting

### Problem: ValidationService.validateField wirft Error

**Lösung**: Stelle sicher, dass `fieldConfig.validator` eine Funktion ist und `extraParams` den korrekten Typ hat.

```typescript
// Falsch
const params = { HIGHEST_ROLE: highestRole }; // fehlende metadata
const result = ValidationService.validateField(field, value, params);

// Richtig
const context: ValidationContext = {
  HIGHEST_ROLE: highestRole,
  metadata: metadata
};
const result = ValidationService.validateField(field, value, context);
```

### Problem: HIGHEST_ROLE wird nicht übergeben

**Lösung**: Stelle sicher dass `extraParams` im FieldConfig die Person 'HIGHEST_ROLE' enthält:

```typescript
{
  profileId: 1,
  key: 'field',
  extraParams: ['HIGHEST_ROLE'], // Muss hier sein!
  validator: (val, extraParams) => {
    const role = extraParams?.['HIGHEST_ROLE']; // Jetzt definiert
    // ...
  }
}
```

### Problem: getAllValues gibt leeres Array zurück

**Lösung**: Prüfe dass der Path richtig ist und die Collection im Metadata vorhanden ist:

```typescript
// Teste mit getValue/getAllValues
const serviceExists = ValidationService.getValue('isoMetadata.services', metadata);
if (serviceExists) {
  const titles = ValidationService.getAllValues('isoMetadata.services.title', metadata);
}
```
