import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { fetchRedis } from '../helpers/redis';
import { redis } from './db';

// Get clientId and clientSecret with validation
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_ID');
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_SECRET');
  }

  return { clientId, clientSecret };
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  //This adapter enables NextAuth.js to store user data and session information in a Redis database, allowing for efficient and scalable storage and retrieval.
  adapter: UpstashRedisAdapter(redis),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    // token and user are automatically provided by next auth
    async jwt({ token, user }) {
      // adapter: UpstashRedisAdapter(redis) takes care of generating token.id
      // check if the user is in the db, to determine if it's a new user or not
      // .d.ts file means type created inside the file doesn't need to be imported, it's available throughout the entire application

      // Two ways to get result from Redis
      // const dbUser = (await redis.get(`user:${token.id}`)) as User | null;
      const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
        | string
        | null;

      if (!dbUserResult) {
        token.id = user!.id;
        console.log('returning token - auth.ts:', token);
        return token;
      }

      const dbUser = JSON.parse(dbUserResult) as User;

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    redirect() {
      return '/dashboard';
    },
  },
};

// ada
