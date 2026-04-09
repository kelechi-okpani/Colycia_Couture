import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/app/lib/mongodb";
import User from "@/app/lib/models/user";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        await dbConnect();

        // 1. Single query: Fetch user AND the hidden password field
        const user = await User.findOne({ email: credentials.email }).select("+password");
        
        if (!user) {
          throw new Error("No user found with this email");
        }

        // 2. Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // 3. Return a clean object (Exclude password)
        return {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          wishlist: user.wishlist || [],
          cart: user.cart || [],
        };
      },
    }),
  ],
  callbacks: {
    // Transfer data from the user object to the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token._id = user.id;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.wishlist = (user as any).wishlist;
        token.cart = (user as any).cart;
      }
      return token;
    },
    // Transfer data from the JWT to the Session for the frontend
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any)._id = token.id;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        (session.user as any).wishlist = token.wishlist;
        (session.user as any).cart = token.cart;
      }
      return session;
    },
  },
  session: { 
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours (86,400 seconds)
    // maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login', // Points to your custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };