import React, { useState, useEffect, useCallback } from "react";

// Usage
function App() {
  const { execute, pending, value, error } = useAsync(myFunction, false); //Executed on Demand and not immediate

  const { value: valueI, error: errorI } = useAsync(anotherAPICall, true)

  return (
    <div>
      <button className="button" onClick={execute} disabled={pending}>
        <span>Submit {pending && (<i
              className="fa fa-refresh fa-spin"
              style={{ marginRight: "5px" }}
            />)}</span>
      </button>
      <section>
        {'Not Immediate :----->'}
        {value && <div style={{"color":"green"}}>{value}</div>}
        {error && <div style={{"color":"red"}}>{error}</div>}
      </section>
      <section>
        {'Immediate :----->'}
        {valueI && <div style={{"color":"green"}}>{valueI}</div>}
        {errorI && <div style={{"color":"red"}}>{errorI}</div>}
      </section>
    </div>
  );
}

// An async function for testing our hook.
// Will be successful 50% of the time.
const myFunction = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rnd = Math.random() * 10;
      rnd <= 5
        ? resolve("Submitted successfully 🙌")
        : reject("Oh no there was an error 😞");
    }, 2000);
  });
};

// An async function for testing our hook.
// Will be successful 50% of the time.
const anotherAPICall = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rnd = Math.random() * 10;
      rnd <= 5
        ? resolve("Immediate Execution - Submitted successfully 🙌")
        : reject("Immediate Execution - Oh no there was an error 😞");
    }, 2000);
  });
};

// Hook
const useAsync = (asyncFunction, immediate = true) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // The execute function wraps our function and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setPending(true);
    setValue(null);
    setError(null);
    return asyncFunction()
      .then(response => setValue(response))
      .catch(error => setError(error))
      .finally(() => setPending(false));
  }, [asyncFunction]);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, pending, value, error };
};

export default App;
