import { motion, AnimatePresence } from 'framer-motion';

export const PageTransition = ({ children, key }) => (
  <motion.div
    key={key}
    initial={{ opacity: 0, scale: 0.96, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 1.04, y: -10 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
    {children}
  </motion.div>
);

export default PageTransition;
