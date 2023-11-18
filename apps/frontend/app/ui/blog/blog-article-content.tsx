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
                        paragraph: ({ children }) => <p className="text-white mb-4">{children}</p>,
                        quote: ({ children }) => <blockquote className="text-white italic mt-8 mb-8 bg-lighterDark p-5 rounded">{children}</blockquote>,
                        code: (props) => (
                            <pre className='bg-lighterDark mt-8 mb-8 p-5 rounded'>
                                <code>{props.children}</code>
                            </pre>
                        ),
                        image: ({ image }) => (
                            <div className='mt-8 mb-8 flex justify-center'>
                                <img src={image.url} alt={image.alternativeText} />
                            </div>
                        ),
                        heading: ({ children, level }) => {
                            switch (level) {
                                case 1:
                                    return <h1 className='text-5xl mb-8'>{children}</h1>
                                case 2:
                                    return <h2 className='text-4xl mb-8'>{children}</h2>
                                case 3:
                                    return <h3 className='text-3xl mb-4'>{children}</h3>
                                case 4:
                                    return <h4 className='text-2xl mb-4'>{children}</h4>
                                case 5:
                                    return <h5 className='text-xl mb-4'>{children}</h5>
                                case 6:
                                    return <h6 className='text-lg mb-4'>{children}</h6>
                                default:
                                    return <h1 className='text-5xl mb-8'>{children}</h1>
                            }
                        },
                        link: ({ children, url }) => <Link href={url}>{children}</Link>,
                    }}
                    modifiers={{
                        bold: ({ children }) => <strong>{children}</strong>,
                        italic: ({ children }) => <span className="italic">{children}</span>,
                        underline: ({ children }) => <span className="bg-lighterDark pr-2 pl-2 rounded py-1">{children}</span>,
                    }}
                />
            )}

        </>
    )
}

export default BlogArticleContent