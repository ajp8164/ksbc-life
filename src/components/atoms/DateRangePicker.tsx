import { Calendar, CalendarProps } from 'react-native-calendars';
import { DateData, MarkedDates, Theme } from 'react-native-calendars/src/types';

import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { useSetState } from '@react-native-ajp-elements/core';

/** Example:
 * 
  <DateRangePicker
    style={{
      backgroundColor: theme.colors.listItemBackgroundAlt,
      borderRadius: 10,
      paddingBottom: 10,
    }}
    theme={{
      markColor: theme.colors.brandSecondary,
      markTextColor: theme.colors.white,
      calendarBackground: theme.colors.listItemBackgroundAlt,
      textDisabledColor: theme.colors.textDim,
      todayBackgroundColor: theme.colors.brandPrimary,
    }}
    minDate={DateTime.now().toISO()}
    initialRange={
      formik.values.schedule.startDate
        ? {
            fromDate: DateTime.fromISO(
              formik.values.schedule.startDate,
            ).toJSDate(),
            toDate: formik.values.schedule.endDate
              ? DateTime.fromISO(
                  formik.values.schedule.endDate,
                ).toJSDate()
              : undefined,
          }
        : undefined
    }
    onSuccess={onDateRangeSelect}
  />

  const onDateRangeSelect = (startDate: string, endDate?: string) => {
    formikRef.current?.setFieldValue(
      'schedule.startDate',
      DateTime.fromFormat(startDate, 'yyyy-MM-dd').toISO(),
    );
    if (endDate) {
      formikRef.current?.setFieldValue(
        'schedule.endDate',
        DateTime.fromFormat(endDate, 'yyyy-MM-dd').toISO(),
      );
    } else {
      formikRef.current?.setFieldValue('schedule.endDate', '');
    }
  };
*
*/
const today = DateTime.now().toFormat('yyyy-MM-dd');

interface DateRangePickerInterface extends CalendarProps {
  initialRange?: {
    fromDate: Date;
    toDate?: Date;
  };
  onSuccess: (fromDate: string, day?: string) => void;
  theme: Theme & { markColor: string; markTextColor: string };
}

const DateRangePicker = ({
  initialRange,
  onSuccess,
  theme,
  ...props
}: DateRangePickerInterface) => {
  const [rangeData, setRangeData] = useSetState({
    fromDate: initialRange?.fromDate.toISOString().split('T')[0],
    isFromDatePicked: false,
    isToDatePicked: false,
    markedDates: {},
  });

  useEffect(() => {
    if (!initialRange) {
      const markedDates = {};
      checkToday(markedDates);
      setRangeData({ markedDates, fromDate: today });
      return;
    }
    const { fromDate: initialFromDate, toDate: initialToDate } = initialRange;
    const fromDate = initialFromDate.toISOString().split('T')[0];
    const toDate = initialToDate && initialToDate.toISOString().split('T')[0];
    const initialMarkedDates = {
      [fromDate]: {
        startingDay: true,
        color: theme.markColor,
        textColor: theme.markTextColor,
      },
    };
    const { markedDates, range: _range } = setupMarkedDates(
      fromDate,
      toDate,
      initialMarkedDates,
    );
    setRangeData({ markedDates, fromDate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupMarkedDates = (
    fromDate: string,
    toDate = '',
    markedDates: MarkedDates,
  ) => {
    const mFromDate = DateTime.fromFormat(fromDate, 'yyyy-MM-dd');
    const mToDate = DateTime.fromFormat(toDate, 'yyyy-MM-dd');
    const range = mToDate.diff(mFromDate, 'days').days;
    if (range >= 0) {
      if (range === 0) {
        markedDates = {
          [toDate]: {
            startingDay: true,
            endingDay: true,
            color: theme.markColor,
            textColor: theme.markTextColor,
          },
        };
      } else {
        let tempDate = mFromDate;
        for (let i = 1; i <= range; i++) {
          tempDate = tempDate.plus({ days: 1 });
          const tempDateStr = tempDate.toFormat('yyyy-MM-dd');
          if (i < range) {
            markedDates[tempDateStr] = {
              color: theme.markColor,
              textColor: theme.markTextColor,
            };
          } else {
            markedDates[tempDateStr] = {
              endingDay: true,
              color: theme.markColor,
              textColor: theme.markTextColor,
            };
          }
        }
      }
    }
    checkToday(markedDates);
    return { markedDates, range };
  };

  const setupStartMarker = (date: DateData) => {
    const markedDates = {
      [date.dateString]: {
        startingDay: true,
        color: theme.markColor,
        textColor: theme.markTextColor,
      },
    };
    checkToday(markedDates);
    setRangeData(
      {
        fromDate: date.dateString,
        isFromDatePicked: true,
        isToDatePicked: false,
        markedDates: markedDates,
      },
      { assign: true },
    );
  };

  const onDayPress = (day: DateData) => {
    if (
      !rangeData.isFromDatePicked ||
      (rangeData.isFromDatePicked && rangeData.isToDatePicked) ||
      (rangeData.fromDate &&
        DateTime.fromFormat(day.dateString, 'yyyy-MM-dd').diff(
          DateTime.fromFormat(rangeData.fromDate, 'yyyy-MM-dd'),
          'days',
        ).days < 0)
    ) {
      setupStartMarker(day);
      onSuccess(day.dateString);
    } else if (!rangeData.isToDatePicked && rangeData.fromDate) {
      const md = { ...rangeData.markedDates };
      const { markedDates, range } = setupMarkedDates(
        rangeData.fromDate,
        day.dateString,
        md,
      );
      if (range >= 0) {
        setRangeData({
          isFromDatePicked: true,
          isToDatePicked: true,
          markedDates,
        });
        onSuccess(rangeData.fromDate, day.dateString);
      } else {
        setupStartMarker(day);
      }
    }
  };

  const checkToday = (markedDates: MarkedDates) => {
    if (!markedDates[today]) {
      markedDates[today] = {
        startingDay: true,
        endingDay: true,
        color: theme.todayBackgroundColor,
        textColor: theme.markTextColor,
      };
    }
  };

  return (
    <Calendar
      {...props}
      theme={theme}
      markingType={'period'}
      current={rangeData.fromDate}
      markedDates={rangeData.markedDates}
      onDayPress={onDayPress}
    />
  );
};

export default DateRangePicker;
