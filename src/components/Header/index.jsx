import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles.css";

import firebase from "firebase/app";
import "firebase/auth";

import Button from "@mui/material/Button";

import ShowChartIcon from "@mui/icons-material/ShowChart";

const Header = ({ setUser, infosUser }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveTab("Home");
    } else if (location.pathname === "/add") {
      setActiveTab("AddContact");
    }
  }, [location]);

  const logout = () =>
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        setUser(false);
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  return (
    <div className='header'>
      <div className='logoTitle'>
        <ShowChartIcon fontSize='large' />
        <span className='titleOpen'>Stock Manager</span>
      </div>
      <div className='header-right'>
        <Link to='/'>
          <p
            className={`${activeTab === "Home" ? "active" : ""}`}
            onClick={() => setActiveTab("Home")}
          >
            Home
          </p>
        </Link>
        <Link to='/add'>
          <p
            className={`${activeTab === "AddContact" ? "active" : ""}`}
            onClick={() => setActiveTab("Add Contact")}
          >
            Adicionar Ações
          </p>
        </Link>

        <div className='container-infosUser'>
          <img
            src={infosUser.photoURL}
            alt='photoURL'
            referrerPolicy='no-referrer'
          />
          <Button onClick={logout} variant='contained' color='warning'>
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
