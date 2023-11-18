import { BlogArticles, Projects } from '@/lib/definitions';
import qs from 'qs';

const STRAPI_API_PUBLIC_KEY = process.env.STRAPI_API_PUBLIC_KEY as string;
const STRAPI_API_ENDPOINT = process.env.STRAPI_API_ENDPOINT as string;

const timeout = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function fetchAllProjects() {
    try {
        const query = qs.stringify({
            populate: 'tags',
        });
        const response = await fetch(
            STRAPI_API_ENDPOINT + '/api/projects?' + query,
            {
                headers: { Authorization: 'Bearer ' + STRAPI_API_PUBLIC_KEY },
                next: {
                    revalidate: 0,
                },
            }
        );

        return (await response.json()) as Projects;
    } catch (error) {
        console.error('API Endpoint Error:', error);
        throw new Error('Failed to fetch projects.');
    }
}

export async function fetchAllBlogArticles() {
    try {
        const response = await fetch(
            STRAPI_API_ENDPOINT + '/api/blog-articles',
            {
                headers: { Authorization: 'Bearer ' + STRAPI_API_PUBLIC_KEY },
                next: {
                    revalidate: 0,
                },
            }
        );

        return (await response.json()) as BlogArticles;
    } catch (error) {
        console.error('API Endpoint Error:', error);
        throw new Error('Failed to fetch blog articles.');
    }
}

export async function fetchBlogArticleContent(slug: string) {
    try {
        const query = qs.stringify({
            filters: {
                slug: {
                    eq: slug,
                },
            },
            populate: 'body',
        });

        const response = await fetch(
            STRAPI_API_ENDPOINT + '/api/blog-articles?' + query,
            {
                headers: { Authorization: 'Bearer ' + STRAPI_API_PUBLIC_KEY },
                next: {
                    revalidate: 100,
                },
            }
        );

        return (await response.json()) as BlogArticles;
    } catch (error) {
        console.error('API Endpoint Error:', error);
        throw new Error('Failed to fetch blog articles.');
    }
}
