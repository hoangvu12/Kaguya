import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
import weekDay from "dayjs/plugin/weekDay";

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);
dayjs.extend(weekDay);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "%s nữa",
    past: "%s trước",
    s: "vài giây",
    m: "một phút",
    mm: "%d phút",
    h: "một tiếng",
    hh: "%d tiếng",
    d: "một ngày",
    dd: "%d ngày",
    M: "một tháng",
    MM: "%d tháng",
    y: "một năm",
    yy: "%d năm",
  },
});

export default dayjs;
