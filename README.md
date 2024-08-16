![Banner Image](./.assets/banner.png)

<h1>BSE 205 - Elective Project</h1>

-   [The Stack](#the-stack)
-   [Building](#building)
-   [Project Structure](#project-structure)

# The Stack

I was aiming for a "_soydev_" stack, I think I've got it.

-   [SvelteKit](https://kit.svelte.dev)
-   [DrizzleORM](https://orm.drizzle.team/)
-   [Bun SQLite](https://bun.sh/docs/api/sqlite)
-   [@shadcn/ui (svelte port)](https://www.shadcn-svelte.com/)
-   [TailwindCSS](https://tailwindcss.com/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Bun](https://bun.sh)
-   [tRPC](https://trpc.io) (with [svelte-query](https://github.com/vishalbalaji/trpc-svelte-query-adapter))

# Building

To build this project you will need to install the following dependency programs on your machine:

-   [Bun](https://bun.sh) - https://bun.sh/

[Bun](https://bun.sh) is a Javascript runtime that is better suited to the task at hand than NodeJS seems to be, whilst remaining mostly compatible (or at least, compatible enough to run Vite).

Before running, building, or doing anything with this project, you will need to install it's dependencies, this can be done with:

```sh
bun install
```

You can start the application in development with Hot Module Reloading (HMR), and auto-restarting with:

```sh
bun run dev
```

If you'd like to create a production-ready build, run the following commands.

```sh
# Create static build, project is configured to build for bun
bun run build
# Run the build, should be done in a docker container
bun ./build/index.js
```

# Project Structure

```py
(project root)
├── src
│   ├── contrib
│   │   └── # code to establish a database
│   ├── lib
│   │   ├── components
│   │   │   └── # shadcn components
│   │   ├── crypto
│   │   │   └── # modules for handling cryptography
│   │   ├── drizzle.ts # database schemas
│   │   └── server
│   │       └── # server only modules
│   ├── routes
│   │   └── # application front-end structure
│   └── test
│       └── # automated tests for testing cryptography modules
├── drizzle
│   └── # database migration history
└── static
    └── # static assets
```
