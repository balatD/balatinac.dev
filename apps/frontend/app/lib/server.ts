'use server';

import { STRAPI_API_ENDPOINT, STRAPI_API_PUBLIC_KEY } from '@/lib/data';
import { BlogArticle, BlogArticles } from '@/lib/definitions';
import qs from 'qs';

export async function updateBlogViewCount(slug: string) {
    try {
        const query = qs.stringify({
            filters: {
                slug: {
                    $eq: slug,
                },
            },
        });

        const response = await fetch(
            STRAPI_API_ENDPOINT + '/api/blog-articles?' + query,
            {
                headers: { Authorization: 'Bearer ' + STRAPI_API_PUBLIC_KEY },
                next: {
                    revalidate: 0,
                },
            }
        );

        const blogArticle = (await response.json()) as BlogArticles;

        const viewCount = blogArticle.data[0].attributes.viewCount + 1;

        const putResponse = await fetch(
            STRAPI_API_ENDPOINT +
            '/api/blog-articles/' +
            blogArticle.data[0].id,
            {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + STRAPI_API_PUBLIC_KEY,
                    'Content-Type': 'application/json',
                },
                next: {
                    revalidate: 0,
                },
                body: JSON.stringify({
                    data: {
                        viewCount: viewCount,
                    },
                }),
            }
        );

        return (await putResponse.json()) as BlogArticle;
    } catch (error) {
        throw new Error('Failed to update blog view count.');
        console.error('Failed to update blog view count.');
    }
}
