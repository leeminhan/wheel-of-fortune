//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
// import "/RandomNumberConsumerV2.sol";

// TODO: replace with chainlink random generator 
contract Oracle{
	uint8 private seed; // Hide seed value!!
	constructor (uint8 _seed) public {
		seed = _seed;
	}

	function getRandomNumber() external returns (uint256){
		return block.number % seed;
	}

}

contract SpinWheel {

    Oracle private oracle;
    uint256 gameId;

    enum Reward {ZERO, TEN, FIFTY, HUNDRED, FIVE_HUNDRED, THOUSAND}
    mapping (Reward => uint256) rewardToValue;

    struct User {
        string name;
        string password;
        uint256 balance; // for rewards given
        string topic;
        string answer;
    }

    address public owner;
    mapping(address => bool) public admins;
    mapping(address => uint256) addressToBalance; //{0x....: uint}

    struct UserRewards {
        address address_;
        Reward reward; // TODO: KIV maybe don't use enum?
    }

    struct GameStatus {
        address _address;
        GameState status;
        string topic;
    }

    enum GameState {
        OPEN,
        CLOSE
    }

    mapping(uint32 => string) indexToTopic; // {1: topic}
    mapping(string => string) topicToWord; // {topic: word}
    mapping(uint256 => GameStatus) gameTracker; // {gameId: GameStatus}

    event LogStartGame(uint256 gameId, string topic);
    event LogRewardValue(uint256 gameId, uint256 reward);
    event LogErrorMessage(uint256 gameId, string message);

    modifier onlyOwner(){
		if (msg.sender==owner) {
			_;
		}
	}

	modifier onlyAdmins() {
		require (admins[msg.sender]);
		_;
	}

    constructor() {
        owner = msg.sender;
		admins[msg.sender] = true;
        oracle = new Oracle(6);

        gameId = 0;
        indexToTopic[0] = "fruit";
        indexToTopic[1] = "animal";
        indexToTopic[2] = "vehicle";
        indexToTopic[3] = "furniture";
        topicToWord["fruit"] = "apple";
        topicToWord["animal"] = "lion";
        topicToWord["vehicle"] = "car";
        topicToWord["furniture"] = "sofa";

        initalizeRewardToValue();
        addNewAddressToBalance();
    }

    function addNewAddressToBalance() public {
        // Check if address exists
        if (!(addressToBalance[msg.sender] >= 0)) {
            addressToBalance[msg.sender] = 0;
        }
    }

    function initalizeRewardToValue() private {
        rewardToValue[Reward.ZERO] = 0;
        rewardToValue[Reward.TEN] = 10;
        rewardToValue[Reward.FIFTY] = 50;
        rewardToValue[Reward.HUNDRED] = 100;
        rewardToValue[Reward.FIVE_HUNDRED] = 500;
        rewardToValue[Reward.THOUSAND] = 1000;
    }

    function startGame() public returns (uint256 _gameId, string memory _topic){
        
        // TODO: Pay ethers to play the game
        // require()

        // Generate Game Id (to track a specific game)
        uint256 currentGameId = gameId;
        gameId += 1;
        
        // TODO: Generate a random topic
        string memory topic = "fruit";
        
        gameTracker[currentGameId] = GameStatus(msg.sender, GameState.OPEN, topic);
        emit LogStartGame(currentGameId, topic);
        return (currentGameId, topic);
    }
    
    function guessByWord(uint256 _gameId, string memory guess) public {
        GameStatus memory gameStatus = gameTracker[_gameId];
        require(gameStatus._address == msg.sender, "You need to be the same player");
        require(gameStatus.status == GameState.OPEN, "Sorry the game is closed");

        string memory correctAnswer = topicToWord[gameStatus.topic];
        uint256 rewardValue;
        
        if (keccak256(abi.encodePacked((guess))) == keccak256(abi.encodePacked((correctAnswer)))) {
            rewardValue = calculateReward();
            addressToBalance[msg.sender] += rewardValue;
            emit LogRewardValue(_gameId, rewardValue); 
        }
        
        emit LogErrorMessage(_gameId, "You have guessed wrongly"); 
        gameTracker[_gameId] = GameStatus(msg.sender, GameState.CLOSE, gameStatus.topic);
    }

    function calculateReward() public returns (uint256 _reward) {
        //get value from RewardToValue mapping
        // TODO: replace hardcoded number with randomly generated number (0 - 5)
        uint256 randomNum = oracle.getRandomNumber();
        Reward reward = Reward(randomNum); // reward = Reward.ZERO....
        return rewardToValue[reward];
    }

    function addAdmin(address _adminAddress) public onlyAdmins {
		admins[_adminAddress] = true;
	}

}
