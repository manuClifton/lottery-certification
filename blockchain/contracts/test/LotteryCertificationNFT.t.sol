// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {LotteryCertificationNFT} from "src/LotteryCertificationNFT.sol";

contract LotteryCertificationNFTTest is Test {
    LotteryCertificationNFT internal nft;

    address internal owner = address(this);
    address internal recipient = address(0xBEEF);
    address internal attacker = address(0xCAFE);

    event DrawCertified(
        uint256 indexed tokenId,
        bytes32 indexed drawHash,
        uint32 indexed drawDateKey,
        LotteryCertificationNFT.DrawData drawData
    );

    function setUp() external {
        nft = new LotteryCertificationNFT(owner);
    }

    function testCertifyDrawMintsAndStoresHash() external {
        uint16[20] memory numbers = _numbers();
        bytes32 drawHash = keccak256("draw-1");
        LotteryCertificationNFT.DrawData memory drawData = LotteryCertificationNFT.DrawData({
            drawNumber: 1001,
            gameName: "Quiniela Nacional",
            drawDate: "17/03/2026",
            drawDateKey: 20260317,
            startTime: "10:00",
            endTime: "10:05",
            prescriptionDate: "17/03/2031",
            numbers: numbers
        });

        uint256 tokenId = nft.certifyDraw(recipient, drawHash, drawData);

        assertEq(tokenId, 1);
        assertEq(nft.ownerOf(tokenId), recipient);
        assertEq(nft.getDrawHash(tokenId), drawHash);
        assertTrue(nft.isHashCertified(drawHash));

        LotteryCertificationNFT.DrawTokenMeta memory meta = nft.getTokenMeta(tokenId);
        assertEq(meta.drawDateKey, 20260317);
        assertEq(meta.mintedAt, uint64(block.timestamp));
    }

    function testCertifyDrawRevertsWhenNotOwner() external {
        uint16[20] memory numbers = _numbers();
        LotteryCertificationNFT.DrawData memory drawData = LotteryCertificationNFT.DrawData({
            drawNumber: 1002,
            gameName: "Quiniela Nacional",
            drawDate: "17/03/2026",
            drawDateKey: 20260317,
            startTime: "11:00",
            endTime: "11:05",
            prescriptionDate: "17/03/2031",
            numbers: numbers
        });

        vm.prank(attacker);
        vm.expectRevert();
        nft.certifyDraw(recipient, keccak256("draw-2"), drawData);
    }

    function testCertifyDrawRevertsOnDuplicateHash() external {
        uint16[20] memory numbers = _numbers();
        bytes32 drawHash = keccak256("draw-dup");
        LotteryCertificationNFT.DrawData memory drawDataA = LotteryCertificationNFT.DrawData({
            drawNumber: 1003,
            gameName: "Quiniela Nacional",
            drawDate: "17/03/2026",
            drawDateKey: 20260317,
            startTime: "12:00",
            endTime: "12:05",
            prescriptionDate: "17/03/2031",
            numbers: numbers
        });
        LotteryCertificationNFT.DrawData memory drawDataB = LotteryCertificationNFT.DrawData({
            drawNumber: 1004,
            gameName: "Quiniela Nacional",
            drawDate: "18/03/2026",
            drawDateKey: 20260318,
            startTime: "13:00",
            endTime: "13:05",
            prescriptionDate: "18/03/2031",
            numbers: numbers
        });

        nft.certifyDraw(recipient, drawHash, drawDataA);

        vm.expectRevert(abi.encodeWithSelector(LotteryCertificationNFT.DuplicateDrawHash.selector, drawHash));
        nft.certifyDraw(recipient, drawHash, drawDataB);
    }

    function testDrawCertifiedEventContainsCompletePayload() external {
        uint16[20] memory numbers = _numbers();
        bytes32 drawHash = keccak256("draw-event");
        LotteryCertificationNFT.DrawData memory drawData = LotteryCertificationNFT.DrawData({
            drawNumber: 2001,
            gameName: "Loto",
            drawDate: "17/03/2026",
            drawDateKey: 20260317,
            startTime: "20:00",
            endTime: "20:10",
            prescriptionDate: "17/03/2031",
            numbers: numbers
        });

        vm.expectEmit(true, true, true, true);
        emit DrawCertified(1, drawHash, 20260317, drawData);

        nft.certifyDraw(recipient, drawHash, drawData);
    }

    function _numbers() internal pure returns (uint16[20] memory numbers) {
        numbers = [
            uint16(12),
            34,
            56,
            78,
            90,
            123,
            456,
            789,
            1000,
            1111,
            2222,
            3333,
            4444,
            5555,
            6666,
            7777,
            8888,
            9999,
            7,
            0
        ];
    }
}
