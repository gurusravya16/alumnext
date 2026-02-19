function App() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AlumNext</h1>
      <p style={styles.subtitle}>
        Secure Alumni, Student & Placement Collaboration Platform
      </p>

      <div style={styles.buttonContainer}>
        <button style={styles.button}>Login</button>
        <button style={styles.button}>Register as Student</button>
        <button style={styles.button}>Register as Alumni</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial",
  },
  title: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "40px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default App;
