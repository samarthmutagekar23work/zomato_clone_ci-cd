import React from "react";

function App() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to My App</h1>
      </header>
      <main style={styles.main}>
        <h2>Hello, World!</h2>
        <p>This is a simple React application.</p>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    backgroundColor: "#E23744",
    color: "white",
    padding: "20px",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
  },
  main: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
};

export default App;
