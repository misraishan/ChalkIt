# Create T3 App

The Markdown editor for the Modern Web.

## Schema

Much of the schema is done through [Prisma](https://prisma.io) and [NextAuth](https://next-auth.js.org). The schema and models are defined in `prisma/schema.prisma`. 

Aside from this MySQL/Postgres database, we also use [Redis](https://redis.io) for document storage. This project will be using [Upstash](https://upstash.com) for this, as it provides the speed of redis with persistence.

## Tooling

This project uses the [T3 stack](https://create.t3.gg/), which is a collection of libraries and tools that work together to make building web applications easier.

### Main Packages:
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [DaisyUI](https://daisyui.com)
- [TipTap](https://tiptap.dev)

## Deployment

For the MySQL side (authentication, folders, sessions, etc), we're using [Planetscale](https://planetscale.com) for the database. [Upstash](https://upstash.com) is used for quick document store from [TipTap](https://tiptap.dev).

The NextJS website will be deployed through [Vercel](https://vercel.com), at the domain https://chalkit.io.