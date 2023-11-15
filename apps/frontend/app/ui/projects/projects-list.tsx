import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

const ProjectList = () => {
    return (
        <div className='flex justify-center'>
            <div className='mt-20 p-10'>
                <h2 className='text-white mb-10 font-semibold text-3xl'>Projects</h2>
                <div className='flex flex-col md:flex-row gap-5 flex-wrap'>
                    <article className='flex flex-col relative text-white border p-10 border-grey/[.55] rounded-lg basis-1/4 '>
                        <a href="#" className=''>
                            <h5 className='text-2xl mb-5'>Project #1</h5>
                        </a>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque doloribus repellat debitis perspiciatis aliquam alias omnis optio eligendi eum incidunt?</p>
                        <div className='mt-10 absolute bottom-10'>
                            <a href="#" className='pt-3 pb-3 pr-2 pl-2 flex gap-4 items-center hover:underline'>Take me to the repository <FiArrowUpRight /></a>
                        </div>
                    </article>
                    <div className='text-white border p-10 border-grey/[.55] rounded-lg basis-1/4'>
                        <a href="#" className=''>
                            <h5>Project #1</h5>
                        </a>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam cum alias perferendis quibusdam eligendi, blanditiis recusandae hic ad! Repellendus alias architecto consectetur nobis, eos veritatis quod nulla autem tenetur obcaecati neque sunt mollitia quidem nam accusamus sed culpa provident quibusdam. Ea quam quia illum itaque doloribus vel! Voluptates, cumque consequatur.</p>
                        <a href="#">Take me to the repository</a>
                    </div>
                    <div className='text-white border p-10 border-grey/[.55] rounded-lg basis-1/4'>
                        <a href="#" className=''>
                            <h5>Project #1</h5>
                        </a>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam cum alias perferendis quibusdam eligendi, blanditiis recusandae hic ad! Repellendus alias architecto consectetur nobis, eos veritatis quod nulla autem tenetur obcaecati neque sunt mollitia quidem nam accusamus sed culpa provident quibusdam. Ea quam quia illum itaque doloribus vel! Voluptates, cumque consequatur.</p>
                        <a href="#">Take me to the repository</a>
                    </div>
                    <div className='text-white border p-10 border-grey/[.55] rounded-lg basis-1/4'>
                        <a href="#" className=''>
                            <h5>Project #1</h5>
                        </a>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam cum alias perferendis quibusdam eligendi, blanditiis recusandae hic ad! Repellendus alias architecto consectetur nobis, eos veritatis quod nulla autem tenetur obcaecati neque sunt mollitia quidem nam accusamus sed culpa provident quibusdam. Ea quam quia illum itaque doloribus vel! Voluptates, cumque consequatur.</p>
                        <a href="#">Take me to the repository</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectList;
