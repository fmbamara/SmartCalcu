
import React, { useState } from 'react';
import { APP_VERSION, SUPPORT_EMAIL } from '../constants';

const Support: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState('');

  const handleSend = () => {
    if (!message) {
      setToast('Message is required.');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    const subject = 'Smartcalcu Feedback';
    const body = `
      Name: ${name || 'Not provided'}
      Email: ${email || 'Not provided'}
      
      Message:
      ${message}
      
      ---
      App Version: ${APP_VERSION}
      User Agent: ${navigator.userAgent}
    `;

    const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    setToast('Thank you for your feedback! Opening your email client...');
    setTimeout(() => setToast(''), 5000);
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center">Contact Support</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
            Have a question or feedback? Let us know!
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name (Optional)</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email (Optional)</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        <button
          onClick={handleSend}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Send Feedback
        </button>

        {toast && (
          <div className="mt-4 text-center text-sm p-3 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
