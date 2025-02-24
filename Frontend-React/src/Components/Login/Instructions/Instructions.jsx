import React from "react";
function SignUpForm() {   
    return (
        <div className="formup-container sign-up-container">
            <h1 className="welcome">W</h1>
            <form>
                <h1 className="create">Instructions</h1>
                
               <label className="instructions">1. Use Your GenePowerX email (ends with @gmail.com or khdreamlife.com)
               </label>
               <label className="instructions"> &nbsp; 2. Accept the Google Authentication</label>
               <h1 className="create">Example</h1>
               <input type="text" placeholder="yourname@gmail.com" disabled />
               {/* <input type="password" placeholder="your password" disabled /> */}


            </form>
        </div>
    );
}

export default SignUpForm;
