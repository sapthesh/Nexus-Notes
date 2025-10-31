
import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2800); // Slightly less than App's timeout to allow fade out
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      className={`fixed bottom-5 right-5 bg-highlight border border-border-color text-text-primary px-6 py-3 rounded-lg shadow-lg transition-transform duration-300 ease-in-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      {message}
    </div>
  );
};

export default Notification;
