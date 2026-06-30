export const Component = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white">
      {/* faint product grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
      {/* soft blue glow rising from the two bottom corners (as if lit from below) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_620px_at_0%_115%,#b8d8ff,transparent),radial-gradient(circle_620px_at_100%_115%,#b8d8ff,transparent)]"></div>
    </div>
  );
};
