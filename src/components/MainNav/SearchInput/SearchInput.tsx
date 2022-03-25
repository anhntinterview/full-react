import React from 'react';

const SearchInput: React.FC = () => {
    return (
        <div className="relative flex items-center h-ooolab_h_10 max-h-full w-96 rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-ooolab_h_5 w-ooolab_w_5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>
            <input
                type="text"
                name="search"
                id="search_box"
                className="py-3 px-4 bg-ooolab_gray_0 placeholder-gray-400 text-gray-900 rounded-lg appearance-none w-full block pl-12 focus:outline-none"
                placeholder="Search"
            />
        </div>
    );
};

export default SearchInput;
