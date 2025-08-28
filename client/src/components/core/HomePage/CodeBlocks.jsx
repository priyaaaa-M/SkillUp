import React from 'react';
import CTAButton from "../HomePage/Button";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = ({ position, heading, subheading, ctabtn1, ctabtn2, codeblock }) => {
    const highlightSyntax = (code) => {
        return code
            .replace(/(&lt;!DOCTYPE.*?&gt;)/g, '<span class="text-blue-400">$1</span>')
            .replace(/(&lt;\/?[a-z][a-z0-9]*)/g, '<span class="text-blue-300">$1</span>')
            .replace(/(&gt;)/g, '<span class="text-blue-300">$1</span>')
            .replace(/([a-z-]+)=/g, '<span class="text-cyan-300">$1</span>=')
            .replace(/(".*?")/g, '<span class="text-amber-300">$1</span>');
    };

    return (
        <div className={`flex ${position} justify-between gap-6 items-stretch`}>
            {/* Content Section - Made more compact */}
            <div className='w-[45%] flex flex-col'>
                <div className="text-xl font-semibold mb-2">{heading}</div>
                <p className='text-richblack-300 text-sm mb-4'>{subheading}</p>
                <div className='flex gap-2 mt-auto'>
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto} className="text-sm py-1 px-3">
                        {ctabtn1.btnText} <FaArrowRight className="inline ml-1 text-xs" />
                    </CTAButton>
                    <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto} className="text-sm py-1 px-3">
                        {ctabtn2.btnText}
                    </CTAButton>
                </div>
            </div>

            {/* Compact Code Editor */}
            <div className='w-[55%] rounded-md overflow-hidden bg-richblack-800 border border-richblack-600'>
                <div className="flex font-mono text-xs h-full">
                    <div className='w-6 text-right text-richblack-400 pr-1 py-2 bg-richblack-900/50'>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <div key={num} className="h-4 leading-4">{num}</div>)}
                    </div>
                    <div className="flex-1 py-2 pl-1 text-richblack-50 overflow-hidden">
                        <TypeAnimation
                            sequence={[codeblock, 2000, ""]}
                            repeat={Infinity}
                            cursor={true}
                            speed={40}
                            style={{
                                whiteSpace: "pre-line",
                                display: "block",
                                lineHeight: '1rem',
                                minHeight: '8rem' // Maintains height
                            }}
                            renderer={text => (
                                <div dangerouslySetInnerHTML={{ __html: highlightSyntax(text) }} />
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeBlocks;