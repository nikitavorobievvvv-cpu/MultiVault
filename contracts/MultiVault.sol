// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

/**
 * @title MultiVault (UUPS upgradeable)
 * @notice Minimal multi-asset vault for native ETH and ERC20 tokens.
 *         **Not audited**. For demo purposes.
 */
contract MultiVault is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeERC20 for IERC20;

    // user => token(0 for native) => balance
    mapping(address => mapping(address => uint256)) private _balances;

    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) public initializer {
        __Ownable_init(initialOwner);
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
    }

    receive() external payable {
        depositNative();
    }

    function depositNative() public payable whenNotPaused nonReentrant {
        require(msg.value > 0, "No value");
        _balances[msg.sender][address(0)] += msg.value;
        emit Deposit(msg.sender, address(0), msg.value);
    }

    function withdrawNative(uint256 amount) external whenNotPaused nonReentrant {
        uint256 bal = _balances[msg.sender][address(0)];
        require(amount > 0 && amount <= bal, "Insufficient");
        _balances[msg.sender][address(0)] = bal - amount;
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "Transfer failed");
        emit Withdraw(msg.sender, address(0), amount);
    }

    function depositToken(address token, uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "No amount");
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        _balances[msg.sender][token] += amount;
        emit Deposit(msg.sender, token, amount);
    }

    function withdrawToken(address token, uint256 amount) external whenNotPaused nonReentrant {
        uint256 bal = _balances[msg.sender][token];
        require(amount > 0 && amount <= bal, "Insufficient");
        _balances[msg.sender][token] = bal - amount;
        IERC20(token).safeTransfer(msg.sender, amount);
        emit Withdraw(msg.sender, token, amount);
    }

    function balanceOf(address user, address token) external view returns (uint256) {
        return _balances[user][token];
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    // UUPS authorization
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
