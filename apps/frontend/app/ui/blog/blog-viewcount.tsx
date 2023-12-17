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
                    const response = await updateBlogViewCount(slug);
                    // @ts-ignore
                    setViewCount(response.data.attributes.viewCount);
                }
            } catch (err) {
                console.error('Error updating view count', err);
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
