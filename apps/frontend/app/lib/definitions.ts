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
    }
}

export type Projects = {
    data: Project[];
}

export type BlogArticle = {
    id: number;
    attributes: {
        title: string;
        body: {};
        shortDescription: string;
        slug: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    }
}

export type BlogArticles = {
    data: BlogArticle[];
}

