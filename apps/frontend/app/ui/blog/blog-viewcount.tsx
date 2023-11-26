'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { updateBlogViewCount } from '@/lib/server';

const BlogViewCount = ({ slug }: { slug: string }) => {
    const [viewCount, setViewCount] = useState(0);
    let isViewCountUpdated = false;

    useEffect(() => {
        const handleViewCountUpdate = async () => {
            try {
                if (!isViewCountUpdated) {
                    const response = await await updateBlogViewCount(slug);
                    console.log(response);
                    // @ts-ignore
                    setViewCount(response.data.attributes.viewCount);
                }
            } catch (err) {
                console.log('Error updating view count');
            }
        };

        handleViewCountUpdate();

        return () => {
            isViewCountUpdated = true;
        };
    }, []);

    return <span>Views: {viewCount}</span>;
};

export default BlogViewCount;
