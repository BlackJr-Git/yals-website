// import createMiddleware from 'next-intl/middleware';
 
// export default createMiddleware({
//   // A list of all locales that are supported
//   locales: ['en', 'fr'],
 
//   // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
//   defaultLocale: 'en',
  
//   // Domains can be used to configure different locales for different domains
//   // domains: [
//   //   {
//   //     domain: 'yals-congo.cd',
//   //     defaultLocale: 'fr',
//   //   },
//   //   {
//   //     domain: 'yals-congo.com',
//   //     defaultLocale: 'en',
//   //   },
//   // ],
// });
 
export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
