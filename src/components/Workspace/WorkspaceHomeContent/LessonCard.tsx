import React from 'react';

import LessonBackground from 'assets/lesson_card.png';

const LessonCard = () => {
    return (
        <div className="w-full col-span-1 relative rounded-lg overflow-x-hidden cursor-pointer">
            <img className="w-full" src={LessonBackground} alt="" />
            <div className="absolute bottom-0 pl-ooolab_p_3 pt-ooolab_p_2 pb-ooolab_p_4 bg-ooolab_gray_0 text-black text-ooolab_xs w-full">
                <p className="text-ooolab_gray_1 mb-ooolab_m_2">3 mins ago</p>
                <p>U1-L2-03: Beauty of Nature and Natural Habitat</p>
            </div>
        </div>
    );
};

export default LessonCard;
