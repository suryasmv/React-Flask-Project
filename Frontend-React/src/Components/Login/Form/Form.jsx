import React, { useState } from 'react'
import { SvgImage } from '../../Libraries/Libraries'
import SignInForm from '../SignIn/SignIn';
import Instructions from '../Instructions/Instructions';
import '../Login.css'
import ParticlesComponent from '../particles';

const Form = () => {
    const [type, setType] = useState("signIn");
    const handleOnClick = text => {
        if (text !== type) {
            setType(text);
            return;
        }
    };
    const containerClass =
        "container " + (type === "instructions" ? "right-panel-active" : "");
    return (
        <div className="form_page">
            <ParticlesComponent />
            <div className="logo"><img src={SvgImage} alt="logo" /></div>
            <div className="Form">
                <h1 className="form_trans">Transforming healthcare through - Analysis, Innovation, Dedication</h1>
                <div className={containerClass} id="container">
                    <Instructions />
                    <SignInForm />
                    <div className="overlayform-container">
                        <div className="overlayform">
                            <div className="overlayform-panel overlayform-left">
                                <div className="cont-left">
                                    <h4>
                                        Login To your Account!!
                                    </h4>
                                    <button
                                        className="ghost"
                                        id="signIn"
                                        onClick={() => handleOnClick("signIn")}
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </div>
                            <div className="overlayform-panel overlayform-right">
                                <div className="cont-right">
                                    <h4>              Instructions to Login!!
                                    </h4>
                                    <button
                                        className="ghost "
                                        id="instructions"
                                        onClick={() => handleOnClick("instructions")}
                                    >
                                        Click Here
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Form