/* eslint-disable */
import React, { useState } from 'react'
import './Home.css'
import { Navigate, SvgImage, Card, image, Button } from '../Libraries/Libraries'
const Home = () => {
  const [gotoGeno, setgotoGeno] = useState(false)
  const [gotoPheno, setgotoPheno] = useState(false);
  const [logout,setlogout]=useState(false);
  if(logout)
  {
    return <Navigate to="/" />;
  }
  const redirectGeno = () => {
    setgotoGeno(true);
  }
  const redirectPheno = () => {
    setgotoPheno(true);
  }
  if (gotoGeno) {
    return <Navigate to="/columns_selection" />
  }
  if (gotoPheno) {
    return <Navigate to="/pdf_view" />
  }

  const headerPheno = (
    <img className='pheno_data' alt="Card" src="https://www.thermofisher.com/blog/wp-content/uploads/sites/9/2019/07/pg1999-pjt4745-col19534_blog205.jpg" />
  );
  const headerGeno = (
    <img className='geno_data' alt="Card" src="https://wp.technologyreview.com/wp-content/uploads/2023/02/MIT-LargeCRISPR-01-crop.jpeg" />
  );
  const handleLogout = () => {
    // Clear authentication-related cookies
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login page
    setlogout(true);
  };
  return (
    <div className="bg_home">
      <div className="user_img">
       <Button label="Logout" onClick={handleLogout}/>
      </div>

      <div className='homepage'>

        <div className="headname">
          <div className='heading'>Welcome to the <img src={SvgImage} alt="" className='logo_home' /> Medical Dashboard</div>
        </div>
        {/* <div className="subheadname">
          Pick where you want to do analysis
        </div> */}
        <div className='Options'>
          {/* <Card title="Phenotype" header={headerPheno} style={{ width: '300px', marginBottom: '20px' }} onClick={redirectPheno} /> */}


          <Card title="Genotype" header={headerGeno} style={{ width: '300px', marginBottom: '20px' }} onClick={redirectGeno} />
        </div>
      </div>

    </div>
  )
}

export default Home