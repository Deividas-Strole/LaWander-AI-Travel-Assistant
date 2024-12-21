package com.coderscampus.lawander.service;

import org.springframework.stereotype.Service;
import com.amadeus.Amadeus;
import com.amadeus.Params;
import com.amadeus.exceptions.ResponseException;
import com.amadeus.resources.FlightOfferSearch;

@Service
public class TicketService {


    public FlightOfferSearch[] getTickets(String destination) {

        FlightOfferSearch[] flightOffers = null;

        System.out.println("Airport code in tixServ: " + destination);
        destination = destination.toUpperCase();


        Amadeus amadeus = Amadeus
                .builder("I2HFd9Ugsu2Wdcum6o0eaOnSvXhynYWy", "vBc1rqFrS57glP9n")
                .build();

        try {
            // Perform a flight search between two cities
            flightOffers = amadeus.shopping.flightOffersSearch.get(
                    Params.with("originLocationCode", "LAX")
                            .and("destinationLocationCode", destination)
                            .and("departureDate", "2024-12-25")
                            .and("adults", 1)
            );

            // Print the flight offers
//            if (flightOffers != null && flightOffers.length > 0) {
//                for (FlightOfferSearch offer : flightOffers) {
//                    System.out.println("Flight Offer: " + offer);
//                }
//            } else {
//                System.out.println("No flight offers found.");
//            }
        } catch (ResponseException e) {
            e.printStackTrace();
        }
        return flightOffers;
    }

}

