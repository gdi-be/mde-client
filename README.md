# Webclient for the GDI-Berlin Metadateneditor

---

The client uses `bun` as a JavaScript runtime. In most cases this can be
replaced with `npm` if `bun` does not work as expected.

---

## Getting Started

In most usecases you don't want to run this client on its own, but rather use it the podman environment
provided by the [mde-deployment](https://github.com/gdi-be/mde-deployment).

The client is not guaranteed to work without the podman environment as it heavily relies on the other services
provided by the deployment: **NGINX**, **Keycloak**, **Backend**.

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

Check the type definitions with:

```bash
bun run check
```

Check the code style with:

```bash
bun run lint
```

Fix the code style with:

```bash
bun run format
```

## Testing

To run the test execute.

```bash
bun test
```

## Building

The build process is based on docker and will automatically be started when the corresponding github action is triggered.

To create a production version of your app:

```bash
bun run build
```

You can preview the production build with `bun run preview`.
