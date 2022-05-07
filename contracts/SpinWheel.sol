//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SpinWheel {
    enum Result {ZERO, TEN, FIFTY, HUNDRED, TWO_HUNDRED, THOUSAND}
    Result result;

    constructor() {
        result = Result.ZERO;
    }

    function setValues(uint _index) public {
        result = Result(_index);
    }
    
    function getValue() public view returns (uint val) {
        uint index = uint(result);
        if(index == 0) return 0;
        if(index == 1) return 10;
        if(index == 2) return 50;
        if(index == 3) return 100;
        if(index == 4) return 200;
        if(index == 5) return 1000;
    }
}