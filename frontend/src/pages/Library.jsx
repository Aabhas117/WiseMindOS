import { motion } from "framer-motion";
import Bag from "../components/Bag";

const Library = () => {
  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-black via-gray-900 to-black px-4 py-8 pb-24">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <motion.h1 className="text-3xl md:text-4xl young-serif-regular text-center font-bold text-white mb-6"
        animate={{
              textShadow: [
                "0px 0px 0px rgba(99,102,241,0)",
                "0px 0px 15px rgba(99,102,241,0.6)",
                "0px 0px 0px rgba(99,102,241,0)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}>
          Your Library
        </motion.h1>

        <Bag />
      </motion.div>

    </div>
  );
};

export default Library;