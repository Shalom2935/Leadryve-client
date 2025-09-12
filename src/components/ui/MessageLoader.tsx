import React from 'react';

export const MessageLoader = () => {
  return (
    <div className="w-full animate-pulse p-4">
      <div className="space-y-3">
        <div className="h-5 w-2/5 rounded-lg bg-leadryve-light-purple"></div>
        <div className="space-y-2">
          <div className="h-4 rounded-lg bg-leadryve-light-purple"></div>
          <div className="h-4 w-5/6 rounded-lg bg-leadryve-light-purple"></div>
          <div className="h-4 w-4/6 rounded-lg bg-leadryve-light-purple"></div>
        </div>
        <div className="space-y-2 pt-4">
          <div className="h-4 rounded-lg bg-leadryve-light-purple"></div>
          <div className="h-4 w-5/6 rounded-lg bg-leadryve-light-purple"></div>
        </div>
      </div>
    </div>
  );
};