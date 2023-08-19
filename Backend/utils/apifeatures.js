class ApiFeatures {

    constructor(query, qureyStr) {
        this.query = query;
        this.qureyStr = qureyStr;
    }

    // for search feature

    search() {
        const keyword = this.qureyStr.keyword ? {
            // if keyword is matched
            // fetch all properties name where keyword is present as either word or substring of any word

            // in below we make "keyword" using regex like mongoDB exprestion
            name: {
                $regex:this.qureyStr.keyword, // one type of mongoDB reguler expresion
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
        // this.queryCopy = this.qureyStr; 
        // --> If we use this method we face an big problem 
        // --> In JS, "this.qureyStr" than it returns refernce of object and that refernce store in "queryCopy" 
        // --> if this occurs and after that we made changes in "queryCopy" it also reflect in queryStr 
        // --> So, don't use that method

        // solution:
        const queryCopy = {...this.qureyStr};
        // console.log(queryCopy); // ---> check
        // above method not pass refernce it make Copy of "queryStr"

        // categories filter  --> case sensitive
        // Removing some fields for categories
        const removeFeilds = ["keyword", "page", "limit"];

        removeFeilds.forEach((key) => delete queryCopy[key]);

        // console.log(queryCopy); //---> check




        // Filter for Price and Rating
        
        console.log(queryCopy);

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`); // provide range in form of MongoDB
        

        this.qurey = this.query.find(JSON.parse(queryStr));
        // this.qurey = this.query.find(queryCopy);

        
        console.log(queryStr);

        return this;
    }

    

}

module.exports = ApiFeatures;
