import Motion from "@/components/Motion";

// Re-mounted on every navigation, so each screen plays its entrance.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="screen">
      {children}
      <Motion />
    </div>
  );
}
