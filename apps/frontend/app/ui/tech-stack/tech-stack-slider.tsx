import React from 'react';
import NextJSIcon from '@/ui/tech-stack/icons/nextjs-icon';
import ReactIcon from '@/ui/tech-stack/icons/react-icon';
import StrapiIcon from '@/ui/tech-stack/icons/strapi-icon';
import TailwindCSSIcon from '@/ui/tech-stack/icons/tailwindcss-icon';
import TypeScriptIcon from '@/ui/tech-stack/icons/typescript-icon';
import TYPO3Icon from '@/ui/tech-stack/icons/typo3-icon';
import PHPIcon from '@/ui/tech-stack/icons/php-icon';
import SymfonyIcon from '@/ui/tech-stack/icons/symfony-icon';
import JavaScriptIcon from '@/ui/tech-stack/icons/javascript-icon';

const TechStackSlider = () => {
    return (
        <div className="border-grey/[.55] border-b">
            <div className="relative flex gap-10 overflow-x-hidden pb-10 pt-10 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-10">
                    <NextJSIcon />
                    <ReactIcon />
                    <StrapiIcon />
                    <TailwindCSSIcon />
                    <TypeScriptIcon />
                    <TYPO3Icon />
                    <PHPIcon />
                    <SymfonyIcon />
                    <JavaScriptIcon />
                </div>

                <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-10">
                    <NextJSIcon />
                    <ReactIcon />
                    <StrapiIcon />
                    <TailwindCSSIcon />
                    <TypeScriptIcon />
                    <TYPO3Icon />
                    <PHPIcon />
                    <SymfonyIcon />
                    <JavaScriptIcon />
                </div>
            </div>
        </div>
    );
};

export default TechStackSlider;
