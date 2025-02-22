"use client"

import {useEffect, useRef, useState} from "react"
import Link from "next/link";
import Image from "next/image";

import prazwalImage from "@/assets/images/prazwalmalakar.png"
import {Logo} from "@/assets/icons/logo"

const sliderContent = [
  "Senior Software Engineer",
  "Master’s in IT (La Trobe University)",
  "Full-stack Developer",
  "React.js | Node.js | TypeScript",
  "Cloud Computing | CI/CD | Microservices",
  "Test Automation | Scalable Applications",
]

const countDownDate = new Date("Mar 30, 2025 00:00:00").getTime()

const setCounterFunc = (now: number) => {
  const distance = countDownDate - now
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}


export default function Home() {

  const [counter, setCounter] = useState(setCounterFunc(Date.now()))

  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    setInterval(() => {
      setCounter(setCounterFunc(Date.now()))
    }, 1000)

    let count = 0

    const slideFunc = () => {
      if (sliderRef.current) {
        sliderRef.current.textContent = sliderContent[count++]
        sliderRef.current.classList.remove('-translate-x-full')
        const tempTimeout = setTimeout(() => {
          if (sliderRef.current) {
            sliderRef.current.classList.add('-translate-x-full')
          }
          clearTimeout(tempTimeout)
        }, 5000)
      }
    }

    slideFunc()

    setInterval(() => {
      if (sliderRef.current) {
        if (count === sliderContent.length) count = 0
        slideFunc()
      }
    }, 6000)
  }, [])

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="row-start-2 grid grid-cols-12 sm:gap-x-12 gap-y-8">
        <div className="h-8/12 sm:col-span-4 col-span-12  flex items-center justify-center overflow-hidden">
          <Image src={prazwalImage} alt={"prazwalmalakar"} height={450} width={450}/>
        </div>
        <div className="sm:col-span-8 col-span-12 flex flex-col sm:gap-12 gap-8 items-center sm:items-start overflow-hidden h-8/12">
          <div>
            <h1 className="sm:text-5xl flex sm:flex-row flex-col items-center gap-4 text-4xl">
              <Logo width={30} height={30} />
              PRAZWAL MALAKAR
            </h1>
            <div
              ref={sliderRef}
              className="bg-gray-800 text-white text-center sm:text-lg text-sm -translate-x-full transition-transform duration-500 uppercase"
            />
          </div>
          <Link
            target={"_blank"}
            href={"https://www.linkedin.com/in/prazwal-malakar-4a214b1b1/"}
            className="font-semibold text-gray-700 animate-bounce"
          >
            View LinkedIn Profile
          </Link>
          <p className="w-11/12 text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            I am a dedicated and results-driven software engineer with a strong foundation in full-stack development,
            specializing in TypeScript, React.js, Node.js, and cloud computing. Currently pursuing a Master’s in
            Information Technology (AI), I have a keen interest in building scalable, high-performance applications and
            implementing modern software development practices such as CI/CD, microservices, and test automation. My
            adaptability, problem-solving skills, and passion for continuous learning enable me to contribute
            effectively
            to dynamic and innovative teams. With a proactive approach to tackling challenges, I am eager to leverage my
            skills to drive impactful technological solutions.
          </p>
          <ol className="list-inside text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2">Thank you for your visit.</li>
            <li>I will be releasing the final website in :</li>
            <li className="text-xl font-semibold mt-2">{counter}</li>
          </ol>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <div>© 2025 Prazwal Malakar. All rights reserved. Unauthorized use or duplication of any content without
          permission is prohibited.
        </div>
      </footer>
    </div>
  )
}
