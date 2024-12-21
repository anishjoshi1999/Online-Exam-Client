# MCQ Exam Management System

A comprehensive system for creating, managing, and participating in multiple-choice question (MCQ) exams. This application allows creators to easily set up exams and provides a seamless experience for participants, ensuring their responses are securely saved and easily accessible.

## Features Implemented

### MCQ Exam Management
- Creators can easily create, update, and delete MCQ exams.
- Local times are saved in UTC on the backend for accurate time management.

### Exam Sharing
- After creating an exam paper, creators can copy the exam code and share it with participating students.

### Exam Participation
- Students can take the exam within the designated time limit:
  - **Upcoming:** Displayed if the current time is before the exam start time.
  - **Active:** Displayed if the current time falls within the exam duration.
  - **Expired:** Displayed if the current time exceeds the exam duration.
  - Automatic submission occurs if the exam expires, or if participants choose to cancel the exam. Once submitted, participants cannot resubmit their results.

### Sync Feature
- In the event of a technical glitch or internet outage, each answer is saved in the database. Participants can continue their exam where they left off on any device, as long as it is within the exam time limit.

### Results Visibility
- After submission, participants can view their scores, total time taken, and their complete question sheet with marks.

### Performance Overview
- Participants can review their past exams, including scores, time taken, and a complete marksheet.

### Creator Insights
- Exam creators can view all participants' scores, time taken, answer sheets, and their rankings.


