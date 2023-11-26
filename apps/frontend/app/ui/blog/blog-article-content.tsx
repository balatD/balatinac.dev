'use client';

import React from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Link from 'next/link';

type BlocksRendererProps = Parameters<typeof BlocksRenderer>[0];

const BlogArticleContent = (props: BlocksRendererProps) => {
    return (
        <>
            {props.content && (
                <BlocksRenderer
                    content={props.content}
                    blocks={{
                        paragraph: ({ children }) => (
                            <p className="mb-4 text-white">{children}</p>
                        ),
                        quote: ({ children }) => (
                            <blockquote className="bg-lighterDark mb-8 mt-8 rounded p-5 italic text-white">
                                {children}
                            </blockquote>
                        ),
                        code: (props) => (
                            <pre className="bg-lighterDark mb-8 mt-8 rounded p-5">
                                <code>{props.children}</code>
                            </pre>
                        ),
                        image: ({ image }) => (
                            <div className="mb-8 mt-8 flex justify-center">
                                <img src={image.url} />
                            </div>
                        ),
                        heading: ({ children, level }) => {
                            switch (level) {
                                case 1:
                                    return (
                                        <h1 className="mb-8 mt-8 text-5xl">
                                            {children}
                                        </h1>
                                    );
                                case 2:
                                    return (
                                        <h2 className="mb-8 mt-8 text-4xl">
                                            {children}
                                        </h2>
                                    );
                                case 3:
                                    return (
                                        <h3 className="mb-4 mt-12 text-3xl">
                                            {children}
                                        </h3>
                                    );
                                case 4:
                                    return (
                                        <h4 className="mb-4 mt-10 text-2xl">
                                            {children}
                                        </h4>
                                    );
                                case 5:
                                    return (
                                        <h5 className="mb-4 mt-10 text-xl">
                                            {children}
                                        </h5>
                                    );
                                case 6:
                                    return (
                                        <h6 className="mb-4 mt-10 text-lg">
                                            {children}
                                        </h6>
                                    );
                                default:
                                    return (
                                        <h1 className="mb-8 mt-8 text-5xl">
                                            {children}
                                        </h1>
                                    );
                            }
                        },
                        link: ({ children, url }) => (
                            <Link href={url}>{children}</Link>
                        ),
                    }}
                    modifiers={{
                        bold: ({ children }) => <strong>{children}</strong>,
                        italic: ({ children }) => (
                            <span className="italic">{children}</span>
                        ),
                        underline: ({ children }) => (
                            <span className="bg-lighterDark rounded py-1 pl-2 pr-2">
                                {children}
                            </span>
                        ),
                    }}
                />
            )}
        </>
    );
};

export default BlogArticleContent;
