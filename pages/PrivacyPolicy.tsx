
import React, { useState, useEffect } from 'react';

const PrivacyPolicy: React.FC = () => {
  const [policyText, setPolicyText] = useState('');

  useEffect(() => {
    fetch('/assets/privacy_policy.txt')
      .then(response => response.text())
      .then(text => setPolicyText(text))
      .catch(error => {
        console.error("Failed to load privacy policy:", error);
        setPolicyText("Could not load privacy policy. Please try again later.");
      });
  }, []);

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
          {policyText}
        </pre>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
