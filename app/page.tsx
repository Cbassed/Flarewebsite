"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function Home() {
   // Generate random number between 1-9 for a static image
   const randomImageNumber = useMemo(() => Math.floor(Math.random() * 9) + 1, []);
   // Only track image fade-in state
   const [imageLoaded, setImageLoaded] = useState(false);
   // State for modal visibility
   const [isModalOpen, setIsModalOpen] = useState(false);
   // State for modal animation
   const [isModalVisible, setIsModalVisible] = useState(false);
   // Ref for modal content to detect outside clicks
   const modalRef = useRef(null);

   useEffect(() => {
      // Wait 1 second before starting the fade-in
      const timer = setTimeout(() => {
         setImageLoaded(true);
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
   }, []);

   // Handle modal open/close with animation
   useEffect(() => {
      if (isModalOpen) {
         // Modal is opening
         document.body.style.overflow = "hidden"; // Prevent scrolling
         setIsModalVisible(true);
      } else {
         // Modal is closing
         setIsModalVisible(false);
         // Wait for animation to finish before removing from DOM
         const timer = setTimeout(() => {
            document.body.style.overflow = ""; // Re-enable scrolling
         }, 300);
         return () => clearTimeout(timer);
      }
   }, [isModalOpen]);

   // Handle outside clicks
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsModalOpen(false);
         }
      }

      // Add event listener when modal is open
      if (isModalOpen) {
         document.addEventListener("mousedown", handleClickOutside);
      }

      // Cleanup
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [isModalOpen]);

   return (
      <div className="bg-black">
         <div className="flex h-screen min-h-screen flex-col justify-center">
            {/* Background Image with fade-in effect */}
            <div className="pointer-events-none absolute left-0 top-0 size-full">
               <div className="pointer-events-none relative size-full overflow-hidden rounded-xl">
                  <div className="absolute size-full">
                     <img
                        src={`/${randomImageNumber}.jpg`}
                        alt="Background image"
                        className="pointer-events-none absolute size-full object-cover object-center"
                        style={{
                           opacity: imageLoaded ? 1 : 0,
                           transition: "opacity 2000ms ease-in-out",
                        }}
                        // width={800}
                        // height={600}
                        // priority
                     />
                  </div>

                  {/* Overlay */}
                  <div className="pointer-events-none absolute size-full bg-black/60" />
               </div>
            </div>

            {/* Content */}
            <div className="flex w-full flex-col items-center justify-center z-10 relative font-mono ">
               <img src="Logo SVG-03.png" className="h-36 mt-12" alt="" />

               <div className="mt-[-20px] w-[400px] flex flex-col items-center justify-center gap-4 text-sm">
                  <input
                     type="tel"
                     placeholder="Enter your phone number"
                     className="border border-neutral-500 rounded-md px-4 py-5 cursor-pointer hover:bg-neutral-700 transition-all duration-300 backdrop-blur-md w-full focus:outline-none"
                  />
                  <div className="flex flex-col gap-2 w-min">
                     <button
                        className="border border-neutral-500 rounded-md px-4 py-1 cursor-pointer hover:bg-neutral-700 transition-all duration-300 backdrop-blur-md w-full"
                        onClick={() => setIsModalOpen(true)}
                     >
                        about
                     </button>
                     <div className="flex flex-row gap-2 w-min">
                        <a
                           href="https://www.instagram.com/fl.4re"
                           target="_blank"
                           className="border grid place-items-center border-neutral-500 rounded-md px-4 py-1 cursor-pointer hover:bg-neutral-700 transition-all duration-300 backdrop-blur-md w-full"
                        >
                           <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 448 512"
                              className="h-4"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                           </svg>
                        </a>
                        <a
                           href="mailto:flare8154@gmail.com"
                           className="border border-neutral-500 rounded-md px-4 py-1 cursor-pointer hover:bg-neutral-700 transition-all duration-300 backdrop-blur-md w-full"
                        >
                           contact
                        </a>
                     </div>
                  </div>
               </div>
            </div>

            {/* Modal with transitions */}
            {isModalOpen && (
               <div
                  className={`fixed inset-0 z-50 flex items-center font-mono text-sm justify-center transition-opacity duration-300 ease-in-out ${
                     isModalVisible ? "opacity-100" : "opacity-0"
                  }`}
               >
                  {/* Backdrop */}
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

                  {/* Modal Content */}
                  <div
                     ref={modalRef}
                     className={`relative bg-black border border-neutral-700 rounded-lg p-8 max-w-lg w-full mx-4 shadow-lg transition-all duration-300 ease-in-out ${
                        isModalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                     }`}
                  >
                     <button
                        className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors duration-200"
                        onClick={() => setIsModalOpen(false)}
                     >
                        <X size={24} />
                     </button>
                     <div className="text-white">
                        <h2 className="text-xl font-semibold mb-4">About Us</h2>
                        <p className="mb-3">Welcome to our platform. We are dedicated to providing exceptional experiences and products.</p>
                        <p className="mb-3">Our mission is to create innovative solutions that make a positive impact on people&apos;s lives.</p>
                        <p className="mb-3">
                           Founded in 2023, we have been working tirelessly to build a brand that resonates with our audience and delivers value.
                        </p>
                        <p className="mb-3">We believe in sustainability, quality, and exceptional customer service.</p>
                        <p>Thank you for joining us on this journey. We look forward to serving you and exceeding your expectations.</p>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
