module.exports = theFunction => (req, res, next) => {

    Promise.resolve(theFunction(req, res, next)).catch (next); // here catch is one type of callback function
};






//----------------------------------------------------------------
// Concepts:
// Promise : it is one JS Pre-built class