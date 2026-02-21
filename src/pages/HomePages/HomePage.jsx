import { useState, useContext } from "react";
import Modal from "../../components/Modal/Modal";
import RegisterForm from "../../components/Auth/RegisterForm";
import LoginForm from "../../components/Auth/LoginForm";
import { AuthContext } from "../../context/AuthContext";
import styles from "./HomePage.module.css";
import logo from "/logo.png";
import avatar from "/avatar.png";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const { user, logout } = useContext(AuthContext);

  const handleClose = () => {
    setOpen(false);
    setIsRegister(false);
  };

  return (
    <div className={styles.homepage}>
      
      {/* NAVBAR */}
      <header className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.navInner}>
            
            <div className={styles.logoWrapper}>
              <img src={logo} alt="logo" className={styles.logoImg} />
              <span className={styles.logoText}>LearnLingo</span>
            </div>

            <nav className={styles.navLinks}>
              <a href="/">Home</a>
              <a href="/teachers">Teachers</a>
            </nav>

            <div className={styles.authButtons}>
              {user ? (
                <>
                  {/* Login iconu kaldırıldı */}
                  <span className={styles.userEmail}>{user.email}</span>
                  <button className={styles.registerBtn} onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.loginBtn}
                    onClick={() => {
                      setIsRegister(false);
                      setOpen(true);
                    }}
                  >
                    <img
                      src={avatar}
                      alt="login"
                      className={styles.avatar}
                    />
                    Log in
                  </button>

                  <button
                    className={styles.registerBtn}
                    onClick={() => {
                      setIsRegister(true);
                      setOpen(true);
                    }}
                  >
                    Registration
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            
            <div className={styles.heroLeft}>
              <h1>
                Unlock your potential with <br />
                the best <span className={styles.italic}>language</span> tutors
              </h1>

              <p>
                Embark on an exciting language journey with expert tutors.
                Elevate your language proficiency to new heights.
              </p>

              <button
                className={styles.getStarted}
                onClick={() => {
                  setIsRegister(true);
                  setOpen(true);
                }}
              >
                Get started
              </button>
            </div>

            <div className={styles.heroRight}>
              <img
                src="/block.png"
                alt="hero"
                className={styles.heroImg}
              />
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.stats}>

            <div className={styles.statsItem}>
              <div className={styles.statsNumber}>32,000+</div>
              <div className={styles.statsText}>
                <span>Experienced</span>
                <span>tutors</span>
              </div>
            </div>

            <div className={styles.statsItem}>
              <div className={styles.statsNumber}>300,000+</div>
              <div className={styles.statsText}>
                <span>5-star</span>
                <span>reviews</span>
              </div>
            </div>

            <div className={styles.statsItem}>
              <div className={styles.statsNumber}>120+</div>
              <div className={styles.statsText}>
                <span>Subjects</span>
                <span>taught</span>
              </div>
            </div>

            <div className={styles.statsItem}>
              <div className={styles.statsNumber}>200+</div>
              <div className={styles.statsText}>
                <span>Tutor</span>
                <span>nationalities</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MODAL */}
      {open && !user && (
        <Modal closeModal={handleClose}>
          <div className={styles.authWrapper}>
            
            {isRegister ? (
              <>
                <RegisterForm onClose={handleClose} />

                <div className={styles.switchBox}>
                  <p>
                    Already have an account?
                    <span
                      className={styles.switchLink}
                      onClick={() => setIsRegister(false)}
                    >
                      Login
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <LoginForm onClose={handleClose} />

                <div className={styles.switchBox}>
                  <p>
                    Don’t have an account?
                    <span
                      className={styles.switchLink}
                      onClick={() => setIsRegister(true)}
                    >
                      Register
                    </span>
                  </p>
                </div>
              </>
            )}

          </div>
        </Modal>
      )}
    </div>
  );
}