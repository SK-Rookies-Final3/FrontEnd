import React from 'react';
import './css/Loading.css';

function Loading() {
  return (
    <div className="load_container">
      <span className="load_text" data-splitting="chars">ShortPinGoo Loading...</span>
    </div>
  );
}

export default Loading;