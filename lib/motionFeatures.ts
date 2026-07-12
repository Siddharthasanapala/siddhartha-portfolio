import { domMax } from "framer-motion";

// Loaded lazily by <LazyMotion> (app/layout.tsx) so the feature bundle is
// its own code-split chunk instead of bundled into the initial JS parsed
// before first paint. domMax (not the lighter domAnimation) is required
// because Nav's active-link indicator uses a layout animation (layoutId).
export default domMax;
