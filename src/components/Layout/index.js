import { motion } from "framer-motion";

const Layout = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1, transition: { delay, type: "spring", stiffness: 300, damping: 20 } }}
    exit={{ y: 50, opacity: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }}
  >
    {children}
  </motion.div>
);

export default Layout;
