"use client";

import { useState } from "react";
import FormTemplatePage from "@components/FormTemplatePage";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
<<<<<<< Updated upstream
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To handle error message
  const router = useRouter();
=======
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, seterror] = useState("")

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
>>>>>>> Stashed changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

<<<<<<< Updated upstream
    // Perform the login attempt
    const res = await signIn("credentials", {
      redirect: false,
      email, 
      password, 
    });


    console.log("Login response:", res); // ✅ Check what the backend returned

    

    // Check if signIn was successful
    if (res?.error) {
      // If there's an error, set the error state to display
      setError(res.error);
    } else {
      // Redirect if successful
      router.replace("/");
=======
    try {
      const res = await signIn('credentials', {
        email: formData.email, password: formData.password, redirect: false,
      });

      if (res?.error) {
        seterror("Invalid Credentials")
      }
      router.replace('dashboard')
    } catch (error) {
      console.log(error);
>>>>>>> Stashed changes
    }
  };

  return (
    <FormTemplatePage
      title="Login Form"
      fields={[
        { 
          label: "Email Address", 
          type: "email", 
          name: "email", 
          placeholder: "muhammad@gmail.com", 
          value: email,
          onChange: e => setEmail(e.target.value), 
          required: true 
        },
        { 
          label: "Password", 
          type: "password", 
          name: "password", 
          placeholder: "Hello123!", 
          value: password,
          onChange: e => setPassword(e.target.value), 
          required: true 
        },
      ]}
      buttonText="Log in"
      onSubmit={handleSubmit}
    />
  );
}


// "use client";

// import { useState } from "react";
// import FormTemplatePage from "@components/FormTemplatePage";
// import { useRouter } from "next/navigation";

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(''); // To handle error message
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Prepare the credentials
//     const credentials = new URLSearchParams();
//     credentials.append('email', email);
//     credentials.append('password', password);

//     try {
//       // Perform the login attempt via fetch
//       const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: credentials.toString(),
//       });

//       const data = await response.json();
//       console.log("Server response:", data); 

//       if (!response.ok) {
//         const errorData = await response.json();
//         setError(errorData.error || 'Authentication failed');
//       } else {
//         // Redirect on successful login
//         router.replace('/');
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       setError('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <FormTemplatePage
//       title="Login Form"
//       fields={[
//         {
//           label: "Email Address",
//           type: "email",
//           name: "email",
//           placeholder: "muhammad@gmail.com",
//           value: email,
//           onChange: (e) => setEmail(e.target.value),
//           required: true,
//         },
//         {
//           label: "Password",
//           type: "password",
//           name: "password",
//           placeholder: "Hello123!",
//           value: password,
//           onChange: (e) => setPassword(e.target.value),
//           required: true,
//         },
//       ]}
//       buttonText="Log in"
//       onSubmit={handleSubmit}
//     />
//   );
// }
