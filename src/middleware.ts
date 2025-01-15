import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Create a public paths array
const publicPaths = ["/", "/pricing", "/features", "/how-it-works", "/faq"];

// Create a route matcher for public paths
const isPublicPath = createRouteMatcher(
  publicPaths.map(path => (path === "/" ? path : `${path}(.*)`))
);

export default clerkMiddleware((auth, req) => {
  if (isPublicPath(req)) {
    return;
  }
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).)',
    '/',
    '/(api|trpc)(.*)'
  ],
};
