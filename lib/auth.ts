import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/d5e55fd7-cdcb-4cd5-8b6b-cd7c5e595a7c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.ts:15',message:'authorize called',data:{email:credentials?.email,hasPassword:!!credentials?.password},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/d5e55fd7-cdcb-4cd5-8b6b-cd7c5e595a7c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.ts:26',message:'user lookup result',data:{found:!!user,userId:user?.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        
        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/d5e55fd7-cdcb-4cd5-8b6b-cd7c5e595a7c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.ts:37',message:'password validation',data:{isValid:isPasswordValid},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
        // #endregion

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session: updateSession }) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/d5e55fd7-cdcb-4cd5-8b6b-cd7c5e595a7c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.ts:61',message:'jwt callback',data:{hasUser:!!user,userId:user?.id,trigger},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }
      // Handle session update (e.g., after profile update)
      if (trigger === 'update' && updateSession) {
        token.name = updateSession.user?.name;
        token.image = updateSession.user?.image;
      }
      return token;
    },
    async session({ session, token }) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/d5e55fd7-cdcb-4cd5-8b6b-cd7c5e595a7c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.ts:75',message:'session callback',data:{userId:token.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

