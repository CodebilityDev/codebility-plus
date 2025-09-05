const GradientBackgroundWhite = ({ className }: { className: string }) => {
  return (
    <div className="mx-auto">
      <div
        className={`absolute rounded-full blur-3xl ${className ? className : ""}`}
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(106, 120, 242, 0.3) 0%, rgba(3, 3, 3, 0.3) 100%)",
        }}
      ></div>
    </div>
  );
};

export default GradientBackgroundWhite;
