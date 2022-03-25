import dayjs from 'dayjs';
import { useBoolean } from 'hooks/custom';
import React, { forwardRef, useRef } from 'react';
import { Column, Row, TableToggleAllRowsSelectedProps } from 'react-table';
import DatePicker from 'react-datepicker';
import { SessionDateFormat, SessionServiceFormat } from 'constant/util.const';

export const EditableStartCell = ({
    value: initialValue,
    row,
    column,
    updateMyData, // This is a custom function that we supplied to our table instance
}: {
    value: any;
    row: Row;
    column: Column;
    updateMyData: (d: { id: number; value: string; index?: number }) => void;
}) => {
    const { values } = row;
    const { id, end_time } = values;
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);
    const {
        booleanValue: openCalendar,
        toggleBooleanValue: toggleOpenCalendar,
    } = useBoolean();
    const inputRef = useRef();

    const onChange = (e: Date) => {
        let tmpValue;

        if (dayjs(e).isBefore(dayjs(end_time))) {
            tmpValue = e;
        } else {
            tmpValue = dayjs(end_time).subtract(30, 'minute').toDate();
        }
        setValue(dayjs(tmpValue).format(SessionDateFormat));
        updateMyData({
            id,
            value: dayjs(tmpValue).format(SessionDateFormat),
            index: row.index,
        });
    };

    const filterTime = (time) => {
        const currentDate = dayjs(end_time);
        const selectedDate = new Date(time);

        return dayjs(selectedDate).isBefore(currentDate);
    };

    const filterDate = (time) => {
        const currentDate = dayjs(end_time);
        const selectedDate = new Date(time);

        return dayjs(selectedDate).isBefore(currentDate);
    };

    return (
        <DatePicker
            onCalendarOpen={() => toggleOpenCalendar()}
            onCalendarClose={() => toggleOpenCalendar()}
            value={value}
            onChange={onChange}
            dateFormat={SessionDateFormat}
            filterTime={filterTime}
            filterDate={filterDate}
            selected={dayjs(value).toDate()}
            className={`cursor-pointer pl-ooolab_p_1_e h-full w-2/3 border-ooolab_bar_color text-ooolab_1xs text-ooolab_dark_1 bg-transparent py-ooolab_p_2 rounded font-normal ${
                openCalendar && 'border'
            }`}
            showTimeSelect
            shouldCloseOnSelect
        />
    );
};

export const EditableEndCell = ({
    value: initialValue,
    row,
    column,
    updateMyData, // This is a custom function that we supplied to our table instance
}: {
    value: any;
    row: Row;
    column: Column;
    updateMyData: (d: { id: number; value: string; index: number }) => void;
}) => {
    const { values } = row;
    const { id, start_time } = values;
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);
    const {
        booleanValue: openCalendar,
        toggleBooleanValue: toggleOpenCalendar,
    } = useBoolean();
    const inputRef = useRef();

    const onChange = (e: Date) => {
        let tmpValue;

        if (dayjs(e).isAfter(dayjs(start_time))) {
            tmpValue = e;
        } else {
            tmpValue = dayjs(start_time).add(30, 'minute').toDate();
        }
        setValue(dayjs(tmpValue).format(SessionDateFormat));
        updateMyData({
            id,
            value: dayjs(tmpValue).format(SessionDateFormat),
            index: row.index,
        });
        // setValue(dayjs(e).format(SessionDateFormat));
        // updateMyData({
        //     id,
        //     value: dayjs(e).format(SessionDateFormat),
        //     index: row.index,
        // });
    };

    const filterTime = (time) => {
        const currentDate = dayjs(start_time);
        const selectedDate = new Date(time);

        return dayjs(selectedDate).isAfter(currentDate);
    };

    const filterDate = (time) => {
        const currentDate = dayjs(start_time);
        const selectedDate = new Date(time);

        return (
            dayjs(selectedDate).isSame(currentDate, 'day') ||
            dayjs(selectedDate).isAfter(currentDate)
        );
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue);
        inputRef.current = initialValue;
    }, [initialValue]);

    return (
        <DatePicker
            onCalendarOpen={() => toggleOpenCalendar()}
            onCalendarClose={() => toggleOpenCalendar()}
            value={value}
            onChange={onChange}
            filterTime={filterTime}
            filterDate={filterDate}
            dateFormat={SessionDateFormat}
            selected={dayjs(value).toDate()}
            className={`cursor-pointer pl-ooolab_p_1_e h-full w-2/3 border-ooolab_bar_color text-ooolab_1xs text-ooolab_dark_1 bg-transparent py-ooolab_p_2 rounded font-normal ${
                openCalendar && 'border'
            }`}
            showTimeSelect
            shouldCloseOnSelect
        />
    );
};

export const FormatColumnValue = ({ children }) => (
    <p className="pl-ooolab_p_1_e  py-ooolab_p_1 font-normal text-ooolab_dark_1 text-ooolab_1xs leading-ooolab_24px">
        {children}
    </p>
);

export const RenderGroupsHeader = ({ value }: { value: string }) => (
    <p className="text-ooolab_sm text-ooolab_dark_1 leading-ooolab_24px font-semibold">
        {value}
    </p>
);

export const IndeterminateCheckbox = React.forwardRef(
    (props: TableToggleAllRowsSelectedProps, ref: any) => {
        const { indeterminate, ...rest } = props;
        const defaultRef = React.useRef();
        const resolvedRef = ref || defaultRef;

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);
        return (
            <>
                <input
                    className="w-ooolab_w_4 h-ooolab_h_4"
                    type="checkbox"
                    ref={resolvedRef}
                    {...rest}
                />
            </>
        );
    }
);
