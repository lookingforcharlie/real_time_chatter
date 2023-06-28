## File base routing system

## Functions

- Database
- Authentication
- Sending friend request
- Seeing friend request
- Accepting friend request
- Real time chatting
- Route protection
- Loading state using skeleton effect

## Database: Upstash

- Redis get data from the cache from the memory, it's store in a JavaScript constant
- Lots of people use Redis for caching, it's actually a fully fledged database that's super fast.
- Speed is vital for chat application, that's MySQL can't handle
- Login with Google, create a database
- npm i @upstash/redis
- db.ts in lib folder contains the setup for Redis

### Regarding Next.JS

- In Next.js all the components are server side components by default, server components don't have any interaction with users, meaning we can't use something like onClick etc.

- route.ts is mandatory, forced by next.js

- The reason we make components, cos we can implement client side functions in the server components such as onClick etc

- Compare with React, we use different route system, <Link />, <Image />, router.refresh(),

## Next Auth

- npm i --save next-auth

## Packages installed

### cva - Allows us to write classes that we can use wherever we render the button

- npm i class-variance-authority

### Lucide - icons dependency

- npm i lucide-react

### Conditional className

- npm i clsx

### Merge Tailwind CSS classes together for cleaner tailwind code

- npm tailwind-merge

### for toast notification

- npm i react-hot-toast
- Create Providers.tsx, wrap the whole application using <Providers></Providers>

### Tailwind CSS form package to make form look prettier

- npm i @tailwindcss/forms

### React Form

- npm install react-hook-form @hookform/resolvers

### react-textarea-autosize to create textarea on the page

- npm install react-textarea-autosize

### date-fns to convert cryptic timestamp into readable time format

- npm install date-fns

### https://pusher.com/ provide real time service

- npm install pusher pusher-js
- pusher for server side, pusher-js for client side
- get pusher credentials from pusher.com to get started

### React Loading Skeleton: implement a skeleton loading effect

- npm install react-loading-skeleton

### Build a middleware

- Create a file: src/middleware.ts

###### Helper in the Comments

At 2:18:00, the problem was not a caching issue. It was a syntax issue. There should be a ":" after email before interpolating the emailToAdd variable

@AMPxLEADER
@AMPxLEADER
2 months ago (edited)
Just finished watching the video. For some reason in production with Vercel the realtime functions are not working smooth. After I do something like sending a chat or friend request, I have to refresh the page of the user that just triggered an event so the other user's page is updated realtime. Like on the chat page, real time chats is not working and the second user does not see the live new msg. If I refresh the page, then the second user displays the new msg the first user sent without having to refresh their page. Any ideas why this is happening? Everything works in dev mode. Edit: doesnt matter which user refreshes the page. after one user refreshes the page, it shows the realtime data

1

Reply

8 replies
@AMPxLEADER
@AMPxLEADER
2 months ago
The only thing that works in production mode is when a user accepts a new friend request and updates list of "Your chats" for both users in real time.

Reply

@hamza_se
@hamza_se
2 months ago
@AMPxLEADER Same brother. Have you found any solution for it?

Reply

@AMPxLEADER
@AMPxLEADER
1 month ago
@hamza_se No luck. You?

Reply

@hamza_se
@hamza_se
1 month ago
@AMPxLEADER Nope

Reply

@AMPxLEADER
@AMPxLEADER
1 month ago
@hamza_se I think its a problem with pusher. Like I'm not sure if something needs to be changed to pusher when the app is deployed. Because I am also getting this same problem in a school project that I am working on and I'm using pusher.

1

Reply

@hamza_se
@hamza_se
1 month ago
@AMPxLEADER I got the solution, you just have to await all the pusher triggers in the api.

2

Reply

@AMPxLEADER
@AMPxLEADER
1 month ago
@hamza_se Thank you! that worked
