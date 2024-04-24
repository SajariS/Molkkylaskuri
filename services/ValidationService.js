

const ValidationService = {

    validateText: (input) => {
        if(input.length === 0) {
            return false;
        }
        else {
            return true;
        }
    }

}

export default ValidationService;