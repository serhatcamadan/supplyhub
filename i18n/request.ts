import { getRequestConfig } from 'next-intl/server'
import { routing, type Locale } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale
  }

  const [common, auth, sidebar, buyer, seller, validation] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/auth.json`),
    import(`../messages/${locale}/sidebar.json`),
    import(`../messages/${locale}/buyer.json`),
    import(`../messages/${locale}/seller.json`),
    import(`../messages/${locale}/validation.json`),
  ])

  return {
    locale: locale as Locale,
    messages: {
      common: common.default,
      auth: auth.default,
      sidebar: sidebar.default,
      buyer: buyer.default,
      seller: seller.default,
      validation: validation.default,
    },
  }
})
