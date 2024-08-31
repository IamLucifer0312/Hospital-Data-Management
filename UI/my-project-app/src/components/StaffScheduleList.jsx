import React, { useEffect, useState } from "react";

const StaffScheduleList = ({ staffID }) => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const response = await fetch(
        `http://localhost:4000/staff/${staffID}/schedules`
      );
      const data = await response.json();
      setSchedules(data);
    };
    fetchSchedules();
  }, [staffID]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      {schedules.length === 0 ? (
        <p className="text-gray-500 text-center">No schedule available</p>
      ) : (
        schedules.map((schedule, index) => (
          <div key={index} className="border-b py-4">
            <h3 className="text-lg font-semibold text-gray-700">
              {schedule.DayOfWeek}
            </h3>
            <p className="text-gray-600">
              {schedule.StartTime} - {schedule.EndTime}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default StaffScheduleList;
