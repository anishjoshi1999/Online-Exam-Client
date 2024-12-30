import React, { useState } from "react";
import { Send } from "lucide-react";
import SendingMethodSelector from "./SendingMethodSelector";
import EmailList from "./EmailList";
import ShareableLink from "./ShareableLink";
import renewAccessToken from "@/lib/token/renewAccessToken";
import { toast, ToastContainer } from "react-toastify"; // Importing toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Make sure to import the styles

function InviteParticipantForm({ examSlug }) {
  const [emails, setEmails] = useState([""]);
  const [sendingMethod, setSendingMethod] = useState("email");
  const examId = examSlug; // Replace with actual exam ID from your app

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validEmails = emails.filter((email) => email.trim());

    if (sendingMethod === "email" && validEmails.length === 0) {
      alert("Please add at least one email address");
      return;
    }

    try {
      let token = await renewAccessToken();
      console.log("Valid Email in submit", validEmails);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/invite-participant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ emails: validEmails, slug: examSlug }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        // Handle specific error messages from backend response
        if (data.message) {
          toast.error(data.message); // Display the error message from backend
        } else {
          toast.error("Failed to send invitations. Please try again.");
        }
        return;
      }

      toast.success("Access granted and invitations sent successfully!"); // Show success toast
    } catch (error) {
      console.error("Error sending invites:", error);
      toast.error("Failed to send invitations. Please try again."); // Show error toast
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <SendingMethodSelector
          sendingMethod={sendingMethod}
          setSendingMethod={setSendingMethod}
        />

        {sendingMethod === "email" ? (
          <EmailList emails={emails} setEmails={setEmails} />
        ) : (
          <ShareableLink type={sendingMethod} examId={examId} />
        )}

        {sendingMethod === "email" && (
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent 
                     text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                     transition-all duration-200 group"
          >
            <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            Grant access to this test and send invitations
          </button>
        )}
      </form>

      {/* Include ToastContainer to render the toast notifications */}
      <ToastContainer />
    </>
  );
}

export default InviteParticipantForm;
