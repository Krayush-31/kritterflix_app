import React from "react";

export default function BackgroundImage({ imageUrl, children }) {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 text-white min-h-screen">{children}</div>
    </div>
  );
}
