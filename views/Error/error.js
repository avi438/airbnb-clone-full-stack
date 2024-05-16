const express = require("express");
const app = express();
const ExpressError = require("./ExpressError.js");
const wrapAsync = require("./wrapAsync.js");


// Different Types of Error Handling
/*
! Normal error
! async error
! try catch error
! using wrapAsync error
! Express Error(manual error)
! mongoose error
*/

app.listen("8080", () => {
    console.log("Connected");
})


//!wrapAsync : best way for try and catch
// it can avoid multiple time use of try and catch

// `Normal Syntax`

function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    };
}



app.get("/wraperror", (req, res,  next) => {
  res.send(fileNotFound.ejs);
})


//!ExpressError
app.use((err, req, res, next) => {
  let {status=500, message="some error"} = err;
  res.status(status).send(message)
});

//for all others wrong route req
app.all("*", (req, res, next) => {
next(new ExpressError(404, "page not found!"));
})



//!error

app.get('/err', (req, res, next) => {
    fs.readFile('/file-does-not-exist', (err, data) => {
      if (err) {
        next(err) // Pass errors to Express.
      } else {
        res.send(data)
      }
    })
  })

//! normal error
  app.get('/', (req, res) => {
    throw new Error('BROKEN') // Express will catch this on its own.
  })

  app.get('/defaulterr', (req, res) => {
    throw new Error(501, 'BROKEN') // my default error with expresserror.js
  })

// for async error, the error works differently, next() is not called we have declare to next(), mostly use in database or async function









  