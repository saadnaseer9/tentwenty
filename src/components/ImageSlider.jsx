"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';

// Slide data type for better maintainability
const SLIDE_DATA = [
  {
    id: 1,
    imageUrl: "https://images.pexels.com/photos/2249602/pexels-photo-2249602.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Client 1",
    location: "Dubai, United Arab Emirates"
  },
  {
    id: 2,
    imageUrl: "https://images.pexels.com/photos/1840623/pexels-photo-1840623.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Client 2",
    location: "London, United Kingdom"
  },
  {
    id: 3,
    imageUrl: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Client 3",
    location: "New York, United States"
  },
  {
    id: 4,
    imageUrl: "https://images.pexels.com/photos/1840623/pexels-photo-1840623.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Client 4",
    location: "London, United Kingdom"
  },
  {
    id: 5,
    imageUrl: "https://images.pexels.com/photos/2249602/pexels-photo-2249602.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Client 5",
    location: "Dubai, United Arab Emirates"
  }
];

// Constants for better maintainability
const DRAG_THRESHOLD = 100;
const MAX_DRAG_OFFSET = 300;
const ANIMATION_DURATION = '0.6s';
const FADE_UP_DURATION = '0.8s';

// Reusable component for individual slide
const SlideCard = ({ 
  slide, 
  index, 
  currentIndex, 
  isDragging, 
  onMouseDown, 
  onTouchStart, 
  onClick, 
  slideStyle 
}) => {
  const isActiveSlide = index === currentIndex;
  
  return (
    <div
      key={slide.id}
      className={`absolute ${isActiveSlide ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
      style={slideStyle}
      onMouseDown={isActiveSlide ? onMouseDown : undefined}
      onTouchStart={isActiveSlide ? onTouchStart : undefined}
      onClick={!isActiveSlide ? onClick : undefined}
    >
      <div className="w-72 h-80 md:w-[434px] md:h-[690px] overflow-hidden bg-white">
        <img
          src={slide.imageUrl}
          alt={slide.title}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Drag indicator for active slide */}
      {isActiveSlide && (
        <DragIndicator />
      )}

      {/* Card shadow for depth */}
      <CardShadow isActive={isActiveSlide} />
    </div>
  );
};

// Reusable drag indicator component
const DragIndicator = () => (
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
    <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
      <span className="text-gray-700 text-sm font-medium">Drag</span>
    </div>
  </div>
);

// Reusable card shadow component
const CardShadow = ({ isActive }) => (
  <div 
    className="absolute inset-0 rounded-2xl"
    style={{
      background: 'rgba(0,0,0,0.1)',
      transform: 'translateZ(-1px) translateY(8px)',
      filter: 'blur(6px)',
      zIndex: -1,
      opacity: isActive ? 0.4 : 0.2
    }}
  />
);

// Reusable slide info component
const SlideInfo = ({ slide, animationKey }) => (
  <div
    key={animationKey}
    className="text-center"
    style={{
      animation: `fadeUp ${FADE_UP_DURATION} ease-out forwards`,
    }}
  >
    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
      {slide.title}
    </h3>
    <p className="text-gray-500 text-lg">
      {slide.location}
    </p>
  </div>
);

// Reusable header component
const SectionHeader = () => (
  <div className="text-center md:mb-16">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Quality Products</h2>
    <p className="text-md md:text-lg text-gray-500 max-w-2xl mx-auto px-8">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </div>
);

// Main component
const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [slideInfoKey, setSlideInfoKey] = useState(0);
  const sliderContainerRef = useRef(null);

  // Reusable function to get client position from event
  const getClientPosition = (event) => {
    return event.touches ? event.touches[0].clientX : event.clientX;
  };

  // Reusable function to constrain drag offset
  const constrainDragOffset = (offset) => {
    return Math.max(-MAX_DRAG_OFFSET, Math.min(MAX_DRAG_OFFSET, offset));
  };

  // Reusable function to handle drag start
  const handleDragStart = useCallback((event) => {
    setIsDragging(true);
    setDragStartPosition(getClientPosition(event));
    setDragOffset(0);
  }, []);

  // Reusable function to handle drag move
  const handleDragMove = useCallback((event) => {
    if (!isDragging) return;
    const currentPosition = getClientPosition(event);
    const offset = currentPosition - dragStartPosition;
    setDragOffset(constrainDragOffset(offset));
  }, [isDragging, dragStartPosition]);

  // Reusable function to handle drag end
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    const shouldNavigate = Math.abs(dragOffset) > DRAG_THRESHOLD;
    
    if (shouldNavigate) {
      if (dragOffset > 0 && currentIndex > 0) {
        navigateToSlide(currentIndex - 1);
      } else if (dragOffset < 0 && currentIndex < SLIDE_DATA.length - 1) {
        navigateToSlide(currentIndex + 1);
      }
    }
    
    resetDragState();
  }, [isDragging, dragOffset, currentIndex]);

  // Reusable function to navigate to a specific slide
  const navigateToSlide = (newIndex) => {
    setCurrentIndex(newIndex);
    setSlideInfoKey(prev => prev + 1);
  };

  // Reusable function to reset drag state
  const resetDragState = () => {
    setIsDragging(false);
    setDragOffset(0);
  };

  // Reusable function to calculate slide transform styles
  const calculateSlideStyle = (index) => {
    const isActive = index === currentIndex;
    const isPrevious = index === currentIndex - 1;
    const isNext = index === currentIndex + 1;

    let transform = '';
    let zIndex = 1;
    let opacity = 0;

    if (isActive) {
      transform = `translateX(${dragOffset}px) translateY(0px) scale(1) rotateZ(0deg)`;
      zIndex = 10;
      opacity = 1;
    } else if (isPrevious) {
      transform = `translateX(-40vw) translateY(60px) scale(1) rotateZ(-15deg)`;
      zIndex = 5;
      opacity = 1;
    } else if (isNext) {
      transform = `translateX(40vw) translateY(60px) scale(1) rotateZ(15deg)`;
      zIndex = 5;
      opacity = 1;
    } else {
      const offsetDirection = index < currentIndex ? -60 : 60;
      const rotationDirection = index < currentIndex ? -45 : 45;
      transform = `translateX(${offsetDirection}vw) translateY(0px) scale(0.8) rotateZ(${rotationDirection}deg)`;
      zIndex = 1;
      opacity = 0;
    }

    return {
      transform,
      zIndex,
      opacity,
      transition: isDragging && isActive ? 'none' : `all ${ANIMATION_DURATION} cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    };
  };

  // Effect to handle mouse and touch events
  useEffect(() => {
    const handleMouseMove = (e) => handleDragMove(e);
    const handleTouchMove = (e) => handleDragMove(e);
    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return (
    <section className="py-20 bg-gray-50 font-sans">
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div>
        <SectionHeader />

        {/* Slider Container */}
        <div className="relative h-[500px] md:h-[900px] overflow-hidden" ref={sliderContainerRef}>
          <div className="absolute inset-0 flex items-center justify-center">
            {SLIDE_DATA.map((slide, index) => (
              <SlideCard
                key={slide.id}
                slide={slide}
                index={index}
                currentIndex={currentIndex}
                isDragging={isDragging}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onClick={() => navigateToSlide(index)}
                slideStyle={calculateSlideStyle(index)}
              />
            ))}
          </div>
        </div>

        {/* Current Slide Info */}
        <SlideInfo 
          slide={SLIDE_DATA[currentIndex]} 
          animationKey={slideInfoKey} 
        />
      </div>
    </section>
  );
};

export default ImageSlider;