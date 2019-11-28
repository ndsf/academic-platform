function promisify(fn) {
    let _err = null, _value = null;
    const callback = (err, value) => {
        _err = err;
        _value = value;
    };
    return (...args) => {
        fn(...args, callback);
        return new Promise((resolve, reject) => {
            if (_err) reject(_err);
            else resolve(_value);
        });
    };
}

const promisifiedUserSearch = await promisify(User.search);

module.exports = {
    Query: {
        async getUsers() {
            try {
                
                const results = promisifiedUserSearch( { query_string: { query: "mengta4" } });
                let res = [];
                for (const result of results.hits.hits) {
                    const thisResult = await User.findById(result._id);
                    res.push(thisResult);
                }
                return res;
            } catch (err) {
                console.error(err);
            }
        },
    }
}