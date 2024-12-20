import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex space-x-2 text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-primary">Home</Link>
        </li>
        {pathnames.map((segment, index) => {
          const pathTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          return (
            <li key={index} className="flex items-center">
              <span className="mx-2">/</span>
              <Link to={pathTo} className="hover:text-primary capitalize">{segment.replace(/-/g, ' ')}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
