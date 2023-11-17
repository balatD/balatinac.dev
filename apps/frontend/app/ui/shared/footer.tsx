import React from 'react';
import { FiX, FiGithub, FiLinkedin } from 'react-icons/fi';
import { TbBrandXing } from 'react-icons/tb';
import { RiTwitterXLine } from "react-icons/ri";


const Footer = () => {
    return (
        <div className='flex justify-between p-10 border-b border-grey/[.55]'>
            <span className='text-white justify-center'>
                balatinac.dev <span className='text-grey'> - 2023</span>
            </span>
            <div className='flex gap-3 text-white'>
                <a href="https://github.com/balatD" target="_blank"><FiGithub size={24} /></a>
                <a href="https://www.xing.com/profile/Dragan_Balatinac2/cv" target='_blank'><TbBrandXing size={24} /></a>
                <a href="https://www.linkedin.com/in/dragan-balatinac-99228a205/" target='_blank'><FiLinkedin size={24} /></a>
            </div>
        </div>
    )
}

export default Footer