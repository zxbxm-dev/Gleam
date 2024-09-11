module.exports = (app) => {
    const expensesConstroller = require("../controller/expense/costOperation");
  
    const express = require("express");
    const router = express.Router();
  
    router.post('/writeOperating', expensesConstroller.writeOperating);
    router.get("/checkOperating", expensesConstroller.checkOperating);

    app.use("/api", router);
  };
  