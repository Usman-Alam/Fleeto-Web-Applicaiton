
// "use client";

// import { useState } from "react";
// import FormTemplatePage from "@components/FormTemplatePage";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";


// export default function Login() {
  
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(''); // To handle error message
//   const router = useRouter();


//   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  
  //     // Perform the login attempt
  //     const res = await signIn("credentials", {
    //       redirect: false,
    //       email, 
    //       password, 
    //     });
    
    
    //     console.log("Login response:", res); // ✅ Check what the backend returned
    
    
    
    //     // Check if signIn was successful
    //     if (res?.error) {
      //       // If there's an error, set the error state to display
      //       setError(res.error);
      //     } else {
//       // Redirect if successful
//       router.replace("/");


//     try {
  //       const res = await signIn('credentials', {
    //         email: setEmail(email), password: setPassword(password), redirect: false,
    //       });
    
    //       if (res?.error) {
      //         setError("Invalid Credentials")
      //       }
      //       router.replace('dashboard')
      //     } catch (error) {
        //       console.log(error);
        
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
//           onChange: e => setEmail(e.target.value), 
//           required: true 
//         },
//         { 
  //           label: "Password", 
  //           type: "password", 
  //           name: "password", 
  //           placeholder: "Hello123!", 
  //           value: password,
  //           onChange: e => setPassword(e.target.value), 
  //           required: true 
  //         },
  //       ]}
  //       buttonText="Log in"
  //       onSubmit={(e) => handleSubmit(e)}
  //     />
  //   );
  // }}
  
  
  
  // import React from 'react'
  
  // const page = () => {
  //   return (
  //     <div>page</div>
  //   )
  // }
  
  // export default page
  
  
  
  
"use client";

import { useState } from "react";
import FormTemplatePage from "@components/FormTemplatePage";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("Login response:", res);

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.replace("/"); // or "dashboard"
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again.");
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
          onChange: (e) => setEmail(e.target.value),
          required: true,
        },
        {
          label: "Password",
          type: "password",
          name: "password",
          placeholder: "Hello123!",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
        },
      ]}
      buttonText="Log in"
      onSubmit={handleSubmit}
    />
  );
}
