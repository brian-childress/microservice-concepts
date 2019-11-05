module.exports = (percentErrors) => {
  return (req, res, next) => {
    percentErrors = percentErrors || 50;

    const percentage = percentErrors * 0.01;
    const randomValue = Math.random();

    if (randomValue <= percentage) {
      const arrayRandomErrors = [404, 418, 500];
      const randomError = arrayRandomErrors[Math.floor(Math.random() * arrayRandomErrors.length)];

      res.status(`${randomError}`).send({ status: `${randomError}`, message: `An error occured` });
    } else {
      next();
    }
  }
}