import months from './months';

interface FormatTimeOptions {
  time?: boolean;
  numeric?: boolean;
}

const formatDate = (date: Date | string, options: FormatTimeOptions = { time: false, numeric: false }): string => {
  const { time, numeric } = options
  const placeholderdate = typeof date === 'string' ? new Date(date) : date;

  function addTime(str: string): string {
    const concated = str.concat(` ${placeholderdate.getHours()}:${placeholderdate.getMinutes().toString().padEnd(2, '0')}`);
    return concated
  }
  if (numeric) {
    let formatted = `${placeholderdate.getMonth() + 1}/${placeholderdate.getDate()}/${placeholderdate.getFullYear().toString().substring(2)}`;
    if (time) {
      formatted = addTime(formatted)
    }
    return formatted
  }

  let formatted = `${months[placeholderdate.getMonth()].substring(0, 3)} ${placeholderdate.getDate()}, ${placeholderdate.getFullYear()}`;
  if (time) {
    formatted = addTime(formatted)
  }
  return formatted
};

export default formatDate;
