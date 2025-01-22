<script lang="ts">
  import { page } from "$app/state";
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import DateInput from "../Inputs/DateInput.svelte";
  import type { MaintenanceFrequency } from "$lib/models/metadata";

  const KEY = 'isoMetadata.modified';
  const LABEL = 'letzte Aktualisierung';

  const getLastUpdateValue = (published: string, maintenanceFrequency: MaintenanceFrequency) => {
    const publishedDate = new Date(published);
    const todayDate = new Date();
    let updateDate = new Date(published);

    function dayInYearIsGreater(dateA: Date, dateB: Date): boolean {
      const todayYearDay = dateB.getMonth() * 31 + dateB.getDate();
      const publishedYearDay = dateA.getMonth() * 31 + dateA.getDate();
      return todayYearDay > publishedYearDay;
    }

    function getLastUpdateDateMonthly(publishedDate: Date, cycleMonths: number) {
      const today = new Date();
      const diffInMonths = (today.getFullYear() - publishedDate.getFullYear()) * 12 + (today.getMonth() - publishedDate.getMonth());
      const cycles = Math.floor(diffInMonths / cycleMonths);

      const lastUpdate = new Date(publishedDate);
      lastUpdate.setMonth(lastUpdate.getMonth() + cycles * cycleMonths);
      return lastUpdate;
    }

    function getLastUpdateDateDaily(publishedDate: Date, days: number = 14) {
      const today = new Date();
      const diffInTime = today.getTime() - publishedDate.getTime();
      const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
      const cycles = Math.floor(diffInDays / days);

      const lastUpdate = new Date(publishedDate);
      lastUpdate.setDate(lastUpdate.getDate() + cycles * days);
      return lastUpdate;
    }

    switch (maintenanceFrequency) {
    case 'continual':
      updateDate = todayDate;
      break;
    case 'daily':
      updateDate = todayDate;
      updateDate.setDate(updateDate.getDate() - 1);
      break;
    case 'weekly':
      updateDate = todayDate;
      if (todayDate.getDay() > publishedDate.getDay()) {
        updateDate.setDate(todayDate.getDate() - (todayDate.getDay() - publishedDate.getDay()));
      } else {
        updateDate.setDate(todayDate.getDate() - (7 - (publishedDate.getDay() - todayDate.getDay())));
      }
      break;
    case 'fortnightly':
      updateDate = getLastUpdateDateDaily(publishedDate, 14);
      break;
    case 'monthly':
      updateDate = todayDate;
      if (todayDate.getDate() > publishedDate.getDate()) {
        updateDate.setDate(publishedDate.getDate());
      } else {
        updateDate.setMonth(updateDate.getMonth() - 1);
        updateDate.setDate(publishedDate.getDate());
      }
      break;
    case 'quarterly':
      updateDate = getLastUpdateDateMonthly(publishedDate, 3);
      break;
    case 'biannually':
      updateDate = getLastUpdateDateMonthly(publishedDate, 6);
      break;
    case 'annually':
      updateDate = publishedDate;
      if (dayInYearIsGreater(publishedDate, todayDate)) {
        updateDate.setFullYear(todayDate.getFullYear());
      } else {
        updateDate.setFullYear(todayDate.getFullYear() - 1);
      }
      break;
    case 'asNeeded':
    case 'irregular':
    case 'notPlanned':
    case 'unknown':
    default:
      return undefined;
    }
    return updateDate;
  };

  let initialValue = getValue<string>(KEY);
  let publishedValue = getValue<string>('isoMetadata.published');
  let maintenanceFrequencyValue = getValue<MaintenanceFrequency>('isoMetadata.maintenanceFrequency');

  if (initialValue) {
    initialValue = new Date(initialValue).toISOString().split('T')[0];
  } else if (publishedValue && maintenanceFrequencyValue) {
    const lastUpdateDate = getLastUpdateValue(publishedValue, maintenanceFrequencyValue);
    initialValue = lastUpdateDate?.toISOString().split('T')[0] || '';
  }

  let value = $state(initialValue || '');
  let showCheckmark = $state(false);

  const onBlur = async () => {
    // TODO check if value has changed
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: (new Date(value!)).toISOString()
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };
</script>

<div class="date-time-field">
  <Paper>
    <DateInput
      bind:value
      key={KEY}
      label={LABEL}
      onblur={onBlur}
      disabled={!!(publishedValue && maintenanceFrequencyValue)}
    />
  </Paper>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .date-time-field {
    position: relative;
    display: flex;
    gap: 1em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
