import type { VisibilityCondition } from "../models/form";

export function isVisible(values: Record<string, unknown> = {}, condition?: VisibilityCondition, ): boolean {
  if (!condition) return true;
  const [key, operator, value] = condition.split(' ');
  const actualValue = values[key];

  if (operator === '==') {
    return actualValue === value;
  }
  if (operator === '!=') {
    return actualValue !== value;
  }
  if (operator === undefined) {
    return !!actualValue;
  }

  throw new Error('Invalid form configuration. Operator in visibilityCondition not supported: ' + operator);

};

export function getValueFromMetadata(metadata: Record<string, unknown> | undefined, key: string): unknown {
  if (!metadata) return undefined;
  return key
    .split('.')
    .reduce((obj, k) => {
      return (obj && obj[k] !== undefined) ? obj[k] : undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, metadata as Record<string, any>);
}
