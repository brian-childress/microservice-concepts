const fetch = require("node-fetch");

const circuitBreaker = () => {

  let settings = {
    cooldownPeriod: 10, // number of seconds to wait before a try is an option
    failureThreshold: 1,
    requestTimeout: 2, // number of seconds to wait before a request is considered to fail
    states: {},
    successThreshold: 5 // number of successful requests required before a circuit could be set to 'CLOSED'
  };

  const canRequest = (endpoint) => {

    if (!settings.states[endpoint]) {
      initState(endpoint);
    }

    const state = settings.states[endpoint];

    if (state.circuit === 'CLOSED') { return true; }

    if (state.circuit === 'HALF') {
      if (state.success > settings.successThreshold) {
        initState(endpoint);
      }
      return true;
    }

    // If endpoint has passed the cooldown period, endpoint should be set to HALF open and tested again
    // If endpoint is HALF open and has been successful for n times, set circuit to closed
    const now = new Date() / 1000;

    if (state.nextAttempt <= now) {
      state.circuit = 'HALF';
      state.success = 0;
      return true;
    }

    return false;

  }

  const initState = (endpoint) => {
    settings.states[endpoint] = {
      circuit: 'CLOSED',
      cooldownPeriod: settings.cooldownPeriod,
      failures: 0,
      nextAttempt: 0
    };
  }

  const makeRequest = (requestOptions) => {
    return new Promise(async (resolve, reject) => {

      const endpoint = `${requestOptions.url}`;

      if (!canRequest(endpoint)) {
        reject({ status: 503, message: `Unable to call service` });
      } else {
        try {
          // call the service
          const response = await fetch(requestOptions.url); // GET request
          if (!response.ok) {
            onFailure(endpoint);
            reject({ status: response.status, message: response.message });
          } else {
            onSuccess(endpoint);
            const json = await response.json()
            resolve(json);
          }
        } catch (error) {
          onFailure(endpoint);
          reject(error); // Error is returned from downstream service
        }
      }
    })
  }

  onFailure = (endpoint) => {
    const state = settings.states[endpoint];
    state.failures += 1;
    state.success = 0;

    // Determine if failure has surpassed the failureThreshold
    if (state.failures > settings.failureThreshold) {
      state.circuit = 'OPEN';
      state.nextAttempt = new Date() / 1000 + settings.cooldownPeriod;

      console.log(`${endpoint} is currently ${state.circuit}`);
    }
  }

  onSuccess = (endpoint) => {
    // Reset state to original default value
    const state = settings.states[endpoint];
    if (state.circuit === 'HALF') {
      state.success += 1;
      state.failires = 0;
    } else {
      initState(endpoint);
    }

  }

  return {
    makeRequest: makeRequest
  }
}

module.exports = circuitBreaker();