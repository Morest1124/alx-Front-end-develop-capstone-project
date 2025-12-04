import React from 'react';

// This component provides an engaging
const App = () => {
    // State to track the mouse position for the background effect
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

    // Custom CSS for the text flicker effect
    const animationStyles = (
        <style>
            {`
            /* Keyframes for a subtle text flicker effect (now professional cyan glow) */
            @keyframes flicker {
                0%, 100% { 
                    opacity: 1; 
                    text-shadow: 0 0 15px rgba(0, 255, 255, 0.9); /* Bright Cyan glow */
                }
                50% { 
                    opacity: 0.7; 
                    text-shadow: 0 0 5px rgba(0, 255, 255, 0.4); 
                }
            }
            /* Class to apply the flickering animation */
            .flicker-text {
                animation: flicker 1s ease-in-out infinite alternate;
            }
            `}
        </style>
    );

    // Effect to set up and clean up the mousemove listener
    React.useEffect(() => {
        const handleMouseMove = (e) => {
            // Calculate a slight movement factor to keep the effect subtle and contained
            const movementFactor = 0.02; // Reduced factor for a calmer, professional movement
            
            // Calculate distance from center
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            setMousePos({
                // Invert the movement slightly for a trailing, liquid effect
                x: (e.clientX - centerX) * movementFactor * -1,
                y: (e.clientY - centerY) * movementFactor * -1,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Style for the dynamic "Amorphous" blob background element
    const blobStyle = {
        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth, liquid-like easing
        filter: 'blur(180px)', // Increased blur for a softer, professional glow
    };


    return (
        <div className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center p-4 antialiased relative overflow-hidden">
            {/* Inject the animation styles */}
            {animationStyles}

            {/* --- The Amorphous, Mouse-Driven Background Blob --- */}
            {/* Professional Cyan and Deep Blue Blobs */}
            <div 
                className="absolute w-[45vw] h-[45vw] min-w-[300px] min-h-[300px] rounded-full opacity-50 pointer-events-none"
                style={{
                    ...blobStyle,
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(15, 23, 42, 0.0) 70%)', // Cyan Accent
                    top: '-15%', 
                    left: '-15%', 
                }}
            ></div>
            <div 
                className="absolute w-[35vw] h-[35vw] min-w-[200px] min-h-[200px] rounded-full opacity-50 pointer-events-none"
                style={{
                    ...blobStyle,
                    background: 'radial-gradient(circle, rgba(37, 99, 235, 0.7) 0%, rgba(15, 23, 42, 0.0) 70%)', // Deep Blue Accent
                    bottom: '0%', 
                    right: '0%', 
                }}
            ></div>


            <div className="text-center space-y-6 max-w-xl w-full p-8 bg-slate-900/95 rounded-2xl shadow-2xl border-4 border-cyan-500/30 backdrop-blur-sm z-10">
                
                {/* Animated 404 Text */}
                <div className="text-8xl md:text-9xl font-extrabold text-cyan-400 flicker-text tracking-widest leading-none">
                    404
                </div>

                {/* Professional Message */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mt-4">
                    Page Not Found.
                </h1>

                <p className="text-lg text-slate-300">
                    We apologize, but the resource you requested could not be located on our server. 
                    It may have been moved, deleted, or you may have followed an outdated link.
                </p>

                <p className="text-cyan-400 text-xl font-medium">
                    Please use the options below to navigate back to our site.
                </p>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-xl transition duration-300 transform hover:scale-[1.03] active:scale-95 ring-2 ring-cyan-400"
                    >
                        &larr; Go Back to Previous Page
                    </button>
                    <button
                        onClick={() => window.location.href = '/' || window.location.reload()} 
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl shadow-xl transition duration-300 transform hover:scale-[1.03] active:scale-95 ring-2 ring-slate-500"
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;