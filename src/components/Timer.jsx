import React from 'react';

const Timer = ({ time, label }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className=" px-2 py-2 rounded shadow-sm border border-yellow-300">
      <span className="font-semibold text-teal-900">{label}:</span>
      <span className="ml-2 text-teal-700">
        {`${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
      </span>
    </div>
  );
};

export default Timer;
