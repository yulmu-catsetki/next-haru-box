import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/kakao`,
    }),
    CredentialsProvider({
      name: '테스트 계정',
      credentials: {
        
      },
      authorize: async (credentials) => {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: 1, name: '정무니우스' };

        if (user) {
             return Promise.resolve(user)
        } else {
              return Promise.resolve(null)
      
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.sub;
      session.user.name = token.name;
      return session;
    },
  },
});
