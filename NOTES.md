## File base routing system

## Functions

- Reusable components: button
- Database
- Authentication
- Sending friend request
- Seeing friend request
- Accepting friend request
- Real time chatting
- Route protection
- Loading state using skeleton effect

## Expecting Update and Bugs Fixing

- Add App Logo
- Add Demo
- Dashboard is a bit run-down
- Requester's friend list doesn't update in real time
- After user handles the request, the number of requests need to be decremented by 1

## Database: Upstash ( Redis Service Provider)

- Redis get data from the cache from the memory, it's store in a JavaScript constant
- Lots of people use Redis for caching, it's actually a fully fledged database that's super fast.
- Speed is vital for chat application, that's MySQL can't handle
- Login with Google, create a database
- npm i @upstash/redis
- db.ts in lib folder contains the setup for Redis

## Regarding Next.JS

- In Next.js all the components are server side components by default, server components don't have any interaction with users, meaning we can't use something like onClick etc.

- route.ts is mandatory, forced by next.js

- The reason we make components, cos we can implement client side functions in the server components such as onClick etc

- Compare with React, we use different route system, <Link />, <Image />, router.refresh(),

## Packages installed

```bash
npm i --save next-auth
# Next Auth
```

```bash
npm i class-variance-authority
# cva - Allows us to write classes that we can use wherever we render the button
```

```bash
npm i lucide-react
# Lucide - icons dependency
```

```bash
npm i clsx
# Conditional className
```

```bash
npm tailwind-merge
# Merge Tailwind CSS classes together for cleaner tailwind code
```

```bash
npm i react-hot-toast
# for toast notification
# Create Providers.tsx, wrap the whole application using <Providers></Providers>
```

```bash
npm i @tailwindcss/forms
# Tailwind CSS form package to make form look prettier
```

```bash
npm install react-hook-form @hookform/resolvers
# React Form
```

```bash
npm install react-textarea-autosize
# react-textarea-autosize to create textarea on the page
```

```bash
npm install date-fns
# date-fns to convert cryptic timestamp into readable time format
```

```bash
npm install pusher pusher-js
# [Pusher](https://pusher.com/) provides real time service
# pusher for server side, pusher-js for client side
# get pusher credentials from pusher.com to get started
```

```bash
npm install react-loading-skeleton
# React Loading Skeleton: implement a skeleton loading effect
```

```bash
npm i @headlessui/react
# Implement mobile interface for chatter
```

### Build a middleware

- Create a file: src/middleware.ts

### Wrapping up project

- npm run lint: to check and fix lint errors
- npm run build
