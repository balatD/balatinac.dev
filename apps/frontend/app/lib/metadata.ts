import type { SeoData } from '@/lib/definitions';

export async function generateMetadataFromEndpoint(
    seoData: SeoData,
    slug: string
) {
    if (seoData) {
        return {
            title:
                seoData.metaTitle + ' - balatinac.dev' ??
                'homepage - balatinac.dev',
            description: seoData.metaDescription,
            keywords: seoData.keywords,
            creator: 'Dragan Balatinac',
            publisher: 'Dragan Balatinac',
            formatDetection: {
                email: false,
                address: false,
                telephone: false,
            },
            openGraph: {
                title: seoData.metaTitle,
                description: seoData.metaDescription,
                url: 'https://balatinac.dev/' + slug,
                siteName: 'balatinac.dev',
                images: seoData.metaImage.data && [
                    {
                        url:
                            process.env.STRAPI_API_ENDPOINT +
                            seoData.metaImage.data.attributes.url,
                        width: seoData.metaImage.data.attributes.width,
                        height: seoData.metaImage.data.attributes.height,
                    },
                ],
                locale: 'en_US',
                type: 'website',
            },
        };
    } else {
        return {};
    }
}
