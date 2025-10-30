// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title EventFactory
 * @dev Factory contract for creating and managing events
 */
contract EventFactory is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _eventIdCounter;

    struct Event {
        uint256 id;
        string name;
        address creator;
        uint256 startDate;
        uint256 endDate;
        uint256 totalTickets;
        uint256 soldTickets;
        uint256 ticketPrice;
        bool active;
        uint256 createdAt;
    }

    mapping(uint256 => Event) public events;
    mapping(address => uint256[]) public creatorEvents;

    event EventCreated(
        uint256 indexed eventId,
        address indexed creator,
        string name,
        uint256 startDate,
        uint256 ticketPrice
    );

    event EventUpdated(uint256 indexed eventId, string name, bool active);

    event TicketSold(
        uint256 indexed eventId,
        address indexed buyer,
        uint256 quantity
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new event
     * @param name Name of the event
     * @param startDate Start timestamp
     * @param endDate End timestamp
     * @param totalTickets Total number of tickets
     * @param ticketPrice Price per ticket in wei
     */
    function createEvent(
        string memory name,
        uint256 startDate,
        uint256 endDate,
        uint256 totalTickets,
        uint256 ticketPrice
    ) public returns (uint256) {
        require(startDate > block.timestamp, "Start date must be in future");
        require(endDate > startDate, "End date must be after start date");
        require(totalTickets > 0, "Total tickets must be greater than 0");

        uint256 eventId = _eventIdCounter.current();
        _eventIdCounter.increment();

        events[eventId] = Event({
            id: eventId,
            name: name,
            creator: msg.sender,
            startDate: startDate,
            endDate: endDate,
            totalTickets: totalTickets,
            soldTickets: 0,
            ticketPrice: ticketPrice,
            active: true,
            createdAt: block.timestamp
        });

        creatorEvents[msg.sender].push(eventId);

        emit EventCreated(eventId, msg.sender, name, startDate, ticketPrice);

        return eventId;
    }

    /**
     * @dev Update event details
     * @param eventId ID of the event to update
     * @param name New name
     * @param active Active status
     */
    function updateEvent(
        uint256 eventId,
        string memory name,
        bool active
    ) public {
        require(events[eventId].creator == msg.sender, "Not event creator");

        events[eventId].name = name;
        events[eventId].active = active;

        emit EventUpdated(eventId, name, active);
    }

    /**
     * @dev Record ticket sale
     * @param eventId ID of the event
     * @param quantity Number of tickets sold
     */
    function recordTicketSale(uint256 eventId, uint256 quantity) public {
        Event storage eventData = events[eventId];
        require(eventData.active, "Event not active");
        require(
            eventData.soldTickets + quantity <= eventData.totalTickets,
            "Not enough tickets available"
        );

        eventData.soldTickets += quantity;

        emit TicketSold(eventId, msg.sender, quantity);
    }

    /**
     * @dev Get event details
     * @param eventId ID of the event
     */
    function getEvent(uint256 eventId)
        public
        view
        returns (
            string memory name,
            address creator,
            uint256 startDate,
            uint256 endDate,
            uint256 totalTickets,
            uint256 soldTickets,
            uint256 ticketPrice,
            bool active
        )
    {
        Event memory eventData = events[eventId];
        return (
            eventData.name,
            eventData.creator,
            eventData.startDate,
            eventData.endDate,
            eventData.totalTickets,
            eventData.soldTickets,
            eventData.ticketPrice,
            eventData.active
        );
    }

    /**
     * @dev Get all events created by an address
     * @param creator Address of the creator
     */
    function getCreatorEvents(address creator)
        public
        view
        returns (uint256[] memory)
    {
        return creatorEvents[creator];
    }

    /**
     * @dev Get total number of events
     */
    function getTotalEvents() public view returns (uint256) {
        return _eventIdCounter.current();
    }

    /**
     * @dev Check if tickets are available
     * @param eventId ID of the event
     * @param quantity Number of tickets to check
     */
    function areTicketsAvailable(uint256 eventId, uint256 quantity)
        public
        view
        returns (bool)
    {
        Event memory eventData = events[eventId];
        return
            eventData.active &&
            (eventData.soldTickets + quantity <= eventData.totalTickets);
    }
}
