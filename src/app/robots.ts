import { appConfig } from '@/src/utils/app-config';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/dashboard/*'],
    },
    sitemap: `${appConfig.appUrl}/sitemap.xml`,
  };
}
