import React, { useEffect, useRef } from "react";
import { useForm, ValidationError } from "@formspree/react";

function EnquiryForm(props) {
  const [state, handleSubmit] = useForm("xldenppo");
  const node = useRef();

  useEffect(() => {
    console.log(state);
    if (state.succeeded) {
      window.alert("Your Form Submitted Successfully");
      props.closeForm();
    }
  }, [state]);

  useEffect(() => {
    console.log("entered useEffect");

    const handleOutsideClick = (event) => {
      if (node.current && !node.current.contains(event.target)) {
        console.log("CLICKED OUTSIDE!");
        props.clickedOutsideForm(); // Corrected function name
      }
    };

    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 1000);

    // Cleanup to avoid memory leaks
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [props]); // Include props dependency

  if (state.succeeded) {
    return <p>Thanks for joining!</p>;
  }

  return (
    <form ref={node} className="enquiry_form" onSubmit={handleSubmit}>
      <p className="form_title">Your Enquiry</p>

      {/* Full Name */}
      <label htmlFor="name">Full Name</label>
      <input id="name" type="text" name="name" required />

      {/* Email Address */}
      <label htmlFor="email">Email Address</label>
      <input id="email" type="email" name="email" required />
      <ValidationError prefix="Email" field="email" errors={state.errors} />

      {/* Contact No */}
      <label htmlFor="contact">Contact No.</label>
      <input id="contact" type="tel" name="contact" pattern="[0-9]+" required />
      <ValidationError prefix="Contact" field="contact" errors={state.errors} />

      {/* Dropdown Menu */}
      <label htmlFor="enquiryType">Enquiry Type</label>
      <select id="enquiryType" name="enquiryType" required>
        <option value="">Select an option</option>
        <option value="general">Schedule a Meeting</option>
        <option value="support">Ask for a Callback</option>
        <option value="feedback">List my property</option>
        <option value="other">Other</option>
      </select>
      <ValidationError
        prefix="Enquiry Type"
        field="enquiryType"
        errors={state.errors}
      />

      {/* Submit Button */}
      <button type="submit" disabled={state.submitting}>
        Submit
      </button>
    </form>
  );
}

export default EnquiryForm;
