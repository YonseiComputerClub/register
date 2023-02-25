import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { IPAUserFindResponse } from "types/Response";

import CREDENTIALS from "~/../credentials.json";

function encodeCookies(cookies: Record<string, string>) {
  return Object.keys(cookies)
    .map((key) => `${key}=${cookies[key]}`)
    .join("; ");
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: CREDENTIALS.web.client_id,
      clientSecret: CREDENTIALS.web.client_secret,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const googleProfile = profile as GoogleProfile;

      const { data: ipaUser } = await axios.post<IPAUserFindResponse>(
        `${process.env.IPA_SERVER_URL}/ipa/session/json`,
        {
          id: 0,
          method: "stageuser_find",
          params: [
            [null],
            {
              all: true,
              raw: false,
              version: "2.251",
              mail: [googleProfile.email],
            },
          ],
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Cookie: encodeCookies({
              ipa_session: process.env.IPA_SERVER_COOKIE,
            }),
            Referer: `${process.env.IPA_SERVER_URL}/ipa`,
          },
        }
      );

      const { data: ipaStagedUser } = await axios.post<IPAUserFindResponse>(
        `${process.env.IPA_SERVER_URL}/ipa/session/json`,
        {
          id: 0,
          method: "user_find",
          params: [
            [null],
            {
              all: true,
              raw: false,
              version: "2.251",
              mail: [googleProfile.email],
            },
          ],
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Cookie: encodeCookies({
              ipa_session: process.env.IPA_SERVER_COOKIE,
            }),
            Referer: `${process.env.IPA_SERVER_URL}/ipa`,
          },
        }
      );

      const userResult = [
        ...ipaUser.result.result,
        ...ipaStagedUser.result.result,
      ];

      console.log(userResult);

      if (
        !(
          googleProfile.email_verified &&
          googleProfile.email.endsWith("@yonsei.ac.kr")
        )
      ) {
        return "/?error=notYonsei";
      }

      if (userResult.length !== 0) {
        return "/?error=alreadyRegistered";
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.id = profile?.sub;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;

      return session;
    },
  },

  debug: true,
} as NextAuthOptions;

export default NextAuth(authOptions);
