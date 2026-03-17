// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract LotteryCertificationNFT is ERC721, Ownable {
    /// @notice Struct minima por token para metadatos tecnicos.
    struct DrawTokenMeta {
        uint32 drawDateKey;
        uint64 mintedAt;
    }

    /// @notice Struct con datos completos del sorteo para emitir en evento.
    struct DrawData {
        uint256 drawNumber;
        string gameName;
        string drawDate;
        uint32 drawDateKey;
        string startTime;
        string endTime;
        string prescriptionDate;
        uint16[20] numbers;
    }

    /// @notice Mapea tokenId al hash certificado del sorteo.
    mapping(uint256 => bytes32) private _tokenIdToHash;

    /// @notice Marca si un hash ya fue certificado para evitar duplicados.
    mapping(bytes32 => bool) private _certifiedHash;

    /// @notice Mapea tokenId a metadatos minimos del NFT.
    mapping(uint256 => DrawTokenMeta) private _tokenMeta;

    /// @notice Contador secuencial para asignar tokenId.
    uint256 private _nextTokenId = 1;

    /// @notice Error para hash vacio.
    error EmptyDrawHash();

    /// @notice Error para hash duplicado.
    error DuplicateDrawHash(bytes32 drawHash);

    /// @notice Error para fecha clave invalida.
    error InvalidDrawDateKey();

    /// @notice Error para direccion destino invalida.
    error InvalidRecipient();

    /// @notice Error para numero de 4 digitos invalido.
    error InvalidFourDigitNumber(uint256 index, uint16 value);

    /// @notice Evento con todos los datos del sorteo para indexacion off-chain.
    event DrawCertified(
        uint256 indexed tokenId,
        bytes32 indexed drawHash,
        uint32 indexed drawDateKey,
        DrawData drawData
    );

    /// @notice Constructor del contrato ERC721.
    constructor(address initialOwner) ERC721("Lottery Certification NFT", "LCNFT") Ownable(initialOwner) {}

    /// @notice Certifica un sorteo, mintea NFT y emite todos los datos en evento.
    function certifyDraw(address to, bytes32 drawHash, DrawData calldata drawData)
        external
        onlyOwner
        returns (uint256 tokenId)
    {
        if (to == address(0)) revert InvalidRecipient();
        if (drawHash == bytes32(0)) revert EmptyDrawHash();
        if (_certifiedHash[drawHash]) revert DuplicateDrawHash(drawHash);
        if (drawData.drawDateKey == 0) revert InvalidDrawDateKey();

        for (uint256 i = 0; i < 20; ++i) {
            if (drawData.numbers[i] > 9999) {
                revert InvalidFourDigitNumber(i, drawData.numbers[i]);
            }
        }

        tokenId = _nextTokenId;
        _nextTokenId = tokenId + 1;

        _safeMint(to, tokenId);

        _tokenIdToHash[tokenId] = drawHash;
        _certifiedHash[drawHash] = true;
        _tokenMeta[tokenId] = DrawTokenMeta({drawDateKey: drawData.drawDateKey, mintedAt: uint64(block.timestamp)});

        emit DrawCertified(tokenId, drawHash, drawData.drawDateKey, drawData);
    }

    /// @notice Devuelve el hash asociado a un tokenId.
    function getDrawHash(uint256 tokenId) external view returns (bytes32) {
        _requireOwned(tokenId);
        return _tokenIdToHash[tokenId];
    }

    /// @notice Indica si un hash de sorteo ya fue certificado.
    function isHashCertified(bytes32 drawHash) external view returns (bool) {
        return _certifiedHash[drawHash];
    }

    /// @notice Devuelve metadatos minimos del token.
    function getTokenMeta(uint256 tokenId) external view returns (DrawTokenMeta memory) {
        _requireOwned(tokenId);
        return _tokenMeta[tokenId];
    }
}
