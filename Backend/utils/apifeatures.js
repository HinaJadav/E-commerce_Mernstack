class ApiFeatures {

    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // for search feature

    search() {
        const keyword = this.queryStr.keyword ? {
            // if keyword is matched
            // fetch all properties name where keyword is present as either word or substring of any word

            // in below we make "keyword" using regex like mongoDB exprestion
            name: {
                $regex:this.queryStr.keyword, // one type of mongoDB reguler expresion
                $options: "i", // means, it is caseInSensitive
            },
        } 
        : {

        };

        // console.log(keyword);

        this.query = this.query.find({...keyword});
        return this;// return this class 
        
    }

    filter(){
        // this.queryCopy = this.queryStr; 
        // --> If we use this method we face an big problem 
        // --> In JS, "this.queryStr" than it returns refernce of object and that refernce store in "queryCopy" 
        // --> if this occurs and after that we made changes in "queryCopy" it also reflect in queryStr 
        // --> So, don't use that method

        // solution:
        const queryCopy = {...this.queryStr};
        // console.log(queryCopy); // ---> check
        // above method not pass refernce it make Copy of "queryStr"

        // categories filter  --> case sensitive
        // Removing some fields for categories
        const removeFeilds = ["keyword", "page", "limit"];

        removeFeilds.forEach((key) => delete queryCopy[key]);

        // console.log(queryCopy); //---> check


        //----------------------------------------------------------------

        // Filter for Price and Rating
        
        // console.log(queryCopy);

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`); // provide range in form of MongoDB
        

        this.qurey = this.query.find(JSON.parse(queryStr));
        // this.qurey = this.query.find(queryCopy); --> only for category

        
        // console.log(queryStr);

        return this;
    }

    pagination(resultPerPage) {
        console.log(this.queryStr);
        const currentPage = Number(this.queryStr.page) || 1; // "this.queryStr.page" -> if we give page number , Otherwise bydefault => page = 1

        const skip1 = resultPerPage * (currentPage - 1);// Howmany product we want to skip(ex. if we want to see all items which are present on "nth" page than we need to skip "(n-1)th" page all items --> bcz, we set some limitation on show item on perPage
   
        this.query = this.query.limit(resultPerPage).skip(skip1); // this query calc howmany product skip

        return this;
   
    }

}

module.exports = ApiFeatures;
