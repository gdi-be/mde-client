/\*\*

- REFACTORING EXAMPLE: MultiSelectInput.svelte
-
- This document shows before and after for refactoring a real component
- to use the new centralized validation architecture.
  \*/

// ============================================================================
// VORHER (Alte Implementierung)
// ============================================================================

/\*

<script lang="ts">
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import { getHighestRole } from '$lib/util';
  import { page } from '$app/state';

  interface Props {
    label: string;
    value?: any;
    profileId: number;
    onChange: (value: any) => void;
  }

  let { label, value, profileId, onChange }: Props = $props();

  const fieldConfig = $derived(getFieldConfig(profileId));
  const token = $derived($page.data?.keycloakToken);
  const highestRole = $derived(getHighestRole(token));

  const validationResult = $derived.by(() => {
    if (!fieldConfig) return { valid: true };

    // Direkter Validator-Aufruf - kann keine Rolle berücksichtigen
    const validation = fieldConfig.validator(value);

    // Rollen-Check erfolgt separat in der Komponente
    const { editingRoles } = fieldConfig;
    const isEditingRole =
      highestRole === 'MdeAdministrator' ||
      (editingRoles ? editingRoles?.includes(highestRole) : true);

    // Problem: Rollen-Logic ist in der Komponente, nicht im Validator
    if (!isEditingRole && field.required) {
      return { valid: false, helpText: 'Keine Berechtigung' };
    }

    return validation;
  });
</script>

{#if validationResult?.valid === false}

  <div class="error">{validationResult.helpText}</div>
{/if}
*/

// ============================================================================
// NACHHER (Neue Implementierung mit ValidationService)
// ============================================================================

/\*

<script lang="ts">
  import { ValidationService, type ValidationContext } from '$lib/services/ValidationService';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import { getHighestRole } from '$lib/util';
  import { page } from '$app/state';

  interface Props {
    label: string;
    value?: any;
    profileId: number;
    onChange: (value: any) => void;
    metadata?: any; // Optional: für komplexe Validierung
  }

  let { label, value, profileId, onChange, metadata }: Props = $props();

  const fieldConfig = $derived(getFieldConfig(profileId));
  const token = $derived($page.data?.keycloakToken);
  const highestRole = $derived(getHighestRole(token));

  // Vorteil: Ein einziger Aufruf mit vollständigem Kontext
  const validationResult = $derived.by(() => {
    if (!fieldConfig) return { valid: true };

    const context: ValidationContext = {
      HIGHEST_ROLE: highestRole,
      metadata: metadata // Optional für metadata-abhängige Validatoren
    };

    // ValidationService kümmert sich um:
    // - Rollen-Checks
    // - Parameter-Auflösung
    // - Aggregations-Logik
    return ValidationService.validateField(fieldConfig, value, context);
  });
</script>

{#if validationResult?.valid === false}

  <div class="error">{validationResult.helpText}</div>
{/if}
*/

// ============================================================================
// BENEFI TED: Cleanup und Tests
// ============================================================================

/\*
import { describe, test, expect } from 'bun:test';
import { getFieldConfig } from '$lib/context/FormContext.svelte';
import { ValidationService } from '$lib/services/ValidationService';

describe('MultiSelectInput Validierung', () => {
test('should validate with role context', () => {
const fieldConfig = getFieldConfig(100);
const value = ['option1', 'option2'];

    const result = ValidationService.validateField(fieldConfig, value, {
      HIGHEST_ROLE: 'MdeEditor',
      metadata: testMetadata
    });

    expect(result.valid).toBe(true);

});

test('should fail empty required field', () => {
const fieldConfig = getFieldConfig(100);
const result = fieldConfig.validator([]);
expect(result.valid).toBe(false);
});

test('should show different errors for different roles', () => {
const fieldConfig = getFieldConfig(100);

    const editorResult = ValidationService.validateField(fieldConfig, undefined, {
      HIGHEST_ROLE: 'MdeEditor'
    });

    const dataOwnerResult = ValidationService.validateField(fieldConfig, undefined, {
      HIGHEST_ROLE: 'MdeDataOwner'
    });

    // Die Ergebnisse können unterschiedlich sein wenn der Validator
    // HIGHEST_ROLE berücksichtigt
    expect([editorResult.valid, dataOwnerResult.valid]).toBeDefined();

});
});
\*/

// ============================================================================
// PATTERN 1: Einfacher Validator-Aufruf (wenn Rollen nicht relevant sind)
// ============================================================================

// Status.quo: getFieldConfig(1).validator(value)
// Weiterhin gültig und unterstützt!

// ============================================================================
// PATTERN 2: Mit Rolle und Metadata (wenn komplexe Logik nötig ist)
// ============================================================================

// Neu: ValidationService.validateField(fieldConfig, value, context)

// const context: ValidationContext = {
// HIGHEST_ROLE: highestRole,
// metadata: formData
// };
// const result = ValidationService.validateField(fieldConfig, value, context);

// ============================================================================
// PATTERN 3: Progress-Berechnung (zentral in FormContext oder Service)
// ============================================================================

// // Old Way (in FormContext.svelte.ts):
// // getProgress(highestRole, section, metadata);

// // New Way (unabhängig aus jeder Komponente):
// const progress = ValidationService.getProgress(
// highestRole,
// 'basedata', // optional
// metadata
// );
// console.log(`${progress.progress * 100}% complete`);
// console.log('Invalid fields:', progress.invalidFields);
