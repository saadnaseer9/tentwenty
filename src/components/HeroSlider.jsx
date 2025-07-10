"use client";

import { useState, useEffect, useCallback } from "react";

// Slide data for better maintainability
const SLIDE_DATA = [
  {
    id: 1,
    imageUrl: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    title: "From Our Farms",
    subtitle: "To Your Hands",
    description: "Welcome To TenTwenty Farms",
  },
  {
    id: 2,
    imageUrl: "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    title: "Fresh Harvest",
    subtitle: "Every Season",
    description: "Quality You Can Trust",
  },
  {
    id: 3,
    imageUrl: "https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    title: "Sustainable",
    subtitle: "Agriculture",
    description: "Growing For Tomorrow",
  },
];

// Constants for better maintainability
const PROGRESS_INCREMENT = 2; // 2% every 100ms
const PROGRESS_INTERVAL = 100; // 100ms

// component for background slide
const BackgroundSlide = ({ slide, isActive }) => (
  <div
    key={slide.id}
    className={`absolute inset-0 transition-all duration-1000 ease-out ${
      isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"
    }`}
  >
    <img
      src={slide.imageUrl}
      alt={slide.title}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/30" />
  </div>
);

//  component for slide content
const SlideContent = ({ slide, isActive }) => (
  <div
    key={slide.id}
    className={`transition-all duration-800 ${
      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`}
  >
    {isActive && (
      <>
        <p className="text-white/90 text-lg mb-4 animate-fade-in hero-text">
          {slide.description}
        </p>
        <h1 className="text-white text-6xl md:text-7xl font-light leading-tight mb-8 hero-text">
          <span
            className="block animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            {slide.title}
          </span>
          <span
            className="block animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            {slide.subtitle}
          </span>
        </h1>
      </>
    )}
  </div>
);

//  component for progress ring
const ProgressRing = ({ progress }) => (
  <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 120 120">
    <rect
      x="2"
      y="2"
      width="116"
      height="116"
      fill="none"
      stroke="rgba(255, 255, 255, 0.3)"
      strokeWidth="2"
    />
    <rect
      x="2"
      y="2"
      width="116"
      height="116"
      fill="none"
      stroke="white"
      strokeWidth="10"
      strokeDasharray="464"
      strokeDashoffset={464 - (progress / 100) * 464}
      className="transition-all duration-300 ease-out"
      style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.4))' }}
    />
  </svg>
);

//  component for next slide preview
const NextSlidePreview = ({ nextSlide, progress, onClick }) => (
  <div className="absolute bottom-8 left-36 z-20">
    <div
      className="relative w-[138px] h-[138px] cursor-pointer group"
      onClick={onClick}
    >
      <ProgressRing progress={progress} />
      
      {/* Centered preview image */}
      <img
        src={nextSlide.imageUrl}
        alt={nextSlide.title}
        className="absolute top-1/2 left-1/2 w-[93px] h-[93px] object-cover -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:scale-105 z-10"
      />

      {/* "Next" text overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <span className="text-white text-sm font-medium">Next</span>
      </div>
    </div>
  </div>
);

//  component for main content container
const ContentContainer = ({ children }) => (
  <div className="relative z-10 h-full flex items-center">
    <div className="max-w-7xl mx-auto px-6 w-full">
      <div className="max-w-2xl">
        {children}
      </div>
    </div>
  </div>
);

// Main HeroSlider component
const HeroSlider = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [nextSlideIndex, setNextSlideIndex] = useState(1);

  //  function to calculate next slide index
  const calculateNextSlideIndex = useCallback((currentIndex) => {
    return (currentIndex + 1) % SLIDE_DATA.length;
  }, []);

  //  function to advance to next slide
  const advanceToNextSlide = useCallback(() => {
    setCurrentSlideIndex(nextSlideIndex);
    setProgressPercentage(0);
  }, [nextSlideIndex]);

  //  function to handle manual slide navigation
  const handleManualSlideNavigation = useCallback(() => {
    advanceToNextSlide();
  }, [advanceToNextSlide]);

  //  function to update progress
  const updateProgress = useCallback((currentProgress) => {
    if (currentProgress >= 100) {
      advanceToNextSlide();
      return 0;
    }
    return currentProgress + PROGRESS_INCREMENT;
  }, [advanceToNextSlide]);

  // Effect to handle slide progression and next slide calculation
  useEffect(() => {
    const nextIndex = calculateNextSlideIndex(currentSlideIndex);
    setNextSlideIndex(nextIndex);

    const progressInterval = setInterval(() => {
      setProgressPercentage(updateProgress);
    }, PROGRESS_INTERVAL);

    return () => clearInterval(progressInterval);
  }, [currentSlideIndex, calculateNextSlideIndex, updateProgress]);

  const nextSlide = SLIDE_DATA[nextSlideIndex];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {SLIDE_DATA.map((slide, index) => (
          <BackgroundSlide
            key={slide.id}
            slide={slide}
            isActive={index === currentSlideIndex}
          />
        ))}
      </div>

      {/* Content */}
      <ContentContainer>
        {SLIDE_DATA.map((slide, index) => (
          <SlideContent
            key={slide.id}
            slide={slide}
            isActive={index === currentSlideIndex}
          />
        ))}
      </ContentContainer>

      {/* Next Image Preview */}
      <NextSlidePreview
        nextSlide={nextSlide}
        progress={progressPercentage}
        onClick={handleManualSlideNavigation}
      />
    </div>
  );
};

export default HeroSlider;