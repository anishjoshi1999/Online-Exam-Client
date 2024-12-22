// "use client";
// import useForm from "@/components/Auth/useForm";
// import InputField from "@/components/Auth/InputField";
// import AuthForm from "@/components/Auth/AuthForm";
// import { useRouter } from "next/navigation";
// import { User, Mail, Lock } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Register() {
//   const { values, error, setError, loading, setLoading, handleChange } =
//     useForm({
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       receiveUpdates: true, // New state for the checkbox
//     });
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     if (
//       !values.firstName ||
//       !values.lastName ||
//       !values.email ||
//       !values.password
//     ) {
//       toast.error("Please fill in all fields");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(values),
//         }
//       );

//       if (res.ok) {
//         toast.success("Account Created Successfully");
//         toast.success("Verification email has been sent. Please check your inbox!");
//         setTimeout(() => {
//           router.push(`/login`);
//         }, 1000); // Wait for the toast to display
//       } else {
//         const data = await res.json();
//         toast.error(data.error || "Registration failed");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLoginClick = () => {
//     router.push("/login"); // Navigate to the login page
//   };

//   return (
//     <>
//       {/* Toast container */}
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//       />

//       <AuthForm
//         title="Create Account"
//         subtitle="Register to access your dashboard"
//         buttonText="Create Account"
//         loading={loading}
//         error={error}
//         onSubmit={handleSubmit}
//         fields={
//           <>
//             <InputField
//               label="First Name"
//               id="firstName"
//               type="text"
//               value={values.firstName}
//               onChange={handleChange}
//               placeholder="Enter your First Name"
//               icon={<User />}
//             />
//             <InputField
//               label="Last Name"
//               id="lastName"
//               type="text"
//               value={values.lastName}
//               onChange={handleChange}
//               placeholder="Enter your Last Name"
//               icon={<User />}
//             />
//             <InputField
//               label="Email"
//               id="email"
//               type="email"
//               value={values.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               icon={<Mail />}
//             />
//             <InputField
//               label="Password"
//               id="password"
//               type="password"
//               value={values.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               icon={<Lock />}
//             />
//             {/* Checkbox for receiving updates */}
//             <div className="flex items-center mt-4">
//               <input
//                 type="checkbox"
//                 id="receiveUpdates"
//                 name="receiveUpdates"
//                 checked={values.receiveUpdates}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-blue-500 border-gray-300 rounded"
//               />
//               <label
//                 htmlFor="receiveUpdates"
//                 className="ml-2 text-sm text-gray-700"
//               >
//                 Receive updates, newsletters, and exclusive offers
//               </label>
//             </div>
//           </>
//         }
//       >
//         {/* Login Button */}
//         <div className="flex justify-center mt-4">
//           <button
//             type="button"
//             className="text-sm text-blue-500 hover:underline"
//             onClick={handleLoginClick}
//           >
//             Already have an account? Login
//           </button>
//         </div>
//       </AuthForm>
//     </>
//   );
// }
