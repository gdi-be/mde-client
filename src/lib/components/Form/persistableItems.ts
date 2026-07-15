export type PersistableField<T> = {
  key: keyof T;
  isValid: (item: T) => boolean;
};

export function getPersistableItems<T extends { id: string }>(
  items: T[],
  previousItems: T[],
  fields: PersistableField<T>[]
) {
  return items.map((item) => {
    const previous = previousItems.find((entry) => entry.id === item.id);
    const next: Partial<T> = { id: item.id } as Partial<T>;

    fields.forEach(({ key, isValid }) => {
      if (isValid(item)) {
        next[key] = item[key];
        return;
      }

      if (previous?.[key] !== undefined) {
        next[key] = previous[key];
      }
    });

    return next as T;
  });
}

export async function persistItems<T extends { id: string }>(
  items: T[],
  previousItems: T[],
  fields: PersistableField<T>[],
  persist: (items: T[]) => Promise<Response>,
  prepare: (items: T[]) => T[] = (items) => items
) {
  const persistableItems = prepare(getPersistableItems(items, previousItems, fields));
  const response = await persist(persistableItems);

  return {
    response,
    persistableItems
  };
}
