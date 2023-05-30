import React, { useEffect } from "react";
import "./Default.css";
import logo from "../../../assets/images/logoEvents.png";

export function Default() {

    return (
        <div className="default-messages">
            <div className="logo-default">
                <div className="logo-default-img">
                    <img src={logo} alt="Logo Events" />
                </div>
            </div>
        </div>
    );
}
