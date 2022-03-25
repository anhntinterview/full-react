import { PlusIcon, SearchIcon, XIcon } from '@heroicons/react/outline';
import { useBoolean } from 'hooks/custom';
import ModalCreate from '../../components/ModalCreateWrapper';
import Pagination from '../../components/Pagination';
import CreateStudentForm from './CreateStudentForm';
import TableGroups from './TableStudent';

const RenderFilter = ({
    filterName,
    listData,
}: {
    filterName: string;
    listData: string;
}) => {
    return (
        <>
            {listData.split(',').map((i) => (
                <p className="text-ooolab_10px text-ooolab_dark_1 flex items-center bg-ooolab_light_100 rounded p-ooolab_p_1 mr-ooolab_m_2">
                    <span className="capitalize">{filterName}</span>: {i}
                    <XIcon className="ml-ooolab_m_2 w-ooolab_w_2_e h-ooolab_h_2_e cursor-pointer" />
                </p>
            ))}
        </>
    );
};

const StudentList = () => {
    const {
        booleanValue: modalCreate,
        toggleBooleanValue: toggleModalCreate,
    } = useBoolean();

    // const [filterState, setFilterState] = useState<Record<string, string>>({});
    // const handleSetFilterState = useCallback(
    //     (val: Record<string, string>) => {
    //         setFilterState((prevState) => ({
    //             ...prevState,
    //             ...val,
    //         }));
    //     },
    //     [filterState]
    // );

    return (
        <div className="w-full h-full flex">
            <ModalCreate
                isOpen={modalCreate}
                onClose={toggleModalCreate}
                title="Add Student"
            >
                <CreateStudentForm />
            </ModalCreate>
            {/* <FilterBy
                classname="w-ooolab_w_56 h-full"
                isOpeningFilter={isOpeningFilter}
                onClose={toggleData}
            >
                <CheckboxFilter
                    name="group"
                    listValue={[
                        'PMH',
                        'OOOLAB',
                        'Apola',
                        'Daily planet',
                        'Boggle',
                    ]}
                    onSelectBox={handleSetFilterState}
                />
                <CheckboxFilter
                    name="location"
                    listValue={[
                        'HCM',
                        'Ha Noi',
                        'Da Lat',
                        'Daklak',
                        'Vung Tau',
                    ]}
                    onSelectBox={handleSetFilterState}
                />
                <CheckboxFilter
                    name="status"
                    listValue={['In Progress', 'Pending', 'Finish']}
                    onSelectBox={handleSetFilterState}
                />
            </FilterBy> */}
            <div className="grid grid-rows-layout_management_table grid-cols-1 w-full h-full mx-ooolab_m_4">
                <div className="col-span-1 row-span-1 flex items-center justify-between">
                    <div className="flex items-center">
                        {/* {(!isOpeningFilter && (
                            <button
                                className="flex items-center focus:outline-none mr-ooolab_m_8"
                                onClick={toggleData}
                            >
                                <svg
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-ooolab_m_1 w-ooolab_w_5 h-ooolab_h_5 cursor-pointer"
                                >
                                    <path
                                        d="M7.5 13.5H10.5V12H7.5V13.5ZM2.25 4.5V6H15.75V4.5H2.25ZM4.5 9.75H13.5V8.25H4.5V9.75Z"
                                        fill="#2E3A59"
                                    />
                                </svg>
                                <span className="font-semibold leading-ooolab_24px text-ooolab_xs">
                                    Filter By
                                </span>
                            </button>
                        )) ||
                            null} */}
                        <div className="h-ooolab_h_8 w-ooolab_w_90 flex flex-row-reverse border border-ooolab_bar_color  text-ooolab_dark_2">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full h-full text-ooolab_xs"
                            />
                            <span className="h-full w-ooolab_w_7_n flex items-center justify-center">
                                <SearchIcon className="w-ooolab_w_4 h-ooolab_h_4" />
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={toggleModalCreate}
                            className="rounded bg-ooolab_dark_300 text-white p-ooolab_p_2 leading-ooolab_24px flex items-center text-ooolab_xs"
                        >
                            <PlusIcon className="w-ooolab_w_5 h-ooolab_h_5 mr-ooolab_m_1" />
                            <span className="font-semibold">Add Student</span>
                        </button>
                        {/* <button className="shadow-ooolab_sched_button rounded border text-ooolab_dark_1 p-ooolab_p_2 leading-ooolab_24px flex items-center text-ooolab_xs">
                            <svg
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-ooolab_w_5 h-ooolab_h_5 mr-ooolab_m_1"
                            >
                                <path
                                    d="M0.750001 10.8747C0.749539 10.0463 0.960316 9.23145 1.36241 8.50718C1.76451 7.7829 2.34465 7.17312 3.048 6.73545C3.23363 5.28802 3.94035 3.95783 5.03589 2.99382C6.13143 2.02981 7.54071 1.49805 9 1.49805C10.4593 1.49805 11.8686 2.02981 12.9641 2.99382C14.0597 3.95783 14.7664 5.28802 14.952 6.73545C15.8244 7.27822 16.503 8.08275 16.891 9.03419C17.2789 9.98562 17.3563 11.0353 17.1121 12.0333C16.8679 13.0314 16.3146 13.9267 15.5313 14.5916C14.7479 15.2565 13.7745 15.6568 12.75 15.7355L5.25 15.7497C2.733 15.5442 0.750001 13.4412 0.750001 10.8747ZM12.636 14.24C13.3454 14.1854 14.0194 13.9081 14.5617 13.4476C15.104 12.9871 15.487 12.367 15.6558 11.6759C15.8247 10.9847 15.7708 10.2579 15.5019 9.59924C15.233 8.94055 14.7628 8.38369 14.1585 8.0082L13.5533 7.63095L13.4633 6.92445C13.3231 5.83972 12.7927 4.84315 11.9712 4.12102C11.1497 3.39888 10.0934 3.00059 8.99963 3.00059C7.90587 3.00059 6.84954 3.39888 6.02807 4.12102C5.20659 4.84315 4.67619 5.83972 4.536 6.92445L4.446 7.63095L3.84225 8.0082C3.23797 8.38365 2.76779 8.94044 2.49885 9.59907C2.22991 10.2577 2.17597 10.9845 2.34473 11.6756C2.5135 12.3667 2.89633 12.9868 3.43856 13.4473C3.98079 13.9079 4.65469 14.1853 5.364 14.24L5.49375 14.2497H12.5063L12.636 14.24ZM9.75 9.7497V12.7497H8.25V9.7497H6L9 5.9997L12 9.7497H9.75Z"
                                    fill="#2E3A59"
                                />
                            </svg>

                            <span className="font-semibold">Import</span>
                        </button> */}
                    </div>
                </div>
                <div className="row-span-1 col-span-1 flex items-center justify-between border-b border-t border-ooolab_bar_color ">
                    {/* <div className="flex items-center">
                        {Object.keys(filterState).map((i, index) => (
                            <RenderFilter
                                key={`${i}-${index}`}
                                filterName={i}
                                listData={filterState[i]}
                            />
                        ))}
                    </div> */}
                    {/* <div className="cursor-pointer w-ooolab_w_8 h-ooolab_h_6 flex items-center justify-end border-l border-ooolab_bar_color">
                        <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-ooolab_w_5 h-ooolab_h_5"
                        >
                            <path
                                d="M0.832032 12.0845C0.831519 11.1641 1.06572 10.2587 1.51249 9.45394C1.95927 8.64919 2.60386 7.97165 3.38537 7.48535C3.59163 5.87709 4.37686 4.39911 5.59413 3.32799C6.8114 2.25686 8.37727 1.66602 9.9987 1.66602C11.6201 1.66602 13.186 2.25686 14.4033 3.32799C15.6205 4.39911 16.4058 5.87709 16.612 7.48535C17.5814 8.08843 18.3354 8.98236 18.7664 10.0395C19.1975 11.0967 19.2835 12.263 19.0122 13.3719C18.7408 14.4808 18.1261 15.4757 17.2557 16.2144C16.3852 16.9531 15.3037 17.398 14.1654 17.4854L5.83203 17.5012C3.03537 17.2729 0.832032 14.9362 0.832032 12.0845ZM14.0387 15.8237C14.8269 15.7631 15.5758 15.455 16.1784 14.9433C16.781 14.4317 17.2065 13.7427 17.3941 12.9747C17.5817 12.2068 17.5218 11.3992 17.223 10.6673C16.9243 9.93546 16.4018 9.31673 15.7304 8.89952L15.0579 8.48035L14.9579 7.69535C14.8021 6.49009 14.2128 5.3828 13.3 4.58043C12.3873 3.77805 11.2136 3.33551 9.99828 3.33551C8.783 3.33551 7.6093 3.77805 6.69655 4.58043C5.7838 5.3828 5.19447 6.49009 5.0387 7.69535L4.9387 8.48035L4.26787 8.89952C3.59645 9.31668 3.07402 9.93534 2.7752 10.6671C2.47637 11.3989 2.41644 12.2065 2.60395 12.9744C2.79147 13.7423 3.21684 14.4313 3.81932 14.943C4.4218 15.4547 5.17057 15.7629 5.9587 15.8237L6.10287 15.8345H13.8945L14.0387 15.8237ZM10.832 10.0012H13.332L9.9987 14.1679L6.66537 10.0012H9.16537V6.66785H10.832V10.0012Z"
                                fill="#2E3A59"
                            />
                        </svg>
                    </div> */}
                </div>
                <div className="row-span-7 col-span-1">
                    <TableGroups />
                </div>
                <div className="row-span-1 col-span-1 border-t border-ooolab_bar_color flex items-center justify-between">
                    <p className="text-ooolab_dark_2 text-ooolab_xs font-semibold leading-ooolab_24px">
                        Showing 1-50 of 976
                    </p>
                    <div>
                        <Pagination
                            onClickPagination={() => {}}
                            perPage={10}
                            total={500}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentList;
