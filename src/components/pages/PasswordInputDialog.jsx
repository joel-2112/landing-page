import React, { useState } from "react";
import { Eye, EyeOff, X, Check, X as XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PasswordInputDialog = ({ email, onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setconfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // State for mismatch error
  const navigate = useNavigate();

  

 const validatePassword = (password) => {
 const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

 const chagneVerifiedPassword = async (
  email,
  newPassword,
  confirmNewPassword
) => {


  try {
   const response = await axios.post("https://api.teamworksc.com/api/v1/users/reset-password", {
      email,
      newPassword,
      confirmNewPassword,
    });

    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw new Error(
      error.response?.data?.message || "Failed to change password"
    );
  }finally {
    setLoading(false);
    setError("");
  }
 
}
  const handleSubmit = async () => {
    if (!validatePassword(newPassword)) {
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      
      // Send the email and passwords to the backend
      await chagneVerifiedPassword(
        email,
        newPassword,
        confirmNewPassword
      );
      // you can add beautiful toast here
      alert("Password reset successfully completed!");
      onClose();
      navigate("/signup");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while changing the password."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordValidations = (password) => {
    return [
      {
        text: "At least 8 characters long",
        valid: password.length >= 8,
      },
      {
        text: "Include an uppercase letter",
        valid: /[A-Z]/.test(password),
      },
      {
        text: "Include a lowercase letter",
        valid: /[a-z]/.test(password),
      },
      {
        text: "Include a number",
        valid: /\d/.test(password),
      },
      {
        text: "Include a special character",
        valid: /[^A-Za-z0-9]/.test(password),
      },
    ];
  };

  const closeDialog = () => {
    onClose();
  };

  return (
    <div className="py-4 mx-auto rounded-lg max-w-sm">
      <div className="flex justify-between items-center mb-4">
        {/* <h2 className="text-lg font-semibold ">Change Password</h2> */}
           <button
        // onClick={handleOtpDialog}
        className="absolute font-bold left-12 text-orange-500  top-8 border-none bg-transparent  cursor-pointer text-xl text-red-400 "
      >
        Change Password
      </button> 
      </div>
      <div className="mb-4 min-w-72">
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
            className="w-full text-black p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-orange-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmNewPassword}
            onChange={(e) => { setconfirmNewPassword(e.target.value); setError(""); }}
            className="w-full p-3 text-black border border-gray-300 rounded focus:outline-none focus:ring focus:ring-orange-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {newPassword && (
          <div className="mb-4">
            <ul className="text-sm">
              {getPasswordValidations(newPassword).map((validation, index) => (
                <li key={index} className="flex items-center mb-1">
                  {validation.valid ? (
                    <Check className="text-green-500 mr-2" size={16} />
                  ) : (
                    <XIcon className="text-red-500 mr-2" size={16} />
                  )}
                  <span className={validation.valid ? "text-green-500" : "text-red-500"}>
                    {validation.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {error && <div className="text-red-500 mb-4">{error}</div>}{" "}
        {/* Error message for mismatch */}
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || error}
        className={`w-full p-3 text-white rounded ${
          loading || error ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"
        } transition`}
      >
        {loading ? "Changing..." : "Change Password"}
      </button>
    </div>
  );
};

export default PasswordInputDialog