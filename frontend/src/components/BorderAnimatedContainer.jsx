// How to make animated gradient border 👇

// https://cruip-tutorials.vercel.app/animated-gradient-border/

// components/BorderAnimatedContainer.jsx
function BorderAnimatedContainer({ children }) {
  return (
    <div
      className="relative w-full h-full p-[2px] rounded-2xl animate-border 
      bg-[conic-gradient(from_var(--border-angle),theme(colors.cyan.500),theme(colors.cyan.300),theme(colors.cyan.500))]
      overflow-hidden"
    >
      <div className="w-full h-full bg-slate-900 rounded-2xl">
        {children}
      </div>
    </div>
  );
}

export default BorderAnimatedContainer;
