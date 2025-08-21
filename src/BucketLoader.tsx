import React from "react";

const LoadingBucket = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        className="w-40 h-40 animate-spin-slow"
      >
        <g>
          <defs>
            <clipPath id="bucket-clip">
              <path d="M57.6,64.3c6.1,5.4,9.9,13.2,9.9,22c0,0.2,0,0.5,0,0.7h44c0-0.2,0-0.5,0-0.7c0-40.3-32.5-73-72.7-73.3v20.1 l9.5,25.6C48.4,58.8,54.9,61.9,57.6,64.3"></path>
            </clipPath>
          </defs>

          {/* Bucket details */}
          <path
            d="M54.6,66c-1.2,0-2.2-0.8-2.5-2c-0.3-1.4,0.6-2.7,2-2.9l0.3-0.1c0.3-0.2,1.3-1.6,1.5-5.8 c0.1-4.4-0.8-9.9-2.5-15.6c-1.7-5.7-4.1-10.8-6.6-14.4c-2.4-3.4-4-4.1-4.4-4l-0.3,0.1c-1.3,0.5-2.7-0.1-3.3-1.3 c-0.5-1.3,0.1-2.7,1.3-3.3l0.5-0.2c0.1,0,0.2-0.1,0.3-0.1c2.2-0.7,5.7-0.2,10,5.9c2.8,4,5.4,9.6,7.3,15.8 c1.9,6.2,2.8,12.3,2.7,17.2c-0.2,7.4-2.9,9.8-5.1,10.4c-0.1,0-0.2,0-0.3,0.1L55.1,66C54.9,66,54.8,66,54.6,66z"
            fill="#e9acef"
            transform="translate(0,2.34)"
          ></path>

          {/* Water animation */}
          <g clipPath="url(#bucket-clip)">
            <circle
              cx="50"
              cy="85"
              r="30"
              fill="#99bbff"
              className="animate-bounce"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default LoadingBucket;
