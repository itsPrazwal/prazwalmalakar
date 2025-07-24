"use client"

import {useEffect, useRef, useState} from "react";
import {IWeather} from "@/types/weather";
import {GoX} from "react-icons/go";
import clsx from "clsx";
import {LoaderSpin} from "@/components/Loader";
import Image from "next/image";
import {getFormattedDateTime, getGeoLocation} from "@/utils/general";
import Link from "next/link";

const getWindDirection = (deg: number) => {
  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ];
  return directions[Math.round(deg / 22.5) % 16];
}

function WeatherContent(weather: IWeather, counter = 30) {

  const kelvinToCelsius = (temp: number) => Math.round(temp - 273.15);

  const stats = [
    {
      label: "Humidity",
      value: `${weather.main.humidity}%`
    },
    {
      label: "Wind Speed",
      value: `${weather.wind.speed} m/s ${getWindDirection(weather.wind.deg)}`
    },
    {
      label: "Pressure",
      value: `${weather.main.pressure} hPa`
    },
    {
      label: "Visibility",
      value: `${weather.visibility / 1000} km`
    },
    {
      label: "Sunrise",
      value: getFormattedDateTime(weather.sys.sunrise * 1000).timeS
    },
    {
      label: "Sunset",
      value: getFormattedDateTime(weather.sys.sunset * 1000).timeS
    }
  ]

  return (
    <>
      <div className="bg-white w-full flex flex-col items-center justify-between">
        <div className="flex items-center justify-center gap-x-4 p-4">
          <Image
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            width={80}
            height={80}
            className=""
          />
          <p className="text-gray-700 font-semibold">
            <span className="text-7xl font-bold">
              {Math.round(weather.main.temp - 273.15)}°
            </span>
            <span className="text-gray-500 text-xs ml-2">
              Feels Like <strong className="text-2xl">{kelvinToCelsius(weather.main.feels_like)}°</strong>
            </span>
          </p>
        </div>
        <p className="text-gray-700 p-2 text-center bg-gray-100 w-full text-xl">
          {`${weather.name}, ${weather.sys.country}`}
        </p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2">
        <p className="col-span-2 text-gray-700 text-lg">
          {weather.weather[0].main} | {weather.weather[0].description}
        </p>
        {stats.map((stat) => (
          <p key={stat.label} className=" text-xs tracking-wider text-gray-500">
            {stat.label}: <br />
            <strong className="text-lg text-gray-700">{stat.value}</strong>
          </p>
        ))}
      </div>
      <div>
        <p className="text-gray-500 text-xs text-center mb-2">
          Auto refreshes in <strong className="text-lg">{(counter / 20).toFixed(0)}</strong> seconds
        </p>
        <p className="text-xs  text-center bg-gray-700 py-1 text-white">
          data source: <Link href={"https://openweathermap.org"} className=" hover:underline"
                           target="_blank">OpenWeather</Link>
        </p>
      </div>
    </>
  )
}

export function CurrentWeather() {

  const [weather, setWeather] = useState<IWeather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showWeather, setShowWeather] = useState<boolean>(false)
  const [counter, setCounter] = useState<number>(1);

  const weatherCircle = useRef<HTMLDivElement | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {

      const {coords: {latitude: lat, longitude: lon}} = await getGeoLocation();
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}`);

      if (!res.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const weatherData: IWeather = await res.json();
      setWeather(weatherData);
      setCounter(1200); // Reset counter to 60 seconds

    } catch (err) {
      setError((err as Error)?.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {

      if (!error) {
        const angle = ((counter - 1 % 59) / 1200) * 360
        if (weatherCircle.current) {
          weatherCircle.current.style.background = `conic-gradient(#e5e7eb ${angle}deg, black ${angle}deg)`;
        }
        if (counter !== 1) {
          setCounter(prev => prev - 1);
        } else {
          fetchWeather();
          clearInterval(interval)
        }
      }


    }, 50);

    return () => clearInterval(interval);
  }, [counter, error]);

  return (
    <div className="fixed top-16 right-8">
      <div
        ref={weatherCircle}
        itemType="button"
        className="relative h-14 w-14 rounded-full shadow-md shadow-gray-200 p-1  bg-[conic-gradient(#e5e7eb_0deg,_black_0deg)] transition-all duration-1000 cursor-pointer"
        onClick={() => {
          setShowWeather(!showWeather)
        }}
      >
        <div className="rounded-full h-full w-full text-xl flex items-center justify-center bg-white hover:bg-gray-50">
          {showWeather ? (
            <GoX className="w-6 h-6" />
          ) : (
            <>
              <p title={error ? error : "Current Temperature"} className="text-gray-700 font-semibold">
                {loading ?
                  <LoaderSpin className="h-6 w-6" />
                  : error
                    ? "ERR"
                    : weather
                      ? `${Math.round(weather.main.temp - 273.15)}°C`
                      : "N/A"
                }
              </p>
            </>
          )}
        </div>
      </div>
      <div
        className={clsx("rounded-lg shadow-lg w-80 uppercase absolute right-16 top-0 overflow-hidden transition-all", {
          "h-[435px] border z-50": showWeather,
          "h-0 border-none -z-50": !showWeather
        })}>

        {loading
          ? <div className="flex gap-x-4 h-full w-full items-center justify-center"><LoaderSpin
            className="h-10 w-10" /> Loading...</div>
          : error
            ? <div className="flex flex-col gap-x-4 h-full w-full items-center justify-center">
              <div className="block text-4xl mb-4">ERROR !</div>
              <div>{error}</div>
            </div>
            : weather
              ? WeatherContent(weather, counter)
              : "No data available"
        }
      </div>
    </div>
  )
}

