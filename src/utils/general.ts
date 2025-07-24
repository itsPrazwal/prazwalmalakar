import {DateTimeType} from "@/types/utils";

export const getFormattedDateTime = (date?: string | number): DateTimeType => {
  const now = date ? new Date(date) : new Date();

  return {
    date: now.toLocaleDateString([], {year: 'numeric', month: 'short', day: '2-digit'}),
    day: now.toLocaleDateString('en-US', {weekday: 'long'}),
    timeS: now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true}),
    time: now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true}),
    seconds: now.getSeconds(),
  };
}

export const getGeoLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async (data) => {
      resolve(data);
    }, (error) => {
      reject(error);
    }, {timeout: 10000});
  })
}