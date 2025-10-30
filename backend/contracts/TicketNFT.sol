// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title TicketNFT
 * @dev NFT contract for event tickets
 */
contract TicketNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct TicketInfo {
        uint256 eventId;
        address originalOwner;
        uint256 mintedAt;
        bool used;
    }

    mapping(uint256 => TicketInfo) public tickets;
    mapping(uint256 => mapping(address => uint256[])) public eventTickets;

    event TicketMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint256 indexed eventId,
        string tokenURI
    );

    event TicketUsed(uint256 indexed tokenId, uint256 indexed eventId);

    constructor() ERC721("EventTicket", "ETKT") Ownable(msg.sender) {}

    /**
     * @dev Mint a new ticket NFT
     * @param to Address to mint the ticket to
     * @param eventId ID of the event
     * @param tokenURI Metadata URI for the ticket
     */
    function mintTicket(
        address to,
        uint256 eventId,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        tickets[tokenId] = TicketInfo({
            eventId: eventId,
            originalOwner: to,
            mintedAt: block.timestamp,
            used: false
        });

        eventTickets[eventId][to].push(tokenId);

        emit TicketMinted(to, tokenId, eventId, tokenURI);

        return tokenId;
    }

    /**
     * @dev Mark ticket as used (for event entry)
     * @param tokenId ID of the ticket to mark as used
     */
    function useTicket(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not ticket owner");
        require(!tickets[tokenId].used, "Ticket already used");

        tickets[tokenId].used = true;

        emit TicketUsed(tokenId, tickets[tokenId].eventId);
    }

    /**
     * @dev Get ticket information
     * @param tokenId ID of the ticket
     */
    function getTicketInfo(uint256 tokenId)
        public
        view
        returns (
            uint256 eventId,
            address originalOwner,
            uint256 mintedAt,
            bool used
        )
    {
        TicketInfo memory ticket = tickets[tokenId];
        return (
            ticket.eventId,
            ticket.originalOwner,
            ticket.mintedAt,
            ticket.used
        );
    }

    /**
     * @dev Get all tickets for an address and event
     * @param eventId ID of the event
     * @param owner Address of the ticket owner
     */
    function getEventTicketsForOwner(uint256 eventId, address owner)
        public
        view
        returns (uint256[] memory)
    {
        return eventTickets[eventId][owner];
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
