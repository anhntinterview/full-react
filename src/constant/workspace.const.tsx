interface IconProps {
    readonly active: boolean;
}
export const ELEMENT_TXT = {
    INVITE_MEMBER: 'You do not have any invitation!',
};

export const TAG_COLOR_PROPS: Record<string, string> = {
    ooolab_pink_0: 'ooolab_pink_1',
    ooolab_blue_0: 'ooolab_blue_1',
};

export const CourseIcon = ({ active }: IconProps) => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dd)">
            <circle cx="30" cy="26" r="22" fill="#0071CE" />
        </g>
        <path
            d="M22 18C22 16.8954 22.8954 16 24 16H32C32.2652 16 32.5196 16.1054 32.7071 16.2929L37.7071 21.2929C37.8946 21.4804 38 21.7348 38 22V34C38 35.1046 37.1046 36 36 36H24C22.8954 36 22 35.1046 22 34V18ZM35.5858 22L32 18.4142V22H35.5858ZM30 18L24 18V34H36V24H31C30.4477 24 30 23.5523 30 23V18ZM26 27C26 26.4477 26.4477 26 27 26H33C33.5523 26 34 26.4477 34 27C34 27.5523 33.5523 28 33 28H27C26.4477 28 26 27.5523 26 27ZM26 31C26 30.4477 26.4477 30 27 30H33C33.5523 30 34 30.4477 34 31C34 31.5523 33.5523 32 33 32H27C26.4477 32 26 31.5523 26 31Z"
            fill="white"
        />
        <defs>
            <filter
                id="filter0_dd"
                x="0"
                y="0"
                width="60"
                height="60"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="4" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.376471 0 0 0 0 0.380392 0 0 0 0 0.439216 0 0 0 0.16 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="1" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.156863 0 0 0 0 0.160784 0 0 0 0 0.239216 0 0 0 0.04 0"
                />
                <feBlend
                    mode="normal"
                    in2="effect1_dropShadow"
                    result="effect2_dropShadow"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect2_dropShadow"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
);
