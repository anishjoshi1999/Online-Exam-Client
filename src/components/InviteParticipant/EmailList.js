import React, { useState } from "react";
import { PlusCircle, Save } from "lucide-react";
import SaveEmailListModal from "./SaveEmailListModal";
import SavedEmailLists from "./SavedEmailLists";
import EmailInputGroup from "./EmailInputGroup";
import {
  saveEmailList,
  getSavedEmailLists,
  deleteEmailList,
} from "@/lib/token/localStorage";

function EmailList({ emails, setEmails, onSubmit }) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedLists, setSavedLists] = useState(() => getSavedEmailLists());

  const addEmailField = () => setEmails([...emails, ""]);

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index, value) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  const handleSaveList = (name, emailList) => {
    if (saveEmailList(name, emailList)) {
      setSavedLists(getSavedEmailLists());
    }
  };

  const handleDeleteList = (name) => {
    if (deleteEmailList(name)) {
      setSavedLists(getSavedEmailLists());
    }
  };

  const handleSelectList = (emailList) => {
    setEmails(emailList);
  };

  return (
    <div className="space-y-8">
      <SavedEmailLists
        savedLists={savedLists}
        onSelectList={handleSelectList}
        onDeleteList={handleDeleteList}
      />

      <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <label className="block text-lg font-medium text-gray-900">
              Participant Emails
            </label>
            <p className="text-sm text-gray-600 mt-1">
              Add email addresses of participants to invite them.
            </p>
          </div>
          {emails.some((email) => email.trim()) && (
            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              <Save className="mr-2 h-5 w-5" />
              Save List
            </button>
          )}
        </div>

        <div className="space-y-4">
          {emails.map((email, index) => (
            <EmailInputGroup
              key={index}
              email={email}
              index={index}
              updateEmail={updateEmail}
              removeEmailField={removeEmailField}
              showRemove={emails.length > 1}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={addEmailField}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Email
          </button>
        </div>

        <div className="border-t border-gray-200 pt-4 text-sm text-gray-700">
          <p>
            Note: Inform your students that to log in or register on{" "}
            <a
              href="https://starttest.online"
              className="text-blue-600 hover:underline"
            >
              starttest.online
            </a>
            , they should use the same email address that you provided while
            granting access to the test.
          </p>
        </div>
      </div>

      {showSaveModal && (
        <SaveEmailListModal
          emails={emails.filter((email) => email.trim())}
          onSave={handleSaveList}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}

export default EmailList;
