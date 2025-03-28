"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";

export default function Home() {
   const totalImages = 9;
   // State for current and next image
   const [currentImageIndex, setCurrentImageIndex] = useState(1);
   const [nextImageIndex, setNextImageIndex] = useState<number | null>(null);
   
   // State for image transitions
   const [imageLoaded, setImageLoaded] = useState(false);
   const [isTransitioning, setIsTransitioning] = useState(false);
   
   // Track preloaded images
   const [imagesPreloaded, setImagesPreloaded] = useState(false);
   const [, setPreloadedImages] = useState({});
   
   // State for modal visibility
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const modalRef = useRef<HTMLDivElement>(null);
   
   // Reference to signup section for accessibility
   const signupRef = useRef<HTMLDivElement>(null);
   
   // Track if user is in signup section
   const [isInSignupSection, setIsInSignupSection] = useState(false);
   const [lastScrollY, setLastScrollY] = useState(0);

   // Phone number submission states
   const [phoneNumber, setPhoneNumber] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitMessage, setSubmitMessage] = useState('');
   const [isSuccess, setIsSuccess] = useState(false);
   
   // Track if keyboard is active
   const [isKeyboardActive, setIsKeyboardActive] = useState(false);

   // Initial image fade-in
   useEffect(() => {
      const timer = setTimeout(() => {
         setImageLoaded(true);
      }, 10);

      return () => clearTimeout(timer);
   }, []);
   
   // Add meta tag to prevent zooming on input focus
   useEffect(() => {
      // Check if the viewport meta tag exists
      let metaViewport = document.querySelector('meta[name="viewport"]');
      
      // If it doesn't exist, create it
      if (!metaViewport) {
         metaViewport = document.createElement('meta');
         (metaViewport as HTMLMetaElement).name = 'viewport';
         document.head.appendChild(metaViewport);
      }
      
      // Set the content to prevent zooming
      (metaViewport as HTMLMetaElement).content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      
      // Disable horizontal scroll
      document.body.style.overflowX = 'hidden';
      
      // Clean up
      return () => {
         // Reset the meta tag when component unmounts
         if (metaViewport) {
            (metaViewport as HTMLMetaElement).content = 'width=device-width, initial-scale=1';
         }
         document.body.style.overflowX = '';
      };
   }, []);
   
   // Handle keyboard appearance detection
   useEffect(() => {
      // Function to handle viewport resize (which occurs when keyboard appears)
      const handleResize = () => {
         // On iOS, window.visualViewport provides accurate keyboard information
         if (window.visualViewport) {
            // If the visual viewport height is significantly less than the window height
            // then the keyboard is likely active
            const keyboardActive = window.visualViewport.height < window.innerHeight * 0.8;
            setIsKeyboardActive(keyboardActive);
         } else {
            // Fallback method for browsers without visualViewport API
            // Compare window.innerHeight before and after keyboard opens
            const keyboardActive = window.innerHeight < window.outerHeight * 0.8;
            setIsKeyboardActive(keyboardActive);
         }
      };

      // Set up event listeners
      window.addEventListener('resize', handleResize);
      if (window.visualViewport) {
         window.visualViewport.addEventListener('resize', handleResize);
      }

      // Initial check
      handleResize();

      // Clean up
      return () => {
         window.removeEventListener('resize', handleResize);
         if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', handleResize);
         }
      };
   }, []);
   
   // Track scrolling to detect signup section without forcing scroll
   useEffect(() => {
      const handleScroll = () => {
         const currentScrollY = window.scrollY;
         const windowHeight = window.innerHeight;
         
         // Check if we're in the signup section (more than halfway down the viewport)
         const isInSignup = currentScrollY > windowHeight * 0.7;
         setIsInSignupSection(isInSignup);
         
         // Update last scroll position
         setLastScrollY(currentScrollY);
      };

      window.addEventListener('scroll', handleScroll);
      
      // Clean up
      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, [lastScrollY]);

   // Preload all images to ensure smooth transitions
   useEffect(() => {
      // Preload all images
      let loadedCount = 0;
      const preloaded: Record<number, boolean> = {};
      
      for (let i = 1; i <= totalImages; i++) {
         const img = new Image();
         const imagePath = `${i}.JPG`;
         
         img.onload = () => {
            console.log(`Successfully loaded image: ${imagePath}`);
            loadedCount++;
            preloaded[i] = true;
            setPreloadedImages({...preloaded});
            
            if (loadedCount === totalImages) {
               setImagesPreloaded(true);
               console.log("All images preloaded successfully");
            }
         };
         
         img.onerror = (e) => {
            console.error(`Failed to load image: ${imagePath}`, e);
            // Try lowercase extension as fallback
            const fallbackImg = new Image();
            const fallbackPath = `${i}.jpg`;
            console.log(`Attempting fallback: ${fallbackPath}`);
            
            fallbackImg.onload = () => {
               console.log(`Fallback successful: ${fallbackPath}`);
               loadedCount++;
               preloaded[i] = true;
               setPreloadedImages({...preloaded});
               
               if (loadedCount === totalImages) {
                  setImagesPreloaded(true);
               }
            };
            
            fallbackImg.onerror = () => {
               console.error(`Fallback also failed: ${fallbackPath}`);
               loadedCount++;
               if (loadedCount === totalImages) {
                  setImagesPreloaded(true);
               }
            };
            
            fallbackImg.src = fallbackPath;
         };
         
         img.src = imagePath;
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
      function handleClickOutside(event: MouseEvent) {
         if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
   const formatPhoneNumber = (value: string) => {
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
   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const formattedValue = formatPhoneNumber(value);
      setPhoneNumber(formattedValue);
   };
   
   // Validate phone number before submission
   const isValidPhoneNumber = (phone: string) => {
      // Must contain 10 digits (after removing formatting)
      const digits = phone.replace(/\D/g, '');
      return digits.length === 10;
   };
   
   // Submit phone number to API
   const handleSubmit = async (e: React.FormEvent) => {
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
      } catch (error: any) {
         setIsSuccess(false);
         setSubmitMessage(error.message || 'Failed to save your number');
      } finally {
         setIsSubmitting(false);
      }
   };

   // Add this function inside your Home component
   const scrollToSignup = () => {
      if (signupRef.current) {
         signupRef.current.scrollIntoView({ behavior: "smooth" });
      }
   };

   return (
      <div
         className="bg-black overflow-x-hidden h-screen snap-y snap-mandatory overflow-y-scroll" // Allow vertical scrolling while hiding horizontal overflow
      >
         {/* Scroll-Snap Container */}
         <div className="h-screen snap-start">
            {/* Landing Section */}
            <div
               className="min-h-screen flex flex-col items-center justify-start relative pt-8 overflow-x-hidden" // Ensure horizontal overflow is hidden
            >
               {/* Background image as a separate element with overlay */}
               <div className="absolute inset-0 z-0">
                  <div className="relative h-full w-full">
                     <img
                        src={`${currentImageIndex}.JPG`}
                        alt="Background"
                        className="absolute h-full w-full object-cover object-center"
                        onError={(e) => {
                           console.log(`Trying fallback for: ${currentImageIndex}.JPG`);
                           e.currentTarget.src = `${currentImageIndex}.jpg`;
                        }}
                     />
                     {/* Overlay */}
                     <div className="absolute inset-0 bg-black/70" />
                  </div>
               </div>

               {/* Content */}
               <div className="flex w-full flex-col items-center justify-start z-10 relative font-mono text-white px-4">
                  {/* Logo */}
                  <img 
                     src="Logo SVG-03.png" 
                     className="h-16 md:h-24 max-w-full mb-6" 
                     alt="Flare" 
                     onError={(e) => {
                        console.error("Failed to load logo");
                        e.currentTarget.style.display = 'none';
                     }} 
                  />

                  {/* App Description and Image */}
                  <div className="mt-4 flex flex-col md:flex-row items-start justify-between gap-16 px-4">
                     {/* Description */}
                     <div className="text-center md:text-left max-w-lg text-white font-mono">
                        <h2 className="text-2xl font-bold mb-4">Discover and Share</h2>
                        <p className="text-sm leading-relaxed">
                           Flare is a platform designed to help you discover small, up-and-coming brands while sharing your own outfits and brands with others. 
                           Join a community of creators and explorers, and send out your flare to the world!
                        </p>
                     </div>

                     {/* Image */}
                     <div className="w-full max-w-sm -mt-8 md:mt-0">
                        <img
                           src="/apppreview.jpg"
                           alt="App Description"
                           className="w-full h-auto rounded-lg shadow-lg"
                        />
                     </div>
                  </div>
               </div>

               {/* Arrows and "Sign Up" Text */}
               <div className="absolute bottom-8 flex flex-col items-center justify-center animate-bounce">
                  <span className="text-white text-sm font-mono mb-2">Sign Up</span>
                  <ChevronDown className="text-white h-6 w-6" />
               </div>
            </div>
         </div>


         {/* Signup Section */}
         <div 
            id="signup"
            ref={signupRef}
            className="h-screen snap-start flex flex-col items-center justify-center bg-black/90 border-t border-neutral-800 overflow-x-hidden" // Ensure horizontal overflow is hidden
         >
            <div className="w-full max-w-[400px] flex flex-col items-center justify-center gap-8 p-4">
               <h2 className="text-white text-2xl font-mono">Sign Up</h2>
               <form onSubmit={handleSubmit} className="w-full">
                  <div className="flex flex-col gap-4 w-full">
                     <input
                        type="tel"
                        placeholder="Enter your phone number (xxx) xxx-xxxx"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        className="border border-neutral-500 text-neutral-300 rounded-md px-4 py-3 cursor-pointer hover:bg-neutral-700 transition-all duration-300 backdrop-blur-md w-full focus:outline-none text-base"
                        maxLength={14}
                        onBlur={() => (document.activeElement as HTMLElement)?.blur()}
                        style={{ fontSize: '16px' }}
                     />
                     <button 
                        type="submit"
                        disabled={isSubmitting || !isValidPhoneNumber(phoneNumber)}
                        className="border border-neutral-500 rounded-md px-4 py-2 cursor-pointer hover:bg-neutral-700 transition-all duration-300 backdrop-blur-md w-full disabled:opacity-50 disabled:cursor-not-allowed text-white"
                     >
                        {isSubmitting ? 'Saving...' : 'Submit'}
                     </button>
                  </div>
               </form>

               {submitMessage && (
                  <div className={`w-full px-4 py-2 rounded-md border ${isSuccess ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'} bg-neutral-900`}>
                     {submitMessage}
                  </div>
               )}
               
               <div className="flex gap-4">
                  <a
                     href="mailto:flare8154@gmail.com"
                     className="border border-neutral-500 rounded-md px-4 py-1 cursor-pointer hover:bg-neutral-700 transition-all duration-300 backdrop-blur-md text-white"
                  >
                     contact
                  </a>
                  <a
                     href="https://www.instagram.com/fl.4re"
                     target="_blank"
                     rel="noreferrer"
                     className="border grid place-items-center border-neutral-500 rounded-md px-4 py-1 cursor-pointer hover:bg-neutral-700 transition-all duration-300 backdrop-blur-md text-white"
                  >
                     {/* Instagram Icon */}
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                     >
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6-7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                     </svg>
                  </a>
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
                     <p className="mb-3">Send out your flare</p>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}