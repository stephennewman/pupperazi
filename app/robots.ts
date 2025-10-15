import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://pupperazi.krezzo.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/contract',
          '/payment/',
          '/proposal',
          '/thank-you',
          '/qr-code',
          '/leads',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

