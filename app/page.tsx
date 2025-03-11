"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Home() {
   const totalImages = 9;
   // State for current and next image
   const [currentImageIndex, setCurrentImageIndex] = useState(1);
   const [nextImageIndex, setNextImageIndex] = useState(null);
   
   // State for image transitions
   const [imageLoaded, setImageLoaded] = useState(false);
   const [isTransitioning, setIsTransitioning] = useState(false);
   
   // Track preloaded images
   const [imagesPreloaded, setImagesPreloaded] = useState(false);
   const [preloadedImages, setPreloadedImages] = useState({});
   
   // State for modal visibility
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const modalRef = useRef(null);

   // Phone number submission states
   const [phoneNumber, setPhoneNumber] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitMessage, setSubmitMessage] = useState('');
   const [isSuccess, setIsSuccess] = useState(false);

   // Initial image fade-in
   useEffect(() => {
      const timer = setTimeout(() => {
         setImageLoaded(true);
      }, 10);

      return () => clearTimeout(timer);
   }, []);

   // Preload all images to ensure smooth transitions
   useEffect(() => {
      // Preload all images
      let loadedCount = 0;
      const preloaded = {};
      
      for (let i = 1; i <= totalImages; i++) {
         const img = new Image();
         img.onload = () => {
            loadedCount++;
            preloaded[i] = true;
            setPreloadedImages({...preloaded});
            
            if (loadedCount === totalImages) {
               setImagesPreloaded(true);
               console.log("All images preloaded successfully");
            }
         };
         img.onerror = () => {
            console.error(`Failed to load image ${i}.JPG`);
            // Still increment to avoid getting stuck
            loadedCount++;
            if (loadedCount === totalImages) {
               setImagesPreloaded(true);
            }
         };
         // Use correct path format
         img.src = `${i}.JPG`;
      }
   }, []);

   // Image cycling
   useEffect(() => {
      // Only start cycling after initial image has loaded and all images are preloaded
      if (!imageLoaded || !imagesPreloaded) return;
      
      const cycleInterval = setInterval(() => {
         // Calculate next image index (sequential from 1 to totalImages)
         const newIndex = currentImageIndex >= totalImages ? 1 : currentImageIndex + 1;
         
         // Set the next image index first
         setNextImageIndex(newIndex);
         
         // Then start transition
         setIsTransitioning(true);
         
         // Wait for fade transition to complete, then update current image
         setTimeout(() => {
            setCurrentImageIndex(newIndex);
            // Keep transitioning for a moment to ensure smooth fade
            setTimeout(() => {
               setIsTransitioning(false);
            }, 300); // Small buffer after changing current image
         }, 2000); // Match the transition time
         
      }, 5000); // Increase interval to allow for complete transition (2s transition + buffer)
      
      return () => clearInterval(cycleInterval);
   }, [imageLoaded, imagesPreloaded, currentImageIndex]);

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
      function handleClickOutside(event) {
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
   
   useEffect(() => {
      // If there's a submit message, set a timer to clear it after 5 seconds
      if (submitMessage) {
         const timer = setTimeout(() => {
            setSubmitMessage('');
          }, 5000); // 5 seconds
         
         // Clean up the timer when component unmounts or message changes
         return () => clearTimeout(timer);
      }
   }, [submitMessage]); // This will run whenever submitMessage changes
   
   // Format phone number as user types
   const formatPhoneNumber = (value) => {
      // Remove all non-digit characters
      const digits = value.replace(/\D/g, '');
      
      // Format based on number of digits
      if (digits.length <= 3) {
         return digits;
      } else if (digits.length <= 6) {
         return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else {
         return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
   };
   
   // Handle phone input changes
   const handlePhoneChange = (e) => {
      const value = e.target.value;
      const formattedValue = formatPhoneNumber(value);
      setPhoneNumber(formattedValue);
   };
   
   // Validate phone number before submission
   const isValidPhoneNumber = (phone) => {
      // Must contain 10 digits (after removing formatting)
      const digits = phone.replace(/\D/g, '');
      return digits.length === 10;
   };
   
   // Submit phone number to API
   const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!phoneNumber) {
         setIsSuccess(false);
         setSubmitMessage('Please enter a phone number');
         return;
      }
      
      if (!isValidPhoneNumber(phoneNumber)) {
         setIsSuccess(false);
         setSubmitMessage('Please enter a valid 10-digit phone number');
         return;
      }
      
      setIsSubmitting(true);
      setSubmitMessage('');
      
      try {
         const response = await fetch('/api/phone', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber }),
         });
         
         const result = await response.json();
         
         if (!response.ok) {
            throw new Error(result.error || 'Something went wrong');
         }
         
         // Success!
         setIsSuccess(true);
         setSubmitMessage('Thank you! We received your number.');
         setPhoneNumber('');
      } catch (error) {
         setIsSuccess(false);
         setSubmitMessage(error.message || 'Failed to save your number');
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="bg-black">
         <div className="flex h-screen min-h-screen flex-col justify-center">
            {/* Background Image with fade-in effect */}
            <div className="pointer-events-none absolute left-0 top-0 size-full">
               <div className="pointer-events-none relative size-full overflow-hidden rounded-xl">
                  {/* Current image */}
                  <div className="absolute size-full">
                     <img
                        src={`/${currentImageIndex}.JPG`}
                        alt="Background image"
                        className="pointer-events-none absolute size-full object-cover object-center"
                        style={{
                           opacity: imageLoaded && !isTransitioning ? 1 : 0,
                           transition: "opacity 2000ms ease-in-out",
                        }}
                        onError={(e) => {
                           console.error(`Failed to load current image: ${currentImageIndex}.JPG`);
                           e.currentTarget.style.display = 'none';
                        }}
                     />
                  </div>
                  
                  {/* Next image (for smooth transition) - always render but control opacity */}
                  <div className="absolute size-full">
                     {nextImageIndex && (
                        <img
                           src={`/${nextImageIndex}.JPG`}
                           alt="Next background image"
                           className="pointer-events-none absolute size-full object-cover object-center"
                           style={{
                              opacity: isTransitioning ? 1 : 0,
                              transition: "opacity 2000ms ease-in-out",
                           }}
                           onError={(e) => {
                              console.error(`Failed to load next image: ${nextImageIndex}.JPG`);
                              e.currentTarget.style.display = 'none';
                           }}
                        />
                     )}
                  </div>

                  {/* Overlay */}
                  <div className="pointer-events-none absolute size-full bg-black/60" />
               </div>
            </div>

            {/* Content */}
            <div className="flex w-full flex-col items-center justify-center z-10 relative font-mono text-white">
               <img src="Logo SVG-03.png" className="h-36 mt-12" alt="" />

               <div className="mt-[-20px] w-[400px] flex flex-col items-center justify-center gap-4 text-sm">
                  <form onSubmit={handleSubmit} className="w-full">
                     <div className="flex flex-col gap-2 w-full">
                        <input
                           type="tel"
                           placeholder="Enter your phone number (xxx) xxx-xxxx"
                           value={phoneNumber}
                           onChange={handlePhoneChange}
                           className="border border-neutral-500 text-neutral-300 rounded-md px-4 py-5 cursor-pointer hover:bg-neutral-700 transition-all duration-300 backdrop-blur-md w-full focus:outline-none"
                           maxLength={14} // (xxx) xxx-xxxx = 14 chars
                        />
                        <button 
                           type="submit"
                           disabled={isSubmitting || !isValidPhoneNumber(phoneNumber)}
                           className="border border-neutral-500 rounded-md px-4 py-2 cursor-pointer hover:bg-neutral-700 transition-all duration-300 backdrop-blur-md w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isSubmitting ? 'Saving...' : 'Submit'}
                        </button>
                     </div>
                  </form>

                  {submitMessage && (
                     <div className={`w-full px-4 py-2 rounded-md border ${
                        isSuccess 
                           ? 'bg-red-700 text-white border-red-500' 
                           : 'bg-red-900/50 text-red-200'
                     }`} style={{ backgroundColor: '#FE3D14' }}>
                        {submitMessage}
                     </div>
                  )}
                                   
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
                        <p className="mb-3">A platform for helping you reach discovery.</p>
                        <p className="mb-3">
                           Discover small up and coming brands while also sharing your own outfits and brands with others.
                        </p>
                        <p className="mb-3"> Send out your flare </p>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}