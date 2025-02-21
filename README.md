# Webclient for the GDI-Berlin Metadateneditor

---

This documentation uses `bun` as a JavaScript runtime. In most cases this can be
replaced with `npm` if `bun` does not work as expected.

---

## Requirements

Install the required packages.

```bash
bun install
```

Generate an auth secret which encrypts tokens. [Learn more](https://authjs.dev/getting-started/deployment)

```bash
bunx auth secret
```

## Development

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

If typing gets messed up in your IDE you can regenerate them with:

```bash
bun run check
```

## Testing

To run the test execute.

```bash
bun test
```

Tests are run via the build in bun testsuite. There is a `test` script in the
package.json so using `npm run test` should also work aslong as bun is installed.

## Building

To create a production version of your app:

```bash
bun run build
```

You can preview the production build with `bun run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
