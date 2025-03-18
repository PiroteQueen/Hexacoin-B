import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-6">页面未找到</h2>
        <p className="text-gray-600 mb-8">
          您访问的页面不存在或已被移除。
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 