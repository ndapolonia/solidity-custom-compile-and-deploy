pragma solidity ^0.4.24;

contract UsersContract {
  struct User {
    string name;
    string surename;
  }

  mapping(address => User) private users;
  mapping(address => bool) private joinedUsers;
  address[] private total;

  event OnUserJoined(address, string);

  function join(string name, string surename) public {
    require(!userJoined(msg.sender), "User already joined");
    User storage user = users[msg.sender];
    user.name = name;
    user.surename = surename;
    joinedUsers[msg.sender] = true;
    total.push(msg.sender);

    emit OnUserJoined(msg.sender, string(abi.encodePacked(name, " ", surename)));
  }

  function getUser(address userAddress) public view returns (string, string) {
    require(userJoined(msg.sender), "User doesn't exists");
    User memory user = users[userAddress];
    return (user.name, user.surename);
  }

  function userJoined(address userAddress) private view returns (bool) {
    return joinedUsers[userAddress];
  }

  function totalUsers() public view returns (uint256) {
    return total.length;
  }
}
