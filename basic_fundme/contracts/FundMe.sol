// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundMe {
    address public owner;
    uint256 public totalFunds;
    
    mapping(address => uint256) public funders;
    address[] public fundersList;
    
    event Funded(address indexed funder, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    function fund() public payable {
        require(msg.value > 0, "Must send some MON");
        
        if (funders[msg.sender] == 0) {
            fundersList.push(msg.sender);
        }
        
        funders[msg.sender] += msg.value;
        totalFunds += msg.value;
        
        emit Funded(msg.sender, msg.value);
    }
    
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(totalFunds > 0, "No funds to withdraw");
        
        uint256 amount = totalFunds;
        totalFunds = 0;
        
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawn(owner, amount);
    }
    
    function getFunderCount() public view returns (uint256) {
        return fundersList.length;
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}