/**
 * Replaces placeholders in the given template string with corresponding values from the provided object.
 *
 * Placeholders in the template should be in the format `{key}` where `key` matches a property in the `values` object.
 * If a key is not found in `values`, the placeholder is left unchanged.
 *
 * @example
 * interpolate('Hello, {name}!', { name: 'Alice' }) // returns 'Hello, Alice!'
 * interpolate('Your score: {score}', { score: '42' }) // returns 'Your score: 42'
 * interpolate('Missing {value}', {}) // returns 'Missing {value}'
 *
 * @param template - The string containing placeholders to be replaced.
 * @param values - An optional object mapping placeholder keys to their replacement values.
 * @returns The interpolated string with placeholders replaced by their corresponding values.
 */
const VARIABLE_PLACEHOLDER = /{(\w+)}/g;

export function interpolate(template: string, values?: Record<string, string | number>) {
  if (!values) return template;
  return template.replace(VARIABLE_PLACEHOLDER, (match, key) => (values[key] || match).toString());
}
