pragma solidity >= 0.5.0 <0.7.0;


import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "@aztec/protocol/contracts/ERC1724/ZkAssetMintable.sol";
import "@aztec/protocol/contracts/ERC1724/ZkAsset.sol";


contract TestERC20 is ERC20 {

  string private _name;
  string private _symbol;

  /**
   * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
  constructor() public {
    _name = "Istanbul";
    _symbol = "IST";
    _mint(msg.sender,10000000);

  }

  /**
   * @dev Returns the name of the token.
     */
  function name() public view returns (string memory) {
    return _name;
  }

  /**
   * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
  function symbol() public view returns (string memory) {
    return _symbol;
  }


  function giveMeTokens(address _account, uint256 _value) public {
    _mint(_account, _value);
  }
}

contract TestZkAssetMintable is ZkAssetMintable {

}

contract TestZkAsset is ZkAsset {

}
