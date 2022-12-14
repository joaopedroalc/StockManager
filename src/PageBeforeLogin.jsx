import { useState } from "react";
import styles from "./PageBeforeLogin.module.css";

import App from "./App";
import firebase from "firebase/app";
import "firebase/auth";

import ShowChartIcon from "@mui/icons-material/ShowChart";

import laptop from "./assets/laptop.png";

import Button from "@mui/material/Button";

export function PageBeforeLogin() {
  const [user, setUser] = useState(false);
  const [infosUser, setInfosUser] = useState("");
  var provider = new firebase.auth.GoogleAuthProvider();

  const logar = () =>
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        var user = result.user;
        // console.log(user.email);

        setUser(true);
        setInfosUser(user);
      })
      .catch((error) => {
        alert(error.message);
      });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      if (
        user.email === "joaopedro.ufma@gmail.com" ||
        user.email === "drive.opens@gmail.com"
      ) {
        setUser(true);
        setInfosUser(user);
      }
      // ...
    } else {
      setUser(false);
      setInfosUser("");
    }
  });

  return (
    <div>
      {user ? (
        <App setUser={setUser} infosUser={infosUser} />
      ) : (
        <div className={styles.home}>
          <header className={styles.header}>
            <a href='/'>
              <ShowChartIcon fontSize='large' />
            </a>

            <Button variant='outlined' color='primary' onClick={logar}>
              Entrar com google
            </Button>
          </header>
          <main>
            <div className={styles.colTwo}>
              <div className={styles.infos}>
                <h2>Stock Manager</h2>
                <p>
                  Sistema para controle de ações dos colaboradores da companhia
                  Stock Manager.
                </p>
              </div>
              <img className={styles.laptop} src={laptop} alt='laptop' />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
