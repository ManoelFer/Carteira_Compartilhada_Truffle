// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

//RNF01 - Os contratos devem seguir o padrão do ERC20Pausable
contract SharedWalletContract is ERC20Pausable, Ownable {
    struct beneficiaryInfo {
        uint256 valueAllowed;
        bool isAllowed;
        uint256 lastDateWithdrawAllowance;
    }
    uint256 maxTokenAllowed = 100000000000000000000000;
    mapping(address => beneficiaryInfo) public beneficiaries;

    //TASK 01 - Deve ser utilizado o modelo de tokens ERC20
    constructor() ERC20("Family Coins", "FCs") {
        /** @dev Dono dos tokens, geralmente é o endereço que executou o contrato, mais a quantidade de tokens que teremos em nossa moeda LBCs
         * A quantidade de tokens é 10000, como precisamos converter wei para ether, multiplicamos a quantidade com 10 elevado a 18
         */

        addTokens(owner(), 10 * 10**18);
    }

    /*
        RF01 - Deve ser possível o cadastro dos endereços a serem beneficiados pela mesada. (Somente o admin poderá realizar essa ação)
        RF02 - Deve ser possível desabilitar o acesso de um beneficiário. (Somente o admin poderá realizar essa ação)
        RF03 - Deve ser possível estipular o valor que cada beneficiário poderá retirar. (Somente o admin poderá realizar essa ação) 
    */
    function setBeneficiary(
        address _beneficiary,
        bool _isAllowed,
        uint256 _amountAllowed
    ) public onlyOwner {
        beneficiaries[_beneficiary].isAllowed = _isAllowed;
        beneficiaries[_beneficiary].valueAllowed = _amountAllowed;
    }

    //RF05 - Deve ser possível estipular o máximo de moedas que o nosso contrato pode ter. (Somente o admin poderá realizar essa ação)
    function setMaxTokensAllowed(uint256 _maxTokenAllowed) public onlyOwner {
        maxTokenAllowed = _maxTokenAllowed;
    }

    //RF04 - Deve ser possível adicionar moedas ao contrato. (Apenas administradores)
    function addTokens(address account, uint256 amount) public onlyOwner {
        require(
            balanceOf(owner()) + amount <= maxTokenAllowed,
            "This value exceeds the maximum number of tokens allowed"
        );

        _mint(account, amount);
    }

    //RF06 - Deve ser possível pausar todas as transferências.  (Somente o admin poderá realizar essa ação)
    function pause() public onlyOwner {
        _pause();
    }

    //RF06 - Deve ser possível pausar todas as transferências.  (Somente o admin poderá realizar essa ação)
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    //RF07 - Deve ser possível a retirada de moedas pelos beneficiados. (Apenas uma vez ao mês)
    function withdrawAllowance() public returns (bool) {
        require(
            block.timestamp >=
                (beneficiaries[msg.sender].lastDateWithdrawAllowance + 30 days),
            "You can only withdraw your allowance once every 30 days"
        );

        _transfer(owner(), msg.sender, beneficiaries[msg.sender].valueAllowed);
        return true;
    }
}
