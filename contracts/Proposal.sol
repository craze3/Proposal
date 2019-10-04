pragma solidity ^0.5.4;
// Import OpenZeppelin's SafeMath Implementation
import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';

/*
Proposal.to (C) 2019
*/

contract Proposal {
    using SafeMath for uint256;

    // List of existing petitions
    Petition[] private petitions;
    // Mapping of vanity URLs to existing petitions
    mapping(string => Petition) petitionsByURL;

    // Event that will be emitted whenever a new project is started
    event PetitionStarted(
        address contractAddress,
        address projectStarter,
        string projectTitle,
        string projectDesc,
        string projectUrl,
        uint256 goalAmount
    );

    /** @dev Function to get a specific project
      * @return A single project struct
    */
    function getPetition(string memory urlString) public view returns  (address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        address projectContract,
        uint256 created,
        uint256 currentAmount,
        uint256 goalAmount) {
        return petitionsByURL[urlString].getDetails();
    }

    /** @dev Function to get a specific project
      * @return A single project struct
    */
    function getPetitionCreator(string memory urlString) public view returns (address) {
        return address(petitionsByURL[urlString].creator);
    }

    /** @dev Function to start a new project.
      * @param title Title of the project to be created
      * @param description Brief description about the project
      * @param amountToRaise Petition goal in wei
      */
    function startPetition(
        string calldata title,
        string calldata description,
        string calldata urlString,
        uint amountToRaise
    ) external {
        require(getPetitionCreator(urlString) == address(0), "Duplicate key"); // duplicate key
        Petition newPetition = new Petition(msg.sender, title, description, urlString, amountToRaise);
        petitions.push(newPetition);
        petitionsByURL[urlString] = newPetition;
        emit PetitionStarted(
            address(newPetition),
            msg.sender,
            title,
            description,
            urlString,
            amountToRaise
        );
    }

    /** @dev Function to get all petitions' contract addresses.
      * @return A list of all petitions' contract addreses
      */
    function returnAllPetitions() external view returns(Petition[] memory){
        return petitions;
    }

}


contract Petition {
    using SafeMath for uint256;

    // State variables
    address payable public creator;
    uint public amountGoal; // required to reach at least this much, else everyone gets refund
    uint256 public currentBalance;
    string public title;
    string public description;
    string public urlString;
    mapping (address => uint) public contributions;

    // Event that will be emitted whenever signing will be received
    event SigningReceived(address contributor, uint amount, uint currentTotal);
    // Event that will be emitted whenever the project starter has received the funds
    event CreatorPaid(address recipient);

    // Modifier to check if the function caller is the project creator
    modifier isCreator() {
        require(msg.sender == creator);
        _;
    }

    constructor
    (
        address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        string memory projectUrl,
        uint goalAmount
    ) public {
        creator = projectStarter;
        title = projectTitle;
        description = projectDesc;
        urlString = projectUrl;
        amountGoal = goalAmount;
        currentBalance = 0;
    }

    /** @dev Function to fund a certain project.
      */
    function signPetition() external {
        require(msg.sender != creator);
        require(contributions[msg.sender] < 1);
        contributions[msg.sender] = 1; //contributions[msg.sender].add(msg.value);
        currentBalance = currentBalance.add(1);
        emit SigningReceived(msg.sender, 1, currentBalance);
    }

     /** @dev Function to get specific information about the project.
      * @return Returns all the project's details
      */
    function getDetails() public view returns
    (
        address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        address projectContract,
        uint256 created,
        uint256 currentAmount,
        uint256 goalAmount
    ) {
        projectStarter = creator;
        projectTitle = title;
        projectDesc = description;
        projectContract = address(this);
        created = now;
        currentAmount = currentBalance;
        goalAmount = amountGoal;
    }
}
