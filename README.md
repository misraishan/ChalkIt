# [ChalkIt](https://beta.chalkit.io)

ChalkIt is a modern web-based Markdown editor. It provides a collaborative editing environment with extensible markup, powered by [Milkdown](https://milkdown.dev), a framework for building markdown editors.

## Reason for Creation
For classes at University, I needed something collaborative and free, without much bulk and could take notes in markdown. Google Docs isn't great for math or code, and Notion just has too much. Obsidian is great, but collaboration is 10$/mo. As an excuse to dive into NextJS, I decided to make ChalkIt as a free alternative.

## Features
- Collaborative editing: Work on documents with others in real-time.
- Extensible markup: Customize your markdown to suit your needs.
- Modern design: A clean and intuitive user interface, using design principles from Neumorphic Design.
- Virtualized file system: Organize your documents in folders.
- Modern web technologies: Built with the latest and greatest web technologies.

## Technologies Used

- [Next.js](https://nextjs.org): A React framework for building modern web applications.
- [NextAuth.js](https://next-auth.js.org): A complete open source authentication solution for Next.js applications.
- [Prisma](https://prisma.io): An open-source database toolkit.
- [Tailwind CSS](https://tailwindcss.com): A utility-first CSS framework for rapidly building custom user interfaces.
- [tRPC](https://trpc.io): A framework for building typesafe APIs.
- [DaisyUI](https://daisyui.com): A plugin for Tailwind CSS that adds beautiful UI components.
- [Milkdown](https://milkdown.dev): A plugin-based markdown editor framework.

## Getting Started

1. Clone the repository.
2. Install the dependencies with `npm install`.
3. Start the development server with `npm run dev`.
4. Initalize the database with `npx prisma migrate dev`.
6. Visit `http://localhost:3000` in your browser.

## Building

To build the project, run `npm run build`.

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the root of the project and add the following variables:
| Variable Name | Description |
| ------------- | ----------- |
| DATABASE_URL    | Location of the database (default is sqlite) |
| NEXTAUTH_URL    | URL of the NextAuth server (default is localhost:3000) |
| NEXT_PUBLIC_URL    | URL of the NextJS server (default is localhost:3000) |
| DISCORD_CLIENT_ID | Discord OAuth client ID |
| DISCORD_CLIENT_SECRET | Discord OAuth client secret |
| GITHUB_CLIENT_ID | GitHub OAuth client ID |
| GITHUB_CLIENT_SECRET | GitHub OAuth client secret |

A `.env.local` file is required for image storage via [ImageKit](https://imagekit.io). Add the following variables:
| Variable Name | Description |
| ------------- | ----------- |
| IMAGEKIT_PUBLIC_KEY | ImageKit public key |
| IMAGEKIT_PRIVATE_KEY | ImageKit private key |
| IMAGEKIT_URL_ENDPOINT | ImageKit URL endpoint |

Why isn't it all in one file? I honestly don't know.

## Good to know

Honestly, going Upstash/persistant Redis to store all the notes wasn't a great idea. While the added speed is nice, going back I would instead only load notes into Redis from Mongo or Postgres when they are opened/actively being edited. Relying on a persistant Redis instance for all notes is a bit much, and kind of goes against the point of Redis being a cache.

The main URL is `https://beta.chalkit.io` and is hosted through Vercel. At the moment, while the site is live, it is non-functional as the databse itself isn't hosted for writing. PlanetScale recently deprecated their free tier, and I'm yet to look into alternatives.

## Contributing

Contributions are welcome! Please read our contributing guide for more information.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the LICENSE file for more information.