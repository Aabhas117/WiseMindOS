import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="
            w-full bg-gray-700 text-white border border-gray-600 rounded-lg 
            px-4 py-3 pr-10
            focus:outline-none focus:ring-2 focus:ring-indigo-500 
            focus:border-transparent 
            focus:shadow-[0_0_15px_rgba(99,102,241,0.5)]
            transition-all
          "
        />

        {/* 👁️ Eye Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-4 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 hover:drop-shadow-[0_0_6px_rgba(99,102,241,0.6)]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;