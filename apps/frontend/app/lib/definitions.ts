export type Project = {
    id: number;
    attributes: {
        name: string;
        shortDescription: string;
        githubLink: string;
        websiteLink: string;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date;
        tags: {
            id: number;
            tag: string;
            icon: string;
            __component: string;
        }[];
    };
};

export type Projects = {
    data: Project[];
};

export type BlogArticle = {
    id: number;
    attributes: {
        title: string;
        body: {};
        shortDescription: string;
        slug: string;
        viewCount: number;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        seo: SeoData;
    };
};

export type BlogArticles = {
    data: BlogArticle[];
};

export type SeoData = {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    metaRobots: string;
    structuredData: string;
    metaViewport: string;
    canonicalURL: string;
    metaImage: {
        data: {
            attributes: {
                width: number;
                height: number;
                url: string;
            };
        };
    };
    metaSocial: object;
};
