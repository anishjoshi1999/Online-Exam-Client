import moment from "moment";
const getExamStatus = (startDate, endDate) => {
  const now = moment();
  if (now.isBefore(moment(startDate))) {
    return { status: "Upcoming", className: "bg-yellow-100 text-yellow-800" };
  } else if (now.isBetween(moment(startDate), moment(endDate))) {
    return { status: "Active", className: "bg-green-100 text-green-800" };
  } else {
    return { status: "Expired", className: "bg-red-100 text-red-800" };
  }
};

export default getExamStatus;
