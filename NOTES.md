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

###### Helper in the Comments

At 2:18:00, the problem was not a caching issue. It was a syntax issue. There should be a ":" after email before interpolating the emailToAdd variable

@AMPxLEADER
@AMPxLEADER
2 months ago (edited)
Just finished watching the video. For some reason in production with Vercel the realtime functions are not working smooth. After I do something like sending a chat or friend request, I have to refresh the page of the user that just triggered an event so the other user's page is updated realtime. Like on the chat page, real time chats is not working and the second user does not see the live new msg. If I refresh the page, then the second user displays the new msg the first user sent without having to refresh their page. Any ideas why this is happening? Everything works in dev mode. Edit: doesnt matter which user refreshes the page. after one user refreshes the page, it shows the realtime data

@hamza_se
@hamza_se
1 month ago
@AMPxLEADER I got the solution, you just have to await all the pusher triggers in the api.

Reply

@AMPxLEADER
@AMPxLEADER
1 month ago
@hamza_se Thank you! that worked
