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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Participant Emails
          </label>
          {emails.some((email) => email.trim()) && (
            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700
                       transition-colors group"
            >
              <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Save List
            </button>
          )}
        </div>

        <div className="space-y-3">
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

        <button
          type="button"
          onClick={addEmailField}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 
                   transition-colors group"
        >
          <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
          Add Another Email
        </button>
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
