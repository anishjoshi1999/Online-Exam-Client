"use client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Clipboard,
  Trash2,
  Eye,
  Edit,
  Users,
  UserPlus,
  MoreHorizontal,
  X,
} from "lucide-react";
import getExamStatus from "@/lib/exam/examStatus";
import moment from "moment";
import Link from "next/link";

const ExamActionsModal = ({
  exam,
  onClose,
  onDelete,
  onPreview,
  onCopySlug,
}) => {
  const actionButtons = [
    {
      icon: Eye,
      color: "text-blue-500",
      title: "Preview Exam",
      description:
        "View the full details and configuration of this exam before taking any action.",
      action: () => {
        onPreview(exam);
        onClose();
      },
    },
    {
      icon: UserPlus,
      color: "text-purple-500",
      title: "Invite Participant",
      description:
        "Send invitations to students or candidates to participate in this exam.",
      href: `/manage-exam/${exam.slug}/invite-participant`,
    },
    {
      icon: Users,
      color: "text-green-500",
      title: "View Participation",
      description:
        "Check which participants have registered or completed this exam.",
      href: `/manage-exam/${exam.slug}/view-participation`,
    },
    {
      icon: Clipboard,
      color: "text-emerald-500",
      title: "Copy Exam Code",
      description:
        "Quickly copy the unique identifier for this exam to share or reference.",
      action: () => {
        onCopySlug(exam.slug);
        onClose();
      },
    },
    {
      icon: Edit,
      color: "text-yellow-500",
      title: "Edit Exam",
      description:
        "Modify the exam details, questions, duration, or other settings.",
      href: `/manage-exam/${exam.slug}`,
    },
    {
      icon: Trash2,
      color: "text-red-500",
      title: "Delete Exam",
      description:
        "Permanently remove this exam and all associated data. This action cannot be undone.",
      action: () => {
        onDelete(exam.slug);
        onClose();
      },
    },
  ];

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Exam Actions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Exam Details */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {exam.name}
          </h3>
          <div className="text-sm text-gray-600">
            <p>Exam Code: {exam.slug}</p>
            <p>
              Duration:{" "}
              {moment(exam.endDate).diff(moment(exam.startDate), "hours")} hours{" "}
              {moment(exam.endDate).diff(moment(exam.startDate), "minutes") %
                60}{" "}
              minutes
            </p>
            <p>Total Questions: {exam.questions.length}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 p-6">
          {actionButtons.map((button, index) => {
            const ActionButton = button.href ? Link : "button";
            const buttonProps = button.href
              ? {
                  href: button.href,
                  className: "block",
                  onClick: onClose,
                }
              : { onClick: button.action };

            return (
              <ActionButton
                key={index}
                {...buttonProps}
                className="
                  flex items-start p-4 rounded-lg 
                  border border-gray-200 hover:border-blue-200
                  hover:bg-blue-50 transition-all duration-300
                  group cursor-pointer
                "
              >
                <div className={`mr-4 ${button.color}`}>
                  <button.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-blue-700">
                    {button.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {button.description}
                  </p>
                </div>
              </ActionButton>
            );
          })}
        </div>
      </div>
    </div>,
    document.body // Render modal at the root level of the DOM
  );
};

const ExamRow = ({ exam, onDelete, onCopySlug, onPreview }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const status = getExamStatus(exam.startDate, exam.endDate);

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">{exam.name}</div>
          <div className="text-sm text-gray-500 flex items-center space-x-1">
            <span>Code:</span>
            <button
              onClick={() => onCopySlug(exam.slug)}
              className="text-blue-600 hover:text-blue-900 flex items-center"
              title="Copy exam code"
            >
              <Clipboard className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">
            {moment(exam.startDate).format("MMM DD, YYYY")}
          </div>
          <div className="text-sm text-gray-500">
            {moment(exam.startDate).format("hh:mm A")}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">
            {moment(exam.endDate).format("MMM DD, YYYY")}
          </div>
          <div className="text-sm text-gray-500">
            {moment(exam.endDate).format("hh:mm A")}
          </div>
        </td>
        <td className="px-6 py-4">
          <span
            className={`px-3 py-1 text-xs rounded-full ${status.className}`}
          >
            {status.status}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">
            {moment(exam.endDate).diff(moment(exam.startDate), "hours")} hours{" "}
            {moment(exam.endDate).diff(moment(exam.startDate), "minutes") % 60}{" "}
            minutes
          </div>

          <div className="text-sm text-gray-500">
            {exam.questions.length} questions
          </div>
        </td>
        <td className="px-6 py-4 relative">
          <button
            onClick={handleOpenModal}
            className="
              p-2 rounded-full hover:bg-gray-200 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-200
            "
            aria-label="Open exam actions"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </td>
      </tr>

      {isModalOpen && (
        <ExamActionsModal
          exam={exam}
          onClose={handleCloseModal}
          onDelete={onDelete}
          onCopySlug={onCopySlug}
          onPreview={onPreview}
        />
      )}
    </>
  );
};

export default ExamRow;
