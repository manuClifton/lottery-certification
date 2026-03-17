// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {LotteryCertificationNFT} from "src/LotteryCertificationNFT.sol";

contract DeployLotteryCertificationNFT is Script {
    function run() external returns (LotteryCertificationNFT deployed) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address initialOwner = vm.envAddress("INITIAL_OWNER");

        vm.startBroadcast(deployerPrivateKey);
        deployed = new LotteryCertificationNFT(initialOwner);
        vm.stopBroadcast();
    }
}
