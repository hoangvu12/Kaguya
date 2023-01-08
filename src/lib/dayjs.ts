import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/vi";
import "dayjs/locale/ru";
import "dayjs/locale/es";

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);
dayjs.extend(duration);

export default dayjs;
