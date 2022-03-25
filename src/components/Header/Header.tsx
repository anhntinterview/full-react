import * as React from 'react';
import { Link } from 'react-router-dom';
import logo from 'assets/OoOLab_Logo_Icon.png';
import { ArrowSmLeftIcon } from '@heroicons/react/outline';
import UserDetailMenu from 'components/MainNav/UserDetailMenu';

export interface HeaderProps {
    isBreadcrumb?: boolean;
    setAuthStorage?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isBreadcrumb, setAuthStorage }) => {
    return (
        // <ul className="flex px-ooolab_p_12 border-b border-gray-200 h-16 md:h-ooolab_h_20 ">
        //     {isBreadcrumb ? (
        //         <>
        //             <li className="items-center md:w-ooolab_w_8 flex w-3/4">
        //                 <img src={logo} alt="_logo" className="w-ooolab_w_32"/>
        //             </li>
        //         </>
        //     ) : (
        //         <li className="flex items-center md:w-1/4 w-3/4">
        //             {/* <Link to="/">
        //         </Link> */}
        //             <img src={logo} alt="" className="w-ooolab_w_32"/>
        //         </li>
        //     )}
        // </ul>
        <div className="pl-ooolab_p_54 h-ooolab_h_15 bg-ooolab_gray_11 flex items-center justify-end ">
            <div>
                <svg
                    className="w-ooolab_w_4 h-ooolab_h_4"
                    viewBox="0 0 18 18"
                    fill="none"
                >
                    <path
                        d="M9.1175 2.33366C8.9287 2.86901 8.8326 3.43265 8.83333 4.00033H2.16667V15.667H13.8333V9.00033C14.401 9.00106 14.9646 8.90496 15.5 8.71616V16.5003C15.5 16.7213 15.4122 16.9333 15.2559 17.0896C15.0996 17.2459 14.8877 17.3337 14.6667 17.3337H1.33333C1.11232 17.3337 0.900358 17.2459 0.744078 17.0896C0.587797 16.9333 0.5 16.7213 0.5 16.5003V3.16699C0.5 2.94598 0.587797 2.73402 0.744078 2.57774C0.900358 2.42146 1.11232 2.33366 1.33333 2.33366H9.1175ZM13.8333 5.66699C14.2754 5.66699 14.6993 5.4914 15.0118 5.17884C15.3244 4.86628 15.5 4.44235 15.5 4.00033C15.5 3.5583 15.3244 3.13437 15.0118 2.82181C14.6993 2.50925 14.2754 2.33366 13.8333 2.33366C13.3913 2.33366 12.9674 2.50925 12.6548 2.82181C12.3423 3.13437 12.1667 3.5583 12.1667 4.00033C12.1667 4.44235 12.3423 4.86628 12.6548 5.17884C12.9674 5.4914 13.3913 5.66699 13.8333 5.66699V5.66699ZM13.8333 7.33366C12.9493 7.33366 12.1014 6.98247 11.4763 6.35735C10.8512 5.73223 10.5 4.88438 10.5 4.00033C10.5 3.11627 10.8512 2.26842 11.4763 1.6433C12.1014 1.01818 12.9493 0.666992 13.8333 0.666992C14.7174 0.666992 15.5652 1.01818 16.1904 1.6433C16.8155 2.26842 17.1667 3.11627 17.1667 4.00033C17.1667 4.88438 16.8155 5.73223 16.1904 6.35735C15.5652 6.98247 14.7174 7.33366 13.8333 7.33366Z"
                        fill="#8F90A6"
                    />
                </svg>
            </div>
            <div className="p-ooolab_p_3 mt-ooolab_m_3">
                <UserDetailMenu setAuthStorage={setAuthStorage} />
            </div>
        </div>
    );
};

export default Header;
