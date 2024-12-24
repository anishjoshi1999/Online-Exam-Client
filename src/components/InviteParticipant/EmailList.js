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
    <div className="space-y-6">
      <SavedEmailLists
        savedLists={savedLists}
        onSelectList={handleSelectList}
        onDeleteList={handleDeleteList}
      />

      <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <label className="block text-sm font-medium text-gray-800">
            Participant Emails
          </label>
          <div className="text-xs font-medium text-gray-600 sm:ml-4 sm:mt-0">
            Note: This will create an account if not created on starttest.online and invite
            participants.
          </div>
          {emails.some((email) => email.trim()) && (
            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:text-blue-700 hover:bg-blue-100 transition"
            >
              <Save className="mr-2 h-4 w-4" />
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
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Another Email
          </button>
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
