import React from 'react';
import AppMainbar from './AppMainbar';
import AppMain from './AppMain.js';

const AppRightSide = ({setRetract}) => {

  return (
      <div className="d-flex flex-column w-100">
        <AppMainbar setRetract={setRetract}/>
        <div className='navline mt-2 mb-4 mx-auto'></div>
          <AppMain />
      </div>
  );
};

export default AppRightSide;
